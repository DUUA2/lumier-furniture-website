import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ExternalLink, Database, Image, Settings, Upload, Code } from "lucide-react";

export default function DeploymentGuide() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-4">Website Management Guide</h1>
        <p className="text-lumiere-gray">
          Complete guide for managing your Lumiere Furniture website after deployment
        </p>
      </div>

      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="products">Products</TabsTrigger>
          <TabsTrigger value="images">Images</TabsTrigger>
          <TabsTrigger value="database">Database</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="mt-6">
          <div className="grid gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="w-5 h-5" />
                  Deployment Status
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span>Website Status</span>
                    <Badge variant="default">Ready for Deployment</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Database</span>
                    <Badge variant="default">PostgreSQL Connected</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Payment System</span>
                    <Badge variant="secondary">Paystack Integration Ready</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Authentication</span>
                    <Badge variant="default">Replit Auth Active</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Button 
                    variant="outline" 
                    className="justify-start"
                    onClick={() => window.open('https://replit.com', '_blank')}
                  >
                    <ExternalLink className="w-4 h-4 mr-2" />
                    Deploy on Replit
                  </Button>
                  <Button 
                    variant="outline" 
                    className="justify-start"
                    onClick={() => window.open('https://console.neon.tech', '_blank')}
                  >
                    <Database className="w-4 h-4 mr-2" />
                    Manage Database
                  </Button>
                  <Button 
                    variant="outline" 
                    className="justify-start"
                    onClick={() => window.open('https://dashboard.paystack.com', '_blank')}
                  >
                    <Settings className="w-4 h-4 mr-2" />
                    Paystack Dashboard
                  </Button>
                  <Button 
                    variant="outline" 
                    className="justify-start"
                    onClick={() => window.open('https://unsplash.com', '_blank')}
                  >
                    <Image className="w-4 h-4 mr-2" />
                    Get Product Images
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="products" className="mt-6">
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Adding New Products</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="bg-blue-50 p-4 rounded-lg">
                  <h4 className="font-semibold mb-2">Database Method (Recommended)</h4>
                  <p className="text-sm text-gray-600 mb-3">
                    Use your Neon database console to add products directly to the database.
                  </p>
                  <ol className="text-sm space-y-2 list-decimal list-inside">
                    <li>Go to your Neon database console</li>
                    <li>Navigate to the "products" table</li>
                    <li>Click "Insert row" or use SQL queries</li>
                    <li>Fill in product details (name, price, category, etc.)</li>
                  </ol>
                </div>

                <div className="bg-green-50 p-4 rounded-lg">
                  <h4 className="font-semibold mb-2">Code Method</h4>
                  <p className="text-sm text-gray-600 mb-3">
                    Add products by modifying the server/seed.ts file and running database updates.
                  </p>
                  <ol className="text-sm space-y-2 list-decimal list-inside">
                    <li>Edit the seed.ts file in your Replit project</li>
                    <li>Add new product objects to the products array</li>
                    <li>Run npm run db:push to update the database</li>
                  </ol>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Product Information Required</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <h5 className="font-medium mb-2">Basic Details</h5>
                    <ul className="space-y-1 text-gray-600">
                      <li>• Product name</li>
                      <li>• Description</li>
                      <li>• Price (in Naira)</li>
                      <li>• Category</li>
                      <li>• In stock status</li>
                    </ul>
                  </div>
                  <div>
                    <h5 className="font-medium mb-2">Additional Details</h5>
                    <ul className="space-y-1 text-gray-600">
                      <li>• Product image URL</li>
                      <li>• Available colors</li>
                      <li>• Dimensions</li>
                      <li>• Material</li>
                      <li>• Weight</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="images" className="mt-6">
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Image Management</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="bg-yellow-50 p-4 rounded-lg">
                  <h4 className="font-semibold mb-2">Recommended Image Services</h4>
                  <div className="space-y-3">
                    <div>
                      <h5 className="font-medium">Unsplash (Free)</h5>
                      <p className="text-sm text-gray-600">High-quality furniture photos for development and testing</p>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="mt-2"
                        onClick={() => window.open('https://unsplash.com/s/photos/furniture', '_blank')}
                      >
                        Browse Furniture Photos
                      </Button>
                    </div>
                    
                    <div>
                      <h5 className="font-medium">Cloudinary (Production)</h5>
                      <p className="text-sm text-gray-600">Professional image hosting with optimization</p>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="mt-2"
                        onClick={() => window.open('https://cloudinary.com', '_blank')}
                      >
                        Sign Up for Cloudinary
                      </Button>
                    </div>
                  </div>
                </div>

                <div className="bg-blue-50 p-4 rounded-lg">
                  <h4 className="font-semibold mb-2">Image Requirements</h4>
                  <ul className="text-sm space-y-1 text-gray-600">
                    <li>• Recommended size: 600x400 pixels</li>
                    <li>• Format: JPG or PNG</li>
                    <li>• High quality and well-lit</li>
                    <li>• Professional furniture photography</li>
                    <li>• Consistent style across all products</li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="database" className="mt-6">
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Database Management</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="bg-green-50 p-4 rounded-lg">
                  <h4 className="font-semibold mb-2">Neon Database Console</h4>
                  <p className="text-sm text-gray-600 mb-3">
                    Your primary tool for managing products, orders, and users.
                  </p>
                  <Button 
                    variant="outline"
                    onClick={() => window.open('https://console.neon.tech', '_blank')}
                  >
                    <Database className="w-4 h-4 mr-2" />
                    Open Neon Console
                  </Button>
                </div>

                <div className="bg-blue-50 p-4 rounded-lg">
                  <h4 className="font-semibold mb-2">Common Database Tasks</h4>
                  <ul className="text-sm space-y-2 text-gray-600">
                    <li>• Add new products to the "products" table</li>
                    <li>• Update product prices and availability</li>
                    <li>• View customer orders in the "orders" table</li>
                    <li>• Manage user accounts in the "users" table</li>
                    <li>• Export data for analytics and reporting</li>
                  </ul>
                </div>

                <div className="bg-yellow-50 p-4 rounded-lg">
                  <h4 className="font-semibold mb-2">Backup and Security</h4>
                  <ul className="text-sm space-y-2 text-gray-600">
                    <li>• Neon automatically backs up your database</li>
                    <li>• Access is controlled through environment variables</li>
                    <li>• Never share database credentials publicly</li>
                    <li>• Monitor database usage in Neon dashboard</li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}