import z from "zod";
import "./App.css";
import {
  QueryClient,
  QueryClientProvider,
  useQuery,
} from "@tanstack/react-query";
import { useEffect, useState } from "react";

const queryClient = new QueryClient();

function useDebounceValue<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    // Set a timeout to update the debounced value
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    // Cleanup timeout if value changes before delay ends
    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}

function Books() {
  const [value, setValue] = useState("");
  const debouncedValue = useDebounceValue(value, 500);

  const { data, isLoading } = useQuery({
    queryKey: ["book-search", debouncedValue],
    queryFn: async () => {
      const res = await fetch(
        `https://openlibrary.org/search.json?q=${encodeURIComponent(
          value
        )}&limit=10`
      );

      const data = await res.json();

      return z
        .object({
          docs: z.array(
            z.object({
              title: z.string(),
              author_name: z.array(z.string()).optional(),
              key: z.string(),
            })
          ),
        })
        .parse(data).docs;
    },
  });

  let status: "loading" | "success" | "no-search-term" | "no-results" =
    "no-search-term";

  if (isLoading || debouncedValue !== value) {
    status = "loading";
  }
  if (data?.length) {
    status = "success";
  }
  if (value !== "" && data?.length === 0) {
    status = "no-results";
  }

  return (
    <>
      <label htmlFor="search">Search books: </label>
      <input
        id="search"
        type="text"
        placeholder="Search books..."
        onChange={(e) => {
          setValue(e.target.value);
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

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Books />
    </QueryClientProvider>
  );
}
