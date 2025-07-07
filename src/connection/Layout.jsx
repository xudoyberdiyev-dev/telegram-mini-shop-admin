import Sidebar from "../components/Sidebar.jsx";
import {Outlet} from "react-router-dom";

export const Layout = () => {
    return (
        <div className="min-h-screen flex bg-[#fdfefe] font-[Open_Sans]">
            <Sidebar />
            <main className="flex-1 ml-0 md:ml-64 p-6">
                <Outlet />
            </main>
        </div>
    )
}