import { login, signup } from '@/infra/actions/auth'
import styles from '@/presentation/styles/Login.module.css'

export default async function LoginPage({
    searchParams,
}: {
    searchParams: Promise<{ message?: string; error?: string }>
}) {
    const resolvedParams = await searchParams

    return (
        <div className={styles.container}>
            <div className={styles.card}>
                <h1 className={styles.brand}>Postula</h1>
                <p className={styles.subtitle}>Your personal ATS & career tracker.</p>

                <form className={styles.form}>
                    <div className={styles.inputGroup}>
                        <label className={styles.label} htmlFor="email">Email address</label>
                        <input
                            className={styles.input}
                            id="email"
                            name="email"
                            type="email"
                            required
                            placeholder="you@example.com"
                        />
                    </div>

                    <div className={styles.inputGroup}>
                        <label className={styles.label} htmlFor="password">Password</label>
                        <input
                            className={styles.input}
                            id="password"
                            name="password"
                            type="password"
                            required
                            placeholder="••••••••"
                        />
                    </div>

                    <div className={styles.buttonGroup}>
                        <button formAction={login} className={`${styles.button} ${styles.loginButton}`}>
                            Log In
                        </button>
                        <button formAction={signup} className={`${styles.button} ${styles.signupButton}`}>
                            Create Account
                        </button>
                    </div>

                    {resolvedParams.message && (
                        <div className={styles.infoMessage}>
                            {resolvedParams.message}
                        </div>
                    )}

                    {resolvedParams.error && (
                        <div className={styles.errorMessage}>
                            {resolvedParams.error}
                        </div>
                    )}
                </form>
            </div>
        </div>
    )
}