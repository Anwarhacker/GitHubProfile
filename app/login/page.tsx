"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { signInWithGoogle } from "@/lib/firebase"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Github, Sparkles, FileText, Zap, Users, Code, TrendingUp, AlertCircle } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/hooks/use-toast"
import { Alert, AlertDescription } from "@/components/ui/alert"

export default function LoginPage() {
  const [loading, setLoading] = useState(false)
  const [showPopupWarning, setShowPopupWarning] = useState(false)
  const router = useRouter()
  const { toast } = useToast()

  const handleGoogleSignIn = async () => {
    setLoading(true)
    setShowPopupWarning(false)

    try {
      const user = await signInWithGoogle()

      toast({
        title: "Welcome!",
        description: "Successfully signed in with Google.",
      })
      router.push("/")
    } catch (error: any) {
      console.error("Sign in error:", error)

      if (error.code === "auth/popup-blocked") {
        setShowPopupWarning(true)
        toast({
          title: "Popup blocked",
          description: "Please allow popups for this site and try again.",
          variant: "destructive",
        })
      } else {
        toast({
          title: "Sign in failed",
          description: error.message || "Please try again.",
          variant: "destructive",
        })
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-700 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-blue-400 rounded-full mix-blend-multiply filter blur-xl animate-pulse"></div>
        <div className="absolute top-1/3 right-1/3 w-72 h-72 bg-purple-400 rounded-full mix-blend-multiply filter blur-xl animate-pulse animation-delay-2000"></div>
        <div className="absolute bottom-1/4 left-1/3 w-72 h-72 bg-indigo-400 rounded-full mix-blend-multiply filter blur-xl animate-pulse animation-delay-4000"></div>
      </div>

      <div className="container mx-auto px-3 sm:px-4 lg:px-6 xl:px-8 py-4 sm:py-6 lg:py-8 relative z-10">
        <div className="grid lg:grid-cols-2 gap-6 sm:gap-8 lg:gap-12 xl:gap-16 min-h-screen items-center">
          {/* Left Side - About Section */}
          <div className="space-y-6 sm:space-y-8 order-2 lg:order-1">
            <div className="text-center lg:text-left">
              <div className="flex justify-center lg:justify-start mb-4 sm:mb-6">
                <div className="relative group">
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full blur-lg opacity-20 animate-pulse group-hover:opacity-30 transition-opacity duration-300"></div>
                  <div className="relative bg-gradient-to-r from-blue-600 to-purple-600 p-3 sm:p-4 rounded-full shadow-2xl group-hover:shadow-blue-500/25 transition-all duration-300 group-hover:scale-110">
                    <Github className="h-8 w-8 sm:h-10 sm:w-10 lg:h-12 lg:w-12 text-white drop-shadow-lg" />
                  </div>
                </div>
              </div>

              <h1 className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-bold bg-gradient-to-r from-slate-900 via-blue-800 to-purple-800 dark:from-slate-100 dark:via-blue-200 dark:to-purple-200 bg-clip-text text-transparent mb-4 sm:mb-6 leading-tight px-2 animate-fade-in-up">
                GitHub AI Analyzer
              </h1>

              <p className="text-sm sm:text-base lg:text-lg text-slate-600 dark:text-slate-300 mb-6 sm:mb-8 leading-relaxed px-2 animate-fade-in-up animation-delay-200">
                Transform your GitHub presence with AI-powered README generation and repository analysis. Create
                professional profiles and comprehensive documentation in seconds.
              </p>

              <div className="flex flex-wrap justify-center lg:justify-start gap-2 sm:gap-3 mb-6 sm:mb-8 px-2 animate-fade-in-up animation-delay-400">
                <Badge
                  variant="secondary"
                  className="px-2 sm:px-3 lg:px-4 py-1 sm:py-1.5 lg:py-2 text-xs sm:text-sm font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 border-0 hover:bg-blue-200 dark:hover:bg-blue-800 transition-colors duration-200 cursor-default"
                >
                  <Sparkles className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                  <span className="hidden xs:inline">AI-Powered Analysis</span>
                  <span className="xs:hidden">AI Analysis</span>
                </Badge>
                <Badge
                  variant="secondary"
                  className="px-2 sm:px-3 lg:px-4 py-1 sm:py-1.5 lg:py-2 text-xs sm:text-sm font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200 border-0 hover:bg-green-200 dark:hover:bg-green-800 transition-colors duration-200 cursor-default"
                >
                  <Zap className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                  <span className="hidden xs:inline">Instant Generation</span>
                  <span className="xs:hidden">Instant</span>
                </Badge>
                <Badge
                  variant="secondary"
                  className="px-2 sm:px-3 lg:px-4 py-1 sm:py-1.5 lg:py-2 text-xs sm:text-sm font-medium bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200 border-0 hover:bg-purple-200 dark:hover:bg-purple-800 transition-colors duration-200 cursor-default"
                >
                  <FileText className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                  <span className="hidden xs:inline">Professional Output</span>
                  <span className="xs:hidden">Professional</span>
                </Badge>
              </div>
            </div>

            <div className="grid grid-cols-1 xs:grid-cols-3 gap-3 sm:gap-4 px-2 animate-fade-in-up animation-delay-600">
              <Card className="border-0 shadow-lg bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm hover:shadow-xl transition-all duration-300 hover:scale-105 group">
                <CardContent className="p-3 sm:p-4 lg:p-6 text-center">
                  <div className="flex justify-center mb-2 sm:mb-3">
                    <div className="p-1.5 sm:p-2 bg-blue-100 dark:bg-blue-900 rounded-full group-hover:bg-blue-200 dark:group-hover:bg-blue-800 transition-colors duration-300">
                      <Users className="h-4 w-4 sm:h-5 sm:w-5 lg:h-6 lg:w-6 text-blue-600 dark:text-blue-400" />
                    </div>
                  </div>
                  <div className="text-lg sm:text-xl lg:text-2xl font-bold text-slate-900 dark:text-slate-100 mb-1">
                    10K+
                  </div>
                  <div className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 font-medium">
                    <span className="hidden sm:inline">Profiles Analyzed</span>
                    <span className="sm:hidden">Profiles</span>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-lg bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm hover:shadow-xl transition-all duration-300 hover:scale-105 group">
                <CardContent className="p-3 sm:p-4 lg:p-6 text-center">
                  <div className="flex justify-center mb-2 sm:mb-3">
                    <div className="p-1.5 sm:p-2 bg-green-100 dark:bg-green-900 rounded-full group-hover:bg-green-200 dark:group-hover:bg-green-800 transition-colors duration-300">
                      <Code className="h-4 w-4 sm:h-5 sm:w-5 lg:h-6 lg:w-6 text-green-600 dark:text-green-400" />
                    </div>
                  </div>
                  <div className="text-lg sm:text-xl lg:text-2xl font-bold text-slate-900 dark:text-slate-100 mb-1">
                    5K+
                  </div>
                  <div className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 font-medium">
                    <span className="hidden sm:inline">Repos Documented</span>
                    <span className="sm:hidden">Repos</span>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-lg bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm hover:shadow-xl transition-all duration-300 hover:scale-105 xs:col-span-1 col-span-1 group">
                <CardContent className="p-3 sm:p-4 lg:p-6 text-center">
                  <div className="flex justify-center mb-2 sm:mb-3">
                    <div className="p-1.5 sm:p-2 bg-yellow-100 dark:bg-yellow-900 rounded-full group-hover:bg-yellow-200 dark:group-hover:bg-yellow-800 transition-colors duration-300">
                      <TrendingUp className="h-4 w-4 sm:h-5 sm:w-5 lg:h-6 lg:w-6 text-yellow-600 dark:text-yellow-400" />
                    </div>
                  </div>
                  <div className="text-lg sm:text-xl lg:text-2xl font-bold text-slate-900 dark:text-slate-100 mb-1">
                    99%
                  </div>
                  <div className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 font-medium">
                    <span className="hidden sm:inline">Satisfaction Rate</span>
                    <span className="sm:hidden">Satisfaction</span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Right Side - Login Section */}
          <div className="flex items-center justify-center order-1 lg:order-2 animate-fade-in-up animation-delay-800">
            <Card className="w-full max-w-sm sm:max-w-md border-0 shadow-2xl bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm mx-2 hover:shadow-3xl transition-shadow duration-500">
              <CardContent className="p-4 sm:p-6 lg:p-8">
                <div className="text-center mb-6 sm:mb-8">
                  <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-slate-100 mb-2">
                    Welcome Back
                  </h2>
                  <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400">
                    Sign in to access your GitHub AI Analyzer
                  </p>
                </div>

                {showPopupWarning && (
                  <Alert className="mb-4 sm:mb-6 border-amber-200 bg-amber-50 dark:border-amber-800 dark:bg-amber-950 animate-slide-down">
                    <AlertCircle className="h-4 w-4 text-amber-600 dark:text-amber-400" />
                    <AlertDescription className="text-xs sm:text-sm text-amber-800 dark:text-amber-200">
                      Popup was blocked by your browser. Please allow popups for this site and try again.
                    </AlertDescription>
                  </Alert>
                )}

                <Button
                  onClick={handleGoogleSignIn}
                  disabled={loading}
                  className="w-full h-11 sm:h-12 text-sm sm:text-base font-medium bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 border border-slate-300 dark:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-600 hover:border-slate-400 dark:hover:border-slate-500 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-slate-800 transition-all duration-200 touch-manipulation shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                  variant="outline"
                >
                  {loading ? (
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-slate-400 border-t-transparent rounded-full animate-spin"></div>
                      <span className="text-sm sm:text-base">Signing in...</span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2 sm:gap-3">
                      <svg className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0" viewBox="0 0 24 24" aria-label="Google logo">
                        <path
                          fill="currentColor"
                          d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                        />
                        <path
                          fill="currentColor"
                          d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                        />
                        <path
                          fill="currentColor"
                          d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                        />
                        <path
                          fill="currentColor"
                          d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                        />
                      </svg>
                      <span className="text-sm sm:text-base">Continue with Google</span>
                    </div>
                  )}
                </Button>

                <div className="mt-4 sm:mt-6 text-center">
                  <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed px-2">
                    By signing in, you agree to our{" "}
                    <button className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 underline underline-offset-2 transition-colors duration-200">
                      Terms of Service
                    </button>{" "}
                    and{" "}
                    <button className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 underline underline-offset-2 transition-colors duration-200">
                      Privacy Policy
                    </button>
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes fade-in-up {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes slide-down {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fade-in-up {
          animation: fade-in-up 0.6s ease-out;
        }

        .animate-slide-down {
          animation: slide-down 0.3s ease-out;
        }

        .animation-delay-200 {
          animation-delay: 200ms;
        }

        .animation-delay-400 {
          animation-delay: 400ms;
        }

        .animation-delay-600 {
          animation-delay: 600ms;
        }

        .animation-delay-800 {
          animation-delay: 800ms;
        }

        .animation-delay-2000 {
          animation-delay: 2000ms;
        }

        .animation-delay-4000 {
          animation-delay: 4000ms;
        }

        .shadow-3xl {
          box-shadow: 0 35px 60px -12px rgba(0, 0, 0, 0.25);
        }
      `}</style>
    </div>
  )
}