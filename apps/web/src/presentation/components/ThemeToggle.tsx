'use client'

import { useTheme } from "next-themes"
import { useEffect, useState } from "react"
import { Sun, Moon } from "lucide-react"

export default function ThemeToggle() {
    const [mounted, setMounted] = useState(false)
    const { theme, setTheme } = useTheme()

    useEffect(() => {
        setMounted(true)
    }, [])

    if (!mounted) {
        return <div style={{ width: 48, height: 26, padding: '3px' }} />
    }

    const isDark = theme === 'dark'

    return (
        <button
            role="switch"
            aria-checked={isDark}
            aria-label="Toggle dark mode"
            onClick={() => setTheme(isDark ? 'light' : 'dark')}
            style={{
                width: '48px',
                height: '26px',
                background: isDark ? '#374151' : '#d1d5db',
                borderRadius: '999px',
                border: 'none',
                padding: '3px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                transition: 'background-color 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
            }}
            title="Toggle theme"
        >
            <div
                style={{
                    width: '20px',
                    height: '20px',
                    borderRadius: '50%',
                    background: '#ffffff',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    transform: isDark ? 'translateX(22px)' : 'translateX(0)',
                    transition: 'transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)',
                    boxShadow: '0 1px 3px rgba(0,0,0,0.15), 0 1px 2px rgba(0,0,0,0.1)',
                    color: isDark ? '#374151' : '#f59e0b',
                }}
            >
                {isDark ? (
                    <Moon size={12} strokeWidth={2.5} />
                ) : (
                    <Sun size={12} strokeWidth={2.5} />
                )}
            </div>
        </button>
    )
}
