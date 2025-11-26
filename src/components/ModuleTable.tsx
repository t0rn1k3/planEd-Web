import { CurriculumProgram, Module } from "@/types/program";
import styles from "./ModuleTable.module.css";

export default function ModuleTable({
  program,
}: {
  program: CurriculumProgram;
}) {
  const weeks = program.totalWeeks;

  return (
    <div className={styles.tableWrapper}>
      <table className={styles.table}>
        <thead>
          <tr>
            <th>კოდი</th>
            <th>სახელი</th>
            <th>ტიპი</th>
            <th>სულ</th>
            <th>კონტ.</th>
            <th>დამოუკიდ.</th>
            <th>შეფას.</th>
            <th>კვირები</th>
            <th>კრედიტი</th>
            {Array.from({ length: weeks }).map((_, i) => (
              <th key={i}>კვ.{i + 1}</th>
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
