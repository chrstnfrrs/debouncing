import z from "zod";

export const BooksSchema = z.object({
  docs: z.array(
    z.object({
      title: z.string(),
      author_name: z.array(z.string()).optional(),
      key: z.string(),
    })
  ),
});