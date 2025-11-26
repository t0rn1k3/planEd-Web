export type ModuleType =
  | "commonProfessional"
  | "professional"
  | "general"
  | "integratedGeneral";

export interface Module {
  id: string;
  code: string;
  name: string;
  type: ModuleType;
  contactHours: number;
  independentHours: number;
  assessmentHours: number;
  durationWeeks: number;
  credits: number;
  startWeek: number;
  weeklyOverrides: Record<number, number>;
}

export interface CurriculumProgram {
  id: string;
  name: string;
  totalWeeks: number;
  startDate: string;
  holidays: string[];
  modules: Module[];
}
