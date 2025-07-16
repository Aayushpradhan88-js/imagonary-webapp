"use client"

import { useState, useEffect, useRef } from 'react'
import { CldImage } from 'next-cloudinary';
import { toast } from 'react-toastify';

//----------SOCIAL MEDIA ASPECT RATIO FORMATS----------//
const socialFormats = {
  "Instagram Square (1:1)": {
    width: 1080,
    height: 1080,
    aspectRatio: "1:1"
  },
  "Instagram Portrait (4:5)": {
    width: 864,
    height: 1080,
    aspectRatio: "4:5"
  },
  "Facebook Cover (208:78)": {
    width: 820,
    height: 312,
    aspectRatio: "205:78"
  },
  "Twitter Post (16:9)": {
    width: 1200,
    height: 675,
    aspectRatio: "16:9"
  },
  "Twitter Header (3:1)": {
    width: 1500,
    height: 500,
    aspectRatio: "3:1"
  },
};

type SocialFormat = keyof typeof socialFormats;

function SocialShare() {
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [selectedFormat, setSelectedFormat] = useState<SocialFormat>("Instagram Square (1:1)");
  const [isUploading, setIsUploading] = useState(false);
  const [isTransforming, setIsTransforming] = useState(false);
  const imageRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    if (uploadedImage) {
      setIsTransforming(true);
    }
  }, [selectedFormat, uploadedImage]);

  //----------File Upload----------//
  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsUploading(true);

    const formData = new FormData();
    formData.append("file", file);

    try {

      const response = await fetch("/api/image-upload", {
        method: "POST",
        body: formData,
      });
      
      
      if (!response.ok) {
        throw new Error("Failed to upload image")
        toast.error('Failed to upload image ')
      };

      const data = await response.json();
      setUploadedImage(data.publicId);

      toast.success('Image fetched successfully')
    }
    catch (error) {
      console.error("Error uploading image:", error);
      alert("Failed to upload image. Please try again.");
    }
    finally {
      setIsUploading(false);
    }
  }

  //-----------DOWNLOAD FUNCTIONALITY----------------//
  const handleDownload = async () => {
    if (!imageRef.current) return null;

    fetch(imageRef.current.src)
      .then((response) => response.blob())
      .then((blob) => {

        const url = window.URL.createObjectURL(blob); //-----creates temporary URL-----//
        const link = document.createElement("a"); //-----creates a link element-----//
        link.href = url; //-----url temporary file set in <a> tag-----//
        link.download = `${selectedFormat
          .replace(/\s/g, "_") //-----replaces spaces with underscores-----//
          .toLowerCase()}.png`;//-----sets the download name e.g(js.png)-----//

        document.body.appendChild(link);
        link.click(); //-----user click download start-----//

        document.body.removeChild(link); //-----after download deleted automatically from the webpage-----//
        window.URL.revokeObjectURL(url);//-----revoke the temp url for memory management-----//
        document.body.removeChild(link);

      })
      toast.success('Image downloaded successfully')
  }

  return (
    <div className="container mx-auto p-4 max-w-lg text-white"> {/* Added text-white for general text color */}
      <h1 className="text-3xl font-bold mb-6 text-center text-gray-100"> {/* Adjusted text color for heading */}
        Social Media Image Creator
      </h1>

      {/* Main Card Container (Replaces DaisyUI 'card') */}
      <div className="bg-gray-800 p-6 rounded-lg shadow-xl border border-gray-700"> {/* Dark background, padding, rounded corners, shadow, border */}
        <div className="p-0"> {/* Replaces DaisyUI 'card-body', assuming card-body was mainly for padding */}
          <h2 className="text-2xl font-semibold text-gray-100 mb-4">Upload Your Image</h2>

          {/* File Upload Section */}
          <div className="mb-4"> {/* Replaces DaisyUI 'form-control' spacing */}
            <label className="block text-base font-medium text-gray-300 mb-2"> {/* Replaces DaisyUI 'label' */}
              <span className="text-gray-300">Choose an image file</span> {/* Replaces DaisyUI 'label-text' */}
            </label>
            {/* Replaces DaisyUI 'file-input file-input-bordered file-input-primary' */}
            <input
              type="file"
              onChange={handleFileUpload} // Your existing handler
              className="block w-full text-sm text-gray-300
                     file:mr-4 file:py-2 file:px-4
                     file:rounded-full file:border-0
                     file:text-sm file:font-semibold
                     file:bg-violet-600 file:text-white
                     hover:file:bg-violet-700
                     border border-gray-600 rounded-md shadow-sm
                     focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-violet-500
                     bg-gray-700 cursor-pointer"
            />
          </div>

          {/* Upload Progress Bar */}
          {isUploading && ( // Your existing state
            <div className="mt-4">
              
              <div className="w-full bg-gray-700 rounded-full h-2.5">
                <div className="bg-violet-600 h-2.5 rounded-full" style={{ width: '50%' }}></div> {/* Example width, set dynamically */}
              </div>
              <p className="text-center text-sm text-gray-400 mt-2">Uploading...</p>
            </div>
          )}

          {/* Conditional Display: After Image is Uploaded */}
          {uploadedImage && ( // Your existing state
            <>
              {/* Social Media Format Selection */}
              <div className="mt-6"> {/* Spacing from upload */}
                <h2 className="text-xl font-semibold text-gray-100 mb-4">Select Format for Social Media</h2>
                <label className="block text-base font-medium text-gray-300 mb-2">
                  <span className="text-gray-300">Choose a social platform</span>
                </label>
                {/* Replaces DaisyUI 'select select-bordered' */}
                <select
                  className="block w-full py-2 px-3 border border-gray-600 bg-gray-700 rounded-md shadow-sm
                         focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-violet-500 text-gray-200"
                  value={selectedFormat} // Your existing state
                  onChange={(e) =>
                    setSelectedFormat(e.target.value as SocialFormat) // Your existing handler
                  }
                >
                  {/* Loop through your socialFormats object */}
                  {Object.keys(socialFormats).map((format) => (
                    <option key={format} value={format}>
                      {format.charAt(0).toUpperCase() + format.slice(1)}
                    </option>
                  ))}
                </select>
              </div>

              {/* Preview Section */}
              <div className="mt-8 text-center">
                <h3 className="text-xl font-semibold text-gray-100 mb-4">Preview:</h3>
                <div className="relative w-full overflow-hidden rounded-lg shadow-md flex items-center justify-center bg-gray-700" style={{ minHeight: '200px' }}>
                  {isTransforming && ( // Your existing state
                    <div className="absolute inset-0 flex items-center justify-center bg-gray-800 bg-opacity-70 z-10">
                      {/* Basic Tailwind CSS Spinner (replaces DaisyUI 'loading loading-spinner loading-lg') */}
                      <div
                        className="w-12 h-12 border-4 border-t-4 border-gray-200 border-solid rounded-full animate-spin"
                        style={{ borderColor: 'rgba(139, 92, 246, 0.5)', borderTopColor: 'rgb(139, 92, 246)' }} // Violet-600 equivalent
                      ></div>
                    </div>
                  )}
                  {/* Your CldImage component */}
                  <CldImage
                    width={socialFormats[selectedFormat].width}
                    height={socialFormats[selectedFormat].height}
                    src={uploadedImage} // Your existing state
                    sizes="100vw"
                    alt="Transformed Image Preview"
                    crop="fill"
                    aspectRatio={socialFormats[selectedFormat].aspectRatio}
                    gravity='auto'
                    ref={imageRef} // Your existing ref
                    onLoad={() => setIsTransforming(false)} // Your existing handler
                    className="max-w-full h-auto"
                  />
                </div>
              </div>

              {/* Download Button */}
              <div className="flex justify-center mt-8"> {/* Replaces DaisyUI 'card-actions justify-end' and centers */}
                {/* Replaces DaisyUI 'btn btn-primary btn-lg' */}
                <button
                  className="px-6 py-3 bg-violet-600 text-white font-semibold rounded-md shadow-md
                         hover:bg-violet-700 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:ring-offset-2 text-lg"
                  onClick={handleDownload} // Your existing handler
                >
                  Download for {selectedFormat.charAt(0).toUpperCase() + selectedFormat.slice(1)}
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

export default SocialShare