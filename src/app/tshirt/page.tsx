"use client";
import { useState, useRef, useEffect } from "react";
/* eslint-disable @typescript-eslint/no-explicit-any */
const TShirtPage = () => {
  const canvasRef = useRef(null);
  const [logo, setLogo] = useState<string | null>(null);
  const [logoPosition, setLogoPosition] = useState({ x: 200, y: 200 });
  const tshirtImage = "/tshirt.jpg";

  // Draw the T-shirt image on the canvas when it loads
  useEffect(() => {
    const canvas: any = canvasRef.current;
    const ctx = canvas.getContext("2d");
    const img = new Image();
    img.src = tshirtImage;
    img.onload = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
    };
  }, []);

  const handleLogoUpload = (event: any) => {
    const file = event.target.files[0];
    if (file) {
      const logoURL = URL.createObjectURL(file);
      setLogo(logoURL);
    }
  };

  // Draw T-shirt and logo
  const drawCanvas = () => {
    const canvas: any = canvasRef.current;
    const ctx = canvas.getContext("2d");
    const img = new Image();
    img.src = tshirtImage;

    img.onload = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

      if (logo) {
        const logoImg = new Image();
        logoImg.src = logo;
        logoImg.onload = () => {
          ctx.drawImage(logoImg, logoPosition.x, logoPosition.y, 100, 100);
        };
      }
    };
  };

  const handleCanvasClick = (e: any) => {
    const canvas: any = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    setLogoPosition({
      x: e.clientX - rect.left - 50,
      y: e.clientY - rect.top - 50,
    });
  };

  // Generate and download final image
  const generateFinalImage = () => {
    drawCanvas();
    const canvas: any = canvasRef.current;
    const finalImageURL = canvas.toDataURL("image/png");
    const link = document.createElement("a");
    link.download = "final-tshirt.png";
    link.href = finalImageURL;
    link.click();
  };

  // Redraw canvas whenever logo or position changes
  
  useEffect(() => {
    drawCanvas();
  }, [logo, logoPosition]);

  return (
    <div className="flex flex-col items-center pt-3">
      <canvas
        ref={canvasRef}
        width={500}
        height={500}
        className="border border-gray-500"
        onClick={handleCanvasClick}
        style={{ cursor: "pointer" }}
      ></canvas>

      <div className="mt-4">
        <label className="block mb-2 font-bold">Upload Your Logo</label>
        <input type="file" accept="image/*" onChange={handleLogoUpload} />
      </div>

      <button
        onClick={generateFinalImage}
        className="mt-4 px-4 py-2 bg-blue-500 text-white rounded"
      >
        Generate Final Image
      </button>
    </div>
  );
};

export default TShirtPage;
