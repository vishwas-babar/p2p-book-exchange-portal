import { z } from "zod";

const RegsiterFormSchema = z.object({
    name: z.string().min(2, "Name is required"),
    email: z.string().email("Invalid email"),
    mobile: z.string().min(10, "Mobile number is required"),
    password: z.string().min(4, "Password must be at least 4 characters"),
    role: z.enum(["OWNER", "SEEKER"]),
});

export type RegisterFormSchema = z.infer<typeof RegsiterFormSchema>;

export default RegsiterFormSchema;