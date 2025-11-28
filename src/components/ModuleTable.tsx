import { CurriculumProgram, Module } from "@/types/program";
import { getWeekLabels } from "@/lib/dateUtils";
import styles from "./ModuleTable.module.css";
import ModuleRow from "./ModuleRow";

export default function ModuleTable({
  program,
}: {
  program: CurriculumProgram;
}) {
  const weeks = program.totalWeeks;
  const weekLabels = getWeekLabels(
    program.startDate,
    Array.from({ length: weeks }, (_, i) => i)
  );

  const typeLabels: Record<Module["type"], string> = {
    professional: "დარგობრივი",
    general: "ზოგადი",
    commonProfessional: "საერთო დარგობრივი",
    integratedGeneral: "ინტეგრირებული ზოგადი",
  };

  return (
    <div className={styles.tableWrapper}>
      <table className={styles.table}>
        <thead>
          <tr>
            <th rowSpan={2}>კოდი</th>
            <th rowSpan={2}>სახელი</th>
            <th rowSpan={2}>ტიპი</th>
            <th rowSpan={2}>სულ</th>
            <th rowSpan={2}>კონტ.</th>
            <th rowSpan={2}>დამოუკიდ.</th>
            <th rowSpan={2}>შეფას.</th>
            <th rowSpan={2}>კვირები</th>
            <th rowSpan={2}>კრედიტი</th>
            {Array.from({ length: weeks }).map((_, i) => (
              <th key={i} className="weeknumbers">
                კვ.{i + 1}
              </th>
            ))}
          </tr>
          <tr>
            {weekLabels.map((label, i) => (
              <th key={i} className={styles.weekdays}>
                {label}
              </th>
            ))}
          </tr>
        </thead>

        <tbody>
          {program.modules.map((m) => (
            <ModuleRow key={m.id} module={m} totalWeeks={weeks} />
          ))}
        </tbody>
      </table>
    </div>
  );
}
