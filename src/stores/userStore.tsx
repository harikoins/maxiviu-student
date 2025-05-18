// src/stores/userStore.ts
import { signal } from "@preact/signals-react";
import type { studentType } from "../services/studentService";

export const userDatas = signal<studentType | null>(null);
