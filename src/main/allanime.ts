import axios from 'axios';
import crypto from 'crypto';

const ALLANIME_API = "https://api.allanime.day/api";
const ALLANIME_BASE = "https://allanime.day";
const AGENT = "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36";
const REFR = "https://youtu-chan.com";

const DECRYPT_KEY = crypto.createHash('sha256').update('Xot36i3lK3:v1').digest();

export interface PlayableSource {
    provider: string;
    quality: string;
    sourceUrl: string;
    isM3U8: boolean;
    referrer?: string;
}


function decryptAES(ciphertextB64: string): string {
    try {
        const buffer = Buffer.from(ciphertextB64, 'base64');
        const extractedIv = buffer.subarray(1, 13);
        const ivHex = extractedIv.toString('hex') + '00000002';
        const iv = Buffer.from(ivHex, 'hex');
        const ciphertext = buffer.subarray(13, buffer.length - 16);
        const decipher = crypto.createDecipheriv('aes-256-ctr', DECRYPT_KEY, iv);
        const decrypted = Buffer.concat([decipher.update(ciphertext), decipher.final()]);
        return decrypted.toString('utf8');
    } catch (e) {
        console.error("AES Decryption failed:", e);
        return "";
    }
}

function decodeXorUrl(hexUrl: string): string {
    if (!hexUrl.startsWith('--')) return hexUrl;
    const hexStr = hexUrl.slice(2);
    let decoded = '';
    for (let i = 0; i < hexStr.length; i += 2) {
        const hexChar = hexStr.slice(i, i + 2);
        decoded += String.fromCharCode(parseInt(hexChar, 16) ^ 56);
    }
    return decoded.replace(/\/clock$/, '/clock.json');
}

export async function getEpisodeData(showId: string, episodeString: string | number, logger?: (msg: string) => void): Promise<PlayableSource[]> {
    logger!(`getting sources for ${showId}, episode ${episodeString}...`);

    const epStr = String(episodeString);
    const query_vars = JSON.stringify({ showId, translationType: "sub", episodeString: epStr });
    
    const query_hash = "d405d0edd690624b66baba3068e0edc3ac90f1597d898a1ec8db4e5c43c00fec";
    const query_ext = JSON.stringify({ persistedQuery: { version: 1, sha256Hash: query_hash } });

    const headers = {
        "User-Agent": AGENT,
        "Referer": REFR,
        "Origin": REFR 
    };

    let responseData: any = null;

    logger!(`trying GET request (presisted query)`);
    try {
        const apqUrl = `${ALLANIME_API}/api?variables=${encodeURIComponent(query_vars)}&extensions=${encodeURIComponent(query_ext)}`;
        const getResp = await axios.get(apqUrl, { headers });
        responseData = getResp.data;
    } catch (e) {}

    logger!(`fallback on POST request`);
    if (!responseData || !JSON.stringify(responseData).includes("tobeparsed")) {
        try {
            const fallbackQuery = 'query ($showId: String!, $translationType: VaildTranslationTypeEnumType!, $episodeString: String!) { episode( showId: $showId translationType: $translationType episodeString: $episodeString ) { episodeString sourceUrls }}';
            const postResp = await axios.post(`${ALLANIME_API}/api`, {
                variables: { showId, translationType: "sub", episodeString: epStr },
                query: fallbackQuery
            }, { headers });
            responseData = postResp.data;
        } catch (e) {
            console.error("both get and post failed");
            return [];
        }
    }

    let targetPayload = responseData?.data?.tobeparsed || responseData?.data?.episode?.sourceUrls || responseData?.tobeparsed;
    let sources: any[] = [];

    if (Array.isArray(targetPayload)) {
        sources = targetPayload;
    } else if (typeof targetPayload === "string") {
        const decrypted = decryptAES(targetPayload);
        try {
            // strip null bytes that might survive the decryption
            const cleanStr = decrypted.replace(/\0/g, ''); 
            const parsed = JSON.parse(cleanStr);
            sources = parsed.episode?.sourceUrls || parsed.data?.episode?.sourceUrls || parsed.sourceUrls || [];
        } catch (e) {
            console.error("failed parsing: ", decrypted);
            return [];
        }
    }

    logger!(`got ${sources.length} sources`);

    const playableSources: PlayableSource[] = [];

    for (const source of sources) {
        logger!(`checking ${source.sourceUrl}`);
        if (!source.sourceUrl) continue;

        let sourceName = source.sourceName || "Unknown";
        let finalUrl = source.sourceUrl;

        if (finalUrl.startsWith("--")) {
            finalUrl = decodeXorUrl(finalUrl);
        } else if (finalUrl.includes("tobeparsed=")) {
            finalUrl = decryptAES(finalUrl.split("tobeparsed=")[1]);
        }

        if (!finalUrl) continue;

        //need to do html scraping
        if (finalUrl.includes("mp4upload")) {
            try {
                const embedResponse = await axios.get(finalUrl, { 
                    headers: { "User-Agent": AGENT, "Referer": REFR } 
                });
                
                //src: "https://.../video.mp4"
                const srcMatch = embedResponse.data.match(/src:\s*["']([^"']+)["']/);
                
                if (srcMatch && srcMatch[1]) {
                    playableSources.push({
                        provider: sourceName,
                        quality: "Direct/MP4",
                        sourceUrl: srcMatch[1],
                        isM3U8: srcMatch[1].includes(".m3u8"),
                        referrer: "https://www.mp4upload.com",
                    });
                }
            } catch (err) {
                console.error("failed to scrape mp4 upload");
            }
            continue;
        }

        // i will need to implement yt dlb or let mpv do it
        if (finalUrl.includes("tools.fast4speed.rsvp") || finalUrl.includes("youtube.com")) {
            playableSources.push({
                provider: sourceName,
                quality: "Adaptive/Stream",
                sourceUrl: finalUrl,
                isM3U8: finalUrl.includes(".m3u8"),
                referrer: REFR,
            });
            continue;
        }

        // --- HOST C: Internal Clock Endpoints (Wixmp, Sharepoint, Default, etc) ---
        try {
            const fullUrl = finalUrl.startsWith("http") ? finalUrl : `https://${ALLANIME_BASE}${finalUrl}`;
            const linkResponse = await axios.get(fullUrl, { headers });
            const linksArray = linkResponse.data?.links || (Array.isArray(linkResponse.data) ? linkResponse.data : null);

            if (linksArray) {
                for (const stream of linksArray) {
                    const isSharepoint = sourceName.toLowerCase().includes("sharepoint");
                    
                    playableSources.push({
                        provider: sourceName,
                        quality: stream.resolutionStr || 'Auto',
                        sourceUrl: stream.link,
                        isM3U8: stream.link.includes(".m3u8") || !!stream.hls,
                        referrer: isSharepoint ? undefined : REFR,
                    });
                }
            }
        } catch (err: any) {
            logger!(`Failed parsing stream array for ${sourceName}`);
        }
    }

    return playableSources;
}

