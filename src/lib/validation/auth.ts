import { z } from "zod";

export const SignUpSchema = z.object({
  email: z.string().email().max(254),
  name: z.string().min(2).max(100),
  organizationName: z.string().min(2).max(120),
  password: z.string().min(12).max(200),
});

export const SignInSchema = z.object({
  email: z.string().email().max(254),
  password: z.string().min(1).max(200),
});

