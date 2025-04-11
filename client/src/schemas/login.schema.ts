// schemas/login.schema.ts
import z from "zod";

const LoginFormSchema = z.object({
  email: z.string().email({ message: "Invalid email" }),
  password: z.string().min(6, { message: "Password must be at least 6 characters" }),
});

export type LoginFormSchema = z.infer<typeof LoginFormSchema>;
export default LoginFormSchema;
