'use client'

import { useState } from 'react'
import axios from 'axios'
import { usePathname, useRouter } from 'next/navigation'
import { toast } from 'react-toastify';


//--------------------VIDEO UPLOAD PAGE--------------------//
function VideoUpload() {
  const [file, setFile] = useState<File | null>(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [isUploading, setIsUploading] = useState(false);

  const router = useRouter();
  //max file size 60 MB

  const MAX_FILE_SIZE = 60 * 1024 * 1024

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!file) return;

    if (file.size > MAX_FILE_SIZE) {
      toast.error("File size is too large");
      return;
    }

    setIsUploading(true);

    const formData = new FormData();
    formData.append("file", file);
    formData.append("title", title);
    formData.append("description", description);
    formData.append("originalSize", file.size.toString());

    try {
      //----------UPLOAD VIDEO FETCHING AT BACKEND----------//
      const response = await axios.post("/api/video-upload", formData);

      if (response.status === 200) {
        toast.success("Video uploaded successfully");
        router.push("/");
      }
    }
    catch (error) {
      console.log(error);
      toast.error("Failed to upload video");
    }
    finally {
      setIsUploading(false);
    };
  }

  return (
    <div className="flex bg-gradient-to-br">
      <div className="w-full max-w-md p-8 rounded-2xl shadow-2xl bg-white/90 border border-blue-200">
        <h1 className="text-3xl font-extrabold text-blue-900 mb-6 text-center drop-shadow">Upload Video</h1>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="label mb-3">
              <span className="label-text text-blue-800 font-semibold">Title</span>
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="input mt-2 p-2 input-bordered w-full rounded-lg border-2  text-black"
              required
            />
          </div>
          <div>
            <label className="label mb-1">
              <span className="label-text mt-2 text-blue-800 font-semibold">Description</span>
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="textarea p-2 text-black textarea-bordered border-2 w-full rounded-lg"
              required
            />
          </div>
          <div>
            <label className="label mb-1">
              <span className="label-text text-blue-800 font-semibold">Video File</span>
            </label>
            <input
              type="file"
              accept="video/*"
              onChange={(e) => setFile(e.target.files?.[0] || null)}
              className="file-input file-input-bordered border-2 w-full  bg-black rounded-lg"
              required
            />
          </div>
          <button
            type="submit"
            className="btn w-full rounded-lg bg-blue-900 hover:bg-blue-800 text-white font-bold py-2 transition-all duration-200 shadow-lg"
            disabled={isUploading}
          >
            {isUploading ? "Uploading..." : "Upload Video"}
          </button>
        </form>
      </div>
    </div>
  )
}

export default VideoUpload