export async function getEpisodesList(showId: string) {
    // 1. Define the specific query that requests only the episodes for a showId
    const query = `
        query ($showId: String!) {
            show(_id: $showId) {
                availableEpisodesDetail
            }
        }
    `;

    const payload = {
        variables: {
            showId: showId
        },
        query: query
    };

    const headers = {
        "Content-Type": "application/json",
        "Referer": "https://allmanga.to/",
        "User-Agent": AGENT
    };

    try {
        const response = await axios.post("https://api.allanime.day/api", payload, { headers });
        
        // 2. Access the data correctly based on the response structure
        // Note: The API returns data.show.availableEpisodesDetail
        const data = response.data?.data?.show?.availableEpisodesDetail;
        
        if (!data) {
            console.error("No episode data found for showId:", showId);
            return null;
        }

        // Return the 'sub' or 'dub' list as needed
        return data.sub; 
    } catch (e) {
        console.error("could not fetch episodes: ", e);
        return null;
    }
}

export async function searchAnime(query: string) {
    const payload = {
        variables: {
            search: {
                // allowUnknown: false,
                // allowAdult: false,
                query: query
            },
            limit: 20,
            page: 1,
            translationType: "sub",
            countryOrigin: "ALL"
        },
        extensions: {
            persistedQuery: {
                version: 1,
                sha256Hash: "a24c500a1b765c68ae1d8dd85174931f661c71369c89b92b88b75a725afc471c"
            }
        }
    };

    const headers = {
        "Content-Type": "application/json",
        "Referer": "https://allmanga.to/",
        // "Origin": "https://allmanga.to",
        "User-Agent": AGENT
    };

    try {
        const response = await axios.post("https://api.allanime.day/api", payload, { headers });
        return response.data.data.shows.edges;
    } catch (e) {
        console.error("could not do query search: ", e);
    }
}