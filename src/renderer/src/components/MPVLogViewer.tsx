import { useEffect, useState } from 'react';

export function MPVLogViwer() {
    const [logs, setLogs] = useState<string[]>([]);

    useEffect(() => {
        // register the listener and store the cleanup function
        const unsubscribe = window.api.onLog((newLog) => {
            setLogs((prev) => [...prev, newLog]);
        });
        return () => unsubscribe(); //cleanup when unmount
    }, []);

    return (
        <div className="log-console">
            {logs
                .filter((log) => !log.includes("AV"))
                .map((log, i) => (
                
                <div key={i}>{log}</div>
            ))}
        </div>
    );
}