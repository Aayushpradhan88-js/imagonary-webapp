"use client"


import React, { useState, useEffect, useRef } from 'react'

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

type socialFormat = keyof typeof socialFormats;

function SocialShare() {
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [selectedFormat, setSelectedFormat] = useState<socialFormat>("Instagram Square (1:1)");
  const [isUploading, setIsUploading] = useState(false);
  const [isTransforming, setIsTransforming] = useState(false);
  const imageRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    if (uploadedImage) {
      setIsTransforming(true);
    }
  }, [selectedFormat, uploadedImage]);

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
  const handleDownload = async() => {
    if(!imageRef.current) return null;

    fetch(imageRef.current.src)
    .then((response) => response.blob())
    .then((blob) => {
      const url = window.URL.createObjectURL(blob); //-----creates temporary URL-----//
      const link  = document.createElement("a"); //-----creates a link element-----//
      link.href = url; //-----url temporary file set in <a> tag-----//
      link.download = `${selectedFormat
        .replace(/\s/g, "_") //-----replaces spaces with underscores-----//
        .toLowerCase()}.png`;//-----sets the download name e.g(js.png)-----//

        document.body.appendChild(link);
        link.click(); //-----user click download start-----//

        document.body.removeChild(link); //-----after download deleted automatically from the webpage-----//
        window.URL.revokeObjectURL(url);//-----revoke the temp url for memory management-----//
        document.body.removeChild(link);
      }
    )
  }

  return (
    <div>
      <h1>Social Share</h1>
    </div>
  )
}
}

export default SocialShare
