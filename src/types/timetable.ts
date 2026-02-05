export interface SchoolClass {
  id: string;
  name: string;
}

export interface TeachingAssignment {
  id: string;
  subject: string;
  classId: string;
  weeklyLessons: number;
}

export interface Teacher {
  id: string;
  name: string;
  weeklyHours: number;
  assignments: TeachingAssignment[];
  unavailableSlots: string[];
}

export interface TimetableConfig {
  periodsPerDay: number;
  lessonDuration: 40 | 45;
  breakDurations: number[];
}

export interface TimetableSlot {
  teacherId: string;
  subject: string;
  assignmentId: string;
}

export type TimetableGrid = Array<Array<TimetableSlot | null>>;
export type TimetableSchedule = Record<string, TimetableGrid>;
