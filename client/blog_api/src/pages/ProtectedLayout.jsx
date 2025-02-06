import { Outlet } from "react-router-dom"
import ProtectedRouteHeader from "../components/ProtectedRouteHeader";

export default function ProtectedLayout() {
    return (
        <div className="flex flex-col min-h-screen">
            <ProtectedRouteHeader/>
            <Outlet />
        </div>
    )
}





