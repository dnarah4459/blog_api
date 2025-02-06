import { Link } from "react-router-dom"
import funLogo from "../assets/fun_logo.svg"
export default function Header() {
    return(
        <div className="flex justify-between items-center p-3 bg-gray-300">
            <div>
                <img src={funLogo} alt="" className="w-[35px]"/>
            </div>
            <Link to ="/" className="font-[550] text-xl">
                Home
            </Link>
            <div className="flex gap-2">
            <Link to = "/login" className="border-[1px] p-2 px-2 rounded-lg">
                Log In
            </Link>

            <Link to = "/signup" className="border-[1px] p-2 px-2 rounded-lg">
                Sign Up
            </Link>

            
            </div>
        </div>
    )
}