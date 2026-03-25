'use client'

import { useState } from 'react'
import { deleteJob } from '@/infra/actions/job'
import styles from '@/presentation/styles/Dashboard.module.css'

interface Props {
    jobId: string;
}

export default function JobCardActions({ jobId }: Props) {
    const [showModal, setShowModal] = useState(false)
    const [isDeleting, setIsDeleting] = useState(false)

    async function handleConfirmDelete() {
        setIsDeleting(true)
        await deleteJob(jobId)
    }

    return (
        <>
            <button
                className={styles.deleteBtn}
                onClick={() => setShowModal(true)}
                title="Delete Job"
            >
                <svg
                    width="16" height="16" viewBox="0 0 24 24" fill="none"
                    stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                >
                    <path d="M3 6h18" />
                    <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
                    <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
                </svg>
            </button>

            {showModal && (
                <div
                    className={styles.modalOverlay}
                    onClick={() => setShowModal(false)}
                >
                    <div
                        className={styles.modalContent}
                        onClick={(e) => e.stopPropagation()}
                    >
                        <h3 className={styles.modalTitle}>Delete Application</h3>
                        <p className={styles.modalText}>
                            Are you sure you want to delete this job? This action cannot be undone.
                        </p>

                        <div className={styles.modalActions}>
                            <button
                                className={styles.cancelBtn}
                                onClick={() => setShowModal(false)}
                                disabled={isDeleting}
                            >
                                Cancel
                            </button>
                            <button
                                className={styles.confirmBtn}
                                onClick={handleConfirmDelete}
                                disabled={isDeleting}
                            >
                                {isDeleting ? 'Deleting...' : 'Delete'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    )
}