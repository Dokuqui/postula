'use client'

import { useState } from 'react'
import { Job } from '@/domain/models/Job'
import { updateJobDetails } from '@/infra/actions/job'
import styles from '@/presentation/styles/Dashboard.module.css'
import Portal from './Portal'

interface Props {
    job: Job;
    onClose: () => void;
}

export default function JobDetailsModal({ job, onClose }: Props) {
    const [notes, setNotes] = useState(job.notes || '')
    const [description, setDescription] = useState(job.description || '')
    const [isSaving, setIsSaving] = useState(false)

    async function handleSave() {
        setIsSaving(true)
        await updateJobDetails(job.id, { notes, description })
        setIsSaving(false)
        onClose()
    }

    return (
        <Portal>
            <div className={styles.modalOverlay} onClick={onClose}>
                <div className={styles.detailsModalContent} onClick={(e) => e.stopPropagation()}>
                    <header className={styles.modalHeader}>
                        <div>
                            <h2 className={styles.modalTitle}>{job.jobTitle}</h2>
                            <p className={styles.modalSubtitle}>{job.companyName}</p>
                        </div>
                        <button onClick={onClose} className={styles.closeBtn}>&times;</button>
                    </header>

                    <div className={styles.modalBody}>
                        <section className={styles.modalSection}>
                            <label className={styles.label}>Job Description</label>
                            <textarea
                                className={styles.textarea}
                                placeholder="Paste the job requirements here..."
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                            />
                        </section>

                        <section className={styles.modalSection}>
                            <label className={styles.label}>My Notes</label>
                            <textarea
                                className={styles.textarea}
                                placeholder="Recruiter info, interview questions, etc..."
                                value={notes}
                                onChange={(e) => setNotes(e.target.value)}
                            />
                        </section>
                    </div>

                    <footer className={styles.modalActions}>
                        <button className={styles.secondaryBtn} onClick={onClose}>Cancel</button>
                        <button className={styles.submitBtn} onClick={handleSave} disabled={isSaving}>
                            {isSaving ? 'Saving...' : 'Save Changes'}
                        </button>
                    </footer>
                </div>
            </div>
        </Portal>
    )
}
