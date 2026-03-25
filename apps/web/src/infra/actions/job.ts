'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '../supabase/server'
import { JobStatus, JobSource } from '@/domain/models/Job'

export async function createJob(formData: FormData) {
    const supabase = await createClient()

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new Error("Unauthorized")

    const companyName = formData.get('companyName') as string
    const jobTitle = formData.get('jobTitle') as string
    const url = formData.get('url') as string
    const status = (formData.get('status') as JobStatus) || 'to_apply'
    const source = (formData.get('source') as JobSource) || 'outbound'

    const { error } = await supabase.from('jobs').insert({
        user_id: user.id,
        company_name: companyName,
        job_title: jobTitle,
        url: url,
        status: status,
        source: source
    })

    if (error) {
        console.error("Error adding job:", error)
        throw new Error("Failed to add job")
    }

    revalidatePath('/dashboard')
}