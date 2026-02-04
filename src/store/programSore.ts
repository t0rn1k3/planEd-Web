import { create } from "zustand";
import { CurriculumProgram, Module } from "@/types/program";

interface ProgramState {
  programs: CurriculumProgram[];
  addProgram: (program: CurriculumProgram) => void;
  removeProgram: (id: string) => void;
  addModule: (programId: string, module: Module) => void;
  removeModule: (programId: string, moduleId: string) => void;
  updateProgram: (program: CurriculumProgram) => void;
  updateModule: (programId: string, module: Module) => void;
}

export const useProgramStore = create<ProgramState>((set) => ({
  programs: [],

  addProgram: (program) =>
    set((state) => ({
      programs: [...state.programs, program],
    })),

  removeProgram: (id) =>
    set((state) => ({
      programs: state.programs.filter((p) => p.id !== id),
    })),

  addModule: (programId, module) =>
    set((state) => ({
      programs: state.programs.map((p) =>
        p.id === programId
          ? { ...p, modules: [...p.modules, module] }
          : p
      ),
    })),

  removeModule: (programId, moduleId) =>
    set((state) => ({
      programs: state.programs.map((p) =>
        p.id === programId
          ? {
              ...p,
              modules: p.modules.filter((m) => m.id !== moduleId),
            }
          : p
      ),
    })),

  updateProgram: (program) =>
    set((state) => ({
      programs: state.programs.map((p) =>
        p.id === program.id ? program : p
      ),
    })),

  updateModule: (programId, updatedModule) =>
    set((state) => ({
      programs: state.programs.map((p) =>
        p.id === programId
          ? {
              ...p,
              modules: p.modules.map((m) =>
                m.id === updatedModule.id ? updatedModule : m
              ),
            }
          : p
      ),
    })),
}));
