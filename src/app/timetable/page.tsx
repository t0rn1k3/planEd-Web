"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import styles from "./TimetablePage.module.css";
import { useTimetableStore } from "@/store/timetableStore";
import { createEmptyGrid, WEEKDAY_LABELS } from "@/lib/timetableUtils";

export default function TimetablePage() {
  const {
    config,
    classes,
    teachers,
    schedule,
    warnings,
    addClass,
    removeClass,
    addTeacher,
    removeTeacher,
    updateConfig,
    generateSchedule,
    clearSchedule,
  } = useTimetableStore();

  const [newClassName, setNewClassName] = useState("");
  const [teacherName, setTeacherName] = useState("");
  const [teacherWeeklyHours, setTeacherWeeklyHours] = useState("");

  const teacherMap = useMemo(
    () => new Map(teachers.map((teacher) => [teacher.id, teacher])),
    [teachers]
  );


  const handleAddClass = () => {
    if (!newClassName.trim()) return;
    addClass(newClassName);
    setNewClassName("");
  };

  const handleAddTeacher = () => {
    const hours = Number(teacherWeeklyHours);
    if (!teacherName.trim() || !Number.isFinite(hours) || hours <= 0) return;
    addTeacher(teacherName, hours);
    setTeacherName("");
    setTeacherWeeklyHours("");
  };

  const handleBreakChange = (index: number, value: number) => {
    const updated = [...config.breakDurations];
    updated[index] = value;
    updateConfig({ breakDurations: updated });
  };

  const periods = Math.max(1, config.periodsPerDay);

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>საათობრივი ბადე</h1>
      <p className={styles.subtitle}>
        შექმენით მასწავლებლები, შემდეგ თითოეულს შეუვსეთ დეტალები და ბოლოს
        დააგენერირეთ კვირის განრიგი.
      </p>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>მასწავლებლები</h2>
        <p className={styles.mutedText}>
          დაამატეთ მასწავლებლები და გახსენით მათი გვერდი დეტალებისთვის.
        </p>
        <div className={styles.formRow}>
          <input
            className={styles.input}
            placeholder="მასწავლებლის სახელი"
            value={teacherName}
            onChange={(event) => setTeacherName(event.target.value)}
          />
          <input
            className={styles.input}
            type="number"
            min={1}
            placeholder="კვირაში საათები"
            value={teacherWeeklyHours}
            onChange={(event) => setTeacherWeeklyHours(event.target.value)}
          />
          <button className={styles.button} onClick={handleAddTeacher}>
            დამატება
          </button>
        </div>

        {teachers.length === 0 ? (
          <p className={styles.mutedText}>
            მასწავლებლები ჯერ არ არის დამატებული.
          </p>
        ) : (
          <ul className={styles.list}>
            {teachers.map((teacher) => {
              const assignmentsTotal = teacher.assignments.reduce(
                (sum, assignment) => sum + assignment.weeklyLessons,
                0
              );
              const classCount = new Set(
                teacher.assignments.map((assignment) => assignment.classId)
              ).size;
              const subjectCount = new Set(
                teacher.assignments.map((assignment) =>
                  assignment.subject.trim().toLowerCase()
                )
              ).size;

              return (
                <li
                  key={teacher.id}
                  className={`${styles.listItem} ${styles.teacherListItem}`}
                >
                  <div>
                    <div className={styles.teacherName}>{teacher.name}</div>
                    <div className={styles.listMeta}>
                      კვირაში მაქს: {teacher.weeklyHours} | მინიჭებული:{" "}
                      {assignmentsTotal}
                    </div>
                    <div className={styles.listMeta}>
                      კლასები: {classCount || "—"} | საგნები:{" "}
                      {subjectCount || "—"}
                    </div>
                  </div>
                  <div className={styles.listActions}>
                    <Link
                      className={styles.buttonSecondary}
                      href={`/timetable/teachers/${teacher.id}`}
                    >
                      დეტალები
                    </Link>
                    <button
                      className={styles.buttonDanger}
                      onClick={() => removeTeacher(teacher.id)}
                    >
                      წაშლა
                    </button>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </section>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>კლასები</h2>
        <div className={styles.formRow}>
          <input
            className={styles.input}
            placeholder="კლასის დასახელება (მაგ. 5ა)"
            value={newClassName}
            onChange={(event) => setNewClassName(event.target.value)}
          />
          <button className={styles.button} onClick={handleAddClass}>
            დამატება
          </button>
        </div>

        {classes.length === 0 ? (
          <p className={styles.mutedText}>კლასები ჯერ არ არის დამატებული.</p>
        ) : (
          <ul className={styles.list}>
            {classes.map((schoolClass) => (
              <li key={schoolClass.id} className={styles.listItem}>
                <span>{schoolClass.name}</span>
                <button
                  className={styles.buttonDanger}
                  onClick={() => removeClass(schoolClass.id)}
                >
                  წაშლა
                </button>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>საწყისი პარამეტრები</h2>
        <div className={styles.formRow}>
          <label className={styles.label}>
            გაკვეთილების რაოდენობა დღეში
            <input
              className={styles.input}
              type="number"
              min={1}
              max={12}
              value={config.periodsPerDay}
              onChange={(event) =>
                updateConfig({
                  periodsPerDay: Number(event.target.value) || 1,
                })
              }
            />
          </label>

          <label className={styles.label}>
            გაკვეთილის ხანგრძლივობა
            <select
              className={styles.select}
              value={config.lessonDuration}
              onChange={(event) =>
                updateConfig({
                  lessonDuration: Number(event.target.value) as 40 | 45,
                })
              }
            >
              <option value={45}>45 წთ</option>
              <option value={40}>40 წთ</option>
            </select>
          </label>
        </div>

        <div className={styles.breaks}>
          <h3 className={styles.subheading}>შესვენებები</h3>
          {config.breakDurations.length === 0 ? (
            <p className={styles.mutedText}>შესვენებები არ არის.</p>
          ) : (
            <div className={styles.breakList}>
              {config.breakDurations.map((breakValue, index) => (
                <label key={index} className={styles.breakItem}>
                  შეწყვეტა {index + 1}
                  <select
                    className={styles.select}
                    value={breakValue}
                    onChange={(event) =>
                      handleBreakChange(index, Number(event.target.value))
                    }
                  >
                    <option value={5}>5 წთ</option>
                    <option value={15}>15 წთ</option>
                  </select>
                </label>
              ))}
            </div>
          )}
        </div>
      </section>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>გენერაცია</h2>
        <div className={styles.formRow}>
          <button className={styles.button} onClick={generateSchedule}>
            განრიგის გენერაცია
          </button>
          <button className={styles.buttonSecondary} onClick={clearSchedule}>
            გასუფთავება
          </button>
        </div>

        {warnings.length > 0 && (
          <div className={styles.warningBox}>
            <h3 className={styles.subheading}>გაფრთხილებები</h3>
            <ul className={styles.warningList}>
              {warnings.map((warning, index) => (
                <li key={`${warning}-${index}`}>{warning}</li>
              ))}
            </ul>
          </div>
        )}
      </section>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>განრიგი</h2>
        {classes.length === 0 ? (
          <p className={styles.mutedText}>
            განრიგის სანახავად ჯერ დაამატეთ კლასები.
          </p>
        ) : Object.keys(schedule).length === 0 ? (
          <p className={styles.mutedText}>
            განრიგი ჯერ არ არის გენერირებული.
          </p>
        ) : (
          <div className={styles.scheduleGrid}>
            {classes.map((schoolClass) => {
              const classSchedule =
                schedule[schoolClass.id] ??
                createEmptyGrid(WEEKDAY_LABELS.length, periods);

              return (
                <div key={schoolClass.id} className={styles.scheduleCard}>
                  <h3 className={styles.teacherName}>{schoolClass.name}</h3>
                  <div className={styles.tableWrapper}>
                    <table className={styles.scheduleTable}>
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
                              const slot =
                                classSchedule[dayIndex]?.[period] ?? null;
                              const teacher = slot
                                ? teacherMap.get(slot.teacherId)
                                : null;
                              return (
                                <td
                                  key={`${label}-${period}`}
                                  className={styles.scheduleCell}
                                >
                                  {slot ? (
                                    <div>
                                      <div className={styles.cellSubject}>
                                        {slot.subject}
                                      </div>
                                      <div className={styles.cellTeacher}>
                                        {teacher?.name ?? "უცნობი"}
                                      </div>
                                    </div>
                                  ) : (
                                    <span className={styles.mutedText}>—</span>
                                  )}
                                </td>
                              );
                            })}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
}
