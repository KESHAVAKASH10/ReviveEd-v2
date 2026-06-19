export default function RoleTabs({ roles, role, switchRole }) {
    return (
        <div style={{ width: '100%', maxWidth: 360, zIndex: 10, marginBottom: 14 }}>
            <div
                style={{
                    display: 'flex',
                    borderRadius: 16,
                    overflow: 'hidden',
                    padding: 4,
                    gap: 4,
                    background: 'rgba(255,255,255,0.04)',
                    border: '1px solid rgba(255,255,255,0.08)',
                }}
            >
                {roles.map((r) => (
                    <button
                        key={r.id}
                        onClick={() => switchRole(r.id)}
                        style={{
                            flex: 1,
                            padding: '8px 6px',
                            fontSize: 11,
                            fontWeight: 700,
                            borderRadius: 12,
                            cursor: 'pointer',
                            background: role === r.id ? `rgba(${r.rgb},.15)` : 'transparent',
                            color: role === r.id ? r.color : '#6b7a9e',
                            border: role === r.id ? `1px solid ${r.color}44` : '1px solid transparent',
                        }}
                    >
                        {r.label}
                    </button>
                ))}
            </div>
        </div>
    )
}