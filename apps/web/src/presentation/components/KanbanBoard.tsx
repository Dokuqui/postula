'use client'

import { useState, useEffect } from 'react'
import { JobStatus, Job } from '@/domain/models/Job'
import { updateJobStatus } from '@/infra/actions/job'
import JobCardActions from './JobCardActions'
import styles from '@/presentation/styles/Dashboard.module.css'
import JobDetailsModal from './JobDetailsModal'

const COLUMNS: { id: JobStatus; title: string }[] = [
    { id: 'to_apply', title: 'To Apply' },
    { id: 'applied', title: 'Applied' },
    { id: 'interview', title: 'Interview' },
    { id: 'offer', title: 'Offer' },
    { id: 'rejected', title: 'Rejected' },
]

function getDomainIcon(urlString: string) {
    try {
        const url = new URL(urlString)
        return `https://www.google.com/s2/favicons?domain=${url.hostname}&sz=32`
    } catch (e) { return null }
}

export default function KanbanBoard({ initialJobs }: { initialJobs: Job[] }) {
    const [jobs, setJobs] = useState<Job[]>(initialJobs)
    const [selectedJob, setSelectedJob] = useState<Job | null>(null)

    useEffect(() => { setJobs(initialJobs) }, [initialJobs])

    const handleDragStart = (e: React.DragEvent, jobId: string) => {
        e.dataTransfer.setData('jobId', jobId)
        setTimeout(() => { (e.target as HTMLElement).style.opacity = '0.5' }, 0)
    }

    const handleDrop = async (e: React.DragEvent, newStatus: JobStatus) => {
        e.preventDefault()
        const jobId = e.dataTransfer.getData('jobId')
        if (!jobId) return
        setJobs(prev => prev.map(j => j.id === jobId ? { ...j, status: newStatus } : j))
        await updateJobStatus(jobId, newStatus)
    }

    return (
        <div className={styles.boardDraft}>
            {COLUMNS.map((column) => {
                const columnJobs = jobs.filter(j => j.status === column.id)
                return (
                    <div
                        key={column.id}
                        className={styles.column}
                        onDragOver={(e) => e.preventDefault()}
                        onDrop={(e) => handleDrop(e, column.id)}
                    >
                        <h2 className={styles.columnTitle}>{column.title} ({columnJobs.length})</h2>

                        {columnJobs.map((job) => {
                            const iconUrl = job.url ? getDomainIcon(job.url) : null
                            return (
                                <div
                                    key={job.id}
                                    className={styles.card}
                                    draggable
                                    onDragStart={(e) => handleDragStart(e, job.id)}
                                    onDragEnd={(e) => (e.target as HTMLElement).style.opacity = '1'}
                                    onClick={(e) => {
                                        if ((e.target as HTMLElement).closest('button')) return;
                                        setSelectedJob(job);
                                    }}
                                >
                                    <div className={styles.cardHeader}>
                                        <div className={styles.cardTitle}>{job.jobTitle}</div>
                                        <JobCardActions jobId={job.id} />
                                    </div>
                                    <div className={styles.companyRow}>
                                        <span className={styles.cardCompany}>{job.companyName}</span>
                                        {job.url && iconUrl && (
                                            <a href={job.url} target="_blank" rel="noreferrer" className={styles.iconLink}>
                                                <img src={iconUrl} alt="" className={styles.favicon} />
                                            </a>
                                        )}
                                    </div>
                                    <div className={styles.cardFooter}>
                                        <span className={styles.badge}>{job.source}</span>
                                        <span>{job.createdAt.toLocaleDateString('en-GB')}</span>
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                )
            })}

            {selectedJob && (
                <JobDetailsModal
                    job={selectedJob}
                    onClose={() => setSelectedJob(null)}
                />
            )}
        </div>
    )
}