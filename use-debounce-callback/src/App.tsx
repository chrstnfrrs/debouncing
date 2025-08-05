import z from "zod";
import "./App.css";
import { useCallback, useEffect, useRef, useState } from "react";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function useDebounceCallback<T extends (...args: any[]) => void>(
  callback: T,
  delay: number
): (...args: Parameters<T>) => void {
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const debouncedFn = useCallback(
    (...args: Parameters<T>) => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }

      timerRef.current = setTimeout(() => {
        callback(...args);
      }, delay);
    },
    [callback, delay]
  );

  // Clean up on unmount
  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, []);

  return debouncedFn;
}

const BooksSchema = z.object({
  docs: z.array(
    z.object({
      title: z.string(),
      author_name: z.array(z.string()).optional(),
      key: z.string(),
    })
  ),
});

export default function Books() {
  const [value, setValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState<
    z.infer<typeof BooksSchema>["docs"] | undefined
  >(undefined);

  const fetchBooks = useDebounceCallback(async (searchTerm: string) => {
    if (!searchTerm) {
      return;
    }

    const res = await fetch(
      `https://openlibrary.org/search.json?q=${encodeURIComponent(
        searchTerm
      )}&limit=10`
    );

    const data = await res.json();

    setIsLoading(false);
    return setData(BooksSchema.parse(data).docs);
  }, 500);

  let status: "loading" | "success" | "no-search-term" | "no-results" =
    "no-search-term";

  if (data?.length) {
    status = "success";
  }
  if (value !== "" && data?.length === 0) {
    status = "no-results";
  }
  if (isLoading) {
    status = "loading";
  }

  return (
    <>
      <label htmlFor="search">Search books: </label>
      <input
        id="search"
        type="text"
        placeholder="Search books..."
        onChange={(e) => {
          const value = e.target.value;
          setValue(value);
          fetchBooks(value);

          if (value) {
            setIsLoading(true);
          } else {
            setData(undefined);
            setIsLoading(false);
          }
        }}
      />
      <h1>Books</h1>
      {status === "loading" && <div>Loading...</div>}
      {status === "success" && (
        <ul>
          {data!.map((todo) => (
            <li key={todo.key}>
              {todo.title} - {todo.author_name?.join(", ")}
            </li>
          ))}
        </ul>
      )}
      {status === "no-results" && <div>No books found</div>}
      {status === "no-search-term" && <div>Must enter search term</div>}
    </>
  );
}
