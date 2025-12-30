import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useToast } from "@/hooks/use-toast";
import { z } from "zod";
import { Loader2 } from "lucide-react";
import alcLogo from "@/assets/alc-logo.png";

const authSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  name: z.string().min(2, "Name must be at least 2 characters"),
  date_of_birth: z.string().refine((val) => {
    const date = new Date(val);
    const today = new Date();
    const age = today.getFullYear() - date.getFullYear();
    return age >= 18;
  }, "You need to be 18 or older to join"),
  gender: z.enum(["male", "female", "other", "prefer_not_to_say"]),
  years_teaching_experience: z.number().min(0, "Must be 0 or greater").max(60, "Must be 60 or less"),
});

const Auth = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isLogin, setIsLogin] = useState(true);
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);

  // Helper to get default date (18 years ago)
  const getDefault18YearOldDate = () => {
    const today = new Date();
    const eighteenYearsAgo = new Date(
      today.getFullYear() - 18,
      today.getMonth(),
      today.getDate()
    );
    return eighteenYearsAgo.toISOString().split('T')[0];
  };

  // Form state
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState(getDefault18YearOldDate);
  const [gender, setGender] = useState<"male" | "female" | "other" | "prefer_not_to_say">("prefer_not_to_say");
  const [yearsExperience, setYearsExperience] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      toast({
        title: "Welcome back!",
        description: "You've successfully signed in.",
      });
      navigate("/");
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();

    if (step < 3) {
      // Validate current step before proceeding
      try {
        if (step === 1) {
          z.object({
            email: authSchema.shape.email,
            password: authSchema.shape.password,
          }).parse({ email, password });
        } else if (step === 2) {
          z.object({
            name: authSchema.shape.name,
            date_of_birth: authSchema.shape.date_of_birth,
          }).parse({ name, date_of_birth: dateOfBirth });
        }
        setStep(step + 1);
      } catch (error: any) {
        toast({
          title: "Validation Error",
          description: error.errors[0]?.message || "Please check your inputs",
          variant: "destructive",
        });
      }
      return;
    }

    // Final validation and signup
    setLoading(true);
    try {
      const validatedData = authSchema.parse({
        email,
        password,
        name,
        date_of_birth: dateOfBirth,
        gender,
        years_teaching_experience: parseInt(yearsExperience),
      });

      const { error } = await supabase.auth.signUp({
        email: validatedData.email,
        password: validatedData.password,
        options: {
          emailRedirectTo: `${window.location.origin}/`,
          data: {
            name: validatedData.name,
            date_of_birth: validatedData.date_of_birth,
            gender: validatedData.gender,
            years_teaching_experience: validatedData.years_teaching_experience,
          },
        },
      });

      if (error) throw error;

      toast({
        title: "Account created!",
        description: "Welcome to FOP Companion!",
      });
      navigate("/");
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to create account",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen min-h-[100dvh] bg-gradient-to-br from-primary/10 via-background to-secondary/10 flex flex-col items-center justify-center p-6 pt-[max(env(safe-area-inset-top),24px)] pb-[env(safe-area-inset-bottom)]">
      <div className="w-full max-w-md space-y-8">
        {/* Header - App Name First */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            FOP Companion
          </h1>
          <p className="text-muted-foreground text-sm">
            Track your teaching journey
          </p>
          <img 
            src={alcLogo} 
            alt="Adult Learning Collaboratory" 
            className="h-8 w-auto mx-auto opacity-70"
          />
        </div>

        {/* Form Container */}
        <div className="bg-card rounded-2xl border-2 border-border p-6 space-y-6">
          {isLogin ? (
            // Login Form
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <h2 className="text-2xl font-semibold text-foreground">Welcome Back</h2>
                <p className="text-sm text-muted-foreground">Sign in to continue</p>
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="login-email">Email</Label>
                  <Input
                    id="login-email"
                    type="email"
                    placeholder="teacher@school.edu"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="login-password">Password</Label>
                  <Input
                    id="login-password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
              </div>

              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? <><Loader2 className="animate-spin" /> Signing In...</> : "Sign In"}
              </Button>

              <p className="text-center text-sm text-muted-foreground">
                Don't have an account?{" "}
                <button
                  type="button"
                  onClick={() => setIsLogin(false)}
                  className="text-primary font-medium hover:underline"
                >
                  Sign Up
                </button>
              </p>
            </form>
          ) : (
            // Signup Form (Multi-step)
            <form onSubmit={handleSignup} className="space-y-4">
              <div className="space-y-2">
                <h2 className="text-2xl font-semibold text-foreground">Create Account</h2>
                <p className="text-sm text-muted-foreground">Step {step} of 3</p>
              </div>

              {/* Progress indicator */}
              <div className="flex gap-2">
                {[1, 2, 3].map((s) => (
                  <div
                    key={s}
                    className={`h-2 flex-1 rounded-full transition-colors ${
                      s <= step ? "bg-primary" : "bg-muted"
                    }`}
                  />
                ))}
              </div>

              {/* Step 1: Credentials */}
              {step === 1 && (
                <div className="space-y-4 animate-slide-in-up">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="teacher@school.edu"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="password">Password</Label>
                    <Input
                      id="password"
                      type="password"
                      placeholder="Minimum 6 characters"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                  </div>
                </div>
              )}

              {/* Step 2: Personal Info */}
              {step === 2 && (
                <div className="space-y-4 animate-slide-in-up">
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name</Label>
                    <Input
                      id="name"
                      type="text"
                      placeholder="Sarah Johnson"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="dob">Date of Birth</Label>
                    <Input
                      id="dob"
                      type="date"
                      value={dateOfBirth}
                      onChange={(e) => setDateOfBirth(e.target.value)}
                      required
                    />
                  </div>
                </div>
              )}

              {/* Step 3: Professional Info */}
              {step === 3 && (
                <div className="space-y-4 animate-slide-in-up">
                  <div className="space-y-2">
                    <Label>Gender</Label>
                    <RadioGroup value={gender} onValueChange={(v: any) => setGender(v)}>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="male" id="male" />
                        <Label htmlFor="male" className="font-normal">Male</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="female" id="female" />
                        <Label htmlFor="female" className="font-normal">Female</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="other" id="other" />
                        <Label htmlFor="other" className="font-normal">Other</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="prefer_not_to_say" id="prefer_not_to_say" />
                        <Label htmlFor="prefer_not_to_say" className="font-normal">Prefer not to say</Label>
                      </div>
                    </RadioGroup>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="experience">Years of Teaching Experience</Label>
                    <Input
                      id="experience"
                      type="number"
                      min="0"
                      max="60"
                      placeholder="5"
                      value={yearsExperience}
                      onChange={(e) => setYearsExperience(e.target.value)}
                      required
                    />
                  </div>
                </div>
              )}

              <div className="flex gap-3">
                {step > 1 && (
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setStep(step - 1)}
                    className="flex-1"
                    disabled={loading}
                  >
                    Back
                  </Button>
                )}
                <Button type="submit" className="flex-1" disabled={loading}>
                  {loading ? (
                    <><Loader2 className="animate-spin" /> Creating...</>
                  ) : step === 3 ? (
                    "Create Account"
                  ) : (
                    "Continue"
                  )}
                </Button>
              </div>

              <p className="text-center text-sm text-muted-foreground">
                Already have an account?{" "}
                <button
                  type="button"
                  onClick={() => {
                    setIsLogin(true);
                    setStep(1);
                  }}
                  className="text-primary font-medium hover:underline"
                >
                  Sign In
                </button>
              </p>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default Auth;
