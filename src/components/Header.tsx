"use client";
import Image from "next/image";
import logo from "@/assets/logo.png";
import "@/styles/colors.css";
import "@/styles/globals.css";
import styles from "./Header.module.css";
import { useRouter } from "next/navigation";

export default function Header() {
  const router = useRouter();
  return (
    <header className={styles.header}>
      <Image
        className={styles.logo}
        src={logo}
        alt="PlanEd Logo"
        width={180}
        height={130}
        onClick={() => router.push("/")}
      />
    </header>
  );
}
