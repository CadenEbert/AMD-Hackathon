export interface Team {
  id: number;
  name: string;
  description: string;
  supervisors_email: string;
}

export interface Ticket {
  ticketId: number;
  companyId: number;
  companyName: string;
  categoryId: number;
  categoryDescription: string;
  category: string;
  assignedTeamId: number;
  description: string;
  created_at: string;
  time_active: string;
  severity_score: number;
  resolved: boolean;
  team: Team;
  openCount: number;
  resolvedCount: number;
  averageTimeToResolve: number;
  averageSeverity: number;
}
