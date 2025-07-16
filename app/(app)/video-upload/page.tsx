'use client'

import { useRef, useState } from 'react'
import axios from 'axios'
import { useRouter } from 'next/navigation'
import { toast } from 'react-toastify';
import { RefreshCw } from 'lucide-react';


//--------------------VIDEO UPLOAD PAGE--------------------//
function VideoUpload() {
  const [file, setFile] = useState<File | null>(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [suggestion, setSuggestion] = useState("");
  const [isSuggesting, setIsSuggesting] = useState(false);
  const fileInputRef = useRef(null);

  const router = useRouter();

  //-----max file size 60 MB-----//
  const MAX_FILE_SIZE = 263 * 1024 * 1024 //1GB in bytes
// 60 * 1024 * 1024
  const handleReload = () => {
    setTitle('');
    setDescription('');
    setSuggestion('');

    if (fileInputRef.current) {
      (fileInputRef.current as HTMLInputElement).value = ''
      setFile(null);
    };

    toast.success("reloaded successfully")
  };

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
  };

  //-----SUGGESTION AI-----//
  const handleGetSuggestion = async () => {
    if (!title) {
      return;
    }
    setIsSuggesting(true);
    setSuggestion('');

    try {
      //-----FETCHING REQUEST OF SUGGESTION-----//
      const response = await axios.post("/api/suggest", {
        prompt: `Generate a single, short and meaning description under 150 characters. Dont provide multiple options or explanations, brackets(), ** stars and symbols"${title}"`
      });

      if (response.data.completion) {
        const cleanSuggestion = response.data.completion.replace(/^"|"$/g, '').trim();
        setSuggestion(cleanSuggestion);
      }
      else {
        toast.error("Could not get suggestion")
      }
    }
    catch (error) {
      console.error("Failed to get suggestion:", error);
      if (axios.isAxiosError(error) && error.response) {
        toast.error(error.response.data || "Could not get a suggestionat at this time")
      }
      else {
        toast.error("An unexpected error occurred while getting a suggestion.")
      }
    }
    finally {
      setIsSuggesting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center text-white bg-gradient-to-br p-1">
      <div className="w-full max-w-md p-8 rounded-2xl shadow-2xl border">
        <form onSubmit={handleSubmit} className="space-y-1">
          <div className="flex justify-between items-center mb-2">
            <h1 className="text-2xl font-extrabold text-blue-900 drop-shadow">Upload Video</h1>
            <button
              type="button"
              onClick={handleReload}
              className="flex items-center px-3 py-1 rounded-full text-white bg-gray-700 hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition-all duration-200 text-sm"
              title="Reload Form" 
            >
              <RefreshCw className='w-4 h-4' /> 
            </button>
          </div>

          <div>
            <label className="label mb-3">
              <span className="label-text text-blue-800 font-semibold">
                Title
                </span>
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="input mt-2 p-2 input-bordered w-full rounded-lg border-2"
              required
            />
          </div>

          <div>
            <label className="label mb-1">
              <span className="label-text mt-2 text-blue-800 font-semibold">
                Description
                </span>
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="textarea p-2 text-white textarea-bordered border-2 w-full rounded-lg"
              required
            />

            {/* //-----suggestion ui-----// */}
            <div className="flex justify-end mt-2">
              <button
                type="button"
                onClick={handleGetSuggestion}
                disabled={isSuggesting || !title}
                className="btn btn-sm cursor-pointer text-white enabled:bg-green-500 rounded-3xl p-1"
              >
                {isSuggesting ? 'Generating...' : '✨ Get AI Suggestion'}
              </button>
            </div>


          </div>

          {/*----- AI Suggestion Display-----*/}
          {suggestion && (
            <div className="mt-2 p-3 border border-dashed border-gray-400 rounded-lg bg-blue-50/70 space-y-2">
              <p className="text-sm text-gray-800">
                <strong className="text-violet-700">AI Suggestion:</strong> {suggestion}
              </p>
              <button
                type="button"
                onClick={() => {
                  setDescription(prev => prev ? `${prev}\n\n${suggestion}` : suggestion);
                }}
                className="btn btn-xs bg-blue-100 text-blue-800 border-blue-300 hover:bg-blue-200"
              >
                Use this suggestion
              </button>
            </div>
          )}

          <div>
            <label className="label mb-1">
              <span className="label-text text-blue-800 font-semibold">Video File</span>
            </label>
            <input
              type="file"
              accept="video/*"
              onChange={(e) => setFile(e.target.files?.[0] || null)}
              className="file-input file-input-bordered border-2 w-full mt-2 cursor-pointer p-2 rounded-lg"
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

export default VideoUpload;