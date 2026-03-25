'use client'

import { useRef } from 'react'
import { createJob } from '@/infra/actions/job'
import styles from '@/presentation/styles/Dashboard.module.css'

export default function AddJobForm() {
    const formRef = useRef<HTMLFormElement>(null)

    async function action(formData: FormData) {
        await createJob(formData)
        formRef.current?.reset()
    }

    return (
        <div className={styles.formContainer}>
            <h2 className={styles.columnTitle} style={{ marginBottom: '1rem' }}>+ Quick Add Job</h2>
            <form ref={formRef} action={action}>
                <div className={styles.formGrid}>
                    <input className={styles.input} name="companyName" placeholder="Company Name" required />
                    <input className={styles.input} name="jobTitle" placeholder="Job Title (e.g. Frontend Developer)" required />
                    <input className={styles.input} name="url" type="url" placeholder="Link to Job (Optional)" />

                    <select className={styles.input} name="status" required defaultValue="to_apply">
                        <option value="to_apply">To Apply</option>
                        <option value="applied">Applied</option>
                        <option value="interview">Interview</option>
                        <option value="offer">Offer</option>
                        <option value="rejected">Rejected</option>
                    </select>
                </div>
                <button type="submit" className={styles.submitBtn}>Add to Board</button>
            </form>
        </div>
    )
}