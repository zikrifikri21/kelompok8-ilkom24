"use client";

import type React from "react";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Checkbox } from "@/components/ui/checkbox";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Eye, EyeOff } from "lucide-react";
import Image from "next/image";

function LoginForm() {
  const [fullName, setFullName] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const errorParam = searchParams.get("error");
    if (errorParam === "unauthorized") {
      setError("You don't have access. Please contact administrator.");
    }
  }, [searchParams]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    const supabase = createClient();
    setIsLoading(true);
    setError(null);

    try {
      const { error: authError } = await supabase.auth.signInWithPassword({
        email: fullName,
        password,
      });
      if (authError) throw authError;

      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (user) {
        router.push("/admin");
      }
    } catch (error: unknown) {
      setError(error instanceof Error ? error.message : "An error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* === Background untuk desktop === */}
      <div className="hidden md:block absolute inset-0">
        {/* <CHANGE> Added priority, optimized sizes, and loading optimization */}
        <Image
          src="https://www.omv.com/images/GvflD8YyeyxOOJFgPN1juD8YainJ-lH3HR5e-kVPCCk/c:4000:2250:fp:0.589:0.512/resize:fill-down:768:432/plain/local:///2024/06/9eb4fa9b-6881-65bd-c3e3-d8ca49a106e8/OMV_Energy_Green-Hydrogen_Wind-Turbine-Aerial-View-01_RGB_web.jpg@webp"
          width={1920}
          height={1080}
          alt="Wind turbines aerial view"
          className="w-full h-full object-cover"
          priority
          sizes="100vw"
          quality={85}
        />
        <div className="absolute inset-0 bg-black/40" />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/20 to-black/60" />
      </div>

      {/* === Background untuk mobile === */}
      <div className="block md:hidden absolute top-0 left-0 right-0 h-64 bg-gradient-to-b from-emerald-800 via-emerald-700 to-emerald-600 rounded-b-[3rem] overflow-hidden">
        <div className="absolute inset-0 opacity-50">
          {/* <CHANGE> Optimized mobile image loading */}
          <Image
            src="https://www.omv.com/images/GvflD8YyeyxOOJFgPN1juD8YainJ-lH3HR5e-kVPCCk/c:4000:2250:fp:0.589:0.512/resize:fill-down:768:432/plain/local:///2024/06/9eb4fa9b-6881-65bd-c3e3-d8ca49a106e8/OMV_Energy_Green-Hydrogen_Wind-Turbine-Aerial-View-01_RGB_web.jpg@webp"
            width={768}
            height={256}
            alt="Wind turbines aerial view"
            className="w-full h-full object-cover"
            sizes="(max-width: 768px) 100vw, 0px"
            quality={75}
          />
        </div>
        {/* <CHANGE> Simplified decorative elements to reduce DOM complexity */}
        <div className="absolute top-8 left-8 w-32 h-32 bg-emerald-300/20 rounded-full blur-xl" />
        <div className="absolute top-16 right-12 w-24 h-24 bg-emerald-200/15 rounded-full blur-lg" />
      </div>

      {/* === Form Section === */}
      <div className="relative z-10 flex items-center justify-center min-h-screen px-6 py-8">
        <div className="w-full max-w-sm">
          <div className="text-center mb-28 mt-0 md:mt-0">
            <div className="flex items-center justify-center gap-2 mb-2">
              {/* Mobile pakai Leaf, Desktop pakai Wind */}
              <h1 className="text-2xl md:text-3xl font-semibold md:font-bold text-white drop-shadow">Welcome Back</h1>
              <span className="text-white md:text-green-400">
                <Leaf className="w-6 h-6 md:hidden" />
                <Wind className="w-7 h-7 hidden md:inline" />
              </span>
            </div>
            <p className="text-white/90 text-sm drop-shadow">Login to your account</p>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-6 border border-emerald-100 md:bg-white/95 md:backdrop-blur-sm md:shadow-2xl md:border-white/20">
            <form onSubmit={handleLogin} className="space-y-5">
              <div className="space-y-2">
                <Label htmlFor="fullName" className="text-emerald-700 md:text-gray-700 text-sm font-medium">
                  Username
                </Label>
                <Input
                  id="fullName"
                  type="text"
                  placeholder="Enter your username"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="bg-emerald-50 md:bg-gray-50 border-emerald-200 md:border-gray-200 focus:border-emerald-400 md:focus:border-green-500 focus:ring-emerald-400 md:focus:ring-green-500 rounded-xl h-12 pl-4"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-emerald-700 md:text-gray-700 text-sm font-medium">
                  Password
                </Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="bg-emerald-50 md:bg-gray-50 border-emerald-200 md:border-gray-200 focus:border-emerald-400 md:focus:border-green-500 focus:ring-emerald-400 md:focus:ring-green-500 rounded-xl h-12 pl-4 pr-12"
                  />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-emerald-600 md:text-gray-500 hover:text-emerald-700 md:hover:text-gray-700">
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="remember"
                    checked={rememberMe}
                    onCheckedChange={(checked) => setRememberMe(checked as boolean)}
                    className="border-emerald-300 md:border-gray-300 data-[state=checked]:bg-emerald-600 md:data-[state=checked]:bg-green-600 data-[state=checked]:border-emerald-600 md:data-[state=checked]:border-green-600"
                  />
                  <Label htmlFor="remember" className="text-sm text-emerald-700 md:text-gray-700">
                    Remember Me
                  </Label>
                </div>
              </div>

              {error && (
                <Alert variant="destructive" className="border-red-200 bg-red-50">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription className="text-red-700">{error}</AlertDescription>
                </Alert>
              )}

              <Button
                type="submit"
                className="w-full bg-emerald-600 md:bg-gradient-to-r md:from-green-600 md:to-green-700 hover:bg-emerald-700 md:hover:from-green-700 md:hover:to-green-800 text-white rounded-xl h-12 font-medium md:font-semibold shadow-lg hover:shadow-xl transition-all duration-200 md:transform md:hover:scale-[1.02]"
                disabled={isLoading}
              >
                {isLoading ? "Logging in..." : "Login"}
              </Button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-sm text-emerald-600 md:text-gray-600">
                <Link href="/" className="font-medium text-emerald-700 md:text-green-600 hover:underline">
                  Kembali keberanda
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LoginForm;
