import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';

export const AuthForm = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [authMode, setAuthMode] = useState<'email' | 'phone'>('email');
  const [showOtpVerification, setShowOtpVerification] = useState(false);
  const { signUp, signUpWithPhone, signIn, signInWithPhone, signInWithGoogle, signInWithFacebook, signInWithTwitter, sendOTP, verifyOTP } = useAuth();
  const { toast } = useToast();

  const [signInForm, setSignInForm] = useState({
    email: '',
    phone: '',
    password: '',
  });

  const [signUpForm, setSignUpForm] = useState({
    fullName: '',
    phoneNumber: '',
    userType: 'customer',
  });

  const [otpForm, setOtpForm] = useState({
    phone: '',
    otp: '',
  });

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    const { error } = authMode === 'email' 
      ? await signIn(signInForm.email, signInForm.password)
      : await signInWithPhone(signInForm.phone, signInForm.password);
    
    if (error) {
      toast({
        variant: "destructive",
        title: "Error signing in",
        description: error.message,
      });
    } else {
      toast({
        title: "Welcome back!",
        description: "You have been signed in successfully.",
      });
    }
    
    setIsLoading(false);
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // First send OTP when creating account
    const { error } = await sendOTP(signUpForm.phoneNumber);
    
    if (error) {
      toast({
        variant: "destructive",
        title: "Error sending OTP",
        description: error.message,
      });
    } else {
      setOtpForm({ ...otpForm, phone: signUpForm.phoneNumber });
      setShowOtpVerification(true);
      toast({
        title: "OTP sent!",
        description: "Please check your phone for the verification code.",
      });
    }
    
    setIsLoading(false);
  };

  const handleSendOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    const { error } = await sendOTP(otpForm.phone);
    
    if (error) {
      toast({
        variant: "destructive",
        title: "Error sending OTP",
        description: error.message,
      });
    } else {
      setShowOtpVerification(true);
      toast({
        title: "OTP sent!",
        description: "Please check your phone for the verification code.",
      });
    }
    
    setIsLoading(false);
  };

  const handleVerifyOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    const { error } = await verifyOTP(otpForm.phone, otpForm.otp);
    
    if (error) {
      toast({
        variant: "destructive",
        title: "Error verifying OTP",
        description: error.message,
      });
    } else {
      toast({
        title: "Welcome!",
        description: "You have been signed in successfully.",
      });
      setShowOtpVerification(false);
    }
    
    setIsLoading(false);
  };

  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    const { error } = await signInWithGoogle();
    
    if (error) {
      toast({
        variant: "destructive",
        title: "Error signing in with Google",
        description: error.message,
      });
    }
    
    setIsLoading(false);
  };

  const handleFacebookSignIn = async () => {
    setIsLoading(true);
    const { error } = await signInWithFacebook();
    
    if (error) {
      toast({
        variant: "destructive",
        title: "Error signing in with Facebook",
        description: error.message,
      });
    }
    
    setIsLoading(false);
  };

  const handleTwitterSignIn = async () => {
    setIsLoading(true);
    const { error } = await signInWithTwitter();
    
    if (error) {
      toast({
        variant: "destructive",
        title: "Error signing in with X",
        description: error.message,
      });
    }
    
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Service Marketplace</CardTitle>
          <CardDescription>Sign in to your account or create a new one</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="signin" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="signin">Sign In</TabsTrigger>
              <TabsTrigger value="signup">Sign Up</TabsTrigger>
            </TabsList>
            
            <TabsContent value="signin">
              <div className="space-y-4">
                <div className="flex space-x-2">
                  <Button
                    type="button"
                    variant={authMode === 'email' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setAuthMode('email')}
                  >
                    Email
                  </Button>
                  <Button
                    type="button"
                    variant={authMode === 'phone' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setAuthMode('phone')}
                  >
                    Phone
                  </Button>
                </div>
                
                <form onSubmit={handleSignIn} className="space-y-4">
                  {authMode === 'email' ? (
                    <div className="space-y-2">
                      <Label htmlFor="signin-email">Email</Label>
                      <Input
                        id="signin-email"
                        type="email"
                        value={signInForm.email}
                        onChange={(e) => setSignInForm({ ...signInForm, email: e.target.value })}
                        required
                      />
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <Label htmlFor="signin-phone">Phone Number</Label>
                      <Input
                        id="signin-phone"
                        type="tel"
                        value={signInForm.phone}
                        onChange={(e) => setSignInForm({ ...signInForm, phone: e.target.value })}
                        placeholder="+1234567890"
                        required
                      />
                    </div>
                  )}
                  <div className="space-y-2">
                    <Label htmlFor="signin-password">Password</Label>
                    <Input
                      id="signin-password"
                      type="password"
                      value={signInForm.password}
                      onChange={(e) => setSignInForm({ ...signInForm, password: e.target.value })}
                      required
                    />
                  </div>
                  <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Sign In
                  </Button>
                </form>
              </div>
            </TabsContent>
            
            <TabsContent value="signup">
              {!showOtpVerification ? (
                <form onSubmit={handleSignUp} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="signup-name">Full Name</Label>
                    <Input
                      id="signup-name"
                      type="text"
                      value={signUpForm.fullName}
                      onChange={(e) => setSignUpForm({ ...signUpForm, fullName: e.target.value })}
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="signup-phone-number">Phone Number</Label>
                    <Input
                      id="signup-phone-number"
                      type="tel"
                      value={signUpForm.phoneNumber}
                      onChange={(e) => setSignUpForm({ ...signUpForm, phoneNumber: e.target.value })}
                      placeholder="+1234567890"
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="user-type">Account Type</Label>
                    <select
                      id="user-type"
                      className="w-full p-2 border border-input rounded-md bg-background"
                      value={signUpForm.userType}
                      onChange={(e) => setSignUpForm({ ...signUpForm, userType: e.target.value })}
                    >
                      <option value="customer">Customer</option>
                      <option value="vendor">Service Provider</option>
                    </select>
                  </div>
                  <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Send OTP
                  </Button>
                </form>
              ) : (
                <form onSubmit={handleVerifyOTP} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="otp-code">Enter OTP Code</Label>
                    <Input
                      id="otp-code"
                      type="text"
                      value={otpForm.otp}
                      onChange={(e) => setOtpForm({ ...otpForm, otp: e.target.value })}
                      placeholder="123456"
                      required
                    />
                  </div>
                  <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Verify OTP
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    className="w-full"
                    onClick={() => setShowOtpVerification(false)}
                  >
                    Back to Sign Up
                  </Button>
                </form>
              )}
            </TabsContent>
          </Tabs>
          
          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-border" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-muted-foreground">
                  Or continue with
                </span>
              </div>
            </div>
            <div className="mt-4 space-y-2">
              <Button
                variant="outline"
                className="w-full"
                onClick={handleGoogleSignIn}
                disabled={isLoading}
              >
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Sign in with Google
              </Button>
              <Button
                variant="outline"
                className="w-full"
                onClick={handleFacebookSignIn}
                disabled={isLoading}
              >
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Sign in with Facebook
              </Button>
              <Button
                variant="outline"
                className="w-full"
                onClick={handleTwitterSignIn}
                disabled={isLoading}
              >
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Sign in with X
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};