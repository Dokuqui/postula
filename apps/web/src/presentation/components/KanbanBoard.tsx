'use client'

import { useState, useEffect } from 'react'
import { JobStatus, Job } from '@/domain/models/Job'
import { updateJobStatus } from '@/infra/actions/job'
import JobCardActions from './JobCardActions'
import styles from '@/presentation/styles/Dashboard.module.css'

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
    } catch (e) {
        return null
    }
}

export default function KanbanBoard({ initialJobs }: { initialJobs: Job[] }) {
    const [jobs, setJobs] = useState<Job[]>(initialJobs)

    useEffect(() => {
        setJobs(initialJobs)
    }, [initialJobs])

    const handleDragStart = (e: React.DragEvent, jobId: string) => {
        e.dataTransfer.setData('jobId', jobId)
        setTimeout(() => {
            (e.target as HTMLElement).style.opacity = '0.5'
        }, 0)
    }

    const handleDragEnd = (e: React.DragEvent) => {
        (e.target as HTMLElement).style.opacity = '1'
    }

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault()
    }

    const handleDrop = async (e: React.DragEvent, newStatus: JobStatus) => {
        e.preventDefault()
        const jobId = e.dataTransfer.getData('jobId')

        if (!jobId) return

        setJobs(prevJobs =>
            prevJobs.map(job => job.id === jobId ? { ...job, status: newStatus } : job)
        )

        await updateJobStatus(jobId, newStatus)
    }

    return (
        <div className={styles.boardDraft}>
            {COLUMNS.map((column) => {
                const columnJobs = jobs.filter(job => job.status === column.id)

                return (
                    <div
                        key={column.id}
                        className={styles.column}
                        onDragOver={handleDragOver}
                        onDrop={(e) => handleDrop(e, column.id)}
                    >
                        <h2 className={styles.columnTitle}>
                            {column.title} ({columnJobs.length})
                        </h2>

                        {columnJobs.map((job) => {
                            const iconUrl = job.url ? getDomainIcon(job.url) : null;

                            return (
                                <div
                                    key={job.id}
                                    className={styles.card}
                                    draggable
                                    onDragStart={(e) => handleDragStart(e, job.id)}
                                    onDragEnd={handleDragEnd}
                                >
                                    <div className={styles.cardHeader}>
                                        <div className={styles.cardTitle}>{job.jobTitle}</div>
                                        <JobCardActions jobId={job.id} />
                                    </div>

                                    <div className={styles.companyRow}>
                                        <span className={styles.cardCompany}>{job.companyName}</span>
                                        {job.url && iconUrl && (
                                            <a
                                                href={job.url}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className={styles.iconLink}
                                                title="Open Job Posting"
                                            >
                                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                                <img src={iconUrl} alt="source" className={styles.favicon} />
                                            </a>
                                        )}
                                    </div>

                                    <div className={styles.cardFooter}>
                                        <span className={styles.badge}>{job.source}</span>
                                        <span>
                                            {job.createdAt.toLocaleDateString('en-GB')}
                                        </span>
                                    </div>
                                </div>
                            )
                        })}

                        {columnJobs.length === 0 && (
                            <div className={styles.emptyDropZone}>
                                Drop here
                            </div>
                        )}
                    </div>
                )
            })}
        </div>
    )
}