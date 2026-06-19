export default function PandaMascot({ hiding }) {
    return (
        <div
            style={{
                position: 'relative',
                width: 140,
                height: 160,
                margin: '0 auto',
            }}
        >
            <svg
                viewBox="0 0 140 160"
                width="140"
                height="160"
                style={{ overflow: 'visible' }}
            >
                {/* Body */}
                <ellipse cx="70" cy="135" rx="38" ry="30" fill="#1a1a2e" />
                <ellipse
                    cx="70"
                    cy="130"
                    rx="22"
                    ry="18"
                    fill="#0d1b3e"
                    stroke="#1e40af"
                    strokeWidth="1"
                />
                <circle cx="70" cy="125" r="3" fill="#1d4ed8" opacity="0.8" />
                <circle cx="70" cy="125" r="1.5" fill="#60a5fa" />

                {/* Left arm */}
                <g
                    style={{
                        transformOrigin: '32px 115px',
                        transform: hiding ? 'rotate(-75deg)' : 'rotate(0deg)',
                        transition: 'transform 0.45s cubic-bezier(0.34,1.56,0.64,1)',
                    }}
                >
                    <ellipse
                        cx="32"
                        cy="128"
                        rx="14"
                        ry="10"
                        fill="#111827"
                        transform="rotate(-20,32,128)"
                    />
                    <circle
                        cx="22"
                        cy="135"
                        r="10"
                        fill="#0f172a"
                        stroke="#1e3a5f"
                        strokeWidth="1.2"
                    />
                    <circle cx="18" cy="131" r="4" fill="#1e293b" />
                    <circle cx="25" cy="129" r="4" fill="#1e293b" />
                    <circle cx="18" cy="131" r="1.5" fill="#3b82f6" opacity="0.7" />
                    <circle cx="25" cy="129" r="1.5" fill="#3b82f6" opacity="0.7" />
                </g>

                {/* Right arm */}
                <g
                    style={{
                        transformOrigin: '108px 115px',
                        transform: hiding ? 'rotate(75deg)' : 'rotate(0deg)',
                        transition: 'transform 0.45s cubic-bezier(0.34,1.56,0.64,1)',
                    }}
                >
                    <ellipse
                        cx="108"
                        cy="128"
                        rx="14"
                        ry="10"
                        fill="#111827"
                        transform="rotate(20,108,128)"
                    />
                    <circle
                        cx="118"
                        cy="135"
                        r="10"
                        fill="#0f172a"
                        stroke="#1e3a5f"
                        strokeWidth="1.2"
                    />
                    <circle cx="114" cy="131" r="4" fill="#1e293b" />
                    <circle cx="121" cy="129" r="4" fill="#1e293b" />
                    <circle cx="122" cy="131" r="1.5" fill="#3b82f6" opacity="0.7" />
                    <circle cx="115" cy="129" r="1.5" fill="#3b82f6" opacity="0.7" />
                </g>

                {/* Head */}
                <circle cx="28" cy="42" r="16" fill="#1a1a2e" />
                <circle cx="28" cy="42" r="10" fill="#111827" />
                <circle cx="112" cy="42" r="16" fill="#1a1a2e" />
                <circle cx="112" cy="42" r="10" fill="#111827" />

                <ellipse cx="70" cy="70" rx="46" ry="44" fill="#e8e8e8" />
                <ellipse cx="52" cy="65" rx="17" ry="14" fill="#2d2d2d" />
                <ellipse cx="88" cy="65" rx="17" ry="14" fill="#2d2d2d" />

                {/* Goggles */}
                <rect
                    x="24"
                    y="61"
                    width="92"
                    height="8"
                    rx="4"
                    fill="#1e3a8a"
                    opacity="0.6"
                />
                <ellipse
                    cx="52"
                    cy="65"
                    rx="15"
                    ry="13"
                    fill="#0d1b3e"
                    stroke="#2563eb"
                    strokeWidth="2"
                />
                <ellipse cx="52" cy="65" rx="12" ry="10" fill="#1e3a8a" opacity="0.8" />
                <ellipse cx="47" cy="60" rx="4" ry="3" fill="#60a5fa" opacity="0.5" />

                <ellipse
                    cx="88"
                    cy="65"
                    rx="15"
                    ry="13"
                    fill="#0d1b3e"
                    stroke="#2563eb"
                    strokeWidth="2"
                />
                <ellipse cx="88" cy="65" rx="12" ry="10" fill="#1e3a8a" opacity="0.8" />
                <ellipse cx="83" cy="60" rx="4" ry="3" fill="#60a5fa" opacity="0.5" />

                {/* Face */}
                <ellipse cx="70" cy="86" rx="18" ry="13" fill="#f0f0f0" />
                <ellipse cx="70" cy="80" rx="6" ry="4" fill="#2d2d2d" />

                {hiding ? (
                    <path
                        d="M61 90 Q65 87 70 90 Q75 93 79 90"
                        stroke="#888"
                        strokeWidth="1.5"
                        fill="none"
                        strokeLinecap="round"
                    />
                ) : (
                    <path
                        d="M61 88 Q70 96 79 88"
                        stroke="#888"
                        strokeWidth="1.5"
                        fill="none"
                        strokeLinecap="round"
                    />
                )}

                <ellipse cx="42" cy="80" rx="7" ry="4" fill="#f9a8d4" opacity="0.35" />
                <ellipse cx="98" cy="80" rx="7" ry="4" fill="#f9a8d4" opacity="0.35" />

                {/* Hiding hands */}
                <g
                    style={{
                        transform: hiding ? 'translateY(0)' : 'translateY(60px)',
                        opacity: hiding ? 1 : 0,
                        transition:
                            'transform 0.45s cubic-bezier(0.34,1.56,0.64,1), opacity 0.3s ease',
                    }}
                >
                    <circle
                        cx="46"
                        cy="65"
                        r="18"
                        fill="#0f172a"
                        stroke="#1e3a5f"
                        strokeWidth="1.5"
                    />
                    <circle cx="94" cy="65" r="18" fill="#0f172a" stroke="#1e3a5f" strokeWidth="1.5" />
                </g>
            </svg>

            {/* Speech bubble */}
            <div
                style={{
                    position: 'absolute',
                    top: -10,
                    right: -60,
                    background: 'rgba(255,255,255,0.95)',
                    border: '1.5px solid #2563eb',
                    borderRadius: 10,
                    padding: '4px 10px',
                    fontSize: 10,
                    fontWeight: 800,
                    color: '#1e40af',
                    whiteSpace: 'nowrap',
                    transform: hiding ? 'scale(1)' : 'scale(0.85)',
                    opacity: hiding ? 1 : 0,
                    transition: 'all 0.3s',
                }}
            >
                🙈 NOT LOOKING!
            </div>

            <div
                style={{
                    position: 'absolute',
                    top: -10,
                    right: -70,
                    background: 'rgba(0,229,160,0.12)',
                    border: '1.5px solid rgba(0,229,160,0.5)',
                    borderRadius: 10,
                    padding: '4px 10px',
                    fontSize: 10,
                    fontWeight: 800,
                    color: '#00e5a0',
                    whiteSpace: 'nowrap',
                    transform: hiding ? 'scale(0.85)' : 'scale(1)',
                    opacity: hiding ? 0 : 1,
                    transition: 'all 0.3s',
                }}
            >
                SPEED = ADVANTAGE
            </div>
        </div>
    )
}