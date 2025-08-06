import { href, NavLink, Outlet } from "react-router";

export default function Home() {
  return (
    <div className="flex flex-col gap-4 py-4 px-12">
      <ul className="flex flex-row gap-2">
        <li>
          <NavLink
            className={({ isActive }) => (isActive ? "underline" : "")}
            to={href("/")}
          >
            Home
          </NavLink>
        </li>
        <li>
          <NavLink
            className={({ isActive }) => (isActive ? "underline" : "")}
            to={href("/use-debounce-callback")}
          >
            useDebounceCallback
          </NavLink>
        </li>
        <li>
          <NavLink
            className={({ isActive }) => (isActive ? "underline" : "")}
            to={href("/use-debounce-value")}
          >
            useDebounceValue
          </NavLink>
        </li>
        <li>
          <NavLink
            className={({ isActive }) => (isActive ? "underline" : "")}
            to={href("/react-router-v1")}
          >
            React Router v1
          </NavLink>
        </li>
        <li>
          <NavLink
            className={({ isActive }) => (isActive ? "underline" : "")}
            to={href("/react-router-v2")}
          >
            React Router v2
          </NavLink>
        </li>
      </ul>
      <Outlet />
    </div>
  );
}
