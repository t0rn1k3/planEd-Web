import { create } from "zustand";
import { v4 as uuid } from "uuid";
import { Teacher } from "@/types/timetable";

interface TimetableState {
  teachers: Teacher[];
  addTeacher: (name: string) => void;
  removeTeacher: (id: string) => void;
}

export const useTimetableStore = create<TimetableState>((set) => ({
  teachers: [],
  addTeacher: (name) =>
    set((state) => {
      const trimmed = name.trim();
      if (!trimmed) return state;
      const exists = state.teachers.some(
        (teacher) => teacher.name.toLowerCase() === trimmed.toLowerCase()
      );
      if (exists) return state;
      return {
        teachers: [...state.teachers, { id: uuid(), name: trimmed }],
      };
    }),
  removeTeacher: (id) =>
    set((state) => ({
      teachers: state.teachers.filter((teacher) => teacher.id !== id),
    })),
}));
