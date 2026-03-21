import StudioSidebar from '@/components/studio/StudioSidebar'

export default function StudioLayout({ children }: { children: React.ReactNode }) {
  return (
    <div
      style={{
        display: 'flex',
        minHeight: '100vh',
        background: '#161719',
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
            borderBottom: '1px solid rgba(255,255,255,0.07)',
            display: 'flex',
            alignItems: 'center',
            padding: '0 1.5rem',
            gap: '1rem',
            background: '#161719',
            position: 'sticky',
            top: 0,
            zIndex: 30,
          }}
        >
          <span
            style={{
              fontFamily: 'var(--font-display)',
              color: '#E0A858',
              fontSize: '1rem',
              fontWeight: 900,
              textTransform: 'uppercase',
              letterSpacing: '0.04em',
            }}
          >
            FTBP
          </span>
          <span style={{ color: 'rgba(255,255,255,0.2)', fontSize: '0.875rem' }}>/</span>
          <span style={{ color: 'rgba(242,240,237,0.6)', fontSize: '0.875rem' }}>Studio</span>
        </header>

        {/* Page content */}
        <div style={{ flex: 1, padding: '2rem 1.5rem' }}>
          {children}
        </div>
      </main>
    </div>
  )
}
