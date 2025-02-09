import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
export default function ProtectedRouteHeader() {
  const navigate = useNavigate();

  const handleLogoutButtonClick = () => {
    localStorage.removeItem("token"); 
    navigate('/login');
  }
  return (
    <div className="flex flex-col gap-2">
      <div className="flex justify-between bg-gray-400 p-4">
        <Link to="/protected/dashboard" className="border-2 p-2 cursor-pointer">
          Dashboard
        </Link>
        <Link to="/protected/myblogs" className="border-2 p-2 cursor-pointer">
          MyBlogs
        </Link>
        <Link
          to="/protected/createblog"
          className="border-2 p-2 cursor-pointer"
        >
          CreateBlog
        </Link>
        <Link to="/protected/allblogs" className="border-2 p-2 cursor-pointer">
          All Blogs
        </Link>
        <button onClick={handleLogoutButtonClick} className="border-2 p-2">
          Logout
        </button>
      </div>

      <div className="p-3 font-[650] text-[25px]"> </div>
    </div>
  );
}
