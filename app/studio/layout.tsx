import StudioSidebar from '@/components/studio/StudioSidebar'
import ThemeManager from '@/components/ThemeManager'

export default function StudioLayout({ children }: { children: React.ReactNode }) {
  return (
    <ThemeManager>
      <div
        style={{
          display: 'flex',
          minHeight: '100vh',
          background: 'var(--bg)',
          fontFamily: 'var(--font-body)',
        }}
      >
        <StudioSidebar />

        {/* Main content */}
        <main
          style={{
            flex: 1,
            marginLeft: 280,
            display: 'flex',
            flexDirection: 'column',
            minHeight: '100vh',
          }}
        >
          {/* Top navbar */}
          <header
            style={{
              height: 56,
              borderBottom: '1px solid var(--border)',
              display: 'flex',
              alignItems: 'center',
              padding: '0 1.5rem',
              gap: '1rem',
              background: 'var(--bg)',
              position: 'sticky',
              top: 0,
              zIndex: 30,
            }}
          >
            <span
              style={{
                fontFamily: 'var(--font-display)',
                color: 'var(--gold)',
                fontSize: '1rem',
                fontWeight: 900,
                textTransform: 'uppercase',
                letterSpacing: '0.04em',
              }}
            >
              FTBP
            </span>
            <span style={{ color: 'var(--text-ter)', fontSize: '0.875rem' }}>/</span>
            <span style={{ color: 'var(--text-sec)', fontSize: '0.875rem' }}>Studio</span>
          </header>

          {/* Page content */}
          <div style={{ flex: 1, padding: '2rem 1.5rem' }}>
            {children}
          </div>
        </main>
      </div>
    </ThemeManager>
  )
}
