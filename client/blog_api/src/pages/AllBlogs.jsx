/* eslint-disable no-unused-vars */
import { useState, useEffect } from "react";

export default function AllBlogs() {
  let [allBlogs, setAllBlogs] = useState([]);
  let [error, setError] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");
    const fetchData = async () => {
      try {
        const response = await fetch("http://localhost:8080/api/all-posts", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch blogs");
        }

        const allBlogs = await response.json();
        setAllBlogs(allBlogs);
      } catch (error) {
        console.error("Error fetching blogs:", error);
        setError(error);
      }
    };

    fetchData();
  }, []);

  if (error) {
    return <div className="p-3 text-red-500">Error: {error}</div>;
  }

  return (
    <div className="flex flex-col flex-grow">
      <h1 className="p-3 font-[650] text-[20px]">Personal Blogs</h1>
      <div className="flex flex-col gap-4 p-3">
        {allBlogs.map((blog) => (
          <div key={blog.id} className="border p-4 rounded-lg shadow">
            <h2 className="text-xl font-semibold">{blog.title}</h2>
            <p className="mt-2">{blog.content}</p>
          </div>
        ))}
        {allBlogs.length === 0 && (
          <p className="text-gray-500">No blogs found</p>
        )}
      </div>
    </div>
  );
}
