import { redirect } from 'next/navigation'
import { createClient } from '@/infra/supabase/server'
import { logout } from '@/infra/actions/auth'
import styles from '@/presentation/styles/Dashboard.module.css'
import AddJobForm from '@/presentation/components/AddJobForm'
import KanbanBoard from '@/presentation/components/KanbanBoard'
import ThemeToggle from '@/presentation/components/ThemeToggle'

export default async function DashboardPage() {
    const supabase = await createClient()
    const { data: { user }, error } = await supabase.auth.getUser()

    if (error || !user) {
        redirect('/login')
    }

    const { data: dbJobs } = await supabase
        .from('jobs')
        .select('*')
        .order('created_at', { ascending: false })

    const domainJobs = (dbJobs || []).map((dbJob) => ({
        id: dbJob.id,
        userId: dbJob.user_id,
        companyName: dbJob.company_name,
        jobTitle: dbJob.job_title,
        url: dbJob.url,
        status: dbJob.status,
        source: dbJob.source,
        createdAt: new Date(dbJob.created_at),
        updatedAt: new Date(dbJob.updated_at)
    }))

    return (
        <div className={styles.layout}>
            <header className={styles.header}>
                <div className={styles.brand}>Postula</div>
                <div className={styles.userInfo}>
                    <ThemeToggle />
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

                <KanbanBoard initialJobs={domainJobs} />
            </main>
        </div>
    )
}