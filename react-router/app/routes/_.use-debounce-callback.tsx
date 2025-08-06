import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useCallback, useState } from "react";
import { debounce } from "lodash-es";
import * as Spinners from "react-loader-spinner";
import z from "zod";

import { BooksSchema } from "~/schemas/books";

const queryClient = new QueryClient();

function Books() {
  const [value, setValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState<
    z.infer<typeof BooksSchema>["docs"] | undefined
  >(undefined);

  const fetchBooks = useCallback(
    debounce(async (searchTerm: string) => {
      const res = await fetch(
        `https://openlibrary.org/search.json?q=${encodeURIComponent(
          searchTerm
        )}&limit=10`
      );

      const data = await res.json();

      setData(BooksSchema.parse(data).docs);
      setIsLoading(false);
    }, 500),
    []
  );

  return (
    <div className="flex justify-between gap-4">
      <div className="flex flex-col flex-1/2 gap-4">
        <h1>Books List</h1>
        <div className="flex flex-col">
          <label className="text-xs" htmlFor="search">
            Search
          </label>
          <input
            id="search"
            type="text"
            onChange={(e) => {
              const value = e.target.value;
              setIsLoading(true);
              setValue(value);
              fetchBooks(value);
            }}
            className="border border-gray-300 rounded px-2 py-1 max-w-64"
          />
        </div>
        {/* Loading */}
        {isLoading && (
          <Spinners.ThreeDots
            visible={true}
            height="18"
            width="80"
            color="#303030"
            radius="9"
            ariaLabel="three-dots-loading"
            wrapperStyle={{}}
            wrapperClass=""
          />
        )}
        {/* Has Data */}
        {!isLoading && data && data.length > 0 && (
          <ul className="list-inside list-disc">
            {data!.map((book) => (
              <li key={book.key}>
                {book.title} - {book.author_name?.join(", ")}
              </li>
            ))}
          </ul>
        )}
        {/* No Data */}
        {!isLoading && data && data.length === 0 && <div>No books found</div>}
        {/* No Search Term */}
        {!isLoading && !data && <div>Must enter search term</div>}
      </div>
      <div className="flex flex-col gap-4 flex-1/2">
        <p>Debug</p>
        <pre className="text-wrap">
          {JSON.stringify(
            {
              value,
              isLoading,
              data: data?.slice(0, 2) || null,
            },
            null,
            2
          )}
        </pre>
      </div>
    </div>
  );
}
export default function UseDebounceValue() {
  return (
    <QueryClientProvider client={queryClient}>
      <Books />
    </QueryClientProvider>
  );
}
