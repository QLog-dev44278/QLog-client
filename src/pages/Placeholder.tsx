/** 아직 구현하지 않은 화면 자리. 각 화면 PR에서 실제 페이지로 교체된다. */
export function Placeholder({ title }: { title: string }) {
  return (
    <main style={{ padding: 'var(--space-40)' }}>
      <h1 className="heading-24">{title}</h1>
      <p className="body-14" style={{ color: 'var(--text-secondary)' }}>
        준비 중인 화면이에요.
      </p>
    </main>
  )
}
