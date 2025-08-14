"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/contexts/auth-context"
import { GitHubAnalyzer } from "@/components/github-analyzer"
import { RepoDescriptionGenerator } from "@/components/repo-description-generator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Github, Sparkles, FileText, Zap, Users, Code, TrendingUp, Mail, Heart, LogOut } from "lucide-react"
import { logOut } from "@/lib/firebase"
import { useToast } from "@/hooks/use-toast"

export default function HomePage() {
  const { user, loading } = useAuth()
  const router = useRouter()
  const { toast } = useToast()

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login")
    }
  }, [user, loading, router])

  const handleLogout = async () => {
    try {
      await logOut()
      toast({
        title: "Signed out",
        description: "You have been successfully signed out.",
      })
      router.push("/login")
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to sign out. Please try again.",
        variant: "destructive",
      })
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-700 flex items-center justify-center">
        <div className="text-center">
          <div className="w-6 h-6 sm:w-8 sm:h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400">Loading...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return null
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-700">
      <header className="border-b border-slate-200 dark:border-slate-700 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-3 sm:px-4 lg:px-6 xl:px-8 py-3 sm:py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-1.5 sm:p-2 rounded-lg">
                <Github className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
              </div>
              <h1 className="text-base sm:text-lg lg:text-xl font-bold text-slate-900 dark:text-slate-100 truncate">
                <span className="hidden sm:inline">GitHub AI Analyzer</span>
                <span className="sm:hidden">GitHub AI</span>
              </h1>
            </div>

            <div className="flex items-center gap-2 sm:gap-4">
              <div className="flex items-center gap-2">
                <img
                  src={user.photoURL || "/placeholder.svg?height=32&width=32"}
                  alt={user.displayName || "User"}
                  className="w-6 h-6 sm:w-8 sm:h-8 rounded-full flex-shrink-0"
                />
                <span className="text-xs sm:text-sm font-medium text-slate-700 dark:text-slate-300 hidden md:inline max-w-32 lg:max-w-none truncate">
                  {user.displayName || user.email}
                </span>
              </div>

              <Button
                onClick={handleLogout}
                variant="outline"
                size="sm"
                className="flex items-center gap-1 sm:gap-2 bg-transparent h-8 sm:h-9 px-2 sm:px-3 text-xs sm:text-sm touch-manipulation"
              >
                <LogOut className="h-3 w-3 sm:h-4 sm:w-4" />
                <span className="hidden sm:inline">Sign Out</span>
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-3 sm:px-4 lg:px-6 xl:px-8 py-6 sm:py-8 lg:py-12 xl:py-16">
        <div className="text-center mb-8 sm:mb-12 lg:mb-16 xl:mb-20">
          <div className="flex justify-center mb-4 sm:mb-6 lg:mb-8">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full blur-lg opacity-20 animate-pulse"></div>
              <div className="relative bg-gradient-to-r from-blue-600 to-purple-600 p-2 sm:p-3 lg:p-4 rounded-full">
                <Github className="h-6 w-6 sm:h-8 sm:w-8 lg:h-10 lg:w-10 xl:h-12 xl:w-12 text-white" />
              </div>
            </div>
          </div>

          <h1 className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl 2xl:text-6xl font-bold bg-gradient-to-r from-slate-900 via-blue-800 to-purple-800 dark:from-slate-100 dark:via-blue-200 dark:to-purple-200 bg-clip-text text-transparent mb-3 sm:mb-4 lg:mb-6 leading-tight px-2">
            GitHub AI Analyzer
          </h1>

          <p className="text-sm sm:text-base lg:text-lg xl:text-xl text-slate-600 dark:text-slate-400 max-w-lg sm:max-w-xl lg:max-w-2xl xl:max-w-3xl mx-auto mb-4 sm:mb-6 lg:mb-8 leading-relaxed px-4">
            Transform your GitHub presence with AI-powered README generation and repository analysis. Create
            professional profiles and comprehensive documentation in seconds.
          </p>

          <div className="flex flex-wrap justify-center gap-1.5 sm:gap-2 lg:gap-3 mb-6 sm:mb-8 lg:mb-12 px-4">
            <Badge
              variant="secondary"
              className="px-2 sm:px-3 lg:px-4 py-1 sm:py-1.5 lg:py-2 text-xs sm:text-sm font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 border-0"
            >
              <Sparkles className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-1.5 lg:mr-2" />
              <span className="hidden xs:inline">AI-Powered Analysis</span>
              <span className="xs:hidden">AI Analysis</span>
            </Badge>
            <Badge
              variant="secondary"
              className="px-2 sm:px-3 lg:px-4 py-1 sm:py-1.5 lg:py-2 text-xs sm:text-sm font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200 border-0"
            >
              <Zap className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-1.5 lg:mr-2" />
              <span className="hidden xs:inline">Instant Generation</span>
              <span className="xs:hidden">Instant</span>
            </Badge>
            <Badge
              variant="secondary"
              className="px-2 sm:px-3 lg:px-4 py-1 sm:py-1.5 lg:py-2 text-xs sm:text-sm font-medium bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200 border-0"
            >
              <FileText className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-1.5 lg:mr-2" />
              <span className="hidden xs:inline">Professional Output</span>
              <span className="xs:hidden">Professional</span>
            </Badge>
          </div>

          <div className="grid grid-cols-1 xs:grid-cols-3 gap-3 sm:gap-4 lg:gap-6 max-w-xs xs:max-w-lg sm:max-w-2xl lg:max-w-3xl xl:max-w-4xl mx-auto mb-6 sm:mb-8 lg:mb-12 px-4">
            <Card className="border-0 shadow-lg bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm hover:shadow-xl transition-all duration-300 hover:scale-105">
              <CardContent className="p-3 sm:p-4 lg:p-6 text-center">
                <div className="flex justify-center mb-2 sm:mb-3">
                  <div className="p-1.5 sm:p-2 bg-blue-100 dark:bg-blue-900 rounded-full">
                    <Users className="h-4 w-4 sm:h-5 sm:w-5 lg:h-6 lg:w-6 text-blue-600 dark:text-blue-400" />
                  </div>
                </div>
                <div className="text-lg sm:text-xl lg:text-2xl xl:text-3xl font-bold text-slate-900 dark:text-slate-100 mb-1">
                  10K+
                </div>
                <div className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 font-medium">
                  <span className="hidden sm:inline">Profiles Analyzed</span>
                  <span className="sm:hidden">Profiles</span>
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm hover:shadow-xl transition-all duration-300 hover:scale-105">
              <CardContent className="p-3 sm:p-4 lg:p-6 text-center">
                <div className="flex justify-center mb-2 sm:mb-3">
                  <div className="p-1.5 sm:p-2 bg-green-100 dark:bg-green-900 rounded-full">
                    <Code className="h-4 w-4 sm:h-5 sm:w-5 lg:h-6 lg:w-6 text-green-600 dark:text-green-400" />
                  </div>
                </div>
                <div className="text-lg sm:text-xl lg:text-2xl xl:text-3xl font-bold text-slate-900 dark:text-slate-100 mb-1">
                  5K+
                </div>
                <div className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 font-medium">
                  <span className="hidden sm:inline">Repos Documented</span>
                  <span className="sm:hidden">Repos</span>
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm hover:shadow-xl transition-all duration-300 hover:scale-105 xs:col-span-1 col-span-1">
              <CardContent className="p-3 sm:p-4 lg:p-6 text-center">
                <div className="flex justify-center mb-2 sm:mb-3">
                  <div className="p-1.5 sm:p-2 bg-yellow-100 dark:bg-yellow-900 rounded-full">
                    <TrendingUp className="h-4 w-4 sm:h-5 sm:w-5 lg:h-6 lg:w-6 text-yellow-600 dark:text-yellow-400" />
                  </div>
                </div>
                <div className="text-lg sm:text-xl lg:text-2xl xl:text-3xl font-bold text-slate-900 dark:text-slate-100 mb-1">
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

        <div className="max-w-7xl mx-auto px-2 sm:px-4">
          <Card className="border-0 shadow-2xl bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm overflow-hidden">
            <CardContent className="p-3 sm:p-4 lg:p-6 xl:p-8">
              <Tabs defaultValue="profile" className="w-full">
                <TabsList className="grid w-full grid-cols-2 mb-4 sm:mb-6 lg:mb-8 bg-slate-100 dark:bg-slate-700 p-1 rounded-xl h-auto">
                  <TabsTrigger
                    value="profile"
                    className="text-xs sm:text-sm lg:text-base font-medium py-2 sm:py-2.5 lg:py-3 px-2 sm:px-3 lg:px-6 rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-md dark:data-[state=active]:bg-slate-600 transition-all duration-200 flex items-center justify-center gap-1 sm:gap-1.5 lg:gap-2 touch-manipulation"
                  >
                    <Users className="h-3 w-3 sm:h-4 sm:w-4" />
                    <span className="hidden xs:inline">Profile README</span>
                    <span className="xs:hidden">Profile</span>
                  </TabsTrigger>
                  <TabsTrigger
                    value="repo"
                    className="text-xs sm:text-sm lg:text-base font-medium py-2 sm:py-2.5 lg:py-3 px-2 sm:px-3 lg:px-6 rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-md dark:data-[state=active]:bg-slate-600 transition-all duration-200 flex items-center justify-center gap-1 sm:gap-1.5 lg:gap-2 touch-manipulation"
                  >
                    <FileText className="h-3 w-3 sm:h-4 sm:w-4" />
                    <span className="hidden xs:inline">Repository Docs</span>
                    <span className="xs:hidden">Repository</span>
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="profile" className="space-y-3 sm:space-y-4 lg:space-y-6">
                  <div className="text-center mb-3 sm:mb-4 lg:mb-6">
                    <h2 className="text-lg sm:text-xl lg:text-2xl xl:text-3xl font-semibold text-slate-900 dark:text-slate-100 mb-2 sm:mb-3 px-2">
                      Generate Your GitHub Profile README
                    </h2>
                    <p className="text-xs sm:text-sm lg:text-base text-slate-600 dark:text-slate-400 max-w-xl lg:max-w-2xl mx-auto leading-relaxed px-4">
                      Create a stunning profile README that showcases your skills, projects, and GitHub activity
                    </p>
                  </div>
                  <GitHubAnalyzer />
                </TabsContent>

                <TabsContent value="repo" className="space-y-3 sm:space-y-4 lg:space-y-6">
                  <div className="text-center mb-3 sm:mb-4 lg:mb-6">
                    <h2 className="text-lg sm:text-xl lg:text-2xl xl:text-3xl font-semibold text-slate-900 dark:text-slate-100 mb-2 sm:mb-3 px-2">
                      Generate Repository Documentation
                    </h2>
                    <p className="text-xs sm:text-sm lg:text-base text-slate-600 dark:text-slate-400 max-w-xl lg:max-w-2xl mx-auto leading-relaxed px-4">
                      Create comprehensive documentation for any GitHub repository with detailed analysis
                    </p>
                  </div>
                  <RepoDescriptionGenerator />
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>

        <footer className="mt-12 sm:mt-16 lg:mt-20 xl:mt-24 pt-6 sm:pt-8 lg:pt-12 border-t border-slate-200 dark:border-slate-700">
          <div className="max-w-4xl mx-auto px-4">
            <div className="text-center mb-4 sm:mb-6 lg:mb-8">
              <div className="flex justify-center items-center gap-2 mb-2 sm:mb-3 lg:mb-4">
                <span className="text-xs sm:text-sm lg:text-base text-slate-600 dark:text-slate-400">Developed </span>
                <Heart className="h-3 w-3 sm:h-4 sm:w-4 text-red-500 animate-pulse" />
                <span className="text-xs sm:text-sm lg:text-base text-slate-600 dark:text-slate-400">by</span>
              </div>

              <div className="space-y-2 sm:space-y-3">
                <h3 className="text-base sm:text-lg lg:text-xl font-semibold text-slate-900 dark:text-slate-100">
                  Anwar Patel
                </h3>

                <div className="flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-4">
                  <a
                    href="mailto:patelanwar647@gmail.com"
                    className="flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm lg:text-base text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors duration-200 group touch-manipulation"
                  >
                    <Mail className="h-3 w-3 sm:h-4 sm:w-4 group-hover:scale-110 transition-transform duration-200 flex-shrink-0" />
                    <span className="break-all">patelanwar647@gmail.com</span>
                  </a>

                  <div className="hidden sm:block w-1 h-1 bg-slate-400 rounded-full"></div>

                  <a
                    href="https://github.com/Anwarhacker"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm lg:text-base text-slate-600 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 transition-colors duration-200 group touch-manipulation"
                  >
                    <Github className="h-3 w-3 sm:h-4 sm:w-4 group-hover:scale-110 transition-transform duration-200 flex-shrink-0" />
                    @Anwarhacker
                  </a>
                </div>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </div>
  )
}
