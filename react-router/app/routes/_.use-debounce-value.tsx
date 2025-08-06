import {
  QueryClient,
  QueryClientProvider,
  useQuery,
} from "@tanstack/react-query";
import { useState } from "react";
import * as Spinners from "react-loader-spinner";
import { useDebounceValue } from "usehooks-ts";
import { BooksSchema } from "~/schemas/books";

const queryClient = new QueryClient();

function Books() {
  const [value, setValue] = useState("");
  const [debouncedValue] = useDebounceValue(value, 500);

  const { data, isLoading } = useQuery({
    queryKey: ["book-search", debouncedValue],
    enabled: !!debouncedValue.trim(),
    queryFn: async () => {
      const res = await fetch(
        `https://openlibrary.org/search.json?q=${encodeURIComponent(
          value
        )}&limit=10`
      );

      const data = await res.json();

      return BooksSchema.parse(data).docs;
    },
  });

  const isLoadingState = isLoading || debouncedValue !== value;

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
              setValue(e.target.value);
            }}
            className="border border-gray-300 rounded px-2 py-1 max-w-64"
          />
        </div>
        {/* Loading */}
        {isLoadingState && (
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
        {!isLoadingState && data && data.length > 0 && (
          <ul className="list-inside list-disc">
            {data!.map((book) => (
              <li key={book.key}>
                {book.title} - {book.author_name?.join(", ")}
              </li>
            ))}
          </ul>
        )}
        {/* No Data */}
        {!isLoadingState && data && data.length === 0 && (
          <div>No books found</div>
        )}
        {/* No Search Term */}
        {!isLoadingState && !data && <div>Must enter search term</div>}
      </div>
      <div className="flex flex-col gap-4 flex-1/2 ">
        <p>Debug</p>
        <pre className="text-wrap">
          {JSON.stringify(
            {
              value,
              debouncedValue,
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
