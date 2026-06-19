export default function DemoHint({
    showHint,
    setShowHint,
    autoFill,
    activeRole,
    role,
    DEMO_HINTS,
}) {
    return (
        <div style={{ marginTop: 16, zIndex: 10, width: '100%', maxWidth: 360 }}>
            <button
                onClick={() => {
                    setShowHint((h) => !h)
                    autoFill()
                }}
            >
                {showHint ? `✓ Auto-filled — tap login` : `▼ Show demo credentials (auto-fills)`}
            </button>

            {showHint && <p>{DEMO_HINTS[role].hint}</p>}
        </div>
    )
}