"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Loader2, User, GitBranch, Star, Copy, Check } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface GitHubProfile {
  login: string
  name: string
  bio: string
  public_repos: number
  followers: number
  following: number
  avatar_url: string
  html_url: string
}

interface Repository {
  name: string
  description: string
  language: string
  stargazers_count: number
  forks_count: number
  html_url: string
}

export function GitHubAnalyzer() {
  const [username, setUsername] = useState("")
  const [loading, setLoading] = useState(false)
  const [profile, setProfile] = useState<GitHubProfile | null>(null)
  const [repositories, setRepositories] = useState<Repository[]>([])
  const [generatedReadme, setGeneratedReadme] = useState("")
  const [copied, setCopied] = useState(false)
  const { toast } = useToast()

  const analyzeProfile = async () => {
    if (!username.trim()) {
      toast({
        title: "Error",
        description: "Please enter a GitHub username",
        variant: "destructive",
      })
      return
    }

    setLoading(true)
    try {
      const response = await fetch("/api/github/analyze-profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: username.trim() }),
      })

      if (!response.ok) {
        throw new Error("Failed to analyze profile")
      }

      const data = await response.json()
      setProfile(data.profile)
      setRepositories(data.repositories)
      setGeneratedReadme(data.readme)

      toast({
        title: "Success",
        description: "Profile analyzed successfully!",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to analyze GitHub profile. Please check the username and try again.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(generatedReadme)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
      toast({
        title: "Copied!",
        description: "README content copied to clipboard",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to copy to clipboard",
        variant: "destructive",
      })
    }
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            GitHub Profile Analyzer
          </CardTitle>
          <CardDescription>Enter a GitHub username to generate a comprehensive README profile</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <Input
              placeholder="Enter GitHub username (e.g., octocat)"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && analyzeProfile()}
            />
            <Button onClick={analyzeProfile} disabled={loading} className=" bg-[#164e63] text-white">
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Analyzing...
                </>
              ) : (
                "Analyze Profile"
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      {profile && (
        <Card>
          <CardHeader>
            <CardTitle>Profile Overview</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-start gap-4">
              <img
                src={profile.avatar_url || "/placeholder.svg"}
                alt={profile.name || profile.login}
                className="w-16 h-16 rounded-full"
              />
              <div className="flex-1">
                <h3 className="text-lg font-semibold">{profile.name || profile.login}</h3>
                <p className="text-muted-foreground mb-2">@{profile.login}</p>
                {profile.bio && <p className="text-sm mb-3">{profile.bio}</p>}
                <div className="flex gap-4 text-sm text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <GitBranch className="h-4 w-4" />
                    {profile.public_repos} repos
                  </span>
                  <span>{profile.followers} followers</span>
                  <span>{profile.following} following</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {repositories.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Top Repositories</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-3">
              {repositories.slice(0, 6).map((repo) => (
                <div key={repo.name} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex-1">
                    <h4 className="font-medium">{repo.name}</h4>
                    {repo.description && <p className="text-sm text-muted-foreground">{repo.description}</p>}
                    <div className="flex items-center gap-3 mt-1 text-xs text-muted-foreground">
                      {repo.language && <span>{repo.language}</span>}
                      <span className="flex items-center gap-1">
                        <Star className="h-3 w-3" />
                        {repo.stargazers_count}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {generatedReadme && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              Generated README Profile
              <Button
                variant="outline"
                size="sm"
                onClick={copyToClipboard}
                className="flex items-center gap-2 bg-transparent"
              >
                {copied ? (
                  <>
                    <Check className="h-4 w-4" />
                    Copied!
                  </>
                ) : (
                  <>
                    <Copy className="h-4 w-4" />
                    Copy
                  </>
                )}
              </Button>
            </CardTitle>
            <CardDescription>Copy this content to your GitHub profile README</CardDescription>
          </CardHeader>
          <CardContent>
            <Textarea value={generatedReadme} readOnly className="min-h-[400px] font-mono text-sm" />
          </CardContent>
        </Card>
      )}
    </div>
  )
}
