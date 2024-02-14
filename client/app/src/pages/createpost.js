import { useState } from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import ReactQuill from "react-quill";
import 'react-quill/dist/quill.snow.css';

export default function CreatePost() {
    const [title, setTitle] = useState('');
    const [summary, setSummary] = useState('');
    const [content, setContent] = useState('');
    const [selectedFile, setSelectedFile] = useState(null);

    const navigate = useNavigate(); // Initialize useNavigate

    async function createNewPost(ev) {
        ev.preventDefault();

        const data = new FormData();
        data.set('title', title);
        data.set('summary', summary);
        data.set('content', content);

        if (selectedFile) {
            data.append('file', selectedFile);
        }

        const response = await fetch('http://localhost:4000/post', {
            method: 'POST',
            body: data,
            credentials:'include'
        });

        if (response.ok) {
            navigate('/'); // Redirect to the home page on success
        }
    }

    return (
        <form onSubmit={createNewPost}>
            <input type="text" placeholder="Title" value={title} onChange={ev => setTitle(ev.target.value)} />
            <input type="text" placeholder="Summary" value={summary} onChange={ev => setSummary(ev.target.value)} />
            <input type="file" onChange={ev => setSelectedFile(ev.target.files[0])} />
            <ReactQuill value={content} onChange={newValue => setContent(newValue)} />
            <button style={{ marginTop: '10px' }}>
                Create Post
            </button>
        </form>
    ) 
}
 