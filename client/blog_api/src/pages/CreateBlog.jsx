/* eslint-disable no-unused-vars */
import { Editor } from "@tinymce/tinymce-react";
import { useRef } from "react";
import { useNavigate } from "react-router-dom";
export default function CreateBlog() {
  const editorRef = useRef(null);
  const navigate = useNavigate(); 

  const log = async () => {
    const token = localStorage.getItem("token");
    let userBlogPost = editorRef.current.getContent({format: 'text'});
    try {
      const response = await fetch("http://localhost:8080/api/create-post", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          content: userBlogPost
        }),
      });

      if(response.ok) {
        editorRef.current.setContent("");
        navigate('/protected/myblogs');
      }
    } catch (error) {
      console.log(error);
    }
  };

  const ai_request = (request, respondWith) => {
    const token = localStorage.getItem("token");
    respondWith.string((signal) =>
      fetch("http://localhost:8080/api/ai-completion", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          prompt: request.prompt,
        }),
        signal,
      }).then(async (response) => {
        if (response.ok) {
          const data = await response.json();
          return data.content;
        }
        throw new Error("Failed to get AI completion");
      })
    );
  };

  return (
    <div className="m-4">
      <Editor
        apiKey="w0tuskv6dxqtyhk19snecjumb2kwtiwzl9f0n6drp3l7xdxc"
        onInit={(_evt, editor) => (editorRef.current = editor)}
        init={{
          plugins: [
            "anchor",
            "autolink",
            "charmap",
            "codesample",
            "emoticons",
            "image",
            "link",
            "lists",
            "media",
            "searchreplace",
            "table",
            "visualblocks",
            "wordcount",
            "checklist",
            "mediaembed",
            "casechange",
            "export",
            "formatpainter",
            "pageembed",
            "a11ychecker",
            "tinymcespellchecker",
            "permanentpen",
            "powerpaste",
            "advtable",
            "advcode",
            "editimage",
            "advtemplate",
            "ai",
            "mentions",
            "tinycomments",
            "tableofcontents",
            "footnotes",
            "mergetags",
            "autocorrect",
            "typography",
            "inlinecss",
            "markdown",
            "importword",
            "exportword",
            "exportpdf",
          ],
          toolbar:
            "undo redo | blocks fontfamily fontsize | bold italic underline strikethrough | link image media table mergetags | addcomment showcomments | spellcheckdialog a11ycheck typography | align lineheight | checklist numlist bullist indent outdent | emoticons charmap | removeformat",
          tinycomments_mode: "embedded",
          tinycomments_author: "Author name",
          mergetags_list: [
            { value: "First.Name", title: "First Name" },
            { value: "Email", title: "Email" },
          ],
          ai_request: ai_request,
        }}
        initialValue="Welcome to TinyMCE!"
      />
      <button onClick={log} className="m-3 p-2 bg-blue-500 cursor-pointer">Log editor content</button>
    </div>
  );
}