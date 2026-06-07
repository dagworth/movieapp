import { useEffect, useState, useRef } from 'react'
import styles from './MPVLogViewer.module.css'

export function MPVLogViwer() {
  const [logs, setLogs] = useState<string[]>([])
  const scroll = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const unsubscribe = window.api.onLog((newLog) => {
      setLogs((prev) => [...prev, newLog])
    })
    return () => unsubscribe()
  }, [])

  useEffect(() => {
    if (scroll.current) {
      scroll.current.scrollTop = scroll.current.scrollHeight
    }
  }, [logs])

  return (
    <div className={styles.console} ref={scroll}>
      {logs
        .filter((log) => !log.includes('AV'))
        .map((log, i) => (
          <div key={i}>{log}</div>
        ))}
    </div>
  )
}
