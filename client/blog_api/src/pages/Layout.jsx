/* eslint-disable no-unused-vars */
import Header from "../components/Header"
import { Outlet } from "react-router-dom"

export default function Layout() {
    return (
        <div className="min-h-screen flex flex-col">
            <Header/>
            <Outlet/>
        </div>
    )
}