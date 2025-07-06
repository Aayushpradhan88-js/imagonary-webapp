"use client"

import { useState, useEffect, useRef } from 'react'
import { CldImage } from 'next-cloudinary';

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
  const handledFileFormat = async (event: React.ChangeEvent<HTMLInputElement>) => {
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

      if (!response.ok) throw new Error("Failed to upload image");

      const data = await response.json();
      setUploadedImage(data.publicId);

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
  }

  return (
    <div className="container mx-auto p-4 max-w-4xl">
      <h1 className="text-3xl font-bold mb-6 text-center">
        Social Media Image Creator
      </h1>

      <div className='card'>
        <div className='card-body'>
          <h2 className="card-title mb-4">
            Upload an Image
          </h2>
          <div className='form-control'>
            <label className='label' >
              <span className='label-text'>Choose an image file</span>
            </label>

            <input
              onChange={handledFileFormat}
              type="file"
              className='file-input file-input-bordered file-input-primary w-full'
            />
          </div>

          {/* ------Uploading Progress Bar------ */}
          {isUploading && (
            <div className="mt-4">
              <progress className='progress progress-primary w-full'></progress>
            </div>
          )}

          {uploadedImage && (
            <div>
              <h2 className="card-title mb-4">Select Social Media Format</h2>
              <div>
                <select
                  className='select select-border w-full'
                  value={selectedFormat}
                  onChange={(e) => {
                    setSelectedFormat(e.target.value as SocialFormat);
                  }}>

                    {Object.keys(socialFormats).map((format) => (
                      <option key={format} value={format}>
                        {format}
                      </option>
                    ))}

                  </select>
              </div>

              <div className="mt-6 relative">
                <h3 className='text-lg font-semibold mb-2'>Preview: </h3>
                <div>
                  {isTransforming && (
                    <div className='absolute inset-0 flex items-center justify-center bg-base-100 z-10'>
                      <span className='loading loading-spinner loading-lg'></span>
                    </div>
                  )}
                  <CldImage
                  width={socialFormats[selectedFormat].width}
                  height={socialFormats[selectedFormat].height}
                  src={uploadedImage}
                  sizes='100vw'
                  alt='transformed image'
                  crop='fill'
                  aspectRatio={socialFormats[selectedFormat].aspectRatio}
                  gravity='auto'
                  ref={imageRef}
                  onLoad={() => setIsTransforming(false)}
                  />
                </div>
              </div>

              <div className="card-actions justify-end mt-4">
                <button className='btn btn-primary' onClick={handleDownload}>
                  Download for {selectedFormat}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default SocialShare;