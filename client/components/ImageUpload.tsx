import { useState, useRef, useCallback } from "react";
import Webcam from "react-webcam";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Camera, Upload, X, RotateCcw } from "lucide-react";
import { cn } from "@/lib/utils";

interface ImageUploadProps {
  onImageCapture: (imageData: string) => void;
  isAnalyzing?: boolean;
}

export function ImageUpload({
  onImageCapture,
  isAnalyzing = false,
}: ImageUploadProps) {
  const [showCamera, setShowCamera] = useState(false);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const webcamRef = useRef<Webcam>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const capture = useCallback(() => {
    const imageSrc = webcamRef.current?.getScreenshot();
    if (imageSrc) {
      setCapturedImage(imageSrc);
      setShowCamera(false);
    }
  }, []);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        setCapturedImage(result);
      };
      reader.readAsDataURL(file);
    }
  };

  const analyzeImage = () => {
    if (capturedImage) {
      onImageCapture(capturedImage);
    }
  };

  const reset = () => {
    setCapturedImage(null);
    setShowCamera(false);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  if (showCamera) {
    return (
      <Card className="w-full max-w-md mx-auto">
        <CardContent className="p-6">
          <div className="space-y-4">
            <div className="relative rounded-lg overflow-hidden">
              <Webcam
                ref={webcamRef}
                audio={false}
                screenshotFormat="image/jpeg"
                className="w-full"
                videoConstraints={{
                  facingMode: "environment",
                }}
              />
            </div>
            <div className="flex gap-2">
              <Button onClick={capture} className="flex-1">
                <Camera className="w-4 h-4 mr-2" />
                Capture
              </Button>
              <Button variant="outline" onClick={() => setShowCamera(false)}>
                <X className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardContent className="p-6">
        <div className="space-y-4">
          {capturedImage ? (
            <>
              <div className="relative">
                <img
                  src={capturedImage}
                  alt="Captured clothing"
                  className="w-full rounded-lg"
                />
                <Button
                  variant="outline"
                  size="sm"
                  className="absolute top-2 right-2"
                  onClick={reset}
                  disabled={isAnalyzing}
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
              <Button
                onClick={analyzeImage}
                className="w-full"
                disabled={isAnalyzing}
              >
                {isAnalyzing ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                    Analyzing...
                  </>
                ) : (
                  "Analyze Clothing"
                )}
              </Button>
            </>
          ) : (
            <>
              <div className="text-center space-y-4">
                <div className="w-24 h-24 mx-auto bg-eco-100 rounded-full flex items-center justify-center">
                  <Camera className="w-12 h-12 text-eco-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg">
                    Upload Your Clothing
                  </h3>
                  <p className="text-muted-foreground text-sm">
                    Take a photo or upload an image to analyze carbon footprint
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <Button
                  variant="outline"
                  onClick={() => setShowCamera(true)}
                  className="flex flex-col gap-2 h-auto py-4"
                >
                  <Camera className="w-6 h-6" />
                  Take Photo
                </Button>

                <Button
                  variant="outline"
                  onClick={() => fileInputRef.current?.click()}
                  className="flex flex-col gap-2 h-auto py-4"
                >
                  <Upload className="w-6 h-6" />
                  Upload File
                </Button>
              </div>

              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileUpload}
                className="hidden"
              />
            </>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
