import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Trash2, Edit, Plus, Save, X } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { formatCurrency } from '@/lib/utils';

interface AdminProduct {
  id: number;
  name: string;
  description: string;
  price: number;
  category: string;
  image: string;
  colors: string[];
  dimensions?: string;
  material?: string;
  weight?: string;
  inStock: boolean;
  availableForPreOrder: boolean;
  availableForInstallment: boolean;
}

export default function SimpleAdmin() {
  const [selectedTab, setSelectedTab] = useState('products');
  const [editingProduct, setEditingProduct] = useState<AdminProduct | null>(null);
  const [newProduct, setNewProduct] = useState({
    name: '',
    description: '',
    price: 0,
    category: '',
    image: '',
    colors: [] as string[],
    dimensions: '',
    material: '',
    weight: '',
    inStock: true,
    availableForPreOrder: false,
    availableForInstallment: true
  });

  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch data
  const { data: products = [], isLoading: productsLoading } = useQuery({
    queryKey: ['/api/products'],
    queryFn: () => fetch('/api/products').then(res => res.json())
  });

  // Mutations
  const createProductMutation = useMutation({
    mutationFn: (product: any) =>
      fetch('/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(product)
      }).then(res => res.json()),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/products'] });
      setNewProduct({
        name: '',
        description: '',
        price: 0,
        category: '',
        image: '',
        colors: [],
        dimensions: '',
        material: '',
        weight: '',
        inStock: true,
        availableForPreOrder: false,
        availableForInstallment: true
      });
      toast({ title: 'Product created successfully!' });
    }
  });

  const updateProductMutation = useMutation({
    mutationFn: ({ id, updates }: { id: number; updates: any }) =>
      fetch(`/api/products/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates)
      }).then(res => res.json()),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/products'] });
      setEditingProduct(null);
      toast({ title: 'Product updated successfully!' });
    }
  });

  const deleteProductMutation = useMutation({
    mutationFn: (id: number) =>
      fetch(`/api/products/${id}`, { method: 'DELETE' }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/products'] });
      toast({ title: 'Product deleted successfully!' });
    }
  });

  const handleCreateProduct = () => {
    if (!newProduct.name || !newProduct.description || !newProduct.price) {
      toast({ title: 'Please fill in all required fields', variant: 'destructive' });
      return;
    }
    createProductMutation.mutate(newProduct);
  };

  const handleUpdateProduct = () => {
    if (!editingProduct) return;
    updateProductMutation.mutate({
      id: editingProduct.id,
      updates: editingProduct
    });
  };

  const handleDeleteProduct = (id: number) => {
    if (confirm('Are you sure you want to delete this product?')) {
      deleteProductMutation.mutate(id);
    }
  };

  return (
    <div className="container mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-lumiere-gold">Lumiere Admin Panel</h1>
        <p className="text-gray-600">Manage your furniture website</p>
      </div>

      <Tabs value={selectedTab} onValueChange={setSelectedTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="products">Products</TabsTrigger>
          <TabsTrigger value="pricing">Pricing</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="products" className="space-y-6">
          {/* Add New Product */}
          <Card>
            <CardHeader>
              <CardTitle>Add New Product</CardTitle>
              <CardDescription>Create a new furniture item for your catalog</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="name">Product Name *</Label>
                    <Input
                      id="name"
                      value={newProduct.name}
                      onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                      placeholder="Enter product name"
                    />
                  </div>
                  <div>
                    <Label htmlFor="price">Price (₦) *</Label>
                    <Input
                      id="price"
                      type="number"
                      value={newProduct.price}
                      onChange={(e) => setNewProduct({ ...newProduct, price: parseInt(e.target.value) || 0 })}
                      placeholder="Enter price"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="description">Description *</Label>
                  <Textarea
                    id="description"
                    value={newProduct.description}
                    onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
                    placeholder="Enter product description"
                    rows={3}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="category">Category</Label>
                    <Select
                      value={newProduct.category}
                      onValueChange={(value) => setNewProduct({ ...newProduct, category: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Living Room">Living Room</SelectItem>
                        <SelectItem value="Bedroom">Bedroom</SelectItem>
                        <SelectItem value="Dining Room">Dining Room</SelectItem>
                        <SelectItem value="Office">Office</SelectItem>
                        <SelectItem value="Lighting">Lighting</SelectItem>
                        <SelectItem value="Decor">Decor</SelectItem>
                        <SelectItem value="Storage">Storage</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="image">Image URL</Label>
                    <Input
                      id="image"
                      value={newProduct.image}
                      onChange={(e) => setNewProduct({ ...newProduct, image: e.target.value })}
                      placeholder="Enter image URL"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="colors">Available Colors (comma-separated)</Label>
                  <Input
                    id="colors"
                    value={newProduct.colors.join(', ')}
                    onChange={(e) => setNewProduct({ 
                      ...newProduct, 
                      colors: e.target.value.split(',').map(c => c.trim()).filter(c => c) 
                    })}
                    placeholder="e.g., Brown, Black, White"
                  />
                </div>

                <div className="flex space-x-6">
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="inStock"
                      checked={newProduct.inStock}
                      onCheckedChange={(checked) => setNewProduct({ ...newProduct, inStock: checked })}
                    />
                    <Label htmlFor="inStock">In Stock</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="preOrder"
                      checked={newProduct.availableForPreOrder}
                      onCheckedChange={(checked) => setNewProduct({ ...newProduct, availableForPreOrder: checked })}
                    />
                    <Label htmlFor="preOrder">Available for Pre-order</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="installment"
                      checked={newProduct.availableForInstallment}
                      onCheckedChange={(checked) => setNewProduct({ ...newProduct, availableForInstallment: checked })}
                    />
                    <Label htmlFor="installment">Available for Installment</Label>
                  </div>
                </div>
              </div>
              <div className="flex justify-end mt-6">
                <Button 
                  onClick={handleCreateProduct}
                  disabled={createProductMutation.isPending}
                  className="bg-lumiere-gold hover:bg-lumiere-gold/90"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Create Product
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Existing Products */}
          <Card>
            <CardHeader>
              <CardTitle>Existing Products ({products.length})</CardTitle>
              <CardDescription>Manage your furniture catalog</CardDescription>
            </CardHeader>
            <CardContent>
              {productsLoading ? (
                <p>Loading products...</p>
              ) : (
                <div className="space-y-4">
                  {products.map((product: any) => (
                    <div key={product.id} className="border rounded-lg p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <img 
                            src={product.image} 
                            alt={product.name}
                            className="w-16 h-16 object-cover rounded"
                          />
                          <div>
                            <h3 className="font-medium">{product.name}</h3>
                            <p className="text-sm text-gray-500">{product.category}</p>
                            <p className="font-semibold text-lumiere-gold">{formatCurrency(product.price)}</p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Badge variant={product.inStock ? 'default' : 'destructive'}>
                            {product.inStock ? 'In Stock' : 'Out of Stock'}
                          </Badge>
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => setEditingProduct(product)}
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => handleDeleteProduct(product.id)}
                            disabled={deleteProductMutation.isPending}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="pricing" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Pricing Configuration</CardTitle>
              <CardDescription>Manage payment and pricing settings</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <Label>VAT Rate (%)</Label>
                  <Input type="number" step="0.1" defaultValue="7.5" />
                  <p className="text-sm text-gray-500 mt-1">Currently 7.5% for Nigeria</p>
                </div>
                <div>
                  <Label>Service Fee Rate (%)</Label>
                  <Input type="number" step="0.1" defaultValue="5.0" />
                  <p className="text-sm text-gray-500 mt-1">Monthly service fee for installments</p>
                </div>
                <div>
                  <Label>Rental Rate (%)</Label>
                  <Input type="number" step="0.1" defaultValue="1.0" />
                  <p className="text-sm text-gray-500 mt-1">Monthly rental percentage</p>
                </div>
                <div>
                  <Label>Insurance Rate (%)</Label>
                  <Input type="number" step="0.1" defaultValue="2.0" />
                  <p className="text-sm text-gray-500 mt-1">Optional insurance percentage</p>
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

              <div className="border-t pt-6">
                <h3 className="text-lg font-semibold mb-4">Subscription Plans</h3>
                <div className="space-y-4">
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <Label>Basic Plan (₦/month)</Label>
                      <Input type="number" defaultValue="15000" />
                    </div>
                    <div>
                      <Label>Premium Plan (₦/month)</Label>
                      <Input type="number" defaultValue="25000" />
                    </div>
                    <div>
                      <Label>Elite Plan (₦/month)</Label>
                      <Input type="number" defaultValue="40000" />
                    </div>
                  </div>
                </div>
              </div>

              <Button className="w-full bg-lumiere-gold hover:bg-lumiere-gold/90">
                Save Pricing Settings
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="settings" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Website Settings</CardTitle>
              <CardDescription>Configure global website settings</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold mb-4">Email Configuration</h3>
                <div className="space-y-4">
                  <div>
                    <Label>SendGrid API Key</Label>
                    <Input type="password" placeholder="Enter SendGrid API key for email notifications" />
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
                </div>
              </div>

              <Button className="w-full bg-lumiere-gold hover:bg-lumiere-gold/90">
                Save Settings
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Edit Product Modal */}
      {editingProduct && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Edit Product</h3>
              <Button variant="outline" size="sm" onClick={() => setEditingProduct(null)}>
                <X className="w-4 h-4" />
              </Button>
            </div>
            
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Product Name</Label>
                  <Input
                    value={editingProduct.name}
                    onChange={(e) => setEditingProduct({ ...editingProduct, name: e.target.value })}
                  />
                </div>
                <div>
                  <Label>Price (₦)</Label>
                  <Input
                    type="number"
                    value={editingProduct.price}
                    onChange={(e) => setEditingProduct({ ...editingProduct, price: parseInt(e.target.value) || 0 })}
                  />
                </div>
              </div>
              
              <div>
                <Label>Description</Label>
                <Textarea
                  value={editingProduct.description}
                  onChange={(e) => setEditingProduct({ ...editingProduct, description: e.target.value })}
                />
              </div>
              
              <div className="flex items-center space-x-2">
                <Switch
                  checked={editingProduct.inStock}
                  onCheckedChange={(checked) => setEditingProduct({ ...editingProduct, inStock: checked })}
                />
                <Label>In Stock</Label>
              </div>
            </div>
            
            <div className="flex justify-end space-x-2 mt-6">
              <Button variant="outline" onClick={() => setEditingProduct(null)}>
                Cancel
              </Button>
              <Button 
                onClick={handleUpdateProduct} 
                disabled={updateProductMutation.isPending}
                className="bg-lumiere-gold hover:bg-lumiere-gold/90"
              >
                Save Changes
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}