import { z } from 'zod';

// Zod schema for validation
const bookSchema = z.object({
  title: z.string().min(2),
  author: z.string().min(2),
  genre: z.string().optional(),
  city: z.string().min(2),
  contact: z.string().min(6),
});


export default bookSchema;
export type BookSchema = z.infer<typeof bookSchema>;