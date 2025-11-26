// store/programStore.ts
import { create } from "zustand";
import { CurriculumProgram, Module } from "@/types/program";

interface ProgramState {
  programs: CurriculumProgram[];
  addProgram: (program: CurriculumProgram) => void;
  removeProgram: (id: string) => void;
  addModule: (programId: string, module: Module) => void;
  removeModule: (programId: string, moduleId: string) => void;
  updateProgram: (program: CurriculumProgram) => void;
}

export const useProgramStore = create<ProgramState>((set) => ({
  programs: [],
  addProgram: (program) =>
    set((state) => ({ programs: [...state.programs, program] })),
  removeProgram: (id) =>
    set((state) => ({
      programs: state.programs.filter((program) => program.id !== id),
    })),
  addModule: (programId, module) =>
    set((state) => ({
      programs: state.programs.map((program) =>
        program.id === programId
          ? { ...program, modules: [...program.modules, module] }
          : program
      ),
    })),
  removeModule: (programId, moduleId) =>
    set((state) => ({
      programs: state.programs.map((program) =>
        program.id === programId
          ? {
              ...program,
              modules: program.modules.filter((m) => m.id !== moduleId),
            }
          : program
      ),
    })),
  updateProgram: (updatedProgram) =>
    set((state) => ({
      programs: state.programs.map((program) =>
        program.id === updatedProgram.id ? updatedProgram : program
      ),
    })),
}));
