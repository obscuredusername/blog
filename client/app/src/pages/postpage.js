import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

export default function PostPage() {
  const [postInfo, setPostInfo] = useState('');
  const { id } = useParams(); // Use useParams to get the 'id' parameter

  useEffect(() => {
    console.log(id);
    fetch(`http://localhost:4000/post/${id}`) // Use the correct endpoint URL
      .then((response) => {
        response.json().then((postInfo) => {
          setPostInfo(postInfo);
        });
      });
  }, [id]); // Include 'id' as a dependency to re-fetch when it changes

  return (
    <div>
      <h1>Post Page</h1>
      <div>{postInfo.title}</div>
      <div>{postInfo.summary}</div>
      <div>{postInfo.content}</div>
    </div>
  );
}
