import { Component } from 'react'

export default class ErrorBoundary extends Component {
    constructor(props) {
        super(props)
        this.state = { hasError: false, error: null }
    }

    static getDerivedStateFromError(error) {
        return { hasError: true, error }
    }

    componentDidCatch(error, info) {
        console.error('[ErrorBoundary] Caught error:', error.message, info)
    }

    render() {
        if (this.state.hasError) {
            return (
                <div style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    minHeight: '100vh',
                    gap: '1rem',
                    padding: '2rem',
                    textAlign: 'center',
                    fontFamily: 'var(--font-main)'
                }}>
                    <div style={{ fontSize: '3rem' }}>⚠️</div>
                    <h2 style={{ color: 'var(--color-text)', fontWeight: 700 }}>
                        Something went wrong
                    </h2>
                    <p style={{ color: 'var(--color-text-muted)', fontSize: '0.85rem', maxWidth: 320 }}>
                        {this.state.error?.message ?? 'An unexpected error occurred.'}
                    </p>
                    <button
                        onClick={() => this.setState({ hasError: false, error: null })}
                        style={{
                            background: 'var(--color-green-dim)',
                            border: '1px solid var(--color-green)',
                            color: 'var(--color-green)',
                            borderRadius: 'var(--radius-md)',
                            padding: '0.5rem 1.5rem',
                            fontSize: '0.85rem',
                            fontWeight: 700,
                            cursor: 'pointer',
                            fontFamily: 'var(--font-main)'
                        }}
                    >
                        Try Again
                    </button>
                </div>
            )
        }

        return this.props.children
    }
}