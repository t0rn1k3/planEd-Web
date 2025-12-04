import { create } from "zustand";
import {
  collection,
  addDoc,
  deleteDoc,
  doc,
  getDocs,
  updateDoc,
  setDoc,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import { CurriculumProgram, Module } from "@/types/program";

interface ProgramState {
  programs: CurriculumProgram[];
  fetchPrograms: () => Promise<void>;
  addProgram: (program: CurriculumProgram) => Promise<void>;
  removeProgram: (id: string) => Promise<void>;
  addModule: (programId: string, module: Module) => Promise<void>;
  removeModule: (programId: string, moduleId: string) => Promise<void>;
  updateProgram: (program: CurriculumProgram) => Promise<void>;
  updateModule: (programId: string, updatedModule: Module) => Promise<void>;
}

export const useProgramStore = create<ProgramState>((set, get) => ({
  programs: [],

  fetchPrograms: async () => {
    const snapshot = await getDocs(collection(db, "programs"));
    const programs: CurriculumProgram[] = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as CurriculumProgram[];
    set({ programs });
  },

  addProgram: async (program) => {
    const docRef = await addDoc(collection(db, "programs"), {
      name: program.name,
      modules: program.modules || [],
    });
    set((state) => ({
      programs: [...state.programs, { ...program, id: docRef.id }],
    }));
  },

  removeProgram: async (id) => {
    await deleteDoc(doc(db, "programs", id));
    set((state) => ({
      programs: state.programs.filter((p) => p.id !== id),
    }));
  },

  addModule: async (programId, module) => {
    const currentPrograms = get().programs;
    const target = currentPrograms.find((p) => p.id === programId);
    if (!target) return;

    const updated = {
      ...target,
      modules: [...target.modules, module],
    };

    await updateDoc(doc(db, "programs", programId), updated);
    set((state) => ({
      programs: state.programs.map((p) => (p.id === programId ? updated : p)),
    }));
  },

  removeModule: async (programId, moduleId) => {
    const currentPrograms = get().programs;
    const target = currentPrograms.find((p) => p.id === programId);
    if (!target) return;

    const updated = {
      ...target,
      modules: target.modules.filter((m) => m.id !== moduleId),
    };

    await updateDoc(doc(db, "programs", programId), updated);
    set((state) => ({
      programs: state.programs.map((p) => (p.id === programId ? updated : p)),
    }));
  },

  updateProgram: async (program) => {
    await setDoc(doc(db, "programs", program.id), program);
    set((state) => ({
      programs: state.programs.map((p) => (p.id === program.id ? program : p)),
    }));
  },

  updateModule: async (programId, updatedModule) => {
    const currentPrograms = get().programs;
    const target = currentPrograms.find((p) => p.id === programId);
    if (!target) return;

    const updated = {
      ...target,
      modules: target.modules.map((m) =>
        m.id === updatedModule.id ? updatedModule : m
      ),
    };

    await updateDoc(doc(db, "programs", programId), updated);
    set((state) => ({
      programs: state.programs.map((p) => (p.id === programId ? updated : p)),
    }));
  },
}));
