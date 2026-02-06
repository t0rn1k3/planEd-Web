"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import styles from "../../TimetablePage.module.css";
import { useTimetableStore } from "@/store/timetableStore";
import { slotKey, WEEKDAY_LABELS } from "@/lib/timetableUtils";

type AssignmentDraft = {
  subject: string;
  classId: string;
  weeklyLessons: string;
};

export default function TeacherDetailPage() {
  const params = useParams();
  const router = useRouter();
  const teacherId = Array.isArray(params.teacherId)
    ? params.teacherId[0]
    : params.teacherId;

  const {
    classes,
    teachers,
    config,
    addAssignment,
    removeAssignment,
    toggleUnavailableSlot,
    removeTeacher,
  } = useTimetableStore();

  const teacher = teachers.find((item) => item.id === teacherId);
  const classMap = useMemo(
    () => new Map(classes.map((schoolClass) => [schoolClass.id, schoolClass])),
    [classes]
  );

  const [draft, setDraft] = useState<AssignmentDraft>({
    subject: "",
    classId: classes[0]?.id ?? "",
    weeklyLessons: "",
  });

  const periods = Math.max(1, config.periodsPerDay);

  if (!teacher) {
    return (
      <div className={styles.container}>
        <div className={styles.pageHeader}>
          <div>
            <h1 className={styles.title}>მასწავლებელი ვერ მოიძებნა</h1>
            <p className={styles.subtitle}>
              დააბრუნდით სიაში და სცადეთ ხელახლა.
            </p>
          </div>
          <div className={styles.listActions}>
            <Link className={styles.buttonSecondary} href="/timetable">
              უკან დაბრუნება
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const assignmentsTotal = teacher.assignments.reduce(
    (sum, assignment) => sum + assignment.weeklyLessons,
    0
  );

  const subjectList = Array.from(
    new Set(
      teacher.assignments.map((assignment) =>
        assignment.subject.trim().toLowerCase()
      )
    )
  ).filter(Boolean);

  const classList = Array.from(
    new Set(teacher.assignments.map((assignment) => assignment.classId))
  )
    .map((classId) => classMap.get(classId)?.name ?? classId)
    .filter(Boolean);

  const classSummary = (() => {
    const summary = new Map<
      string,
      { className: string; totalLessons: number; subjects: Set<string> }
    >();

    teacher.assignments.forEach((assignment) => {
      const className =
        classMap.get(assignment.classId)?.name ?? assignment.classId;
      if (!summary.has(assignment.classId)) {
        summary.set(assignment.classId, {
          className,
          totalLessons: 0,
          subjects: new Set(),
        });
      }
      const entry = summary.get(assignment.classId);
      if (!entry) return;
      entry.totalLessons += assignment.weeklyLessons;
      entry.subjects.add(assignment.subject);
    });

    return Array.from(summary.values());
  })();

  const handleDraftChange = (
    field: keyof AssignmentDraft,
    value: string
  ) => {
    setDraft((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleAddAssignment = () => {
    const weeklyLessons = Number(draft.weeklyLessons);
    const classId = draft.classId || classes[0]?.id || "";

    if (
      !draft.subject.trim() ||
      !classId ||
      !Number.isFinite(weeklyLessons) ||
      weeklyLessons <= 0
    ) {
      return;
    }

    addAssignment(teacher.id, {
      subject: draft.subject,
      classId,
      weeklyLessons,
    });

    setDraft((prev) => ({
      ...prev,
      subject: "",
      weeklyLessons: "",
    }));
  };

  const handleRemoveTeacher = () => {
    removeTeacher(teacher.id);
    router.push("/timetable");
  };

  return (
    <div className={styles.container}>
      <div className={styles.pageHeader}>
        <div>
          <h1 className={styles.title}>{teacher.name}</h1>
          <p className={styles.subtitle}>მასწავლებლის დეტალური გვერდი</p>
        </div>
        <div className={styles.listActions}>
          <Link className={styles.buttonSecondary} href="/timetable">
            უკან დაბრუნება
          </Link>
          <button className={styles.buttonDanger} onClick={handleRemoveTeacher}>
            წაშლა
          </button>
        </div>
      </div>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>საერთო ინფორმაცია</h2>
        <div className={styles.infoGrid}>
          <div className={styles.infoCard}>
            <div className={styles.infoLabel}>კვირაში ლიმიტი</div>
            <div className={styles.infoValue}>
              {teacher.weeklyHours > 0 ? teacher.weeklyHours : "შეუზღუდავი"}
            </div>
          </div>
          <div className={styles.infoCard}>
            <div className={styles.infoLabel}>მინიჭებული გაკვეთილები</div>
            <div className={styles.infoValue}>{assignmentsTotal}</div>
          </div>
          <div className={styles.infoCard}>
            <div className={styles.infoLabel}>კლასები</div>
            <div className={styles.infoValue}>
              {classList.length > 0 ? classList.join(", ") : "—"}
            </div>
          </div>
          <div className={styles.infoCard}>
            <div className={styles.infoLabel}>საგნები</div>
            <div className={styles.infoValue}>
              {subjectList.length > 0 ? subjectList.join(", ") : "—"}
            </div>
          </div>
        </div>
      </section>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>საგნები და კლასები</h2>
        <div className={styles.assignmentForm}>
          <input
            className={styles.input}
            placeholder="საგანი"
            value={draft.subject}
            onChange={(event) =>
              handleDraftChange("subject", event.target.value)
            }
          />
          <select
            className={styles.select}
            value={draft.classId}
            onChange={(event) =>
              handleDraftChange("classId", event.target.value)
            }
          >
            <option value="">კლასი</option>
            {classes.map((schoolClass) => (
              <option key={schoolClass.id} value={schoolClass.id}>
                {schoolClass.name}
              </option>
            ))}
          </select>
          <input
            className={styles.input}
            type="number"
            min={1}
            placeholder="კვირაში გაკვეთილები"
            value={draft.weeklyLessons}
            onChange={(event) =>
              handleDraftChange("weeklyLessons", event.target.value)
            }
          />
          <button
            className={styles.button}
            onClick={handleAddAssignment}
            disabled={classes.length === 0}
          >
            დამატება
          </button>
        </div>

        {classes.length === 0 && (
          <p className={styles.mutedText}>
            საგნების დასამატებლად ჯერ დაამატეთ კლასები.
          </p>
        )}

        {teacher.assignments.length === 0 ? (
          <p className={styles.mutedText}>საგნები ჯერ არ არის დამატებული.</p>
        ) : (
          <ul className={styles.assignmentList}>
            {teacher.assignments.map((assignment) => (
              <li key={assignment.id} className={styles.assignmentRow}>
                <div>
                  <span className={styles.badge}>{assignment.subject}</span>
                  <span className={styles.assignmentMeta}>
                    {classMap.get(assignment.classId)?.name ??
                      assignment.classId}
                    , კვირაში {assignment.weeklyLessons}
                  </span>
                </div>
                <button
                  className={styles.buttonSecondary}
                  onClick={() => removeAssignment(teacher.id, assignment.id)}
                >
                  წაშლა
                </button>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>
          კლასების მიხედვით კვირაში გაკვეთილები
        </h2>
        {classSummary.length === 0 ? (
          <p className={styles.mutedText}>მონაცემები ჯერ არ არის.</p>
        ) : (
          <div className={styles.tableWrapper}>
            <table className={styles.scheduleTable}>
              <thead>
                <tr>
                  <th>კლასი</th>
                  <th>საგნები</th>
                  <th>კვირაში ჯამი</th>
                </tr>
              </thead>
              <tbody>
                {classSummary.map((entry) => (
                  <tr key={entry.className}>
                    <td>{entry.className}</td>
                    <td>{Array.from(entry.subjects).join(", ") || "—"}</td>
                    <td>{entry.totalLessons}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>ხელმისაწვდომობა</h2>
        <p className={styles.mutedText}>
          მონიშნეთ პერიოდი, როდესაც მასწავლებელი ვერ ატარებს გაკვეთილს.
        </p>
        <div className={styles.tableWrapper}>
          <table className={styles.availabilityTable}>
            <thead>
              <tr>
                <th>პერიოდი</th>
                {WEEKDAY_LABELS.map((label) => (
                  <th key={label}>{label}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {Array.from({ length: periods }).map((_, period) => (
                <tr key={period}>
                  <td>{period + 1}</td>
                  {WEEKDAY_LABELS.map((label, dayIndex) => {
                    const key = slotKey(dayIndex, period);
                    const isUnavailable =
                      teacher.unavailableSlots.includes(key);
                    return (
                      <td
                        key={`${label}-${period}`}
                        className={
                          isUnavailable ? styles.unavailableCell : undefined
                        }
                      >
                        <input
                          type="checkbox"
                          checked={isUnavailable}
                          onChange={() =>
                            toggleUnavailableSlot(
                              teacher.id,
                              dayIndex,
                              period
                            )
                          }
                          aria-label={`${teacher.name} ${label} ${period + 1}`}
                        />
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
