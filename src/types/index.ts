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
}
export interface Participant {
  name: string;
  rollNo: string;
}
export interface Registration {
  id: string;
  registrationId: string;
  eventId: string;
  eventName: string;
  teamName: string;
  leaderName: string;
  leaderRollNo: string;
  leaderEmail: string;
  leaderPhone: string;
  members: Participant[];
  status: "confirmed" | "pending" | "cancelled";
  registeredAt: string;
}

export interface EventStat {
  eventId: string;
  eventName: string;
  registrations: number;
  teams: number;
  students: number;
}
