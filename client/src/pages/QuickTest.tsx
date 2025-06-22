import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function QuickTest() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(false);

  const createAccountAndLogin = async () => {
    if (!email) {
      setStatus("Please enter an email address");
      return;
    }

    setLoading(true);
    setStatus("Creating account...");

    try {
      // Create user
      const createResponse = await fetch('/api/create-test-user', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          firstName: "Test",
          lastName: "User",
          phone: "+234 123 456 7890"
        })
      });

      if (createResponse.ok) {
        setStatus("Account created! Logging in...");
        
        // Login
        const loginResponse = await fetch('/api/test-login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email })
        });

        if (loginResponse.ok) {
          setStatus("Login successful! Creating test order...");
          
          // Create test order
          const orderResponse = await fetch('/api/create-test-order', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ userEmail: email })
          });

          if (orderResponse.ok) {
            setStatus("All set! Redirecting to your account page...");
            setTimeout(() => {
              window.location.href = '/account';
            }, 2000);
          } else {
            setStatus("Account ready! Go to /account to view (no test order created)");
          }
        } else {
          setStatus("Account created but login failed. Try the login form above.");
        }
      } else {
        const error = await createResponse.json();
        if (error.error === 'User already exists') {
          setStatus("Account exists! Trying to login...");
          
          const loginResponse = await fetch('/api/test-login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email })
          });

          if (loginResponse.ok) {
            setStatus("Login successful! Redirecting to account page...");
            setTimeout(() => {
              window.location.href = '/account';
            }, 2000);
          } else {
            setStatus("User exists but login failed. Check your email.");
          }
        } else {
          setStatus(`Error: ${error.error}`);
        }
      }
    } catch (error) {
      setStatus("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-md">
      <h1 className="text-3xl font-bold text-center mb-2">Quick Test Access</h1>
      <p className="text-center text-muted-foreground mb-8">
        One-click setup to test the customer account page
      </p>
      
      <Card>
        <CardHeader>
          <CardTitle>Instant Account Setup</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="email">Your Email</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="test@example.com"
              disabled={loading}
            />
          </div>
          
          <Button 
            onClick={createAccountAndLogin}
            className="w-full bg-lumiere-gold hover:bg-lumiere-gold/90"
            disabled={loading || !email}
          >
            {loading ? 'Setting up...' : 'Create Account & Login'}
          </Button>
          
          {status && (
            <div className="p-3 bg-gray-50 rounded text-sm text-center">
              {status}
            </div>
          )}
          
          <div className="text-xs text-muted-foreground text-center space-y-1">
            <p>This will:</p>
            <p>• Create a test account with your email</p>
            <p>• Log you in automatically</p>
            <p>• Create a sample order</p>
            <p>• Take you to the account page</p>
          </div>
        </CardContent>
      </Card>

      <div className="mt-6 text-center">
        <p className="text-sm text-muted-foreground mb-2">
          Or manually visit:
        </p>
        <div className="space-y-2">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => window.location.href = '/account'}
          >
            Go to Account Page
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => window.location.href = '/test-login'}
          >
            Advanced Test Options
          </Button>
        </div>
      </div>
    </div>
  );
}