/* eslint-disable no-unused-vars */
import { useState, useEffect } from "react";

export default function AllBlogs() {
  let [allBlogs, setAllBlogs] = useState([]);
  let [error, setError] = useState(false);
  let [showCommentFormForIndividualBlog, setShowCommentFormForIndividualBlog] =
    useState({});

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
        console.log(allBlogs);
        let commentFormMappedBlogPosts = {};
        allBlogs.map((element) => {
          commentFormMappedBlogPosts[element.id] = false;
        });
        setShowCommentFormForIndividualBlog(commentFormMappedBlogPosts);
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

  const handleCommentFormSubmit = async (e, blogId) => {
    console.log("jo")
    e.preventDefault();
    const formData = new FormData(e.target);
    const commentTitle = formData.get("commentTitle");
    const commentContent = formData.get("commentContent");
    const token = localStorage.getItem("token");
    try {
      const response = await fetch(
        `http://localhost:8080/api/add-comment/${blogId}`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            title: commentTitle,
            content: commentContent,
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to add comment");
      }

      const updatedBlogsCommentList = await response.json();
      setAllBlogs(updatedBlogsCommentList);
      const newshowCommentMapBlog = {
        ...showCommentFormForIndividualBlog,
        [blogId]: false,
      };
      setShowCommentFormForIndividualBlog(newshowCommentMapBlog);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="flex flex-col flex-grow">
      <h1 className="p-3 font-[650] text-[20px]">Personal Blogs</h1>
      <div className="flex flex-col gap-4 p-3">
        {allBlogs.map((element) => {
          return (
            <>
              <div
                key={element.id}
                className="flex flex-col gap-3 border-2 p-3"
              >
                <h1 className="font-[650] text-[18px]">{element.title}</h1>
                <p className="text-[16px]">{element.content}</p>
                <p className="font-[650]">
                  Written By:
                  <a href="" className="font-normal">
                    {" "}
                    {element.User.firstName} {element.User.lastName}
                  </a>
                </p>

                <div className="border-2 p-3 flex flex-col gap-2">
                  <h1 className="text-[20px] font-[650]">Comments for this post:</h1>
                  {element.comments.map((element) => {
                    return (
                    <div key={element.id} className="border-2 flex flex-col gap-2 p-2">
                      <h1>Title: {element.title}</h1>
                      <p>Content: {element.content}</p>
                      <p>Written By: {element.User.firstName} {element.User.lastName}</p>
                    </div>
                  );
                  })}
                </div>

                {showCommentFormForIndividualBlog[element.id] ? (
                  <button
                    className="font-[650] text-[18px] self-start border-2 p-2 bg-amber-600 cursor-pointer"
                    onClick={() => {
                      const newshowCommentMapBlog = {
                        ...showCommentFormForIndividualBlog,
                        [element.id]: false,
                      };
                      setShowCommentFormForIndividualBlog(
                        newshowCommentMapBlog
                      );
                    }}
                  >
                    Close `Add Comment` Form
                  </button>
                ) : (
                  <button
                    className="font-[650] text-[18px] self-start border-2 p-2 bg-amber-600 cursor-pointer"
                    onClick={() => {
                      const newshowCommentMapBlog = {
                        ...showCommentFormForIndividualBlog,
                        [element.id]: true,
                      };
                      setShowCommentFormForIndividualBlog(
                        newshowCommentMapBlog
                      );
                    }}
                  >
                    Add Comment
                  </button>
                )}
              </div>
              {showCommentFormForIndividualBlog[element.id] && (
                <form
                  action=""
                  className="flex flex-col gap-5 p-2 border-2 border-black"
                  onSubmit={(e) => {
                    handleCommentFormSubmit(e, element.id);
                  }}
                >
                  <div className="flex flex-col gap-2">
                    <h1 className="font-[650] text-[16px]">Comment Title:</h1>
                    <input
                      type="text"
                      className="border-2 p-2 rounded-lg"
                      name="commentTitle"
                    />
                  </div>

                  <div className="flex flex-col gap-2">
                    <h1 className="font-[650] text-[16px]">Content</h1>
                    <textarea
                      name="commentContent"
                      id=""
                      className="border-2 p-2 rounded-lg"
                    ></textarea>
                  </div>
                  <button className="p-2 bg-blue-600 rounded-lg self-start cursor-pointer">
                    Submit
                  </button>
                </form>
              )}
            </>
          );
        })}

        {allBlogs.length === 0 && (
          <p className="text-gray-500">No blogs found</p>
        )}
      </div>
    </div>
  );
}
