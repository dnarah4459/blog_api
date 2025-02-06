/* eslint-disable no-unused-vars */
import { useEffect, useState } from "react";

export default function MyBlogs() {
  const [personalBlogs, setPersonalBlogs] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const fetchData = async () => {
      try {
        const response = await fetch("http://localhost:8080/api/all-posts-user", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch blogs");
        }
        const newPersonalBlogPosts = await response.json();
        console.log(newPersonalBlogPosts)
        setPersonalBlogs(newPersonalBlogPosts);
      } catch (error) {
        setError(error.message);
        console.error("Error fetching blogs:", error);
      }
    };

    fetchData();
  }, []);

  const handleDeleteButton = async (postIdToDelete) => {
    console.log('hi');
    const token = localStorage.getItem("token");
    try {
        const response = await fetch("http://localhost:8080/api/delete-post", {
            method: "DELETE",
            headers: {
              "Content-Type": "application/json", 
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
                postIdToDelete: postIdToDelete
            }),
        });   

        if (!response.ok) {
            throw new Error("Failed to fetch blogs");
          }
          const updatedPersonalBlogPostList= await response.json();
          setPersonalBlogs(updatedPersonalBlogPostList)
    } catch (error) {
        console.log(error); 
    }   

  }


  if (error) {
    return <div className="p-3 text-red-500">Error: {error}</div>;
  }

  return (
    <div className="flex flex-col flex-grow">
      <h1 className="p-3 font-[650] text-[20px]">Personal Blogs</h1>
      <div className="flex flex-col gap-4 p-3">
        {personalBlogs.map((blog) => (
          <div key={blog.id} className="flex flex-col gap-3 border p-4 rounded-lg shadow">
            <h2 className="text-xl font-semibold">{blog.title}</h2>
            <p className="mt-2">{blog.content}</p>
            <p className="mt-2">Written by: {blog.User.firstName} {blog.User.lastName}</p>
            {blog.comments.map((element) => {
                return (
                    <div key = {element.id}>
                            
                    </div>
                )
            })}
            <button onClick={() => {handleDeleteButton(blog.id)}} className="cursor-pointer border-2 bg-gray-400 p-2 self-start">Delete</button>
          </div>
        ))}
        {personalBlogs.length === 0 && (
          <p className="text-gray-500">No blogs found</p>
        )}
      </div>
    </div>
  );
}
