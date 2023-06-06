import { z } from "zod";

export const JobFormSchema = z.object({
  jobTitle: z.string(),
  skills: z.array(z.object({ value: z.string(), label: z.string() })),
  baseExp: z.number(),
  highExp: z.number(),
  baseSalary: z.number(),
  highSalary: z.number(),
  date: z.date(),
  description: z.string(),
  experienceUnit: z.object({ value: z.string(), label: z.string() }),
  salaryUnit: z.object({ value: z.string(), label: z.string() }),
});
