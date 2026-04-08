'use client'

import { useState } from 'react'
import { Trash2 } from 'lucide-react'
import { deleteJob } from '@/infra/actions/job'
import styles from '@/presentation/styles/Dashboard.module.css'
import Portal from './Portal'

export default function JobCardActions({ jobId }: { jobId: string }) {
    const [showModal, setShowModal] = useState(false)
    const [isDeleting, setIsDeleting] = useState(false)

    const handleCancel = (e: React.MouseEvent) => {
        e.preventDefault()
        e.stopPropagation()
        setShowModal(false)
    }

    const TrashIcon = Trash2 as any;

    return (
        <>
            <button
                type="button"
                className={styles.deleteBtn}
                onClick={(e) => {
                    e.stopPropagation()
                    setShowModal(true)
                }}
                title="Delete Job"
            >
                <TrashIcon size={16} strokeWidth={2.5} />
            </button>

            {showModal && (
                <Portal>
                    <div className={styles.modalOverlay} onClick={handleCancel}>
                        <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
                            <h3 className={styles.modalTitle}>Delete Application</h3>
                            <p className={styles.modalText}>Are you sure? This cannot be undone.</p>

                            <div className={styles.modalActions}>
                                <button
                                    type="button"
                                    className={styles.secondaryBtn}
                                    onClick={handleCancel}
                                    disabled={isDeleting}
                                >
                                    Cancel
                                </button>
                                <button
                                    type="button"
                                    className={styles.confirmBtn}
                                    onClick={async (e) => {
                                        e.stopPropagation()
                                        setIsDeleting(true)
                                        await deleteJob(jobId)
                                    }}
                                    disabled={isDeleting}
                                >
                                    {isDeleting ? 'Deleting...' : 'Delete'}
                                </button>
                            </div>
                        </div>
                    </div>
                </Portal>
            )}
        </>
    )
}