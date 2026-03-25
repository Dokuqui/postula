import { redirect } from 'next/navigation'
import { createClient } from '@/infra/supabase/server'
import { logout } from '@/infra/actions/auth'
import styles from '@/presentation/styles/Dashboard.module.css'

export default async function DashboardPage() {
    const supabase = await createClient()

    const { data: { user }, error } = await supabase.auth.getUser()

    if (error || !user) {
        redirect('/login')
    }

    return (
        <div className={styles.layout}>
            <header className={styles.header}>
                <div className={styles.brand}>Postula</div>
                <div className={styles.userInfo}>
                    <span>{user.email}</span>
                    <form action={logout}>
                        <button type="submit" className={styles.logoutButton}>
                            Log out
                        </button>
                    </form>
                </div>
            </header>

            <main className={styles.main}>
                <div className={styles.pageHeader}>
                    <h1 className={styles.pageTitle}>My Applications</h1>
                </div>

                <div className={styles.boardDraft}>
                    <div className={styles.column}>
                        <h2 className={styles.columnTitle}>To Apply (Draft)</h2>
                        <div className={styles.cardDraft}>
                            Save jobs here using the extension...
                        </div>
                    </div>

                    <div className={styles.column}>
                        <h2 className={styles.columnTitle}>Applied</h2>
                    </div>

                    <div className={styles.column}>
                        <h2 className={styles.columnTitle}>Interview</h2>
                    </div>
                </div>
            </main>
        </div>
    )
}