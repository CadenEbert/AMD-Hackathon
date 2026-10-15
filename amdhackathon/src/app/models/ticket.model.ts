export interface Ticket {
    tickerId: number;
    companyId: number;
    companyName: string;
    categoryId: number;
    category: string;
    assignedTeamId: number;
    description: string;
    time_active: string;
    severity_score: number;
    resolved: boolean;
    created_at: string;
}
