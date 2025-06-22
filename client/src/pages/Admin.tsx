import { useState, useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Product } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { queryClient } from "@/lib/queryClient";
import { Plus, Edit, Save, X, Trash2, Eye, EyeOff, Lock, Unlock, Truck, Package } from "lucide-react";

interface ProductFormData {
  name: string;
  description: string;
  price: number;
  category: string;
  image: string;
  images: string[];
  colors: string[];
  dimensions: string;
  material: string;
  weight: string;
  inStock: boolean;
  availableForPreOrder: boolean;
  availableForInstallment: boolean;
  requiresTruckDelivery: boolean;
}

export default function Admin() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [adminPassword, setAdminPassword] = useState("");
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [formData, setFormData] = useState<ProductFormData>({
    name: "",
    description: "",
    price: 0,
    category: "",
    image: "",
    images: [""],
    colors: [],
    dimensions: "",
    material: "",
    weight: "",
    inStock: true,
    availableForPreOrder: false,
    availableForInstallment: true,
    requiresTruckDelivery: false
  });
  const [newColor, setNewColor] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCategory, setFilterCategory] = useState("all");

  const { toast } = useToast();

  // Check if admin is already authenticated
  useEffect(() => {
    const adminAuth = localStorage.getItem('adminAuthenticated');
    if (adminAuth === 'true') {
      setIsAuthenticated(true);
    }
  }, []);

  const handleAdminLogin = () => {
    // Simple password check - in production, use proper authentication
    if (adminPassword === "lumier2024") {
      setIsAuthenticated(true);
      localStorage.setItem('adminAuthenticated', 'true');
      toast({ title: "Admin access granted" });
    } else {
      toast({ title: "Invalid password", variant: "destructive" });
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem('adminAuthenticated');
    setAdminPassword("");
    toast({ title: "Logged out successfully" });
  };

  const { data: products = [] } = useQuery<Product[]>({
    queryKey: ["/api/products"],
  });

  const updateProductMutation = useMutation({
    mutationFn: async ({ id, data }: { id: number; data: Partial<Product> }) => {
      const response = await fetch(`/api/products/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
      });
      if (!response.ok) throw new Error('Update failed');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/products"] });
      toast({ title: "Product updated successfully" });
      setEditingProduct(null);
    },
    onError: () => {
      toast({ title: "Failed to update product", variant: "destructive" });
    }
  });

  const createProductMutation = useMutation({
    mutationFn: async (data: ProductFormData) => {
      const response = await fetch("/api/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
      });
      if (!response.ok) throw new Error('Create failed');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/products"] });
      toast({ title: "Product created successfully" });
      setShowAddForm(false);
      resetForm();
    },
    onError: () => {
      toast({ title: "Failed to create product", variant: "destructive" });
    }
  });

  const deleteProductMutation = useMutation({
    mutationFn: async (id: number) => {
      const response = await fetch(`/api/products/${id}`, {
        method: "DELETE"
      });
      if (!response.ok) throw new Error('Delete failed');
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/products"] });
      toast({ title: "Product deleted successfully" });
    },
    onError: () => {
      toast({ title: "Failed to delete product", variant: "destructive" });
    }
  });



  const categories = [
    "Living Room", "Bedroom", "Dining Room", "Office", "Lighting", "Decor", "Storage"
  ];

  const resetForm = () => {
    setFormData({
      name: "",
      description: "",
      price: 0,
      category: "",
      image: "",
      images: [""],
      colors: [],
      dimensions: "",
      material: "",
      weight: "",
      inStock: true,
      availableForPreOrder: false,
      availableForInstallment: true,
      requiresTruckDelivery: false
    });
    setNewColor("");
  };

  const startEdit = (product: Product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name || "",
      description: product.description || "",
      price: product.price || 0,
      category: product.category || "",
      image: product.image || "",
      images: [product.image || ""],
      colors: product.colors || [],
      dimensions: product.dimensions || "",
      material: product.material || "",
      weight: product.weight || "",
      inStock: product.inStock !== false,
      availableForPreOrder: product.availableForPreOrder || false,
      availableForInstallment: product.availableForInstallment !== false,
      requiresTruckDelivery: product.requiresTruckDelivery || false
    });
    setShowAddForm(true); // Show the form when editing
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>, index?: number) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          const newImageUrl = event.target.result as string;
          setFormData(prev => {
            const newImages = [...prev.images];
            if (index !== undefined) {
              newImages[index] = newImageUrl;
            } else {
              newImages.push(newImageUrl);
            }
            return { 
              ...prev, 
              image: newImages[0] || newImageUrl,
              images: newImages 
            };
          });
        }
      };
      reader.readAsDataURL(file);
      
      toast({ 
        title: "Image Selected", 
        description: "Preview loaded. For production, use image hosting services like Cloudinary." 
      });
    }
  };

  const addNewImageSlot = () => {
    setFormData(prev => ({
      ...prev,
      images: [...prev.images, ""]
    }));
  };

  const removeImage = (index: number) => {
    setFormData(prev => {
      const newImages = prev.images.filter((_, i) => i !== index);
      return {
        ...prev,
        images: newImages,
        image: newImages[0] || ""
      };
    });
  };

  const addColor = () => {
    if (newColor && !formData.colors.includes(newColor)) {
      setFormData(prev => ({ ...prev, colors: [...prev.colors, newColor] }));
      setNewColor("");
    }
  };

  const removeColor = (color: string) => {
    setFormData(prev => ({ 
      ...prev, 
      colors: prev.colors.filter(c => c !== color) 
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingProduct) {
      updateProductMutation.mutate({ id: editingProduct.id, data: formData });
    } else {
      createProductMutation.mutate(formData);
    }
  };

  const handleCancel = () => {
    setShowAddForm(false);
    setEditingProduct(null);
    resetForm();
  };

  const handleDeleteProduct = (id: number) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      deleteProductMutation.mutate(id);
    }
  };

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = filterCategory === "all" || product.category === filterCategory;
    return matchesSearch && matchesCategory;
  });

  // Show login form if not authenticated
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <CardTitle className="flex items-center justify-center gap-2">
              <Lock className="w-5 h-5" />
              Admin Login
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <Label htmlFor="password">Admin Password</Label>
                <Input
                  id="password"
                  type="password"
                  value={adminPassword}
                  onChange={(e) => setAdminPassword(e.target.value)}
                  placeholder="Enter admin password"
                  onKeyPress={(e) => e.key === 'Enter' && handleAdminLogin()}
                />
              </div>
              <Button 
                onClick={handleAdminLogin} 
                className="w-full bg-lumiere-gold text-lumiere-black hover:bg-lumiere-gold/90"
              >
                <Unlock className="w-4 h-4 mr-2" />
                Login to Admin Panel
              </Button>
              <p className="text-xs text-center text-gray-500">
                Default password: lumier2024
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold">Admin Panel</h1>
          <p className="text-lumiere-gray">Manage products, prices, and inventory</p>
        </div>
        <div className="flex gap-3">
          <Button
            onClick={() => setShowAddForm(true)}
            className="bg-lumiere-gold text-lumiere-black hover:bg-lumiere-gold/90"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Product
          </Button>
          <Button
            onClick={handleLogout}
            variant="outline"
          >
            <Lock className="w-4 h-4 mr-2" />
            Logout
          </Button>
        </div>
      </div>

      {/* Search and Filter Controls */}
      <div className="mb-6 grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <Label htmlFor="search">Search Products</Label>
          <Input
            id="search"
            placeholder="Search by name or description..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div>
          <Label htmlFor="category-filter">Filter by Category</Label>
          <Select value={filterCategory} onValueChange={setFilterCategory}>
            <SelectTrigger>
              <SelectValue placeholder="All categories" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {categories.map(cat => (
                <SelectItem key={cat} value={cat.toLowerCase().replace(' ', '-')}>
                  {cat}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="flex items-end">
          <div className="bg-gray-100 p-3 rounded-lg">
            <span className="text-sm font-medium">
              Showing {filteredProducts.length} of {products.length} products
            </span>
          </div>
        </div>
      </div>

      <Tabs defaultValue="products" className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="products">Products</TabsTrigger>
          <TabsTrigger value="orders">Orders</TabsTrigger>
          <TabsTrigger value="pricing">Pricing</TabsTrigger>
          <TabsTrigger value="subscriptions">Subscriptions</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="products" className="mt-6">
          {(showAddForm || editingProduct) && (
            <Card className="mb-6">
              <CardHeader>
                <CardTitle>
                  {editingProduct ? "Edit Product" : "Add New Product"}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <Label htmlFor="name">Product Name</Label>
                      <Input
                        id="name"
                        value={formData.name}
                        onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                        required
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="price">Price (₦)</Label>
                      <Input
                        id="price"
                        type="number"
                        value={formData.price}
                        onChange={(e) => setFormData(prev => ({ ...prev, price: Number(e.target.value) }))}
                        required
                      />
                    </div>

                    <div>
                      <Label htmlFor="category">Category</Label>
                      <Select
                        value={formData.category}
                        onValueChange={(value) => setFormData(prev => ({ ...prev, category: value }))}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                        <SelectContent>
                          {categories.map(cat => (
                            <SelectItem key={cat} value={cat.toLowerCase().replace(' ', '-')}>
                              {cat}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label htmlFor="image">Product Images</Label>
                      <div className="mt-2">
                        <div className="grid grid-cols-3 gap-4">
                          {formData.images.map((image, index) => (
                            <div key={index} className="relative">
                              {image ? (
                                <div className="relative">
                                  <img 
                                    src={image} 
                                    alt={`Product preview ${index + 1}`} 
                                    className="w-32 h-32 object-cover rounded-lg border-2 border-gray-200"
                                  />
                                  <Button
                                    type="button"
                                    variant="outline"
                                    size="sm"
                                    className="absolute top-2 right-2 bg-white/90 hover:bg-white"
                                    onClick={() => removeImage(index)}
                                  >
                                    <X className="w-4 h-4" />
                                  </Button>
                                </div>
                              ) : (
                                <div 
                                  className="w-32 h-32 border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:border-lumiere-gold hover:bg-gray-50 transition-colors"
                                  onClick={() => document.getElementById(`image-upload-${index}`)?.click()}
                                >
                                  <Plus className="w-8 h-8 text-gray-400 mb-2" />
                                  <span className="text-sm text-gray-500">Add Photo</span>
                                </div>
                              )}
                              <input
                                id={`image-upload-${index}`}
                                type="file"
                                accept="image/*"
                                className="hidden"
                                onChange={(e) => handleImageUpload(e, index)}
                              />
                            </div>
                          ))}
                          
                          {formData.images.length < 6 && (
                            <div 
                              className="w-32 h-32 border-2 border-dashed border-lumiere-gold/50 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:border-lumiere-gold hover:bg-lumiere-gold/10 transition-colors"
                              onClick={addNewImageSlot}
                            >
                              <Plus className="w-8 h-8 text-lumiere-gold mb-2" />
                              <span className="text-sm text-lumiere-gold font-medium">Add Another</span>
                            </div>
                          )}
                        </div>
                        
                        <div className="mt-4">
                          <Input
                            placeholder="Or enter image URL for first photo"
                            value={formData.images[0] || ""}
                            onChange={(e) => setFormData(prev => {
                              const newImages = [...prev.images];
                              newImages[0] = e.target.value;
                              return { 
                                ...prev, 
                                image: e.target.value,
                                images: newImages.filter(img => img !== "")
                              };
                            })}
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      value={formData.description}
                      onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                      rows={3}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <Label htmlFor="dimensions">Dimensions</Label>
                      <Input
                        id="dimensions"
                        value={formData.dimensions}
                        onChange={(e) => setFormData(prev => ({ ...prev, dimensions: e.target.value }))}
                        placeholder="e.g., 200cm x 100cm x 80cm"
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="material">Material</Label>
                      <Input
                        id="material"
                        value={formData.material}
                        onChange={(e) => setFormData(prev => ({ ...prev, material: e.target.value }))}
                        placeholder="e.g., Leather, Wood"
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="weight">Weight</Label>
                      <Input
                        id="weight"
                        value={formData.weight}
                        onChange={(e) => setFormData(prev => ({ ...prev, weight: e.target.value }))}
                        placeholder="e.g., 25kg"
                      />
                    </div>
                  </div>

                  <div>
                    <Label>Available Colors</Label>
                    <div className="flex gap-2 mt-2">
                      <Input
                        value={newColor}
                        onChange={(e) => setNewColor(e.target.value)}
                        placeholder="Add color"
                        onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addColor())}
                      />
                      <Button type="button" onClick={addColor} variant="outline">
                        Add
                      </Button>
                    </div>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {formData.colors.map(color => (
                        <Badge key={color} variant="secondary" className="flex items-center gap-1">
                          {color}
                          <X 
                            className="w-3 h-3 cursor-pointer" 
                            onClick={() => removeColor(color)}
                          />
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-4 p-4 bg-gray-50 rounded-lg mb-4">
                    <Label className="font-semibold">Product Availability</Label>
                    
                    <div className="flex items-center space-x-3">
                      <Switch
                        id="inStock"
                        checked={formData.inStock}
                        onCheckedChange={(checked) => setFormData(prev => ({ ...prev, inStock: checked }))}
                      />
                      <Label htmlFor="inStock" className="flex items-center gap-2">
                        {formData.inStock ? (
                          <>
                            <Eye className="w-4 h-4 text-green-600" />
                            <span className="text-green-700">In Stock - Ready for immediate purchase</span>
                          </>
                        ) : (
                          <>
                            <EyeOff className="w-4 h-4 text-red-600" />
                            <span className="text-red-700">Out of Stock</span>
                          </>
                        )}
                      </Label>
                    </div>

                    <div className="flex items-center space-x-3">
                      <Switch
                        id="availableForPreOrder"
                        checked={formData.availableForPreOrder}
                        onCheckedChange={(checked) => setFormData(prev => ({ ...prev, availableForPreOrder: checked }))}
                      />
                      <Label htmlFor="availableForPreOrder" className="flex items-center gap-2">
                        {formData.availableForPreOrder ? (
                          <>
                            <Eye className="w-4 h-4 text-blue-600" />
                            <span className="text-blue-700">Available for Pre-order - Customers can reserve</span>
                          </>
                        ) : (
                          <>
                            <EyeOff className="w-4 h-4 text-gray-600" />
                            <span className="text-gray-700">Pre-order disabled</span>
                          </>
                        )}
                      </Label>
                    </div>

                    <div className="flex items-center space-x-3">
                      <Switch
                        id="availableForInstallment"
                        checked={formData.availableForInstallment}
                        onCheckedChange={(checked) => setFormData(prev => ({ ...prev, availableForInstallment: checked }))}
                      />
                      <Label htmlFor="availableForInstallment" className="flex items-center gap-2">
                        {formData.availableForInstallment ? (
                          <>
                            <Eye className="w-4 h-4 text-purple-600" />
                            <span className="text-purple-700">Available for Installment Payment - Monthly plans</span>
                          </>
                        ) : (
                          <>
                            <EyeOff className="w-4 h-4 text-gray-600" />
                            <span className="text-gray-700">Installment payment disabled</span>
                          </>
                        )}
                      </Label>
                    </div>

                    <div className="flex items-center space-x-3">
                      <Switch
                        id="requiresTruckDelivery"
                        checked={formData.requiresTruckDelivery}
                        onCheckedChange={(checked) => setFormData(prev => ({ ...prev, requiresTruckDelivery: checked }))}
                      />
                      <Label htmlFor="requiresTruckDelivery" className="flex items-center gap-2">
                        {formData.requiresTruckDelivery ? (
                          <>
                            <Truck className="w-4 h-4 text-orange-600" />
                            <span className="text-orange-700">Requires Truck Delivery - Large item</span>
                          </>
                        ) : (
                          <>
                            <Package className="w-4 h-4 text-gray-600" />
                            <span className="text-gray-700">Standard delivery available</span>
                          </>
                        )}
                      </Label>
                    </div>

                    <div className="text-xs text-gray-600 bg-white p-2 rounded border">
                      <strong>Status Summary:</strong> 
                      {formData.inStock && " In Stock"}
                      {!formData.inStock && formData.availableForPreOrder && " Available for Pre-order"}
                      {!formData.inStock && !formData.availableForPreOrder && " Out of Stock"}
                      {formData.availableForInstallment && " • Installment Payment Available"}
                      {!formData.availableForInstallment && " • Installment Payment Disabled"}
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <Button
                      type="submit"
                      className="bg-lumiere-gold text-lumiere-black hover:bg-lumiere-gold/90"
                      disabled={updateProductMutation.isPending || createProductMutation.isPending}
                    >
                      <Save className="w-4 h-4 mr-2" />
                      {editingProduct ? "Update Product" : "Create Product"}
                    </Button>
                    
                    <Button
                      type="button"
                      variant="outline"
                      onClick={handleCancel}
                    >
                      <X className="w-4 h-4 mr-2" />
                      Cancel
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProducts.map(product => (
              <Card key={product.id} className="relative">
                <CardContent className="p-4">
                  <div className="absolute top-2 right-2 flex gap-1">
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleDeleteProduct(product.id)}
                      className="h-8 w-8 p-0 text-red-500 hover:text-red-700"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                  
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-40 object-cover rounded-lg mb-4"
                  />
                  
                  <div className="space-y-2 mb-4">
                    <h3 className="font-semibold text-lg">{product.name}</h3>
                    <p className="text-lumiere-gray text-sm line-clamp-2">
                      {product.description}
                    </p>
                    <div className="flex flex-wrap gap-1">
                      {product.colors.map(color => (
                        <Badge key={color} variant="outline" className="text-xs">
                          {color}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-lg font-bold">₦{product.price.toLocaleString()}</span>
                      <div className="flex gap-1">
                        {product.inStock && (
                          <Badge variant="default" className="bg-green-600">
                            In Stock
                          </Badge>
                        )}
                        {product.availableForPreOrder && (
                          <Badge variant="outline" className="border-blue-600 text-blue-600">
                            Pre-order
                          </Badge>
                        )}
                        {!product.inStock && !product.availableForPreOrder && (
                          <Badge variant="destructive">
                            Unavailable
                          </Badge>
                        )}
                      </div>
                    </div>
                    
                    <div className="text-xs text-gray-500 space-y-1">
                      <div>Category: {product.category}</div>
                      {product.dimensions && <div>Size: {product.dimensions}</div>}
                      {product.material && <div>Material: {product.material}</div>}
                    </div>
                    
                    <Button
                      onClick={() => startEdit(product)}
                      variant="outline"
                      className="w-full"
                    >
                      <Edit className="w-4 h-4 mr-2" />
                      Edit Product
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          
          {filteredProducts.length === 0 && (
            <div className="text-center py-12">
              <p className="text-lumiere-gray">No products found matching your search criteria.</p>
            </div>
          )}
        </TabsContent>

        <TabsContent value="orders" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Order Management</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div className="bg-blue-50 p-4 rounded">
                    <h3 className="font-semibold text-blue-700">Total Orders</h3>
                    <p className="text-2xl font-bold text-blue-800">0</p>
                  </div>
                  <div className="bg-green-50 p-4 rounded">
                    <h3 className="font-semibold text-green-700">Total Revenue</h3>
                    <p className="text-2xl font-bold text-green-800">₦0</p>
                  </div>
                  <div className="bg-yellow-50 p-4 rounded">
                    <h3 className="font-semibold text-yellow-700">Pending Orders</h3>
                    <p className="text-2xl font-bold text-yellow-800">0</p>
                  </div>
                </div>
                <p className="text-lumiere-gray">Orders will appear here once customers start purchasing</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="pricing" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Pricing Configuration</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <Label>VAT Rate (%)</Label>
                    <Input type="number" step="0.1" defaultValue="7.5" />
                    <p className="text-xs text-gray-500 mt-1">Nigeria standard VAT rate</p>
                  </div>
                  <div>
                    <Label>Service Fee Rate (%)</Label>
                    <Input type="number" step="0.1" defaultValue="5.0" />
                    <p className="text-xs text-gray-500 mt-1">Monthly service fee for installments</p>
                  </div>
                  <div>
                    <Label>Rental Rate (%)</Label>
                    <Input type="number" step="0.1" defaultValue="1.0" />
                    <p className="text-xs text-gray-500 mt-1">Monthly rental percentage of item value</p>
                  </div>
                  <div>
                    <Label>Insurance Rate (%)</Label>
                    <Input type="number" step="0.1" defaultValue="2.0" />
                    <p className="text-xs text-gray-500 mt-1">Optional insurance for rental items</p>
                  </div>
                </div>
                
                <div className="border-t pt-6">
                  <h3 className="text-lg font-semibold mb-4">Delivery Fees</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>Lagos Delivery Fee (₦)</Label>
                      <Input type="number" defaultValue="15000" />
                    </div>
                    <div>
                      <Label>Other States Delivery Fee (₦)</Label>
                      <Input type="number" defaultValue="25000" />
                    </div>
                  </div>
                </div>
                
                <Button className="w-full bg-lumiere-gold text-lumiere-black hover:bg-lumiere-gold/90">
                  Save Pricing Settings
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="subscriptions" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Subscription Plans Management</CardTitle>
              <p className="text-sm text-gray-600">Customize plan descriptions, pricing, and features</p>
            </CardHeader>
            <CardContent>
              <div className="space-y-8">
                {/* Basic Plan */}
                <div className="border rounded-lg p-6 bg-blue-50">
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label>Plan Name</Label>
                        <Input defaultValue="Basic Plan" />
                      </div>
                      <div>
                        <Label>Monthly Price (₦)</Label>
                        <Input type="number" defaultValue="15000" />
                      </div>
                    </div>
                    
                    <div>
                      <Label>Plan Description</Label>
                      <Textarea 
                        defaultValue="Essential furniture pieces for small spaces and budget-conscious customers"
                        rows={2}
                      />
                    </div>
                    
                    <div>
                      <Label>Features & Benefits (one per line)</Label>
                      <Textarea 
                        defaultValue={`2-3 carefully selected furniture pieces
Quarterly refresh options to change your style
Basic delivery service included
Perfect for studio apartments and small spaces
Customer support via email`}
                        rows={6}
                        placeholder="Enter each feature on a new line"
                      />
                    </div>
                  </div>
                </div>

                {/* Premium Plan */}
                <div className="border rounded-lg p-6 bg-yellow-50">
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label>Plan Name</Label>
                        <Input defaultValue="Premium Plan" />
                      </div>
                      <div>
                        <Label>Monthly Price (₦)</Label>
                        <Input type="number" defaultValue="25000" />
                      </div>
                    </div>
                    
                    <div>
                      <Label>Plan Description</Label>
                      <Textarea 
                        defaultValue="Complete room solutions with premium furniture pieces and enhanced services"
                        rows={2}
                      />
                    </div>
                    
                    <div>
                      <Label>Features & Benefits (one per line)</Label>
                      <Textarea 
                        defaultValue={`4-6 premium furniture pieces for complete room setup
Monthly refresh options for more flexibility
Priority delivery service with scheduling
Basic interior design consultation included
Phone and email customer support
Perfect for 1-2 bedroom apartments`}
                        rows={6}
                        placeholder="Enter each feature on a new line"
                      />
                    </div>
                  </div>
                </div>

                {/* Elite Plan */}
                <div className="border rounded-lg p-6 bg-purple-50">
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label>Plan Name</Label>
                        <Input defaultValue="Elite Plan" />
                      </div>
                      <div>
                        <Label>Monthly Price (₦)</Label>
                        <Input type="number" defaultValue="40000" />
                      </div>
                    </div>
                    
                    <div>
                      <Label>Plan Description</Label>
                      <Textarea 
                        defaultValue="Luxury furniture collection with exclusive pieces and white-glove service"
                        rows={2}
                      />
                    </div>
                    
                    <div>
                      <Label>Features & Benefits (one per line)</Label>
                      <Textarea 
                        defaultValue={`8+ luxury furniture pieces including exclusive designs
Weekly refresh options for maximum flexibility
White-glove delivery and setup service
Personal interior design consultant
24/7 priority customer support
Access to limited edition and designer pieces
Perfect for large homes and luxury spaces
Complimentary styling and rearrangement service`}
                        rows={8}
                        placeholder="Enter each feature on a new line"
                      />
                    </div>
                  </div>
                </div>

                {/* Plan Comparison Settings */}
                <div className="border rounded-lg p-6 bg-gray-50">
                  <h3 className="text-lg font-semibold mb-4">Plan Comparison Settings</h3>
                  <div className="space-y-4">
                    <div>
                      <Label>Main Subscription Headline</Label>
                      <Input defaultValue="Transform Your Space with Flexible Furniture Subscriptions" />
                    </div>
                    
                    <div>
                      <Label>Subscription Service Description</Label>
                      <Textarea 
                        defaultValue="Enjoy premium furniture without the commitment. Our subscription plans let you refresh your space regularly with high-quality pieces that match your evolving style and needs."
                        rows={3}
                      />
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label>Call-to-Action Button Text</Label>
                        <Input defaultValue="Start Your Subscription" />
                      </div>
                      <div>
                        <Label>Secondary Button Text</Label>
                        <Input defaultValue="Learn More" />
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="flex gap-4">
                  <Button className="flex-1 bg-lumiere-gold text-lumiere-black hover:bg-lumiere-gold/90">
                    Save All Subscription Changes
                  </Button>
                  <Button variant="outline" className="px-6">
                    Preview Changes
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="settings" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Website Settings</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold mb-4">Email Configuration</h3>
                  <div className="grid grid-cols-1 gap-4">
                    <div>
                      <Label>SendGrid API Key</Label>
                      <Input type="password" placeholder="Enter SendGrid API key for email notifications" />
                      <p className="text-xs text-gray-500 mt-1">Required for order confirmations and notifications</p>
                    </div>
                    <div>
                      <Label>Admin Email</Label>
                      <Input type="email" defaultValue="admin@lumierefurniture.com" />
                    </div>
                  </div>
                </div>
                
                <div className="border-t pt-6">
                  <h3 className="text-lg font-semibold mb-4">Business Information</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>Company RC Number</Label>
                      <Input defaultValue="3662809" />
                    </div>
                    <div>
                      <Label>Business Address</Label>
                      <Input defaultValue="Lagos, Nigeria" />
                    </div>
                    <div>
                      <Label>Phone Number</Label>
                      <Input defaultValue="+234 800 LUMIERE" />
                    </div>
                    <div>
                      <Label>Support Email</Label>
                      <Input defaultValue="support@lumierefurniture.com" />
                    </div>
                  </div>
                </div>
                
                <div className="border-t pt-6">
                  <h3 className="text-lg font-semibold mb-4">Website Features</h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <Label>Live Chat Support</Label>
                        <p className="text-sm text-gray-500">Enable real-time customer support</p>
                      </div>
                      <Switch defaultChecked />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <Label>Newsletter Signup</Label>
                        <p className="text-sm text-gray-500">Allow customers to subscribe to updates</p>
                      </div>
                      <Switch defaultChecked />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <Label>Seasonal Collections</Label>
                        <p className="text-sm text-gray-500">Display seasonal furniture collections</p>
                      </div>
                      <Switch defaultChecked />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <Label>AR Showroom</Label>
                        <p className="text-sm text-gray-500">Virtual furniture preview feature</p>
                      </div>
                      <Switch defaultChecked />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <Label>Subscription Service</Label>
                        <p className="text-sm text-gray-500">Monthly furniture rental plans</p>
                      </div>
                      <Switch defaultChecked />
                    </div>
                  </div>
                </div>
                
                <Button className="w-full bg-lumiere-gold text-lumiere-black hover:bg-lumiere-gold/90">
                  Save All Settings
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}