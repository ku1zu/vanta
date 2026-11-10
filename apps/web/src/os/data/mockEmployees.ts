export interface Employee { name: string; task: string; status: 'active' | 'monitoring' | 'idle' }

export const EMPLOYEES: Employee[] = [
  { name: 'Marketing', task: 'Running campaign analysis', status: 'active' },
  { name: 'Sales', task: 'Following up with 4 leads', status: 'active' },
  { name: 'Support', task: 'Triaging 14 messages', status: 'active' },
  { name: 'Finance', task: 'Reconciling invoices', status: 'monitoring' },
  { name: 'Research', task: 'Analyzing competitors', status: 'active' },
  { name: 'Website', task: 'Monitoring conversion rate', status: 'monitoring' },
  { name: 'Analytics', task: 'Updating growth model', status: 'active' },
  { name: 'Content', task: 'Waiting for brief', status: 'idle' },
]