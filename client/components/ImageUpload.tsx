import { useState, useRef, useCallback } from "react";
import Webcam from "react-webcam";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Camera,
  Upload,
  X,
  RotateCcw,
  Sparkles,
  Zap,
  Brain,
  Scan,
  Eye,
} from "lucide-react";
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
      <Card className="w-full max-w-md mx-auto shadow-2xl border-2 border-eco-200 animate-in zoom-in-95 duration-500">
        <CardContent className="p-6">
          <div className="space-y-6">
            <div className="relative rounded-xl overflow-hidden shadow-lg">
              <Webcam
                ref={webcamRef}
                audio={false}
                screenshotFormat="image/jpeg"
                className="w-full"
                videoConstraints={{
                  facingMode: "environment",
                }}
              />
              {/* Camera overlay */}
              <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-4 left-4 right-4 bottom-4 border-2 border-white/50 rounded-lg" />
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                  <div className="w-4 h-4 border-2 border-white rounded-full animate-pulse" />
                </div>
              </div>
            </div>
            <div className="flex gap-3">
              <Button
                onClick={capture}
                className="flex-1 bg-gradient-to-r from-eco-500 to-eco-600 hover:from-eco-600 hover:to-eco-700 shadow-lg hover:shadow-xl transition-all duration-300"
                size="lg"
              >
                <Camera className="w-5 h-5 mr-2" />
                Capture Photo
              </Button>
              <Button
                variant="outline"
                onClick={() => setShowCamera(false)}
                size="lg"
                className="hover:bg-red-50 hover:border-red-200 hover:text-red-600 transition-colors"
              >
                <X className="w-5 h-5" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-md mx-auto shadow-2xl border-2 border-eco-200 dark:border-eco-700 bg-gradient-to-br from-white to-eco-50/30 dark:from-gray-900 dark:to-eco-900/20 backdrop-blur-sm">
      <CardContent className="p-8">
        <div className="space-y-6">
          {capturedImage ? (
            <div className="animate-in zoom-in-95 duration-500">
              <div className="relative group">
                <img
                  src={capturedImage}
                  alt="Captured clothing"
                  className="w-full rounded-xl shadow-lg transition-all duration-300 group-hover:shadow-2xl"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                {/* AI Analysis overlay when analyzing */}
                {isAnalyzing && (
                  <div className="absolute inset-0 bg-blue-600/10 rounded-xl flex items-center justify-center">
                    <div className="text-center text-white">
                      <div className="relative">
                        <div className="w-20 h-20 border-4 border-blue-400/30 rounded-full animate-pulse mb-4 mx-auto" />
                        <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-20 h-20 border-t-4 border-blue-400 rounded-full animate-spin" />
                        <Brain className="absolute top-6 left-1/2 transform -translate-x-1/2 w-8 h-8 text-blue-400 animate-pulse" />
                      </div>
                      <p className="text-sm font-semibold bg-black/50 px-3 py-1 rounded-full backdrop-blur-sm">
                        AI Scanning...
                      </p>
                    </div>
                  </div>
                )}

                <Button
                  variant="outline"
                  size="sm"
                  className="absolute top-3 right-3 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm hover:bg-white dark:hover:bg-gray-800 shadow-lg transition-all duration-300"
                  onClick={reset}
                  disabled={isAnalyzing}
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
              <Button
                onClick={analyzeImage}
                className="w-full mt-6 bg-gradient-to-r from-blue-600 via-eco-500 to-purple-600 hover:from-blue-700 hover:via-eco-600 hover:to-purple-700 shadow-lg hover:shadow-xl hover:shadow-blue-500/30 transition-all duration-300 text-white"
                size="lg"
                disabled={isAnalyzing}
              >
                {isAnalyzing ? (
                  <div className="flex items-center gap-3">
                    <div className="flex gap-1">
                      <div
                        className="w-2 h-2 bg-white rounded-full animate-bounce"
                        style={{ animationDelay: "0ms" }}
                      />
                      <div
                        className="w-2 h-2 bg-white rounded-full animate-bounce"
                        style={{ animationDelay: "150ms" }}
                      />
                      <div
                        className="w-2 h-2 bg-white rounded-full animate-bounce"
                        style={{ animationDelay: "300ms" }}
                      />
                    </div>
                    <span>AI is analyzing your clothing...</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-3">
                    <Brain className="w-5 h-5" />
                    <span>Start AI Analysis</span>
                    <Zap className="w-4 h-4 animate-pulse" />
                  </div>
                )}
              </Button>
            </div>
          ) : (
            <div className="animate-in fade-in-50 duration-500">
              <div className="text-center space-y-6 mb-8">
                <div className="relative group">
                  <div className="w-32 h-32 mx-auto bg-gradient-to-br from-blue-100 via-eco-100 to-purple-100 dark:from-blue-900/50 dark:via-eco-900/50 dark:to-purple-900/50 rounded-full flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-105 border-2 border-blue-200/50 dark:border-blue-700/50">
                    <div className="relative">
                      <Camera className="w-16 h-16 text-eco-600 dark:text-eco-400 group-hover:scale-110 transition-transform duration-300" />
                      <div className="absolute -top-2 -right-2 w-6 h-6 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center animate-pulse">
                        <Eye className="w-3 h-3 text-white" />
                      </div>
                    </div>
                  </div>
                  <div className="absolute -top-2 -right-2 w-10 h-10 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center animate-bounce">
                    <Brain className="w-5 h-5 text-white" />
                  </div>
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-eco-800 dark:text-eco-200 mb-2">
                    AI-Powered Clothing Analysis
                  </h3>
                  <p className="text-muted-foreground">
                    Advanced computer vision to instantly identify and analyze
                    your clothing's environmental impact
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <Button
                  variant="outline"
                  onClick={() => setShowCamera(true)}
                  className="flex flex-col gap-3 h-auto py-6 border-2 border-blue-200 dark:border-blue-700 hover:border-blue-400 dark:hover:border-blue-500 hover:bg-blue-50 dark:hover:bg-blue-950/50 transition-all duration-300 hover:scale-105 hover:shadow-lg group"
                >
                  <div className="relative">
                    <Camera className="w-8 h-8 text-blue-600 dark:text-blue-400 group-hover:scale-110 transition-transform duration-300" />
                    <Scan className="absolute -bottom-1 -right-1 w-4 h-4 text-blue-500 dark:text-blue-300 animate-pulse" />
                  </div>
                  <span className="font-semibold">AI Camera</span>
                  <span className="text-xs text-muted-foreground">
                    Real-time analysis
                  </span>
                </Button>

                <Button
                  variant="outline"
                  onClick={() => fileInputRef.current?.click()}
                  className="flex flex-col gap-3 h-auto py-6 border-2 border-eco-200 dark:border-eco-700 hover:border-eco-400 dark:hover:border-eco-500 hover:bg-eco-50 dark:hover:bg-eco-950/50 transition-all duration-300 hover:scale-105 hover:shadow-lg group"
                >
                  <div className="relative">
                    <Upload className="w-8 h-8 text-eco-600 dark:text-eco-400 group-hover:scale-110 transition-transform duration-300" />
                    <Brain className="absolute -bottom-1 -right-1 w-4 h-4 text-eco-500 dark:text-eco-300 animate-pulse" />
                  </div>
                  <span className="font-semibold">Smart Upload</span>
                  <span className="text-xs text-muted-foreground">
                    Instant recognition
                  </span>
                </Button>
              </div>

              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileUpload}
                className="hidden"
              />
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
