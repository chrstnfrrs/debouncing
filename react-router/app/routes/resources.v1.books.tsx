import type { LoaderFunctionArgs } from "react-router";
import { BooksSchema } from "~/schemas/books";

export async function loader({ request }: LoaderFunctionArgs) {
  const url = new URL(request.url);
  const searchTerm = url.searchParams.get("q") || "";

  if (!searchTerm.trim()) {
    return null;
  }

  await new Promise((resolve) => setTimeout(resolve, 500));

  const res = await fetch(
    `https://openlibrary.org/search.json?q=${encodeURIComponent(
      searchTerm
    )}&limit=10`
  );

  const data = await res.json();

  return BooksSchema.parse(data).docs;
}
