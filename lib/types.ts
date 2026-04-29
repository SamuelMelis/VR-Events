export type UserRole = "admin" | "operator";

export interface UserProfile {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  avatarUrl?: string;
}

export type LeadStage =
  | "prospecting"
  | "contacted"
  | "qualifying"
  | "qualified"
  | "lost";

export type TargetType = "festival" | "school" | "corporate" | "ngo";

export interface Lead {
  id: string;
  organizationName: string;
  contactName: string;
  contactPhone: string;
  targetType: TargetType;
  stage: LeadStage;
  notes?: string;
  ownerId: string;
  firstContactAt?: string;
  createdAt: string;
  qualification?: {
    crowdSize?: number;
    hasPower?: boolean;
    hasShade?: boolean;
    eventDate?: string;
  };
}

export interface Client {
  id: string;
  name: string;
  type: TargetType;
  primaryContactName: string;
  primaryContactPhone: string;
  totalEvents: number;
  lifetimeRevenue: number;
  lastEventAt?: string;
  rebookingStatus: "active" | "follow_up" | "cold" | "churned";
}

export type EventStatus =
  | "scheduled"
  | "confirmed"
  | "in_progress"
  | "completed"
  | "cancelled";

export type DealType = "pay_per_play" | "flat_fee" | "rev_split";

export interface VrEvent {
  id: string;
  clientId: string;
  clientName: string;
  title: string;
  date: string;
  startsAt: string;
  endsAt: string;
  venue: string;
  expectedCrowd: number;
  status: EventStatus;
  dealType: DealType;
  flatFeeETB?: number;
  cashCollectedETB: number;
  expensesETB: number;
  sessionsLogged: number;
  assignedOperatorIds: string[];
  notes?: string;
}
