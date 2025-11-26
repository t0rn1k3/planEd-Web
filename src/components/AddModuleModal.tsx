"use client";

import { useState } from "react";
import { useProgramStore } from "@/store/programSore";
import { v4 as uuid } from "uuid";
import { Module, ModuleType } from "@/types/program";
import styles from "./AddModuleModal.module.css";

export default function AddModuleModal({
  programId,
  onClose,
}: {
  programId: string;
  onClose: () => void;
}) {
  const { addModule } = useProgramStore();

  const [code, setCode] = useState("");
  const [name, setName] = useState("");
  const [type, setType] = useState<ModuleType>("professional");
  const [contactHours, setContact] = useState("");
  const [independentHours, setIndependent] = useState("");
  const [assessmentHours, setAssessment] = useState("");
  const [durationWeeks, setWeeks] = useState("");
  const [credits, setCredits] = useState("");

  const distributeWeeklyHours = (total: number, weeks: number) => {
    const base = Math.floor(total / weeks);
    const remainder = total % weeks;

    const result: Record<number, number> = {};

    for (let i = 1; i <= weeks; i++) {
      result[i] = base + (i <= remainder ? 1 : 0);
    }

    return result;
  };

  const onSubmit = () => {
    if (!code || !name || !contactHours || !assessmentHours || !durationWeeks)
      return;

    const contact = parseInt(contactHours);
    const independent = parseInt(independentHours || "0");
    const assessment = parseInt(assessmentHours);
    const weeks = parseInt(durationWeeks);

    const weeklyOverrides = distributeWeeklyHours(contact + assessment, weeks);

    const modules: Module = {
      id: uuid(),
      code,
      name,
      type,
      contactHours: contact,
      independentHours: independent,
      assessmentHours: assessment,
      durationWeeks: weeks,
      credits: parseInt(credits || "0"),
      startWeek: 1,
      weeklyOverrides,
    };

    addModule(programId, modules);
    onClose();
  };

  return (
    <div className={styles.modal}>
      <div className={styles.modalBody}>
        <h2>მოდულის დამატება</h2>

        <input
          placeholder="კოდი"
          value={code}
          onChange={(e) => setCode(e.target.value)}
        />
        <input
          placeholder="სახელი"
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
          placeholder="დამოუკიდებელი"
          type="number"
          value={independentHours}
          onChange={(e) => setIndependent(e.target.value)}
        />
        <input
          placeholder="შეფასება"
          type="number"
          value={assessmentHours}
          onChange={(e) => setAssessment(e.target.value)}
        />
        <input
          placeholder="კვირები"
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

        <button onClick={onSubmit}>დამატება</button>
        <button onClick={onClose}>გაუქმება</button>
      </div>
    </div>
  );
}
