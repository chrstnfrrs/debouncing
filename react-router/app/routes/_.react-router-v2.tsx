import { href, useFetcher } from "react-router";
import * as Spinners from "react-loader-spinner";

import type { loader as booksLoader } from "./resources.v2.books";

export default function ReactRouter() {
  const fetcher = useFetcher<typeof booksLoader>();
  console.log("fetcher", fetcher.state);

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
            className="border border-gray-300 rounded px-2 py-1 max-w-64"
            onChange={(e) => {
              fetcher.load(
                `${href("/resources/v2/books")}?q=${encodeURIComponent(e.target.value)}`
              );
            }}
            onBlur={(e) => {
              if (!e.target.value.trim()) {
                console.log("blur", e.target.value);
                fetcher.load(
                  `${href("/resources/v2/books")}?q=${encodeURIComponent(e.target.value)}`
                );
              }
            }}
          />
          <p className="text-red-500 text-xs h-5">
            {fetcher.state === "idle" && fetcher.data?.status === "invalid"
              ? "Must enter search term"
              : "\u200b"}
          </p>
        </div>
        {/* Loading */}
        {fetcher.state === "loading" && (
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
        {fetcher.state === "idle" && fetcher.data?.data?.length && (
          <ul className="list-inside list-disc">
            {fetcher.data.data.map((book) => (
              <li key={book.key}>
                {book.title} - {book.author_name?.join(", ")}
              </li>
            ))}
          </ul>
        )}
        {/* No Data */}
        {fetcher.state === "idle" &&
          fetcher.data &&
          !fetcher.data?.data?.length && <div>No books found</div>}
        {/* No Search Term */}
        {fetcher.state === "idle" && !fetcher.data && (
          <div>Must enter search term</div>
        )}
      </div>
      <div className="flex flex-col gap-4 flex-1/2">
        <p>Debug</p>
        <pre className="text-wrap">
          {JSON.stringify(
            {
              state: fetcher.state,
              data: fetcher.data?.data?.slice(0, 2) || null,
            },
            null,
            2
          )}
        </pre>
      </div>
    </div>
  );
}
