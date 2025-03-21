import { Outlet } from "react-router-dom";

export default function Layout ({children}) {
  return (
    <div className="app">
    <Outlet/>
    </div>
  );
}