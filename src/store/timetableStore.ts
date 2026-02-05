import { create } from "zustand";
import { v4 as uuid } from "uuid";

import {
  DEFAULT_CONFIG,
  generateSchedule,
  normalizeBreakDurations,
  slotKey,
} from "@/lib/timetableUtils";
import {
  SchoolClass,
  Teacher,
  TeachingAssignment,
  TimetableConfig,
  TimetableSchedule,
} from "@/types/timetable";

interface TimetableState {
  config: TimetableConfig;
  classes: SchoolClass[];
  teachers: Teacher[];
  schedule: TimetableSchedule;
  warnings: string[];
  addClass: (name: string) => void;
  removeClass: (id: string) => void;
  addTeacher: (name: string, weeklyHours: number) => void;
  removeTeacher: (id: string) => void;
  addAssignment: (
    teacherId: string,
    assignment: Omit<TeachingAssignment, "id">
  ) => void;
  removeAssignment: (teacherId: string, assignmentId: string) => void;
  updateConfig: (updates: Partial<TimetableConfig>) => void;
  toggleUnavailableSlot: (
    teacherId: string,
    dayIndex: number,
    period: number
  ) => void;
  generateSchedule: () => void;
  clearSchedule: () => void;
}

function filterUnavailableSlots(
  slots: string[],
  periodsPerDay: number
): string[] {
  return slots.filter((key) => {
    const parts = key.split("-");
    if (parts.length !== 2) return false;
    const period = Number(parts[1]);
    return Number.isFinite(period) && period >= 0 && period < periodsPerDay;
  });
}

export const useTimetableStore = create<TimetableState>((set, get) => ({
  config: {
    ...DEFAULT_CONFIG,
    breakDurations: normalizeBreakDurations(
      DEFAULT_CONFIG.periodsPerDay,
      DEFAULT_CONFIG.breakDurations
    ),
  },
  classes: [],
  teachers: [],
  schedule: {},
  warnings: [],

  addClass: (name) =>
    set((state) => {
      const trimmed = name.trim();
      if (!trimmed) return state;
      const exists = state.classes.some(
        (item) => item.name.toLowerCase() === trimmed.toLowerCase()
      );
      if (exists) return state;

      return {
        classes: [...state.classes, { id: uuid(), name: trimmed }],
        schedule: {},
        warnings: [],
      };
    }),

  removeClass: (id) =>
    set((state) => {
      const classes = state.classes.filter((item) => item.id !== id);
      const teachers = state.teachers.map((teacher) => ({
        ...teacher,
        assignments: teacher.assignments.filter(
          (assignment) => assignment.classId !== id
        ),
      }));

      return {
        classes,
        teachers,
        schedule: {},
        warnings: [],
      };
    }),

  addTeacher: (name, weeklyHours) =>
    set((state) => {
      const trimmed = name.trim();
      if (!trimmed || weeklyHours <= 0) return state;
      const exists = state.teachers.some(
        (teacher) => teacher.name.toLowerCase() === trimmed.toLowerCase()
      );
      if (exists) return state;

      return {
        teachers: [
          ...state.teachers,
          {
            id: uuid(),
            name: trimmed,
            weeklyHours,
            assignments: [],
            unavailableSlots: [],
          },
        ],
        schedule: {},
        warnings: [],
      };
    }),

  removeTeacher: (id) =>
    set((state) => ({
      teachers: state.teachers.filter((teacher) => teacher.id !== id),
      schedule: {},
      warnings: [],
    })),

  addAssignment: (teacherId, assignment) =>
    set((state) => {
      const subject = assignment.subject.trim();
      if (!subject || !assignment.classId || assignment.weeklyLessons <= 0) {
        return state;
      }

      return {
        teachers: state.teachers.map((teacher) =>
          teacher.id === teacherId
            ? {
                ...teacher,
                assignments: [
                  ...teacher.assignments,
                  { ...assignment, id: uuid(), subject },
                ],
              }
            : teacher
        ),
        schedule: {},
        warnings: [],
      };
    }),

  removeAssignment: (teacherId, assignmentId) =>
    set((state) => ({
      teachers: state.teachers.map((teacher) =>
        teacher.id === teacherId
          ? {
              ...teacher,
              assignments: teacher.assignments.filter(
                (assignment) => assignment.id !== assignmentId
              ),
            }
          : teacher
      ),
      schedule: {},
      warnings: [],
    })),

  updateConfig: (updates) =>
    set((state) => {
      const nextPeriods = Math.max(
        1,
        updates.periodsPerDay ?? state.config.periodsPerDay
      );
      const nextBreaks = normalizeBreakDurations(
        nextPeriods,
        updates.breakDurations ?? state.config.breakDurations
      );
      const nextConfig: TimetableConfig = {
        periodsPerDay: nextPeriods,
        lessonDuration: updates.lessonDuration ?? state.config.lessonDuration,
        breakDurations: nextBreaks,
      };

      const periodsChanged = nextPeriods !== state.config.periodsPerDay;
      const teachers = periodsChanged
        ? state.teachers.map((teacher) => ({
            ...teacher,
            unavailableSlots: filterUnavailableSlots(
              teacher.unavailableSlots,
              nextPeriods
            ),
          }))
        : state.teachers;

      return {
        config: nextConfig,
        teachers,
        schedule: periodsChanged ? {} : state.schedule,
        warnings: periodsChanged ? [] : state.warnings,
      };
    }),

  toggleUnavailableSlot: (teacherId, dayIndex, period) =>
    set((state) => {
      const key = slotKey(dayIndex, period);
      return {
        teachers: state.teachers.map((teacher) =>
          teacher.id === teacherId
            ? {
                ...teacher,
                unavailableSlots: teacher.unavailableSlots.includes(key)
                  ? teacher.unavailableSlots.filter((item) => item !== key)
                  : [...teacher.unavailableSlots, key],
              }
            : teacher
        ),
        schedule: {},
        warnings: [],
      };
    }),

  generateSchedule: () =>
    set((state) => {
      const { schedule, warnings } = generateSchedule({
        classes: state.classes,
        teachers: state.teachers,
        config: state.config,
      });
      return { schedule, warnings };
    }),

  clearSchedule: () => set({ schedule: {}, warnings: [] }),
}));
