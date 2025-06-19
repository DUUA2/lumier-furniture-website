import { useState, useEffect } from 'react';
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
import { Product, Order } from '@shared/schema';
import { formatCurrency } from '@/lib/utils';

interface AdminStats {
  totalProducts: number;
  totalOrders: number;
  totalRevenue: number;
  activeSubscriptions: number;
}

interface SubscriptionPlan {
  id: number;
  name: string;
  description: string;
  monthlyPrice: number;
  features: string[];
  isActive: boolean;
}

export default function AdminDashboard() {
  const [selectedTab, setSelectedTab] = useState('overview');
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [newProduct, setNewProduct] = useState<Partial<Product>>({
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
  const [subscriptionPlans, setSubscriptionPlans] = useState<SubscriptionPlan[]>([
    {
      id: 1,
      name: 'Basic',
      description: 'Essential furniture pieces for small spaces',
      monthlyPrice: 15000,
      features: ['2-3 furniture pieces', 'Quarterly refresh', 'Basic delivery'],
      isActive: true
    },
    {
      id: 2,
      name: 'Premium',
      description: 'Complete room solutions with premium pieces',
      monthlyPrice: 25000,
      features: ['4-6 furniture pieces', 'Monthly refresh option', 'Priority delivery', 'Design consultation'],
      isActive: true
    },
    {
      id: 3,
      name: 'Elite',
      description: 'Luxury furniture collection with exclusive pieces',
      monthlyPrice: 40000,
      features: ['8+ furniture pieces', 'Weekly refresh option', 'White-glove delivery', 'Personal design consultant', 'Exclusive pieces'],
      isActive: true
    }
  ]);

  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch data
  const { data: products = [], isLoading: productsLoading } = useQuery({
    queryKey: ['/api/products'],
    queryFn: () => fetch('/api/products').then(res => res.json())
  });

  const { data: orders = [], isLoading: ordersLoading } = useQuery({
    queryKey: ['/api/orders'],
    queryFn: () => fetch('/api/orders').then(res => res.json())
  });

  const { data: stats } = useQuery({
    queryKey: ['/api/admin/stats'],
    queryFn: () => fetch('/api/admin/stats').then(res => res.json()),
    initialData: {
      totalProducts: products.length,
      totalOrders: orders.length,
      totalRevenue: orders.reduce((sum: number, order: Order) => sum + (order.total || 0), 0),
      activeSubscriptions: 0
    } as AdminStats
  });

  // Mutations
  const createProductMutation = useMutation({
    mutationFn: (product: Partial<Product>) =>
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
    mutationFn: ({ id, updates }: { id: number; updates: Partial<Product> }) =>
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

  const ProductForm = ({ product, onChange, isNew = false }: {
    product: Partial<Product>;
    onChange: (updates: Partial<Product>) => void;
    isNew?: boolean;
  }) => (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="name">Product Name *</Label>
          <Input
            id="name"
            value={product.name || ''}
            onChange={(e) => onChange({ ...product, name: e.target.value })}
            placeholder="Enter product name"
          />
        </div>
        <div>
          <Label htmlFor="price">Price (₦) *</Label>
          <Input
            id="price"
            type="number"
            value={product.price || 0}
            onChange={(e) => onChange({ ...product, price: parseInt(e.target.value) })}
            placeholder="Enter price"
          />
        </div>
      </div>

      <div>
        <Label htmlFor="description">Description *</Label>
        <Textarea
          id="description"
          value={product.description || ''}
          onChange={(e) => onChange({ ...product, description: e.target.value })}
          placeholder="Enter product description"
          rows={3}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="category">Category</Label>
          <Select
            value={product.category || ''}
            onValueChange={(value) => onChange({ ...product, category: value })}
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
            value={product.image || ''}
            onChange={(e) => onChange({ ...product, image: e.target.value })}
            placeholder="Enter image URL"
          />
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div>
          <Label htmlFor="dimensions">Dimensions</Label>
          <Input
            id="dimensions"
            value={product.dimensions || ''}
            onChange={(e) => onChange({ ...product, dimensions: e.target.value })}
            placeholder="e.g., 200x90x85 cm"
          />
        </div>
        <div>
          <Label htmlFor="material">Material</Label>
          <Input
            id="material"
            value={product.material || ''}
            onChange={(e) => onChange({ ...product, material: e.target.value })}
            placeholder="e.g., Oak Wood"
          />
        </div>
        <div>
          <Label htmlFor="weight">Weight</Label>
          <Input
            id="weight"
            value={product.weight || ''}
            onChange={(e) => onChange({ ...product, weight: e.target.value })}
            placeholder="e.g., 45 kg"
          />
        </div>
      </div>

      <div>
        <Label htmlFor="colors">Available Colors (comma-separated)</Label>
        <Input
          id="colors"
          value={Array.isArray(product.colors) ? product.colors.join(', ') : ''}
          onChange={(e) => onChange({ 
            ...product, 
            colors: e.target.value.split(',').map(c => c.trim()).filter(c => c) 
          })}
          placeholder="e.g., Brown, Black, White"
        />
      </div>

      <div className="flex space-x-6">
        <div className="flex items-center space-x-2">
          <Switch
            id="inStock"
            checked={product.inStock || false}
            onCheckedChange={(checked) => onChange({ ...product, inStock: checked })}
          />
          <Label htmlFor="inStock">In Stock</Label>
        </div>
        <div className="flex items-center space-x-2">
          <Switch
            id="preOrder"
            checked={product.availableForPreOrder || false}
            onCheckedChange={(checked) => onChange({ ...product, availableForPreOrder: checked })}
          />
          <Label htmlFor="preOrder">Available for Pre-order</Label>
        </div>
        <div className="flex items-center space-x-2">
          <Switch
            id="installment"
            checked={product.availableForInstallment || false}
            onCheckedChange={(checked) => onChange({ ...product, availableForInstallment: checked })}
          />
          <Label htmlFor="installment">Available for Installment</Label>
        </div>
      </div>
    </div>
  );

  return (
    <div className="container mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
        <p className="text-gray-600">Manage your Lumiere Furniture website</p>
      </div>

      <Tabs value={selectedTab} onValueChange={setSelectedTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="products">Products</TabsTrigger>
          <TabsTrigger value="orders">Orders</TabsTrigger>
          <TabsTrigger value="subscriptions">Subscriptions</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Products</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats?.totalProducts || 0}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats?.totalOrders || 0}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{formatCurrency(stats?.totalRevenue || 0)}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Active Subscriptions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats?.activeSubscriptions || 0}</div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Recent Orders</CardTitle>
              <CardDescription>Latest customer orders</CardDescription>
            </CardHeader>
            <CardContent>
              {ordersLoading ? (
                <p>Loading orders...</p>
              ) : orders.length === 0 ? (
                <p>No orders yet</p>
              ) : (
                <div className="space-y-4">
                  {orders.slice(0, 5).map((order: Order) => (
                    <div key={order.id} className="flex items-center justify-between p-4 border rounded">
                      <div>
                        <p className="font-medium">{order.customerName}</p>
                        <p className="text-sm text-gray-500">{order.customerEmail}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">{formatCurrency(order.total || 0)}</p>
                        <Badge variant={order.orderType === 'purchase' ? 'default' : 'secondary'}>
                          {order.orderType}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="products" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Add New Product</CardTitle>
              <CardDescription>Create a new furniture item for your catalog</CardDescription>
            </CardHeader>
            <CardContent>
              <ProductForm
                product={newProduct}
                onChange={setNewProduct}
                isNew={true}
              />
              <div className="flex justify-end mt-6">
                <Button 
                  onClick={handleCreateProduct}
                  disabled={createProductMutation.isPending}
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Create Product
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Existing Products</CardTitle>
              <CardDescription>Manage your furniture catalog</CardDescription>
            </CardHeader>
            <CardContent>
              {productsLoading ? (
                <p>Loading products...</p>
              ) : (
                <div className="space-y-4">
                  {products.map((product: Product) => (
                    <div key={product.id} className="border rounded-lg p-4">
                      {editingProduct?.id === product.id ? (
                        <div className="space-y-4">
                          <ProductForm
                            product={editingProduct}
                            onChange={(updates) => setEditingProduct(updates as Product)}
                          />
                          <div className="flex justify-end space-x-2">
                            <Button variant="outline" onClick={() => setEditingProduct(null)}>
                              <X className="w-4 h-4 mr-2" />
                              Cancel
                            </Button>
                            <Button onClick={handleUpdateProduct} disabled={updateProductMutation.isPending}>
                              <Save className="w-4 h-4 mr-2" />
                              Save Changes
                            </Button>
                          </div>
                        </div>
                      ) : (
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
                              <p className="font-semibold">{formatCurrency(product.price)}</p>
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
                      )}
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="orders" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>All Orders</CardTitle>
              <CardDescription>Manage customer orders and payments</CardDescription>
            </CardHeader>
            <CardContent>
              {ordersLoading ? (
                <p>Loading orders...</p>
              ) : orders.length === 0 ? (
                <p>No orders yet</p>
              ) : (
                <div className="space-y-4">
                  {orders.map((order: Order) => (
                    <div key={order.id} className="border rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <div>
                          <h3 className="font-medium">Order #{order.id}</h3>
                          <p className="text-sm text-gray-500">{order.customerName} - {order.customerEmail}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold">{formatCurrency(order.total || 0)}</p>
                          <Badge variant={order.orderType === 'purchase' ? 'default' : 'secondary'}>
                            {order.orderType}
                          </Badge>
                        </div>
                      </div>
                      <div className="text-sm text-gray-600">
                        <p>Phone: {order.customerPhone}</p>
                        <p>Delivery: {typeof order.deliveryAddress === 'object' 
                          ? `${order.deliveryAddress.street}, ${order.deliveryAddress.city}, ${order.deliveryAddress.state}`
                          : String(order.deliveryAddress)}</p>
                        <p>Payment Plan: {order.paymentPlan} months</p>
                        {order.monthlyPayment && (
                          <p>Monthly Amount: {formatCurrency(order.monthlyPayment)}</p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="subscriptions" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Subscription Plans</CardTitle>
              <CardDescription>Manage your furniture subscription offerings</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {subscriptionPlans.map((plan) => (
                  <div key={plan.id} className="border rounded-lg p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <h3 className="text-xl font-semibold">{plan.name}</h3>
                        <p className="text-gray-600">{plan.description}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-2xl font-bold">{formatCurrency(plan.monthlyPrice)}</p>
                        <p className="text-sm text-gray-500">per month</p>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <div>
                        <Label>Monthly Price (₦)</Label>
                        <Input
                          type="number"
                          value={plan.monthlyPrice}
                          onChange={(e) => {
                            const updatedPlans = subscriptionPlans.map(p =>
                              p.id === plan.id ? { ...p, monthlyPrice: parseInt(e.target.value) } : p
                            );
                            setSubscriptionPlans(updatedPlans);
                          }}
                        />
                      </div>
                      <div>
                        <Label>Status</Label>
                        <div className="flex items-center space-x-2 mt-2">
                          <Switch
                            checked={plan.isActive}
                            onCheckedChange={(checked) => {
                              const updatedPlans = subscriptionPlans.map(p =>
                                p.id === plan.id ? { ...p, isActive: checked } : p
                              );
                              setSubscriptionPlans(updatedPlans);
                            }}
                          />
                          <Label>{plan.isActive ? 'Active' : 'Inactive'}</Label>
                        </div>
                      </div>
                    </div>
                    <div>
                      <Label>Features</Label>
                      <ul className="list-disc list-inside text-sm text-gray-600 mt-1">
                        {plan.features.map((feature, index) => (
                          <li key={index}>{feature}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                ))}
              </div>
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
                <h3 className="text-lg font-semibold mb-4">Payment Configuration</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>VAT Rate (%)</Label>
                    <Input type="number" step="0.1" defaultValue="7.5" />
                  </div>
                  <div>
                    <Label>Service Fee Rate (%)</Label>
                    <Input type="number" step="0.1" defaultValue="5.0" />
                  </div>
                  <div>
                    <Label>Rental Rate (%)</Label>
                    <Input type="number" step="0.1" defaultValue="1.0" />
                  </div>
                  <div>
                    <Label>Insurance Rate (%)</Label>
                    <Input type="number" step="0.1" defaultValue="2.0" />
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-4">Delivery Settings</h3>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>Lagos Delivery Fee (₦)</Label>
                      <Input type="number" defaultValue="15000" />
                    </div>
                    <div>
                      <Label>Default Delivery Fee (₦)</Label>
                      <Input type="number" defaultValue="25000" />
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-4">Email Settings</h3>
                <div className="space-y-4">
                  <div>
                    <Label>SendGrid API Key</Label>
                    <Input type="password" placeholder="Enter SendGrid API key" />
                  </div>
                  <div>
                    <Label>Admin Email</Label>
                    <Input type="email" defaultValue="admin@lumierefurniture.com" />
                  </div>
                </div>
              </div>

              <Button className="w-full">Save Settings</Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}