'use client'

import { useEffect, useState } from 'react'

function getTheme(): 'light' | 'dark' {
  const hour = new Date().getHours()
  return hour >= 7 && hour < 19 ? 'light' : 'dark'
}

export default function ThemeManager({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<'light' | 'dark'>('dark')

  useEffect(() => {
    setTheme(getTheme())

    const interval = setInterval(() => {
      setTheme(getTheme())
    }, 60_000)

    return () => clearInterval(interval)
  }, [])

  return (
    <div
      className="studio-theme"
      data-theme={theme}
      style={{ minHeight: '100vh' }}
    >
      {children}
    </div>
  )
}
