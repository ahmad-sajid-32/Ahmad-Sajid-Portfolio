'use client'

import { useEffect, useState } from 'react'

const FORMAT = new Intl.DateTimeFormat('en-GB', {
  timeZone: 'Asia/Karachi',
  hour: '2-digit',
  minute: '2-digit',
  hour12: false,
})

/**
 * Live Lahore time for the footer's postcard block, ticking
 * every 20 seconds. Renders a placeholder until mounted so
 * the server HTML and the first client render agree.
 */
export function FooterClock() {
  const [time, setTime] = useState<string | null>(null)

  useEffect(() => {
    const tick = () => setTime(FORMAT.format(new Date()))
    tick()
    const id = setInterval(tick, 20_000)
    return () => clearInterval(id)
  }, [])

  return <span className="text-primary">{time ?? '--:--'} PKT</span>
}
