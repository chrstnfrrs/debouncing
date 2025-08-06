import type {
  ClientLoaderFunctionArgs,
  LoaderFunctionArgs,
} from "react-router";
import { BooksSchema } from "~/schemas/books";

export async function loader({ request }: LoaderFunctionArgs) {
  const url = new URL(request.url);
  const searchTerm = url.searchParams.get("q") || "";

  if (!searchTerm?.trim()) {
    return {
      status: "invalid" as const,
      data: null,
    };
  }

  const res = await fetch(
    `https://openlibrary.org/search.json?q=${encodeURIComponent(
      searchTerm
    )}&limit=10`
  );

  const data = await res.json();

  return {
    status: "valid" as const,
    data: BooksSchema.parse(data).docs,
  };
}

export async function clientLoader({
  request,
  serverLoader,
}: ClientLoaderFunctionArgs) {
  const url = new URL(request.url);
  const searchTerm = url.searchParams.get("q");

  if (!searchTerm?.trim()) {
    return {
      status: "invalid" as const,
      data: null,
    };
  }

  await new Promise((resolve) => setTimeout(resolve, 500));

  return serverLoader();
}
