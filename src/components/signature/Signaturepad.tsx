/* eslint-disable @typescript-eslint/no-explicit-any */
import { useRef, useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Upload, Pen, Trash2, Download, Loader2, Check } from "lucide-react";
import { toast } from "sonner";
import { uploadToDriveApi } from "@/lib/membership-api";

interface SignaturePadProps {
  onSignatureChange: (signature: string) => void;
  value?: string;
  error?: string;
}

export function SignaturePad({
  onSignatureChange,
  value = "",
  error,
}: SignaturePadProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [signatureMode, setSignatureMode] = useState<"draw" | "upload">("draw");
  const [uploadedImage, setUploadedImage] = useState<string>("");
  const [isUploading, setIsUploading] = useState(false);
  const [hasUnsavedSignature, setHasUnsavedSignature] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // High-DPI scaling
    const ratio = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * ratio;
    canvas.height = rect.height * ratio;
    canvas.style.width = `${rect.width}px`;
    canvas.style.height = `${rect.height}px`;
    ctx.scale(ratio, ratio);

    // Stroke styling with round line caps for smooth dots
    ctx.strokeStyle = "#000";
    ctx.lineWidth = 2;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.fillStyle = "#fff";
    ctx.fillRect(0, 0, rect.width, rect.height);
  }, []);

  const getEventPos = (e: React.MouseEvent | React.TouchEvent) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };

    const rect = canvas.getBoundingClientRect();
    const x =
      "touches" in e
        ? e.touches[0].clientX - rect.left
        : (e as React.MouseEvent).clientX - rect.left;
    const y =
      "touches" in e
        ? e.touches[0].clientY - rect.top
        : (e as React.MouseEvent).clientY - rect.top;

    return { x, y };
  };

  const startDrawing = (e: React.MouseEvent | React.TouchEvent) => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;

    setIsDrawing(true);
    const { x, y } = getEventPos(e);
    ctx.beginPath();
    ctx.moveTo(x, y);
  };

  const draw = (e: React.MouseEvent | React.TouchEvent) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;

    const { x, y } = getEventPos(e);
    ctx.lineTo(x, y);
    ctx.stroke();
  };

  const stopDrawing = () => {
    if (!isDrawing) return;
    setIsDrawing(false);
    setHasUnsavedSignature(true);
  };

  const handleDoneDrawing = async () => {
    const canvas = canvasRef.current;
    if (!canvas || !hasUnsavedSignature) return;

    canvas.toBlob(async (blob) => {
      if (blob) {
        await uploadSignatureToApi(blob);
        setHasUnsavedSignature(false);
      }
    }, "image/png");
  };

  const uploadSignatureToApi = async (blob: Blob) => {
    setIsUploading(true);
    try {
      const file = new File([blob], "signature.png", { type: "image/png" });
      const signatureUrl = await uploadToDriveApi(file);
      onSignatureChange(signatureUrl);
      toast.success("Signature saved successfully!");
    } catch (error: any) {
      console.error("Signature upload failed:", error);
      toast.error("Failed to save signature. Please try again.");
    } finally {
      setIsUploading(false);
    }
  };

  const clearSignature = () => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (canvas && ctx) {
      const rect = canvas.getBoundingClientRect();
      ctx.fillStyle = "#fff";
      ctx.fillRect(0, 0, rect.width, rect.height);
      ctx.beginPath();
    }
    setUploadedImage("");
    onSignatureChange("");
    setHasUnsavedSignature(false);
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file?.type.startsWith("image/")) {
      toast.error("Please upload a valid image file");
      return;
    }

    setIsUploading(true);
    try {
      const signatureUrl = await uploadToDriveApi(file);
      const reader = new FileReader();
      reader.onload = (ev) => {
        const img = ev.target?.result as string;
        setUploadedImage(img);
      };
      reader.readAsDataURL(file);
      onSignatureChange(signatureUrl);
      toast.success("Signature uploaded successfully!");
    } catch (error: any) {
      toast.error(error.message || "Failed to upload signature");
    } finally {
      setIsUploading(false);
    }
  };

  const downloadSignature = () => {
    let href = "";
    if (signatureMode === "draw" && canvasRef.current) {
      href = canvasRef.current.toDataURL();
    } else if (signatureMode === "upload" && uploadedImage) {
      href = uploadedImage;
    }

    if (href) {
      const link = document.createElement("a");
      link.download = "signature.png";
      link.href = href;
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex space-x-2">
        <Button
          type="button"
          variant={signatureMode === "draw" ? "default" : "outline"}
          size="sm"
          onClick={() => setSignatureMode("draw")}
          disabled={isUploading}
        >
          <Pen className="w-4 h-4 mr-1" />
          Draw
        </Button>
        <Button
          type="button"
          variant={signatureMode === "upload" ? "default" : "outline"}
          size="sm"
          onClick={() => setSignatureMode("upload")}
          disabled={isUploading}
        >
          <Upload className="w-4 h-4 mr-1" />
          Upload
        </Button>
      </div>

      {signatureMode === "draw" && (
        <div className="space-y-2">
          <div className="relative">
            <canvas
              ref={canvasRef}
              className="border-2 border-gray-300 rounded-md cursor-crosshair bg-white w-full touch-none"
              style={{ height: "150px" }}
              onMouseDown={startDrawing}
              onMouseMove={draw}
              onMouseUp={stopDrawing}
              onMouseLeave={stopDrawing}
              onTouchStart={startDrawing}
              onTouchMove={draw}
              onTouchEnd={stopDrawing}
            />
            {isUploading && (
              <div className="absolute inset-0 bg-white/80 flex items-center justify-center rounded-md">
                <div className="flex items-center space-x-2">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span className="text-sm">Saving signature...</span>
                </div>
              </div>
            )}
          </div>
          <p className="text-sm text-gray-600">Draw your signature above</p>

          {hasUnsavedSignature && (
            <Button
              type="button"
              onClick={handleDoneDrawing}
              disabled={isUploading}
              className="w-full bg-emerald-600 hover:bg-emerald-700"
            >
              {isUploading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Check className="w-4 h-4 mr-2" />
                  Done - Save Signature
                </>
              )}
            </Button>
          )}
        </div>
      )}

      {signatureMode === "upload" && (
        <div className="space-y-2">
          <Input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileUpload}
            className="hidden"
            disabled={isUploading}
          />
          <Button
            type="button"
            variant="outline"
            onClick={() => fileInputRef.current?.click()}
            className="w-full flex items-center justify-center"
            disabled={isUploading}
          >
            {isUploading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Uploading...
              </>
            ) : (
              <>
                <Upload className="w-4 h-4 mr-2" />
                Choose Signature Image
              </>
            )}
          </Button>
          {uploadedImage && (
            <div className="border-2 border-gray-300 rounded-md p-2 bg-white">
              <img
                src={uploadedImage || "/placeholder.svg"}
                alt="Uploaded signature"
                className="max-h-32 mx-auto"
              />
            </div>
          )}
        </div>
      )}

      <div className="flex space-x-2">
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={clearSignature}
          disabled={isUploading}
        >
          <Trash2 className="w-4 h-4 mr-1" />
          Clear
        </Button>
        {(value || uploadedImage) && (
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={downloadSignature}
            disabled={isUploading}
          >
            <Download className="w-4 h-4 mr-1" />
            Download
          </Button>
        )}
      </div>

      {error && <p className="text-red-500 text-sm">{error}</p>}
    </div>
  );
}
