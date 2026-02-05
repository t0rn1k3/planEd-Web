import {
  SchoolClass,
  Teacher,
  TimetableConfig,
  TimetableGrid,
  TimetableSchedule,
} from "@/types/timetable";

export const WEEKDAYS = ["Mon", "Tue", "Wed", "Thu", "Fri"] as const;
export const WEEKDAY_LABELS = ["ორშ", "სამ", "ოთხ", "ხუთ", "პარ"];

export const DEFAULT_CONFIG: TimetableConfig = {
  periodsPerDay: 6,
  lessonDuration: 45,
  breakDurations: [5, 5, 5, 5, 5],
};

export function slotKey(dayIndex: number, period: number) {
  return `${dayIndex}-${period}`;
}

export function normalizeBreakDurations(
  periodsPerDay: number,
  existing: number[] = []
) {
  const safePeriods = Math.max(1, periodsPerDay);
  const targetLength = Math.max(0, safePeriods - 1);
  const normalized = existing.slice(0, targetLength).map((value) =>
    value === 15 ? 15 : 5
  );
  while (normalized.length < targetLength) {
    normalized.push(5);
  }
  return normalized;
}

export function createEmptyGrid(days: number, periods: number): TimetableGrid {
  return Array.from({ length: days }, () =>
    Array.from({ length: periods }, () => null)
  );
}

export function createEmptySchedule(
  classes: SchoolClass[],
  config: TimetableConfig
): TimetableSchedule {
  const schedule: TimetableSchedule = {};
  const days = WEEKDAYS.length;
  classes.forEach((schoolClass) => {
    schedule[schoolClass.id] = createEmptyGrid(days, config.periodsPerDay);
  });
  return schedule;
}

type Session = {
  teacherId: string;
  teacherName: string;
  classId: string;
  className: string;
  subject: string;
  assignmentId: string;
};

function createBusyGrid(days: number, periods: number) {
  return Array.from({ length: days }, () =>
    Array.from({ length: periods }, () => false)
  );
}

export function generateSchedule({
  classes,
  teachers,
  config,
}: {
  classes: SchoolClass[];
  teachers: Teacher[];
  config: TimetableConfig;
}): { schedule: TimetableSchedule; warnings: string[] } {
  const warnings: string[] = [];
  const days = WEEKDAYS.length;
  const periods = Math.max(1, config.periodsPerDay);

  if (classes.length === 0) {
    warnings.push("კლასები არ არის დამატებული.");
  }

  if (teachers.length === 0) {
    warnings.push("მასწავლებლები არ არის დამატებული.");
  }

  const schedule = createEmptySchedule(classes, {
    ...config,
    periodsPerDay: periods,
  });

  if (classes.length === 0 || teachers.length === 0) {
    return { schedule, warnings };
  }

  const classMap = new Map(classes.map((item) => [item.id, item.name]));

  const teacherUnavailable: Record<string, Set<string>> = {};
  const teacherBusy: Record<string, boolean[][]> = {};

  teachers.forEach((teacher) => {
    teacherUnavailable[teacher.id] = new Set(teacher.unavailableSlots || []);
    teacherBusy[teacher.id] = createBusyGrid(days, periods);
  });

  const sessions: Session[] = [];
  const totalSlots = days * periods;

  teachers.forEach((teacher) => {
    const assignedLessons = teacher.assignments.reduce(
      (sum, assignment) => sum + Math.max(0, assignment.weeklyLessons),
      0
    );

    if (teacher.weeklyHours > 0 && assignedLessons > teacher.weeklyHours) {
      warnings.push(
        `მასწავლებელი ${teacher.name}: მინიჭებული გაკვეთილები (${assignedLessons}) აღემატება კვირის ლიმიტს (${teacher.weeklyHours}).`
      );
    }

    let remaining =
      teacher.weeklyHours > 0 ? teacher.weeklyHours : assignedLessons;

    teacher.assignments.forEach((assignment) => {
      const className = classMap.get(assignment.classId) ?? assignment.classId;
      if (!classMap.has(assignment.classId)) {
        warnings.push(
          `მასწავლებელი ${teacher.name}: კლასი ვერ მოიძებნა (${assignment.classId}).`
        );
        return;
      }

      const lessons = Math.max(0, assignment.weeklyLessons);
      if (lessons === 0) return;

      for (let i = 0; i < lessons; i += 1) {
        if (teacher.weeklyHours > 0 && remaining <= 0) {
          const remainingLessons = lessons - i;
          warnings.push(
            `მასწავლებელი ${teacher.name}: "${assignment.subject}" (${className}) დარჩა ${remainingLessons} გაკვეთილი კვირის ლიმიტის გამო.`
          );
          break;
        }

        sessions.push({
          teacherId: teacher.id,
          teacherName: teacher.name,
          classId: assignment.classId,
          className,
          subject: assignment.subject,
          assignmentId: assignment.id,
        });

        if (teacher.weeklyHours > 0) {
          remaining -= 1;
        }
      }
    });
  });

  const availabilityScore: Record<string, number> = {};
  teachers.forEach((teacher) => {
    const unavailableCount = teacherUnavailable[teacher.id]?.size ?? 0;
    availabilityScore[teacher.id] = Math.max(0, totalSlots - unavailableCount);
  });

  sessions.sort((a, b) => {
    const aScore = availabilityScore[a.teacherId] ?? 0;
    const bScore = availabilityScore[b.teacherId] ?? 0;
    return aScore - bScore;
  });

  sessions.forEach((session) => {
    const classGrid = schedule[session.classId];
    if (!classGrid) {
      warnings.push(
        `ვერ განთავსდა "${session.subject}" (${session.className}) — კლასი ვერ მოიძებნა.`
      );
      return;
    }

    const dayLoads = classGrid.map(
      (day) => day.filter((slot) => slot !== null).length
    );
    const subjectDayCounts = classGrid.map(
      (day) => day.filter((slot) => slot?.subject === session.subject).length
    );

    let bestSlot: { day: number; period: number } | null = null;
    let bestScore = Number.POSITIVE_INFINITY;

    for (let day = 0; day < days; day += 1) {
      for (let period = 0; period < periods; period += 1) {
        if (classGrid[day][period]) continue;
        if (teacherBusy[session.teacherId]?.[day]?.[period]) continue;
        if (teacherUnavailable[session.teacherId]?.has(slotKey(day, period)))
          continue;

        const score = dayLoads[day] * 10 + subjectDayCounts[day] * 5 + period;
        if (score < bestScore) {
          bestSlot = { day, period };
          bestScore = score;
        }
      }
    }

    if (!bestSlot) {
      warnings.push(
        `ვერ განთავსდა "${session.subject}" (${session.className}) — ${session.teacherName}.`
      );
      return;
    }

    classGrid[bestSlot.day][bestSlot.period] = {
      teacherId: session.teacherId,
      subject: session.subject,
      assignmentId: session.assignmentId,
    };
    if (teacherBusy[session.teacherId]) {
      teacherBusy[session.teacherId][bestSlot.day][bestSlot.period] = true;
    }
  });

  return { schedule, warnings };
}
