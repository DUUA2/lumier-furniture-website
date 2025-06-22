import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Palette, RotateCcw } from "lucide-react";
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

export default function CustomizationPanel({ product, onCustomizationChange, availableFor = 'both' }: CustomizationPanelProps) {
  // Get customization configuration from product
  const customizationConfig = product.customizationOptions || {};
  const hasAnyCustomization = Object.values(customizationConfig).some(option => option?.enabled);

  // Early return if no customization is enabled
  if (!hasAnyCustomization) {
    return null;
  }

  const [customization, setCustomization] = useState<CustomizationOptions>({
    color: customizationConfig.color?.options?.[0] || product.colors[0] || '#9CA3AF',
    fabric: customizationConfig.fabric?.options?.[0] || undefined,
    finish: customizationConfig.finish?.options?.[0] || undefined,
    layout: customizationConfig.layout?.options?.[0] || undefined,
    dimensions: customizationConfig.dimensions?.enabled ? {
      width: 200,
      height: 80,
      depth: 90
    } : undefined
  });

  useEffect(() => {
    onCustomizationChange(customization);
  }, [customization, onCustomizationChange]);

  const updateCustomization = (key: keyof CustomizationOptions, value: any) => {
    setCustomization(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const resetCustomization = () => {
    setCustomization({
      color: customizationConfig.color?.options?.[0] || product.colors[0] || '#9CA3AF',
      fabric: customizationConfig.fabric?.options?.[0] || undefined,
      finish: customizationConfig.finish?.options?.[0] || undefined,
      layout: customizationConfig.layout?.options?.[0] || undefined,
      dimensions: customizationConfig.dimensions?.enabled ? {
        width: 200,
        height: 80,
        depth: 90
      } : undefined
    });
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
        </CardHeader>

        <CardContent>
          <div className="space-y-6">
            {/* Color Customization */}
            {customizationConfig.color?.enabled && (
              <div>
                <Label className="text-base font-semibold mb-3 block">Choose Color</Label>
                <div className="grid grid-cols-6 gap-3">
                  {customizationConfig.color.options.map((color) => (
                    <button
                      key={color}
                      className={`w-12 h-12 rounded-lg border-2 transition-all ${
                        customization.color === color 
                          ? 'border-lumiere-gold scale-110 shadow-lg' 
                          : 'border-gray-300 hover:border-gray-400'
                      }`}
                      style={{ backgroundColor: color.toLowerCase() }}
                      onClick={() => updateCustomization('color', color)}
                      title={color}
                    />
                  ))}
                </div>
                <p className="text-sm text-lumiere-gray mt-2">
                  Selected: {customization.color}
                </p>
              </div>
            )}

            {/* Fabric Customization */}
            {customizationConfig.fabric?.enabled && (
              <div>
                <Label className="text-base font-semibold mb-3 block">Choose Fabric</Label>
                <div className="grid grid-cols-2 gap-3">
                  {customizationConfig.fabric.options.map((fabric) => (
                    <button
                      key={fabric}
                      className={`p-3 rounded-lg border-2 text-left transition-all ${
                        customization.fabric === fabric 
                          ? 'border-lumiere-gold bg-lumiere-gold/10' 
                          : 'border-gray-300 hover:border-gray-400'
                      }`}
                      onClick={() => updateCustomization('fabric', fabric)}
                    >
                      <div className="font-medium">{fabric}</div>
                    </button>
                  ))}
                </div>
                <p className="text-sm text-lumiere-gray mt-2">
                  Selected: {customization.fabric}
                </p>
              </div>
            )}

            {/* Finish Customization */}
            {customizationConfig.finish?.enabled && (
              <div>
                <Label className="text-base font-semibold mb-3 block">Choose Finish</Label>
                <div className="grid grid-cols-2 gap-3">
                  {customizationConfig.finish.options.map((finish) => (
                    <button
                      key={finish}
                      className={`p-3 rounded-lg border-2 text-left transition-all ${
                        customization.finish === finish 
                          ? 'border-lumiere-gold bg-lumiere-gold/10' 
                          : 'border-gray-300 hover:border-gray-400'
                      }`}
                      onClick={() => updateCustomization('finish', finish)}
                    >
                      <div className="font-medium">{finish}</div>
                    </button>
                  ))}
                </div>
                <p className="text-sm text-lumiere-gray mt-2">
                  Selected: {customization.finish}
                </p>
              </div>
            )}

            {/* Layout Customization */}
            {customizationConfig.layout?.enabled && (
              <div>
                <Label className="text-base font-semibold mb-3 block">Choose Layout</Label>
                <div className="grid grid-cols-2 gap-3">
                  {customizationConfig.layout.options.map((layout) => (
                    <button
                      key={layout}
                      className={`p-3 rounded-lg border-2 text-left transition-all ${
                        customization.layout === layout 
                          ? 'border-lumiere-gold bg-lumiere-gold/10' 
                          : 'border-gray-300 hover:border-gray-400'
                      }`}
                      onClick={() => updateCustomization('layout', layout)}
                    >
                      <div className="font-medium">{layout}</div>
                    </button>
                  ))}
                </div>
                <p className="text-sm text-lumiere-gray mt-2">
                  Selected: {customization.layout}
                </p>
              </div>
            )}

            {/* Dimensions Customization */}
            {customizationConfig.dimensions?.enabled && (
              <div>
                <Label className="text-base font-semibold mb-3 block">Custom Dimensions</Label>
                {customizationConfig.dimensions.allowCustom ? (
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <Label htmlFor="width" className="text-sm">Width (cm)</Label>
                      <input
                        id="width"
                        type="number"
                        value={customization.dimensions?.width || 200}
                        onChange={(e) => updateCustomization('dimensions', {
                          ...customization.dimensions,
                          width: parseInt(e.target.value) || 200
                        })}
                        className="w-full mt-1 p-2 border rounded"
                      />
                    </div>
                    <div>
                      <Label htmlFor="height" className="text-sm">Height (cm)</Label>
                      <input
                        id="height"
                        type="number"
                        value={customization.dimensions?.height || 80}
                        onChange={(e) => updateCustomization('dimensions', {
                          ...customization.dimensions,
                          height: parseInt(e.target.value) || 80
                        })}
                        className="w-full mt-1 p-2 border rounded"
                      />
                    </div>
                    <div>
                      <Label htmlFor="depth" className="text-sm">Depth (cm)</Label>
                      <input
                        id="depth"
                        type="number"
                        value={customization.dimensions?.depth || 90}
                        onChange={(e) => updateCustomization('dimensions', {
                          ...customization.dimensions,
                          depth: parseInt(e.target.value) || 90
                        })}
                        className="w-full mt-1 p-2 border rounded"
                      />
                    </div>
                  </div>
                ) : (
                  <p className="text-sm text-lumiere-gray">Custom dimensions not available for this product</p>
                )}
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </TooltipProvider>
  );
}