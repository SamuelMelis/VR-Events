import type { Client, Lead, UserProfile, VrEvent } from "./types";

export const users: UserProfile[] = [
  {
    id: "u_sam",
    email: "sam@vr-ethiopia.com",
    name: "Samuel Melis",
    role: "admin",
  },
  {
    id: "u_mick",
    email: "mick@vr-ethiopia.com",
    name: "Mickael T.",
    role: "operator",
  },
];

export const userById = (id: string) => users.find((u) => u.id === id);

export const leads: Lead[] = [
  {
    id: "l_01",
    organizationName: "International Community School (ICS)",
    contactName: "Ms. Sarah",
    contactPhone: "+251911223344",
    targetType: "school",
    stage: "qualified",
    ownerId: "u_sam",
    createdAt: "2024-08-10T10:00:00Z",
    qualification: {
      crowdSize: 800,
      hasPower: true,
      hasShade: true,
      eventDate: "2024-09-15T09:00:00Z",
    },
    notes: "Spring fair event. They want 2 headsets for 4 hours.",
  },
  {
    id: "l_02",
    organizationName: "Heineken Ethiopia",
    contactName: "Dawit",
    contactPhone: "+251922334455",
    targetType: "corporate",
    stage: "contacted",
    ownerId: "u_sam",
    createdAt: "2024-08-12T14:30:00Z",
    notes: "Employee appreciation day. Need to follow up with proposal.",
  },
  {
    id: "l_03",
    organizationName: "Meskel Square Food Fest",
    contactName: "Tewodros",
    contactPhone: "+251933445566",
    targetType: "festival",
    stage: "qualifying",
    ownerId: "u_sam",
    createdAt: "2024-08-14T09:15:00Z",
    qualification: {
      crowdSize: 5000,
    },
  },
];

export const clients: Client[] = [
  {
    id: "c_01",
    name: "Lycée Guebre-Mariam",
    type: "school",
    primaryContactName: "M. Lefebvre",
    primaryContactPhone: "+251944556677",
    totalEvents: 3,
    lifetimeRevenue: 45000,
    lastEventAt: "2024-06-10T00:00:00Z",
    rebookingStatus: "active",
  },
  {
    id: "c_02",
    name: "British Council",
    type: "ngo",
    primaryContactName: "Helen",
    primaryContactPhone: "+251955667788",
    totalEvents: 1,
    lifetimeRevenue: 12000,
    lastEventAt: "2024-05-15T00:00:00Z",
    rebookingStatus: "follow_up",
  },
];

export const events: VrEvent[] = [
  {
    id: "e_01",
    clientId: "c_01",
    clientName: "Lycée Guebre-Mariam",
    title: "End of Year Carnival",
    date: "2024-06-10T00:00:00Z",
    startsAt: "2024-06-10T10:00:00Z",
    endsAt: "2024-06-10T16:00:00Z",
    venue: "School Main Courtyard",
    expectedCrowd: 1200,
    status: "completed",
    dealType: "flat_fee",
    flatFeeETB: 15000,
    cashCollectedETB: 15000,
    expensesETB: 1200,
    sessionsLogged: 84,
    assignedOperatorIds: ["u_mick"],
  },
  {
    id: "e_02",
    clientId: "l_01",
    clientName: "International Community School",
    title: "Spring Fair",
    date: "2024-09-15T00:00:00Z",
    startsAt: "2024-09-15T09:00:00Z",
    endsAt: "2024-09-15T15:00:00Z",
    venue: "ICS Athletics Field",
    expectedCrowd: 800,
    status: "confirmed",
    dealType: "pay_per_play",
    cashCollectedETB: 0,
    expensesETB: 0,
    sessionsLogged: 0,
    assignedOperatorIds: ["u_mick", "u_sam"],
  },
];
