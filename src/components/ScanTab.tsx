import React, { useState, useRef, useEffect } from "react";
import { Camera, Upload, AlertCircle, FileText, Settings, Sparkles, Wand2 } from "lucide-react";
import { homeworkSamples, generateHomeworkSampleDataURL, HomeworkSample } from "../utils/canvasHomework";

interface ScanTabProps {
  onSolveUploadedImage: (base64Image: string, mimeType: string, additionalPrompt: string) => void;
  isLoading: boolean;
  theme?: "dark" | "light";
}

export default function ScanTab({ onSolveUploadedImage, isLoading, theme = "dark" }: ScanTabProps) {
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [selectedSampleId, setSelectedSampleId] = useState<string | null>(null);
  const [additionalPrompt, setAdditionalPrompt] = useState("");
  const [dragActive, setDragActive] = useState(false);

  const isLight = theme === "light";

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Initialize camera stream
  const startCamera = async () => {
    try {
      setCameraError(null);
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
      }

      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment", width: 640, height: 480 },
        audio: false
      });
      
      setStream(mediaStream);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
    } catch (err: any) {
      console.warn("Camera stream access blocked or not supported:", err);
      setCameraError(
        "Camera stream blocked/unsupported in iframe. Use the drag-and-drop file uploader or single-click our math homework sheets below to demo!"
      );
    }
  };

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
      setStream(null);
    }
  };

  useEffect(() => {
    startCamera();
    return () => stopCamera();
  }, []);

  // Capture current frame from viewfinder
  const handleCapture = () => {
    if (videoRef.current) {
      try {
        const video = videoRef.current;
        const canvas = document.createElement("canvas");
        canvas.width = video.videoWidth || 640;
        canvas.height = video.videoHeight || 480;
        const ctx = canvas.getContext("2d");
        
        if (ctx) {
          ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
          const dataUrl = canvas.toDataURL("image/jpeg");
          setCapturedImage(dataUrl);
          setSelectedSampleId(null);
          stopCamera();
        }
      } catch (err) {
        console.error("Capture failure:", err);
      }
    }
  };

  // Switch back to viewfinder stream
  const handleRetake = () => {
    setCapturedImage(null);
    setSelectedSampleId(null);
    startCamera();
  };

  // Drag and drop events
  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const processFile = (file: File) => {
    if (file && file.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === "string") {
          setCapturedImage(reader.result);
          setSelectedSampleId(null);
          stopCamera();
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      processFile(e.target.files[0]);
    }
  };

  const selectSample = (sample: HomeworkSample) => {
    const dataUrl = generateHomeworkSampleDataURL(sample.id);
    setCapturedImage(dataUrl);
    setSelectedSampleId(sample.id);
    stopCamera();
  };

  const handleSolveSubmit = () => {
    if (capturedImage) {
      // Determine mimetype
      let mimeType = "image/jpeg";
      if (capturedImage.startsWith("data:")) {
        const match = capturedImage.match(/^data:([^;]+);/);
        if (match) mimeType = match[1];
      }
      onSolveUploadedImage(capturedImage, mimeType, additionalPrompt);
    }
  };

  return (
    <div className={`flex-1 flex flex-col transition-colors duration-200 overflow-y-auto ${
      isLight ? "bg-slate-50" : "bg-slate-900"
    }`}>
      
      {/* Upper scanning viewfinder frame or preview */}
      <div className="p-4 flex flex-col items-center">
        <div className={`w-full relative aspect-video rounded-2xl overflow-hidden flex flex-col items-center justify-center shadow-md border ${
          isLight ? "bg-slate-900 border-slate-200" : "bg-slate-950 border-slate-800"
        }`}>
          
          {/* Active webcam stream */}
          {stream && !capturedImage && (
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              className="absolute inset-0 w-full h-full object-cover"
            />
          )}

          {/* Captured / Loaded Image Display */}
          {capturedImage && (
            <img
              src={capturedImage}
              alt="Scan capture"
              className="absolute inset-0 w-full h-full object-contain bg-slate-950"
            />
          )}

          {/* Viewfinder Target box highlight overlay */}
          {!capturedImage && !cameraError && (
            <div className="absolute inset-6 border-2 border-dashed border-cyan-400/45 rounded-lg pointer-events-none flex flex-col items-center justify-center">
              <div className="text-[10px] text-cyan-300 font-mono tracking-wider font-semibold py-1 px-2.5 rounded bg-slate-950/80 uppercase">
                Align Homework problem inside frame
              </div>
            </div>
          )}

          {/* Fallback frame in case of blocked cam permissions */}
          {!stream && !capturedImage && cameraError && (
            <div
              className={`absolute inset-0 flex flex-col items-center justify-center p-6 text-center transition-all duration-150 ${
                dragActive ? "bg-cyan-950/25" : ""
              }`}
              onDragEnter={handleDrag}
              onDragOver={handleDrag}
              onDragLeave={handleDrag}
              onDrop={handleDrop}
            >
              <FileText className="w-10 h-10 text-slate-500 mb-2 animate-bounce" />
              <p className="text-xs text-slate-300 max-w-xs leading-relaxed font-medium">
                {cameraError}
              </p>
              
              <button
                onClick={() => fileInputRef.current?.click()}
                className="mt-3.5 flex items-center space-x-1.5 bg-slate-850 hover:bg-slate-800 text-slate-200 text-xs px-4 py-1.5 rounded-lg border border-slate-755 font-medium shadow"
              >
                <Upload className="w-3.5 h-3.5 text-cyan-400" />
                <span>Upload Math Photo</span>
              </button>
              <p className="text-[10px] text-slate-400 mt-1">Accepts JPG, PNG, Screenshots</p>
            </div>
          )}

          {/* Bottom quick overlay actions */}
          {stream && !capturedImage && (
            <button
              onClick={handleCapture}
              className="absolute bottom-4 bg-gradient-to-r from-cyan-500 to-cyan-600 hover:scale-105 hover:from-cyan-400 hover:to-cyan-500 text-slate-950 font-bold p-3 rounded-full shadow-lg border border-cyan-300 transition-all duration-150 animate-pulse active:scale-95 z-10"
            >
              <Camera className="w-6 h-6 text-slate-950" />
            </button>
          )}

          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleFileChange}
          />
        </div>

        {/* Captured state helper buttons */}
        {capturedImage && (
          <div className="flex space-x-2 mt-3 w-full">
            <button
              onClick={handleRetake}
              disabled={isLoading}
              className={`flex-1 font-semibold py-1.5 rounded-lg text-xs transition active:scale-95 disabled:opacity-50 border ${
                isLight
                  ? "bg-white hover:bg-slate-50 text-slate-700 border-slate-200 shadow-sm"
                  : "bg-slate-800 hover:bg-slate-700 text-slate-300 border-slate-700/60"
              }`}
            >
              Clear / Retake
            </button>
            <button
              onClick={() => fileInputRef.current?.click()}
              disabled={isLoading}
              className={`flex-1 font-semibold py-1.5 rounded-lg text-xs transition active:scale-95 disabled:opacity-50 flex items-center justify-center space-x-1 border ${
                isLight
                  ? "bg-slate-100 hover:bg-slate-200 text-slate-850 border-slate-300 shadow-sm"
                  : "bg-slate-850 hover:bg-slate-800 text-slate-300 border-slate-750"
              }`}
            >
              <Upload className="w-3.5 h-3.5" />
              <span>Replace File</span>
            </button>
          </div>
        )}
      </div>

      {/* Interactive prompt configuration panel */}
      {capturedImage && (
        <div className="px-4 pb-4 shrink-0">
          <div className={`rounded-xl p-3 border transition-colors duration-200 ${
            isLight
              ? "bg-white border-cyan-200 hover:shadow-sm shadow-cyan-100/50"
              : "bg-slate-950 border-cyan-500/20"
          }`}>
            <label className={`text-[10px] font-bold tracking-wider uppercase block mb-1 ${
              isLight ? "text-cyan-700" : "text-cyan-400"
            }`}>
              Add Question Notes / Instructions (Optional):
            </label>
            <input
              type="text"
              placeholder="e.g., 'Solve using factoring', 'Graph the limit'..."
              value={additionalPrompt}
              onChange={(e) => setAdditionalPrompt(e.target.value)}
              disabled={isLoading}
              className={`w-full rounded-lg px-3 py-1.5 text-xs placeholder-slate-400 focus:outline-none focus:border-cyan-550 border transition-all duration-150 disabled:opacity-60 ${
                isLight
                  ? "bg-slate-50 border-slate-205 text-slate-850 placeholder-slate-400"
                  : "bg-slate-900 border-slate-800 text-slate-105 placeholder-slate-500"
              }`}
            />

            <button
              onClick={handleSolveSubmit}
              disabled={isLoading}
              className={`w-full mt-3 h-10 rounded-lg text-xs font-semibold transition-all duration-150 active:scale-[0.98] flex items-center justify-center space-x-2 disabled:opacity-50 ${
                isLight
                  ? "bg-cyan-500 hover:bg-cyan-455 text-slate-950 shadow shadow-cyan-400/20"
                  : "bg-gradient-to-r from-cyan-500 to-cyan-600 hover:from-cyan-400 hover:to-cyan-500 text-slate-950 shadow-lg shadow-cyan-500/10 hover:shadow-cyan-500/20"
              }`}
            >
              <Wand2 className="w-4 h-4 text-slate-950 fill-slate-950" />
              <span>
                {selectedSampleId ? "Analyze Sample Worksheet" : "Solve Scanned Homework"}
              </span>
            </button>
          </div>
        </div>
      )}

      {/* Student Demo Homework Section (The canvas notebooks!) */}
      <div className={`flex-1 p-4 transition-colors duration-200 border-t ${
        isLight
          ? "bg-slate-100/50 border-slate-200"
          : "bg-slate-950/40 border-slate-800/60"
      }`}>
        <h3 className={`text-[10px] font-bold tracking-wider uppercase mb-3 flex items-center space-x-1 ${
          isLight ? "text-slate-550" : "text-slate-400"
        }`}>
          <Sparkles className={`w-3.5 h-3.5 ${isLight ? "text-cyan-600" : "text-cyan-400"}`} />
          <span>Interactive Homework Samples (Tap to Scan)</span>
        </h3>

        <div className="grid grid-cols-2 gap-2.5">
          {homeworkSamples.map((sample) => {
            const isSelected = selectedSampleId === sample.id;
            return (
              <button
                key={sample.id}
                onClick={() => selectSample(sample)}
                disabled={isLoading}
                className={`text-left rounded-xl p-3 border transition-all duration-150 flex flex-col justify-between h-24 cursor-pointer relative overflow-hidden select-none active:scale-95 ${
                  isSelected
                    ? isLight
                      ? "bg-cyan-50 border-cyan-400 text-cyan-900 shadow shadow-cyan-200/50"
                      : "bg-cyan-500/10 border-cyan-500/40 shadow-md shadow-cyan-500/5 text-cyan-200"
                    : isLight
                      ? "bg-white hover:bg-slate-50 border-slate-200 text-slate-700 shadow-sm"
                      : "bg-slate-950/70 hover:bg-slate-950 border-slate-800 hover:border-slate-700 text-slate-300"
                }`}
              >
                <div>
                  <span className={`text-[9px] font-bold uppercase tracking-widest px-1.5 py-0.5 rounded border inline-block mb-1 ${
                    isSelected
                      ? isLight
                        ? "bg-cyan-100 text-cyan-800 border-cyan-200"
                        : "bg-cyan-950/40 text-cyan-400 border-cyan-900/30"
                      : isLight
                        ? "bg-slate-100 text-slate-600 border-slate-200/80"
                        : "bg-cyan-950/40 text-cyan-400 border-cyan-900/30"
                  }`}>
                    {sample.category}
                  </span>
                  <h4 className={`text-[11px] font-semibold tracking-tight leading-tight line-clamp-1 ${
                    isLight ? "text-slate-900" : "text-slate-200"
                  }`}>
                    {sample.title}
                  </h4>
                  <p className={`text-[10px] font-mono mt-1 tracking-tight leading-snug truncate ${
                    isLight ? "text-slate-500" : "text-slate-400"
                  }`}>
                    {sample.problemText}
                  </p>
                </div>

                <div className={`flex items-center justify-between mt-1 pt-1 border-t ${
                  isLight ? "border-slate-100" : "border-slate-850"
                }`}>
                  <span className={`text-[9px] font-medium ${
                    sample.difficulty === "Easy" ? "text-emerald-500" :
                    sample.difficulty === "Medium" ? "text-amber-500" : "text-rose-500"
                  }`}>
                    {sample.difficulty}
                  </span>
                  <span className={`text-[9px] underline ${
                    isLight ? "text-cyan-600 decoration-cyan-400/50" : "text-cyan-400 decoration-cyan-400/30"
                  }`}>
                    Load Sheet
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

    </div>
  );
}
