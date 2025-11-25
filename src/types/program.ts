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
  assesmentHours: number;
  durationWeeks: number;
  credits: number;
  startWeek: number;
}

export interface CurriculumProgram {
  id: string;
  name: string;
  totalWeeks: number;
  startDate: number;
  holidays: string[];
  modules: Module[];
}
