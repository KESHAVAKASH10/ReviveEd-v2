export default function PandaMascot({ hiding }) {
    return (
        <div style={{ position: 'relative', width: 120, height: 120, margin: '0 auto 8px' }}>
            <svg viewBox="0 0 120 120" width="120" height="120">

                {/* Ears */}
                <circle cx="22" cy="28" r="18" fill="#222" />
                <circle cx="22" cy="28" r="10" fill="#444" />
                <circle cx="98" cy="28" r="18" fill="#222" />
                <circle cx="98" cy="28" r="10" fill="#444" />

                {/* Head */}
                <circle cx="60" cy="65" r="48" fill="#f0f0f0" />

                {/* Eye patches */}
                <ellipse cx="42" cy="58" rx="14" ry="12" fill="#222" />
                <ellipse cx="78" cy="58" rx="14" ry="12" fill="#222" />

                {/* Eyes */}
                <circle cx="42" cy="58" r="7" fill="white" />
                <circle cx="78" cy="58" r="7" fill="white" />

                {/* Pupils — look forward normally, look away when hiding */}
                <circle
                    cx={hiding ? "39" : "43"}
                    cy={hiding ? "55" : "59"}
                    r="4" fill="#1a1a2e"
                    style={{ transition: 'cx 0.3s, cy 0.3s' }}
                />
                <circle
                    cx={hiding ? "75" : "79"}
                    cy={hiding ? "55" : "59"}
                    r="4" fill="#1a1a2e"
                    style={{ transition: 'cx 0.3s, cy 0.3s' }}
                />

                {/* Shine in eyes */}
                <circle cx="45" cy="56" r="1.5" fill="white" />
                <circle cx="81" cy="56" r="1.5" fill="white" />

                {/* Nose */}
                <ellipse cx="60" cy="72" rx="5" ry="3.5" fill="#333" />

                {/* Mouth — smile normally, worried when hiding */}
                {hiding
                    ? <path d="M50 82 Q60 78 70 82" stroke="#666" strokeWidth="2" fill="none" strokeLinecap="round" />
                    : <path d="M50 80 Q60 88 70 80" stroke="#666" strokeWidth="2" fill="none" strokeLinecap="round" />
                }

                {/* Cheeks */}
                <ellipse cx="30" cy="76" rx="8" ry="5" fill="#ffb3ba" opacity="0.5" />
                <ellipse cx="90" cy="76" rx="8" ry="5" fill="#ffb3ba" opacity="0.5" />

                {/* Hands covering eyes when hiding */}
                {hiding && (
                    <g style={{ animation: 'none' }}>
                        {/* Left hand */}
                        <ellipse cx="38" cy="58" rx="16" ry="14" fill="#f5d0a9" />
                        <ellipse cx="28" cy="50" rx="7" ry="6" fill="#f5d0a9" />
                        <ellipse cx="36" cy="46" rx="7" ry="6" fill="#f5d0a9" />
                        <ellipse cx="44" cy="46" rx="7" ry="6" fill="#f5d0a9" />
                        {/* Right hand */}
                        <ellipse cx="82" cy="58" rx="16" ry="14" fill="#f5d0a9" />
                        <ellipse cx="72" cy="46" rx="7" ry="6" fill="#f5d0a9" />
                        <ellipse cx="80" cy="46" rx="7" ry="6" fill="#f5d0a9" />
                        <ellipse cx="88" cy="50" rx="7" ry="6" fill="#f5d0a9" />
                    </g>
                )}
            </svg>

            {/* Speech bubble */}
            {hiding && (
                <div style={{
                    position: 'absolute', top: -8, right: -75,
                    background: 'white', border: '1.5px solid #2563eb',
                    borderRadius: 10, padding: '4px 10px',
                    fontSize: 10, fontWeight: 800, color: '#1e40af',
                    whiteSpace: 'nowrap',
                    animation: 'fadeIn 0.2s ease'
                }}>
                    🙈 not looking!
                </div>
            )}
        </div>
    )
}