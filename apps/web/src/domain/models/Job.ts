export type JobStatus = 'to_apply' | 'applied' | 'interview' | 'offer' | 'rejected';
export type JobSource = 'inbound' | 'outbound' | 'spontaneous';

export interface Job {
    id: string;
    userId: string;
    companyName: string;
    jobTitle: string;
    url?: string;
    status: JobStatus;
    source: JobSource;
    notes?: string,
    description?: string,
    createdAt: Date;
    updatedAt: Date;
}