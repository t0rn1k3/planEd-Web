import { CurriculumProgram, Module } from "@/types/program";
import { getWeekLabels } from "@/lib/dateUtils";
import styles from "./ModuleTable.module.css";

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
          {program.modules.map((m: Module) => (
            <tr key={m.id}>
              <td>{m.code}</td>
              <td>{m.name}</td>
              <td>{m.type}</td>
              <td>{m.contactHours + m.independentHours + m.assessmentHours}</td>
              <td>{m.contactHours}</td>
              <td>{m.independentHours}</td>
              <td>{m.assessmentHours}</td>
              <td>{m.durationWeeks}</td>
              <td>{m.credits}</td>

              {Array.from({ length: weeks }).map((_, weekIndex) => (
                <td key={weekIndex}>
                  {m.weeklyOverrides[weekIndex + 1] ?? ""}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
