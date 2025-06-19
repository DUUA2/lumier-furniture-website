import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar, Package, RefreshCw, Clock, Truck, Star } from "lucide-react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

interface SubscriptionData {
  id: number;
  planType: string;
  status: string;
  refreshFrequency: string;
  seasonalRefreshEnabled: boolean;
  lastRefreshDate: string | null;
  nextRefreshDate: string | null;
  monthlyPayment: number;
  currentItems: Array<{
    productId: number;
    name: string;
    customizations?: any;
    deliveryDate: string;
  }>;
  refreshHistory: Array<{
    refreshDate: string;
    previousItems: Array<{productId: number; name: string}>;
    newItems: Array<{productId: number; name: string}>;
    reason: string;
  }>;
}

export default function Dashboard() {
  const { user, isAuthenticated } = useAuth();
  const { toast } = useToast();
  const [selectedRefreshDate, setSelectedRefreshDate] = useState<string>("");

  const { data: subscription, isLoading } = useQuery<SubscriptionData>({
    queryKey: ["/api/subscription/current"],
    enabled: isAuthenticated,
  });

  const scheduleRefreshMutation = useMutation({
    mutationFn: async (data: { date: string; reason: string }) => {
      return apiRequest("POST", "/api/subscription/schedule-refresh", data);
    },
    onSuccess: () => {
      toast({
        title: "Refresh Scheduled",
        description: "Your seasonal refresh has been scheduled successfully.",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/subscription/current"] });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to schedule refresh. Please try again.",
        variant: "destructive",
      });
    }
  });

  const calculateProgressToNextRefresh = () => {
    if (!subscription?.nextRefreshDate || !subscription?.lastRefreshDate) return 0;
    
    const now = new Date().getTime();
    const lastRefresh = new Date(subscription.lastRefreshDate).getTime();
    const nextRefresh = new Date(subscription.nextRefreshDate).getTime();
    
    const totalDuration = nextRefresh - lastRefresh;
    const elapsed = now - lastRefresh;
    
    return Math.min(Math.max((elapsed / totalDuration) * 100, 0), 100);
  };

  const getDaysUntilNextRefresh = () => {
    if (!subscription?.nextRefreshDate) return null;
    
    const now = new Date();
    const nextRefresh = new Date(subscription.nextRefreshDate);
    const diffTime = nextRefresh.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    return diffDays > 0 ? diffDays : 0;
  };

  const planTypeLabels = {
    basic: "Basic Plan",
    premium: "Premium Plan", 
    elite: "Elite Plan"
  };

  const refreshFrequencyLabels = {
    quarterly: "Every 3 Months",
    biannual: "Every 6 Months"
  };

  if (!isAuthenticated) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-2xl font-bold mb-4">Access Denied</h1>
        <p className="text-lumiere-gray mb-6">Please sign in to view your dashboard.</p>
        <Button onClick={() => window.location.href = '/api/login'}>
          Sign In
        </Button>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-300 rounded w-48 mx-auto mb-4"></div>
          <div className="h-4 bg-gray-300 rounded w-32 mx-auto"></div>
        </div>
      </div>
    );
  }

  if (!subscription) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-2xl font-bold mb-4">No Active Subscription</h1>
        <p className="text-lumiere-gray mb-6">You don't have an active subscription yet.</p>
        <Button onClick={() => window.location.href = '/subscription'}>
          Browse Subscription Plans
        </Button>
      </div>
    );
  }

  const progress = calculateProgressToNextRefresh();
  const daysUntilRefresh = getDaysUntilNextRefresh();

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">My Dashboard</h1>
        <p className="text-lumiere-gray">Welcome back, {(user as any)?.firstName || 'Member'}!</p>
      </div>

      <div className="grid lg:grid-cols-3 gap-6 mb-8">
        {/* Current Subscription Overview */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Package className="h-5 w-5" />
              Current Subscription
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold">{planTypeLabels[subscription.planType as keyof typeof planTypeLabels]}</h3>
                <p className="text-sm text-lumiere-gray">₦{subscription.monthlyPayment.toLocaleString()}/month</p>
              </div>
              <Badge variant={subscription.status === 'active' ? 'default' : 'secondary'}>
                {subscription.status.charAt(0).toUpperCase() + subscription.status.slice(1)}
              </Badge>
            </div>

            {subscription.seasonalRefreshEnabled && (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Next Refresh Progress</span>
                  <span className="text-sm text-lumiere-gray">
                    {daysUntilRefresh !== null ? `${daysUntilRefresh} days remaining` : 'Calculating...'}
                  </span>
                </div>
                <Progress value={progress} className="h-2" />
                <p className="text-xs text-lumiere-gray">
                  Refresh frequency: {refreshFrequencyLabels[subscription.refreshFrequency as keyof typeof refreshFrequencyLabels]}
                </p>
              </div>
            )}

            <div className="grid sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <p className="text-sm font-medium">Current Items</p>
                <p className="text-2xl font-bold text-lumiere-gold">{subscription.currentItems.length}</p>
              </div>
              <div className="space-y-2">
                <p className="text-sm font-medium">Total Refreshes</p>
                <p className="text-2xl font-bold text-lumiere-gold">{subscription.refreshHistory.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <RefreshCw className="h-5 w-5" />
              Quick Actions
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button 
              className="w-full"
              disabled={!subscription.seasonalRefreshEnabled || daysUntilRefresh === null || daysUntilRefresh > 30}
              onClick={() => {
                const nextWeek = new Date();
                nextWeek.setDate(nextWeek.getDate() + 7);
                setSelectedRefreshDate(nextWeek.toISOString().split('T')[0]);
                scheduleRefreshMutation.mutate({
                  date: nextWeek.toISOString(),
                  reason: "Early seasonal refresh"
                });
              }}
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Schedule Early Refresh
            </Button>
            
            <Button variant="outline" className="w-full">
              <Calendar className="h-4 w-4 mr-2" />
              View Calendar
            </Button>
            
            <Button variant="outline" className="w-full">
              <Truck className="h-4 w-4 mr-2" />
              Track Delivery
            </Button>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="current-items" className="space-y-6">
        <TabsList>
          <TabsTrigger value="current-items">Current Items</TabsTrigger>
          <TabsTrigger value="refresh-history">Refresh History</TabsTrigger>
          <TabsTrigger value="preferences">Preferences</TabsTrigger>
        </TabsList>

        <TabsContent value="current-items" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Your Current Furniture</CardTitle>
            </CardHeader>
            <CardContent>
              {subscription.currentItems.length > 0 ? (
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {subscription.currentItems.map((item, index) => (
                    <div key={index} className="border rounded-lg p-4">
                      <h4 className="font-semibold">{item.name}</h4>
                      <p className="text-sm text-lumiere-gray">Delivered: {new Date(item.deliveryDate).toLocaleDateString()}</p>
                      {item.customizations && (
                        <Badge variant="outline" className="mt-2">
                          Customized
                        </Badge>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-center text-lumiere-gray py-8">No current items in your subscription.</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="refresh-history" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Seasonal Refresh History</CardTitle>
            </CardHeader>
            <CardContent>
              {subscription.refreshHistory.length > 0 ? (
                <div className="space-y-4">
                  {subscription.refreshHistory.map((refresh, index) => (
                    <div key={index} className="border rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-semibold">
                          {new Date(refresh.refreshDate).toLocaleDateString()}
                        </span>
                        <Badge variant="outline">{refresh.reason}</Badge>
                      </div>
                      <div className="grid sm:grid-cols-2 gap-4 text-sm">
                        <div>
                          <p className="font-medium mb-1">Previous Items:</p>
                          <ul className="text-lumiere-gray">
                            {refresh.previousItems.map((item, i) => (
                              <li key={i}>• {item.name}</li>
                            ))}
                          </ul>
                        </div>
                        <div>
                          <p className="font-medium mb-1">New Items:</p>
                          <ul className="text-lumiere-gray">
                            {refresh.newItems.map((item, i) => (
                              <li key={i}>• {item.name}</li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-center text-lumiere-gray py-8">No refresh history yet.</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="preferences" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Subscription Preferences</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Seasonal Refresh</p>
                  <p className="text-sm text-lumiere-gray">Automatically refresh your furniture seasonally</p>
                </div>
                <Badge variant={subscription.seasonalRefreshEnabled ? "default" : "secondary"}>
                  {subscription.seasonalRefreshEnabled ? "Enabled" : "Disabled"}
                </Badge>
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Email Notifications</p>
                  <p className="text-sm text-lumiere-gray">Get notified about upcoming refreshes and updates</p>
                </div>
                <Badge variant="default">Enabled</Badge>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Refresh Frequency</p>
                  <p className="text-sm text-lumiere-gray">How often you want to refresh your items</p>
                </div>
                <Badge variant="outline">
                  {refreshFrequencyLabels[subscription.refreshFrequency as keyof typeof refreshFrequencyLabels]}
                </Badge>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}