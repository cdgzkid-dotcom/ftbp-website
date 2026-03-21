import ChatInterface from '@/components/studio/ChatInterface'

export default function NuevoGuionPage() {
  return (
    <div style={{ maxWidth: 800, margin: '0 auto' }}>
      <div style={{ marginBottom: '1.5rem' }}>
        <h1
          style={{
            color: 'var(--text-pri)',
            fontSize: '1.5rem',
            fontWeight: 700,
            marginBottom: '0.25rem',
          }}
        >
          Nuevo guion
        </h1>
        <p style={{ color: 'var(--text-sec)', fontSize: '0.875rem' }}>
          Conversa con el asistente de producción para generar el guion del episodio.
        </p>
      </div>

      <ChatInterface />
    </div>
  )
}
