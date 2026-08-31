import { events, registrations } from "../data/events";
export const eventService = {
  getAll: () => events,
  getById: (id: string) => events.find((e) => e.id === id),
};
export const registrationService = {
  getAll: () => registrations,
  getByEvent: (id: string) => registrations.filter((r) => r.eventId === id),
  create: (data: unknown) => data,
};
export const adminService = {
  getStats: () => ({
    totalRegistrations: registrations.length,
    totalTeams: registrations.filter((r) => r.teamName).length,
    totalStudents: registrations.reduce((n, r) => n + r.members.length, 0),
    totalEvents: events.length,
    eventWiseStats: events.map((e) => ({
      eventId: e.id,
      eventName: e.name,
      registrations: registrations.filter((r) => r.eventId === e.id).length,
      teams: registrations.filter((r) => r.eventId === e.id && r.teamName)
        .length,
      students: registrations
        .filter((r) => r.eventId === e.id)
        .reduce((n, r) => n + r.members.length, 0),
    })),
  }),
  getEventStats: (id: string) => {
    const rs = registrations.filter((r) => r.eventId === id);
    return {
      totalTeams: rs.filter((r) => r.teamName).length,
      totalStudents: rs.reduce((n, r) => n + r.members.length, 0),
    };
  },
};
