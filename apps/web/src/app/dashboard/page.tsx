import { redirect } from 'next/navigation'
import { createClient } from '@/infra/supabase/server'
import { logout } from '@/infra/actions/auth'
import styles from '@/presentation/styles/Dashboard.module.css'
import AddJobForm from '@/presentation/components/AddJobForm'

const COLUMNS = [
    { id: 'to_apply', title: 'To Apply' },
    { id: 'applied', title: 'Applied' },
    { id: 'interview', title: 'Interview' },
    { id: 'offer', title: 'Offer' },
    { id: 'rejected', title: 'Rejected' },
]

export default async function DashboardPage() {
    const supabase = await createClient()
    const { data: { user }, error } = await supabase.auth.getUser()

    if (error || !user) {
        redirect('/login')
    }

    const { data: jobs } = await supabase
        .from('jobs')
        .select('*')
        .order('created_at', { ascending: false })

    return (
        <div className={styles.layout}>
            <header className={styles.header}>
                <div className={styles.brand}>Postula</div>
                <div className={styles.userInfo}>
                    <span>{user.email}</span>
                    <form action={logout}>
                        <button type="submit" className={styles.logoutButton}>Log out</button>
                    </form>
                </div>
            </header>

            <main className={styles.main}>
                <div className={styles.pageHeader}>
                    <h1 className={styles.pageTitle}>My Applications</h1>
                </div>

                <AddJobForm />

                <div className={styles.boardDraft}>
                    {COLUMNS.map((column) => {
                        const columnJobs = jobs?.filter(job => job.status === column.id) || []

                        return (
                            <div key={column.id} className={styles.column}>
                                <h2 className={styles.columnTitle}>
                                    {column.title} ({columnJobs.length})
                                </h2>

                                {columnJobs.map((job) => (
                                    <div key={job.id} className={styles.card}>
                                        <div className={styles.cardTitle}>{job.job_title}</div>
                                        <div className={styles.cardCompany}>{job.company_name}</div>

                                        {job.url && (
                                            <a href={job.url} target="_blank" rel="noopener noreferrer" className={styles.cardUrl}>
                                                View Posting
                                            </a>
                                        )}

                                        <div className={styles.cardFooter}>
                                            <span className={styles.badge}>{job.source}</span>
                                            <span>
                                                {new Date(job.created_at).toLocaleDateString('en-GB')}
                                            </span>
                                        </div>
                                    </div>
                                ))}

                                {columnJobs.length === 0 && (
                                    <div className={styles.cardDraft} style={{ textAlign: 'center', background: 'transparent', border: '1px dashed #ccc' }}>
                                        Empty
                                    </div>
                                )}
                            </div>
                        )
                    })}
                </div>
            </main>
        </div>
    )
}