"use client";

import { useState } from "react";
import { useProgramStore } from "@/store/programSore";
import { v4 as uuid } from "uuid";
import { Module, ModuleType } from "@/types/program";
import styles from "./AddModuleModal.module.css";

export default function AddModuleModal({
  programId,
  onClose,
  existingModule,
}: {
  programId: string;
  onClose: () => void;
  existingModule?: Module;
}) {
  const { addModule, updateModule } = useProgramStore();
  const isEdit = !!existingModule;

  const [code, setCode] = useState(existingModule?.code || "");
  const [name, setName] = useState(existingModule?.name || "");
  const [type, setType] = useState<ModuleType>(
    existingModule?.type || "professional"
  );
  const [contactHours, setContact] = useState(
    existingModule?.contactHours.toString() || ""
  );
  const [independentHours, setIndependent] = useState(
    existingModule?.independentHours.toString() || ""
  );
  const [assessmentHours, setAssessment] = useState(
    existingModule?.assessmentHours.toString() || ""
  );
  const [durationWeeks, setWeeks] = useState(
    existingModule?.durationWeeks.toString() || ""
  );
  const [credits, setCredits] = useState(
    existingModule?.credits.toString() || ""
  );
  const [startWeek, setStartWeek] = useState(
    existingModule?.startWeek.toString() || "1"
  );

  const distributeWeeklyHours = (
    total: number,
    duration: number,
    start: number
  ) => {
    const base = Math.floor(total / duration);
    const remainder = total % duration;
    const result: Record<number, number> = {};

    for (let i = 0; i < duration; i++) {
      result[start + i] = base + (i < remainder ? 1 : 0);
    }

    return result;
  };

  const onSubmit = () => {
    if (
      !code ||
      !name ||
      !contactHours ||
      !assessmentHours ||
      !durationWeeks ||
      !startWeek
    )
      return;

    const contact = parseInt(contactHours);
    const independent = parseInt(independentHours || "0");
    const assessment = parseInt(assessmentHours);
    const weeks = parseInt(durationWeeks);
    const start = parseInt(startWeek);
    const total = contact + assessment;

    const weeklyOverrides = distributeWeeklyHours(total, weeks, start);

    const moduleData: Module = {
      id: isEdit ? existingModule!.id : uuid(),
      code,
      name,
      type,
      contactHours: contact,
      independentHours: independent,
      assessmentHours: assessment,
      durationWeeks: weeks,
      credits: parseInt(credits || "0"),
      startWeek: start,
      weeklyOverrides,
    };

    if (isEdit) {
      updateModule(programId, moduleData);
    } else {
      addModule(programId, moduleData);
    }

    onClose();
  };

  return (
    <div className={styles.modal}>
      <div className={styles.modalBody}>
        <h2>{isEdit ? "მოდულის რედაქტირება" : "მოდულის დამატება"}</h2>

        <input
          placeholder="მოდულის კოდი"
          value={code}
          onChange={(e) => setCode(e.target.value)}
        />
        <input
          placeholder="მოდულის სახელი"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <select
          value={type}
          onChange={(e) => setType(e.target.value as ModuleType)}
        >
          <option value="professional">დარგობრივი</option>
          <option value="commonProfessional">საერთო დარგობრივი</option>
          <option value="general">ზოგადი</option>
          <option value="integratedGeneral">ინტეგრირებული ზოგადი</option>
        </select>
        <input
          placeholder="საკონტაქტო საათები"
          type="number"
          value={contactHours}
          onChange={(e) => setContact(e.target.value)}
        />
        <input
          placeholder="დამოუკიდებელი საათები"
          type="number"
          value={independentHours}
          onChange={(e) => setIndependent(e.target.value)}
        />
        <input
          placeholder="შეფასების საათები"
          type="number"
          value={assessmentHours}
          onChange={(e) => setAssessment(e.target.value)}
        />
        <input
          placeholder="პროგრამის ხანგრძ. კვირებში"
          type="number"
          value={durationWeeks}
          onChange={(e) => setWeeks(e.target.value)}
        />
        <input
          placeholder="კრედიტები"
          type="number"
          value={credits}
          onChange={(e) => setCredits(e.target.value)}
        />
        <input
          placeholder="დასაწყისი კვირა"
          type="number"
          value={startWeek}
          onChange={(e) => setStartWeek(e.target.value)}
        />

        <button onClick={onSubmit}>{isEdit ? "შენახვა" : "დამატება"}</button>
        <button onClick={onClose}>გაუქმება</button>
      </div>
    </div>
  );
}
