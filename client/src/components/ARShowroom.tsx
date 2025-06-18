import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Camera, RotateCcw, Move3D, Maximize2, Download, Share2, Eye, X } from "lucide-react";
import type { Product } from "@shared/schema";

interface ARShowroomProps {
  product?: Product;
  isOpen: boolean;
  onClose: () => void;
}

const sampleRooms = [
  {
    id: "living-room",
    name: "Modern Living Room",
    image: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
    description: "Spacious living area with natural light"
  },
  {
    id: "bedroom",
    name: "Master Bedroom",
    image: "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
    description: "Cozy bedroom with warm tones"
  },
  {
    id: "dining",
    name: "Dining Area",
    image: "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
    description: "Elegant dining space"
  },
  {
    id: "office",
    name: "Home Office",
    image: "https://images.unsplash.com/photo-1587825140708-dfaf72ae4b04?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
    description: "Productive workspace"
  }
];

export default function ARShowroom({ product, isOpen, onClose }: ARShowroomProps) {
  const [selectedRoom, setSelectedRoom] = useState(sampleRooms[0]);
  const [isARMode, setIsARMode] = useState(false);
  const [productPosition, setProductPosition] = useState({ x: 50, y: 50 });
  const [productScale, setProductScale] = useState(1);
  const [productRotation, setProductRotation] = useState(0);
  const [showControls, setShowControls] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  const startCamera = async () => {
    setIsLoading(true);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: 'environment' } 
      });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
        setIsARMode(true);
      }
    } catch (error) {
      console.error("Camera access denied:", error);
      // Fallback to room selection mode
      setIsARMode(false);
    }
    setIsLoading(false);
  };

  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const tracks = (videoRef.current.srcObject as MediaStream).getTracks();
      tracks.forEach(track => track.stop());
      videoRef.current.srcObject = null;
    }
    setIsARMode(false);
  };

  const resetProductPosition = () => {
    setProductPosition({ x: 50, y: 50 });
    setProductScale(1);
    setProductRotation(0);
  };

  const handleProductDrag = (e: React.MouseEvent) => {
    if (!isARMode) {
      const rect = e.currentTarget.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 100;
      const y = ((e.clientY - rect.top) / rect.height) * 100;
      setProductPosition({ x: Math.max(5, Math.min(95, x)), y: Math.max(5, Math.min(95, y)) });
    }
  };

  const captureSnapshot = () => {
    // Simulate snapshot capture
    const link = document.createElement('a');
    link.download = `${product?.name || 'furniture'}-preview.png`;
    link.href = selectedRoom.image; // In real implementation, this would be the canvas capture
    link.click();
  };

  const sharePreview = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `${product?.name} in ${selectedRoom.name}`,
          text: `Check out how this ${product?.name} looks in a ${selectedRoom.name}!`,
          url: window.location.href
        });
      } catch (error) {
        console.log('Share cancelled or failed');
      }
    } else {
      // Fallback: copy link to clipboard
      navigator.clipboard.writeText(window.location.href);
    }
  };

  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, []);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl max-w-6xl w-full max-h-[90vh] overflow-hidden">
        <div className="flex justify-between items-center p-6 border-b">
          <div>
            <h2 className="text-2xl font-bold">Virtual Showroom</h2>
            {product && (
              <p className="text-lumier-gray">Visualizing: {product.name}</p>
            )}
          </div>
          <Button variant="ghost" onClick={onClose}>
            <X className="h-6 w-6" />
          </Button>
        </div>

        <div className="grid lg:grid-cols-4 h-[600px]">
          {/* Room Selection Sidebar */}
          <div className="lg:col-span-1 border-r p-4 overflow-y-auto">
            <h3 className="font-semibold mb-4">Choose Environment</h3>
            
            <div className="space-y-3 mb-6">
              {sampleRooms.map((room) => (
                <div
                  key={room.id}
                  className={`cursor-pointer rounded-lg border-2 overflow-hidden transition-all ${
                    selectedRoom.id === room.id ? 'border-lumier-gold' : 'border-gray-200 hover:border-gray-300'
                  }`}
                  onClick={() => setSelectedRoom(room)}
                >
                  <img 
                    src={room.image} 
                    alt={room.name}
                    className="w-full h-20 object-cover"
                  />
                  <div className="p-2">
                    <h4 className="font-medium text-sm">{room.name}</h4>
                    <p className="text-xs text-lumier-gray">{room.description}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="space-y-3">
              <Button 
                className="w-full" 
                variant={isARMode ? "destructive" : "default"}
                onClick={isARMode ? stopCamera : startCamera}
                disabled={isLoading}
              >
                <Camera className="h-4 w-4 mr-2" />
                {isLoading ? "Loading..." : isARMode ? "Stop AR" : "Use Your Camera"}
              </Button>

              {product && (
                <div className="text-xs text-lumier-gray space-y-1">
                  <p><strong>Dimensions:</strong> {product.dimensions}</p>
                  <p><strong>Material:</strong> {product.material}</p>
                  <p><strong>Weight:</strong> {product.weight}</p>
                </div>
              )}
            </div>
          </div>

          {/* Main Visualization Area */}
          <div className="lg:col-span-3 relative">
            <div className="relative w-full h-full overflow-hidden">
              {isARMode ? (
                <video
                  ref={videoRef}
                  className="w-full h-full object-cover"
                  autoPlay
                  playsInline
                  muted
                />
              ) : (
                <img
                  src={selectedRoom.image}
                  alt={selectedRoom.name}
                  className="w-full h-full object-cover cursor-crosshair"
                  onClick={handleProductDrag}
                />
              )}

              {/* Virtual Product Overlay */}
              {product && (
                <div
                  className="absolute transition-all duration-300 ease-out cursor-move"
                  style={{
                    left: `${productPosition.x}%`,
                    top: `${productPosition.y}%`,
                    transform: `translate(-50%, -50%) scale(${productScale}) rotate(${productRotation}deg)`,
                    maxWidth: '200px',
                    filter: isARMode ? 'drop-shadow(0 4px 8px rgba(0,0,0,0.3))' : 'none'
                  }}
                  onClick={(e) => e.stopPropagation()}
                >
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-auto rounded-lg"
                    style={{ 
                      opacity: isARMode ? 0.9 : 0.95,
                      border: isARMode ? '2px solid rgba(212, 175, 55, 0.8)' : 'none'
                    }}
                  />
                  <Badge 
                    className="absolute -top-2 -right-2 bg-lumier-gold text-lumier-black text-xs"
                  >
                    ₦{product.price.toLocaleString()}
                  </Badge>
                </div>
              )}

              {/* Controls Overlay */}
              {showControls && (
                <div className="absolute top-4 right-4 space-y-2">
                  <div className="bg-white/90 backdrop-blur rounded-lg p-3 space-y-2">
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline" onClick={resetProductPosition}>
                        <RotateCcw className="h-4 w-4" />
                      </Button>
                      <Button size="sm" variant="outline" onClick={captureSnapshot}>
                        <Download className="h-4 w-4" />
                      </Button>
                      <Button size="sm" variant="outline" onClick={sharePreview}>
                        <Share2 className="h-4 w-4" />
                      </Button>
                    </div>
                    
                    <div className="space-y-2 text-xs">
                      <div>
                        <label className="block font-medium mb-1">Size</label>
                        <input
                          type="range"
                          min="0.5"
                          max="2"
                          step="0.1"
                          value={productScale}
                          onChange={(e) => setProductScale(parseFloat(e.target.value))}
                          className="w-full"
                        />
                      </div>
                      
                      <div>
                        <label className="block font-medium mb-1">Rotation</label>
                        <input
                          type="range"
                          min="0"
                          max="360"
                          step="15"
                          value={productRotation}
                          onChange={(e) => setProductRotation(parseInt(e.target.value))}
                          className="w-full"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Toggle Controls Button */}
              <Button
                className="absolute bottom-4 right-4"
                size="sm"
                variant="outline"
                onClick={() => setShowControls(!showControls)}
              >
                <Eye className="h-4 w-4" />
              </Button>

              {/* Instructions */}
              <div className="absolute bottom-4 left-4 bg-black/70 text-white rounded-lg p-3 max-w-xs">
                <p className="text-sm">
                  {isARMode 
                    ? "Move your camera to position the furniture in your space"
                    : "Click on the room image to position the furniture"
                  }
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="p-6 border-t bg-gray-50 flex justify-between items-center">
          <div className="text-sm text-lumier-gray">
            {isARMode ? "AR Mode Active" : `Viewing in ${selectedRoom.name}`}
          </div>
          <div className="flex gap-3">
            <Button variant="outline" onClick={onClose}>
              Close Preview
            </Button>
            {product && (
              <Button className="bg-lumier-gold text-lumier-black hover:bg-lumier-gold/90">
                Add to Cart
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}