export type ParticipationType = "team" | "individual";
export interface Criterion {
  name: string;
  weight: number;
}
export interface EventConfig {
  id: string;
  number: string;
  name: string;
  category: string;
  description: string;
  participationType: ParticipationType;
  minMembers: number;
  maxMembers: number | null;
  eligibility: string;
  rules: string[];
  instructions: string[];
  evaluationCriteria: Criterion[];
  registrationOpen: boolean;
  rulesPdf?: string;
  coordinatorName?: string;
  coordinatorPhone?: string;
  hidden?: boolean;
}
export interface Participant {
  name: string;
  rollNo: string;
}
export interface Registration {
  id?: string;
  registrationId?: string;
  teamId?: string;
  eventId: string;
  eventName: string;
  teamName?: string;
  leaderName: string;
  leaderRollNo: string;
  leaderEmail: string;
  leaderPhone: string;
  members?: Participant[];
  status?: "confirmed" | "pending" | "cancelled";
  registeredAt?: string;
}

export interface EventStat {
  eventId: string;
  eventName: string;
  registrations: number;
  teams: number;
  students: number;
}

export interface EvaluationRecord {
  eventId: string;
  teamId: string;
  scores: Record<string, number>;
  totalScore: number;
  updatedAt?: string;
}

export interface ResultRecord {
  teamId: string;
  teamName: string;
  leaderName: string;
  total: number;
  rank: number;
}

export interface AuditLogRecord {
  timestamp: string;
  user: string;
  role: string;
  action: string;
  eventId: string;
  eventName: string;
  teamId: string;
  teamName: string;
  prevM1: string | number;
  prevM2: string | number;
  prevM3: string | number;
  prevM4: string | number;
  prevM5: string | number;
  prevTotal: string | number;
  newM1: string | number;
  newM2: string | number;
  newM3: string | number;
  newM4: string | number;
  newM5: string | number;
  newTotal: string | number;
}

export interface DashboardStats {
  totalRegistrations: number;
  totalTeams: number;
  totalStudents: number;
  totalEvents: number;
  eventWiseStats: EventStat[];
}
