import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";

export default function TestLogin() {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    email: "",
    firstName: "",
    lastName: "",
    phone: ""
  });

  const createUserMutation = useMutation({
    mutationFn: async (userData: typeof formData) => {
      const response = await fetch('/api/create-test-user', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData)
      });
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to create user');
      }
      return response.json();
    },
    onSuccess: (data) => {
      toast({
        title: "Account Created Successfully!",
        description: `Account created for ${data.user.email}. You can now login below.`,
      });
      // Don't clear email so user can easily login
      setFormData(prev => ({ ...prev, firstName: "", lastName: "", phone: "" }));
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  });

  const loginMutation = useMutation({
    mutationFn: async (email: string) => {
      const response = await fetch('/api/test-login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to login');
      }
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Login Successful",
        description: "You are now logged in. Redirecting to account page...",
      });
      setTimeout(() => {
        window.location.href = '/account';
      }, 2000);
    },
    onError: (error: Error) => {
      toast({
        title: "Login Error",
        description: error.message,
        variant: "destructive",
      });
    }
  });

  const createOrderMutation = useMutation({
    mutationFn: async (email: string) => {
      const response = await fetch('/api/create-test-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userEmail: email })
      });
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to create test order');
      }
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Test Order Created",
        description: "A sample order has been created for your account. Go to /account to view it.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Order Creation Error",
        description: error.message,
        variant: "destructive",
      });
    }
  });

  const handleCreateUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.email || !formData.firstName) {
      toast({
        title: "Missing Information",
        description: "Email and first name are required.",
        variant: "destructive",
      });
      return;
    }
    createUserMutation.mutate(formData);
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.email) {
      toast({
        title: "Missing Email",
        description: "Please enter your email address.",
        variant: "destructive",
      });
      return;
    }
    loginMutation.mutate(formData.email);
  };

  const handleCreateOrder = () => {
    if (!formData.email) {
      toast({
        title: "Missing Email",
        description: "Please enter your email address first.",
        variant: "destructive",
      });
      return;
    }
    createOrderMutation.mutate(formData.email);
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-md">
      <h1 className="text-3xl font-bold text-center mb-2">Test Account Access</h1>
      <p className="text-center text-muted-foreground mb-8">Create and login to test the customer account features</p>
      
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Create Test Account</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleCreateUser} className="space-y-4">
              <div>
                <Label htmlFor="email">Email *</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="test@example.com"
                  required
                />
              </div>
              <div>
                <Label htmlFor="firstName">First Name *</Label>
                <Input
                  id="firstName"
                  type="text"
                  value={formData.firstName}
                  onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                  placeholder="John"
                  required
                />
              </div>
              <div>
                <Label htmlFor="lastName">Last Name</Label>
                <Input
                  id="lastName"
                  type="text"
                  value={formData.lastName}
                  onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                  placeholder="Doe"
                />
              </div>
              <div>
                <Label htmlFor="phone">Phone</Label>
                <Input
                  id="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="+234 123 456 7890"
                />
              </div>
              <Button 
                type="submit" 
                className="w-full bg-lumiere-gold hover:bg-lumiere-gold/90"
                disabled={createUserMutation.isPending}
              >
                {createUserMutation.isPending ? 'Creating...' : 'Create Test Account'}
              </Button>
            </form>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Login to Existing Account</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <Label htmlFor="loginEmail">Email</Label>
                <Input
                  id="loginEmail"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="test@example.com"
                  required
                />
              </div>
              <Button 
                type="submit" 
                className="w-full"
                disabled={loginMutation.isPending}
              >
                {loginMutation.isPending ? 'Logging in...' : 'Login'}
              </Button>
            </form>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Create Test Order</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground">
                Create a sample order to test the account management features.
              </p>
              <Button 
                onClick={handleCreateOrder}
                className="w-full bg-green-600 hover:bg-green-700"
                disabled={createOrderMutation.isPending || !formData.email}
              >
                {createOrderMutation.isPending ? 'Creating Order...' : 'Create Test Order'}
              </Button>
            </div>
          </CardContent>
        </Card>

        <div className="text-center text-sm text-muted-foreground">
          <p>After creating an account and logging in, you can:</p>
          <ul className="mt-2 space-y-1">
            <li>• Create test orders to see them in your account</li>
            <li>• View order history and payment status</li>
            <li>• Test the "Pay Remaining Balance" feature</li>
            <li>• See your profile information</li>
          </ul>
          <p className="mt-4 font-medium">
            Visit <span className="bg-gray-100 px-2 py-1 rounded">/account</span> after logging in to see your customer dashboard
          </p>
        </div>
      </div>
    </div>
  );
}