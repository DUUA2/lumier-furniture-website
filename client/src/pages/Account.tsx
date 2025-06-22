import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { Label } from "@/components/ui/label";
import { CreditCard, Calendar, Package, AlertCircle, CheckCircle, Clock } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import type { Order } from "@shared/schema";

interface PaymentSchedule {
  id: number;
  orderId: number;
  installmentNumber: number;
  amount: number;
  dueDate: string;
  status: 'pending' | 'paid' | 'overdue';
  paidDate?: string;
}

export default function Account() {
  const { user, loading } = useAuth();
  const { toast } = useToast();
  const [selectedOrder, setSelectedOrder] = useState<number | null>(null);

  // Fetch user orders
  const { data: orders = [], isLoading: ordersLoading } = useQuery({
    queryKey: ['/api/orders/user', user?.id],
    enabled: !!user?.id,
  });

  // Fetch payment schedules for selected order
  const { data: paymentSchedule = [], isLoading: scheduleLoading } = useQuery({
    queryKey: ['/api/orders', selectedOrder, 'payments'],
    enabled: !!selectedOrder,
  });

  // Pay remaining balance mutation
  const payRemainingMutation = useMutation({
    mutationFn: async (orderId: number) => {
      return apiRequest(`/api/orders/${orderId}/pay-remaining`, {
        method: 'POST'
      });
    },
    onSuccess: () => {
      toast({
        title: "Payment Successful",
        description: "Remaining balance has been paid in full.",
      });
      queryClient.invalidateQueries({ queryKey: ['/api/orders'] });
    },
    onError: () => {
      toast({
        title: "Payment Failed",
        description: "Unable to process payment. Please try again.",
        variant: "destructive",
      });
    }
  });

  // Pay single installment mutation
  const payInstallmentMutation = useMutation({
    mutationFn: async ({ orderId, installmentId }: { orderId: number; installmentId: number }) => {
      return apiRequest(`/api/orders/${orderId}/installments/${installmentId}/pay`, {
        method: 'POST'
      });
    },
    onSuccess: () => {
      toast({
        title: "Payment Successful",
        description: "Installment payment processed successfully.",
      });
      queryClient.invalidateQueries({ queryKey: ['/api/orders'] });
    },
    onError: () => {
      toast({
        title: "Payment Failed",
        description: "Unable to process installment payment. Please try again.",
        variant: "destructive",
      });
    }
  });

  if (loading || ordersLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-lumiere-gold mx-auto mb-4"></div>
            <p>Loading your account...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card>
          <CardContent className="p-8 text-center">
            <AlertCircle className="h-12 w-12 text-yellow-500 mx-auto mb-4" />
            <h2 className="text-xl font-semibold mb-2">Sign In Required</h2>
            <p className="text-muted-foreground mb-4">
              Please sign in to view your account and payment information.
            </p>
            <Button onClick={() => window.location.href = '/checkout'}>
              Sign In
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const calculateOrderProgress = (order: Order) => {
    if (order.paymentStatus === 'completed') return 100;
    if (order.paymentType === 'full') return order.paymentStatus === 'completed' ? 100 : 0;
    
    // For installment orders, calculate based on payments made
    const totalAmount = order.totalAmount;
    const downPayment = totalAmount * 0.7; // 70% down payment
    const remainingAmount = totalAmount - downPayment;
    
    // This would need to be calculated based on actual payment records
    // For now, showing based on payment status
    if (order.paymentStatus === 'pending') return 70; // Down payment made
    return 100;
  };

  const getRemainingBalance = (order: Order) => {
    if (order.paymentStatus === 'completed') return 0;
    if (order.paymentType === 'full') return order.totalAmount;
    
    const totalAmount = order.totalAmount;
    const downPayment = totalAmount * 0.7;
    return totalAmount - downPayment;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-500';
      case 'pending': return 'bg-yellow-500';
      case 'overdue': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return <CheckCircle className="h-4 w-4" />;
      case 'pending': return <Clock className="h-4 w-4" />;
      case 'overdue': return <AlertCircle className="h-4 w-4" />;
      default: return <Package className="h-4 w-4" />;
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-lumiere-dark">My Account</h1>
        <p className="text-muted-foreground">
          Welcome back, {user.name}! Manage your orders and payments.
        </p>
      </div>

      <Tabs defaultValue="orders" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="orders">My Orders</TabsTrigger>
          <TabsTrigger value="payments">Payment Schedule</TabsTrigger>
          <TabsTrigger value="profile">Profile</TabsTrigger>
        </TabsList>

        <TabsContent value="orders" className="space-y-6">
          {orders.length === 0 ? (
            <Card>
              <CardContent className="p-8 text-center">
                <Package className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">No Orders Yet</h3>
                <p className="text-muted-foreground mb-4">
                  You haven't placed any orders yet. Start shopping to see your orders here.
                </p>
                <Button onClick={() => window.location.href = '/'}>
                  Start Shopping
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-6">
              {orders.map((order: Order) => {
                const progress = calculateOrderProgress(order);
                const remaining = getRemainingBalance(order);
                
                return (
                  <Card key={order.id} className="p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="text-lg font-semibold">Order #{order.id}</h3>
                        <p className="text-sm text-muted-foreground">
                          Placed on {new Date(order.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                      <Badge className={`${getStatusColor(order.paymentStatus)} text-white`}>
                        {getStatusIcon(order.paymentStatus)}
                        <span className="ml-1 capitalize">{order.paymentStatus}</span>
                      </Badge>
                    </div>

                    <div className="space-y-4">
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span>Payment Progress</span>
                          <span>{progress}%</span>
                        </div>
                        <Progress value={progress} className="h-2" />
                      </div>

                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                        <div>
                          <p className="text-muted-foreground">Total Amount</p>
                          <p className="font-semibold">₦{order.totalAmount.toLocaleString()}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Payment Type</p>
                          <p className="font-semibold capitalize">{order.paymentType}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Remaining Balance</p>
                          <p className="font-semibold text-lumiere-gold">₦{remaining.toLocaleString()}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Delivery Status</p>
                          <p className="font-semibold capitalize">{order.deliveryStatus || 'Processing'}</p>
                        </div>
                      </div>

                      {remaining > 0 && (
                        <div className="flex gap-2 pt-4 border-t">
                          <Button
                            onClick={() => payRemainingMutation.mutate(order.id)}
                            disabled={payRemainingMutation.isPending}
                            className="bg-lumiere-gold hover:bg-lumiere-gold/90"
                          >
                            <CreditCard className="h-4 w-4 mr-2" />
                            Pay Remaining ₦{remaining.toLocaleString()}
                          </Button>
                          {order.paymentType === 'installment' && (
                            <Button
                              variant="outline"
                              onClick={() => setSelectedOrder(order.id)}
                            >
                              <Calendar className="h-4 w-4 mr-2" />
                              View Payment Schedule
                            </Button>
                          )}
                        </div>
                      )}
                    </div>
                  </Card>
                );
              })}
            </div>
          )}
        </TabsContent>

        <TabsContent value="payments" className="space-y-6">
          {!selectedOrder ? (
            <Card>
              <CardContent className="p-8 text-center">
                <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">Select an Order</h3>
                <p className="text-muted-foreground">
                  Choose an order from the Orders tab to view its payment schedule.
                </p>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardHeader>
                <CardTitle>Payment Schedule - Order #{selectedOrder}</CardTitle>
              </CardHeader>
              <CardContent>
                {scheduleLoading ? (
                  <div className="text-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-lumiere-gold mx-auto"></div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {paymentSchedule.map((payment: PaymentSchedule) => (
                      <div key={payment.id} className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="flex items-center gap-4">
                          <div className={`w-3 h-3 rounded-full ${getStatusColor(payment.status)}`} />
                          <div>
                            <p className="font-medium">Installment #{payment.installmentNumber}</p>
                            <p className="text-sm text-muted-foreground">
                              Due: {new Date(payment.dueDate).toLocaleDateString()}
                              {payment.paidDate && (
                                <span className="ml-2 text-green-600">
                                  (Paid: {new Date(payment.paidDate).toLocaleDateString()})
                                </span>
                              )}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-4">
                          <span className="font-semibold">₦{payment.amount.toLocaleString()}</span>
                          {payment.status === 'pending' && (
                            <Button
                              size="sm"
                              onClick={() => payInstallmentMutation.mutate({
                                orderId: selectedOrder,
                                installmentId: payment.id
                              })}
                              disabled={payInstallmentMutation.isPending}
                            >
                              Pay Now
                            </Button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="profile" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Profile Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium">Name</Label>
                  <p className="text-sm">{user.name}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Email</Label>
                  <p className="text-sm">{user.email}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Phone</Label>
                  <p className="text-sm">{user.phone || 'Not provided'}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Member Since</Label>
                  <p className="text-sm">{new Date(user.createdAt).toLocaleDateString()}</p>
                </div>
              </div>
              <Separator />
              <Button variant="outline">
                Edit Profile
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}