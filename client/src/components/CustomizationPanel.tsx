import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Palette, Layers, Ruler, Eye, RotateCcw, Info } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import type { Product } from "@shared/schema";

interface CustomizationPanelProps {
  product: Product;
  onCustomizationChange: (customization: CustomizationOptions) => void;
  availableFor?: 'purchase' | 'subscription' | 'both';
}

interface CustomizationOptions {
  fabric?: string;
  color: string;
  finish?: string;
  layout?: string;
  dimensions?: {
    width: number;
    height: number;
    depth: number;
  };
}

const fabricOptions = [
  { id: 'linen', name: 'Premium Linen', price: 5000, image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&h=100' },
  { id: 'velvet', name: 'Luxury Velvet', price: 8000, image: 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&h=100' },
  { id: 'leather', name: 'Genuine Leather', price: 12000, image: 'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&h=100' },
  { id: 'cotton', name: 'Organic Cotton', price: 3000, image: 'https://images.unsplash.com/photo-1587825140708-dfaf72ae4b04?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&h=100' }
];

const finishOptions = [
  { id: 'natural', name: 'Natural Wood', price: 0 },
  { id: 'walnut', name: 'Walnut Stain', price: 2000 },
  { id: 'oak', name: 'Oak Finish', price: 1500 },
  { id: 'mahogany', name: 'Mahogany', price: 3000 },
  { id: 'white', name: 'White Paint', price: 1000 },
  { id: 'black', name: 'Black Paint', price: 1000 }
];

const layoutOptions = [
  { id: 'standard', name: 'Standard Layout', description: 'Classic arrangement' },
  { id: 'sectional', name: 'Sectional', description: 'L-shaped configuration' },
  { id: 'modular', name: 'Modular', description: 'Flexible components' },
  { id: 'compact', name: 'Compact', description: 'Space-saving design' }
];

export default function CustomizationPanel({ product, onCustomizationChange, availableFor = 'both' }: CustomizationPanelProps) {
  const [customization, setCustomization] = useState<CustomizationOptions>({
    color: product.colors[0] || '#9CA3AF',
    fabric: 'linen',
    finish: 'natural',
    layout: 'standard',
    dimensions: {
      width: 200,
      height: 80,
      depth: 90
    }
  });

  const [previewImage, setPreviewImage] = useState(product.image);
  const [totalPrice, setTotalPrice] = useState(product.price);

  useEffect(() => {
    // Calculate total price with customizations
    let price = product.price;
    
    if (customization.fabric) {
      const fabric = fabricOptions.find(f => f.id === customization.fabric);
      if (fabric) price += fabric.price;
    }
    
    if (customization.finish) {
      const finish = finishOptions.find(f => f.id === customization.finish);
      if (finish) price += finish.price;
    }
    
    setTotalPrice(price);
    onCustomizationChange(customization);
  }, [customization, product.price, onCustomizationChange]);

  const updateCustomization = (key: keyof CustomizationOptions, value: any) => {
    setCustomization(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const resetCustomization = () => {
    setCustomization({
      color: product.colors[0] || '#9CA3AF',
      fabric: 'linen',
      finish: 'natural',
      layout: 'standard',
      dimensions: {
        width: 200,
        height: 80,
        depth: 90
      }
    });
  };

  const getDimensionPresets = () => {
    const category = product.category.toLowerCase();
    switch (category) {
      case 'living room':
        return [
          { name: 'Compact', width: 180, height: 75, depth: 85 },
          { name: 'Standard', width: 200, height: 80, depth: 90 },
          { name: 'Large', width: 220, height: 85, depth: 95 }
        ];
      case 'dining room':
        return [
          { name: '4-Seater', width: 120, height: 75, depth: 80 },
          { name: '6-Seater', width: 160, height: 75, depth: 90 },
          { name: '8-Seater', width: 200, height: 75, depth: 100 }
        ];
      default:
        return [
          { name: 'Small', width: 150, height: 70, depth: 75 },
          { name: 'Medium', width: 180, height: 80, depth: 85 },
          { name: 'Large', width: 210, height: 90, depth: 95 }
        ];
    }
  };

  return (
    <TooltipProvider>
      <Card className="w-full">
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle className="flex items-center gap-2">
              <Palette className="h-5 w-5" />
              Customize Your {product.name}
            </CardTitle>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="outline" size="sm" onClick={resetCustomization}>
                  <RotateCcw className="h-4 w-4 mr-2" />
                  Reset
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Reset all customizations to default</p>
              </TooltipContent>
            </Tooltip>
          </div>
          {availableFor !== 'both' && (
            <Badge variant="outline" className="w-fit">
              Available for {availableFor}
            </Badge>
          )}
        </CardHeader>

      <CardContent>
        <Tabs defaultValue="colors" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="colors">Colors</TabsTrigger>
            <TabsTrigger value="materials">Materials</TabsTrigger>
            <TabsTrigger value="dimensions">Size</TabsTrigger>
            <TabsTrigger value="preview">Preview</TabsTrigger>
          </TabsList>

          <TabsContent value="colors" className="space-y-4">
            <div>
              <Label className="text-base font-semibold mb-3 block">Choose Color</Label>
              <div className="grid grid-cols-6 gap-3">
                {product.colors.map((color) => (
                  <button
                    key={color}
                    className={`w-12 h-12 rounded-lg border-2 transition-all ${
                      customization.color === color 
                        ? 'border-lumiere-gold scale-110 shadow-lg' 
                        : 'border-gray-300 hover:border-gray-400'
                    }`}
                    style={{ backgroundColor: color }}
                    onClick={() => updateCustomization('color', color)}
                    title={color}
                  />
                ))}
              </div>
              <p className="text-sm text-lumiere-gray mt-2">
                Selected: {customization.color}
              </p>
            </div>

            {product.category.toLowerCase().includes('living') && (
              <div>
                <Label className="text-base font-semibold mb-3 block">Layout Options</Label>
                <div className="grid grid-cols-2 gap-3">
                  {layoutOptions.map((layout) => (
                    <button
                      key={layout.id}
                      className={`p-3 rounded-lg border-2 text-left transition-all ${
                        customization.layout === layout.id
                          ? 'border-lumiere-gold bg-lumiere-gold/10'
                          : 'border-gray-300 hover:border-gray-400'
                      }`}
                      onClick={() => updateCustomization('layout', layout.id)}
                    >
                      <div className="font-medium">{layout.name}</div>
                      <div className="text-sm text-lumiere-gray">{layout.description}</div>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </TabsContent>

          <TabsContent value="materials" className="space-y-4">
            <div>
              <Label className="text-base font-semibold mb-3 block">Fabric Options</Label>
              <div className="grid grid-cols-2 gap-3">
                {fabricOptions.map((fabric) => (
                  <button
                    key={fabric.id}
                    className={`p-3 rounded-lg border-2 transition-all ${
                      customization.fabric === fabric.id
                        ? 'border-lumiere-gold bg-lumiere-gold/10'
                        : 'border-gray-300 hover:border-gray-400'
                    }`}
                    onClick={() => updateCustomization('fabric', fabric.id)}
                  >
                    <img
                      src={fabric.image}
                      alt={fabric.name}
                      className="w-full h-16 object-cover rounded mb-2"
                    />
                    <div className="font-medium text-sm">{fabric.name}</div>
                    <div className="text-sm text-lumiere-gray">
                      +₦{fabric.price.toLocaleString()}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <Label className="text-base font-semibold mb-3 block">Wood Finish</Label>
              <div className="grid grid-cols-3 gap-2">
                {finishOptions.map((finish) => (
                  <button
                    key={finish.id}
                    className={`p-2 rounded border-2 text-sm transition-all ${
                      customization.finish === finish.id
                        ? 'border-lumiere-gold bg-lumiere-gold/10'
                        : 'border-gray-300 hover:border-gray-400'
                    }`}
                    onClick={() => updateCustomization('finish', finish.id)}
                  >
                    <div className="font-medium">{finish.name}</div>
                    <div className="text-xs text-lumiere-gray">
                      {finish.price === 0 ? 'Included' : `+₦${finish.price.toLocaleString()}`}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="dimensions" className="space-y-4">
            <div>
              <Label className="text-base font-semibold mb-3 block">Size Presets</Label>
              <div className="grid grid-cols-3 gap-3 mb-4">
                {getDimensionPresets().map((preset) => (
                  <button
                    key={preset.name}
                    className="p-3 rounded-lg border-2 border-gray-300 hover:border-gray-400 transition-all"
                    onClick={() => updateCustomization('dimensions', {
                      width: preset.width,
                      height: preset.height,
                      depth: preset.depth
                    })}
                  >
                    <div className="font-medium text-sm">{preset.name}</div>
                    <div className="text-xs text-lumiere-gray">
                      {preset.width} × {preset.depth} × {preset.height}cm
                    </div>
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-3">
              <Label className="text-base font-semibold block">Custom Dimensions</Label>
              
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <Label className="text-sm font-medium">Width (cm)</Label>
                  <input
                    type="number"
                    min="100"
                    max="300"
                    value={customization.dimensions?.width || 200}
                    onChange={(e) => updateCustomization('dimensions', {
                      ...customization.dimensions,
                      width: parseInt(e.target.value) || 200
                    })}
                    className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-lumiere-gold"
                  />
                </div>
                
                <div>
                  <Label className="text-sm font-medium">Height (cm)</Label>
                  <input
                    type="number"
                    min="50"
                    max="120"
                    value={customization.dimensions?.height || 80}
                    onChange={(e) => updateCustomization('dimensions', {
                      ...customization.dimensions,
                      height: parseInt(e.target.value) || 80
                    })}
                    className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-lumiere-gold"
                  />
                </div>
                
                <div>
                  <Label className="text-sm font-medium">Depth (cm)</Label>
                  <input
                    type="number"
                    min="60"
                    max="120"
                    value={customization.dimensions?.depth || 90}
                    onChange={(e) => updateCustomization('dimensions', {
                      ...customization.dimensions,
                      depth: parseInt(e.target.value) || 90
                    })}
                    className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-lumiere-gold"
                  />
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="preview" className="space-y-4">
            <div className="text-center">
              <div className="relative inline-block">
                <img
                  src={product.image}
                  alt={`${product.name} preview`}
                  className="w-full max-w-md h-64 object-cover rounded-lg shadow-lg"
                  style={{
                    filter: `hue-rotate(${customization.color === '#9CA3AF' ? '0' : '45'}deg) contrast(1.1)`
                  }}
                />
                <div className="absolute top-2 right-2 bg-white/90 backdrop-blur rounded px-2 py-1 text-xs">
                  {customization.dimensions?.width} × {customization.dimensions?.depth} × {customization.dimensions?.height}cm
                </div>
              </div>
            </div>

            <div className="bg-gray-50 rounded-lg p-4">
              <h4 className="font-semibold mb-3">Customization Summary</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Base Price:</span>
                  <span>₦{product.price.toLocaleString()}</span>
                </div>
                {customization.fabric && (
                  <div className="flex justify-between">
                    <span>{fabricOptions.find(f => f.id === customization.fabric)?.name}:</span>
                    <span>+₦{fabricOptions.find(f => f.id === customization.fabric)?.price.toLocaleString()}</span>
                  </div>
                )}
                {customization.finish && (() => {
                  const finishOption = finishOptions.find(f => f.id === customization.finish);
                  return finishOption?.price && finishOption.price > 0;
                })() && (
                  <div className="flex justify-between">
                    <span>{finishOptions.find(f => f.id === customization.finish)?.name}:</span>
                    <span>+₦{finishOptions.find(f => f.id === customization.finish)!.price.toLocaleString()}</span>
                  </div>
                )}
                <hr />
                <div className="flex justify-between font-semibold">
                  <span>Total Price:</span>
                  <span>₦{totalPrice.toLocaleString()}</span>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
      </Card>
    </TooltipProvider>
  );
}