"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Loader2, GitBranch, Copy, Check, AlertCircle } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface RepoData {
  name: string
  description: string
  language: string
  stargazers_count: number
  forks_count: number
  html_url: string
  topics: string[]
}

export function RepoDescriptionGenerator() {
  const [repoUrl, setRepoUrl] = useState("")
  const [loading, setLoading] = useState(false)
  const [repoData, setRepoData] = useState<RepoData | null>(null)
  const [generatedDescription, setGeneratedDescription] = useState("")
  const [copied, setCopied] = useState(false)
  const [error, setError] = useState("")
  const { toast } = useToast()

  const analyzeRepository = async () => {
    if (!repoUrl.trim()) {
      toast({
        title: "Error",
        description: "Please enter a GitHub repository URL",
        variant: "destructive",
      })
      return
    }

    const githubUrlPattern = /^https?:\/\/(www\.)?github\.com\/[^/]+\/[^/]+\/?$/
    if (!githubUrlPattern.test(repoUrl.trim())) {
      toast({
        title: "Invalid URL",
        description: "Please enter a valid GitHub repository URL (e.g., https://github.com/user/repo)",
        variant: "destructive",
      })
      return
    }

    setLoading(true)
    setError("")
    setRepoData(null)
    setGeneratedDescription("")

    try {
      const response = await fetch("/api/github/analyze-repo", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ repoUrl: repoUrl.trim() }),
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: "Unknown error" }))
        throw new Error(errorData.error || `HTTP ${response.status}`)
      }

      const data = await response.json()

      setRepoData(data.repository)
      setGeneratedDescription(data.description)

      toast({
        title: "Success",
        description: "Repository analyzed successfully!",
      })
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Unknown error occurred"
      setError(errorMessage)
      toast({
        title: "Error",
        description: `Failed to analyze repository: ${errorMessage}`,
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(generatedDescription)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
      toast({
        title: "Copied!",
        description: "Description copied to clipboard",
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
            <GitBranch className="h-5 w-5" />
            Repository Description Generator
          </CardTitle>
          <CardDescription>Enter a GitHub repository URL to generate a comprehensive description</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <Input
              placeholder="Enter GitHub repository URL (e.g., https://github.com/user/repo)"
              value={repoUrl}
              onChange={(e) => setRepoUrl(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && analyzeRepository()}
              className={error ? "border-red-500" : ""}
            />
            <Button onClick={analyzeRepository} disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Analyzing...
                </>
              ) : (
                "Analyze Repo"
              )}
            </Button>
          </div>

          {error && (
            <div className="flex items-center gap-2 text-red-600 text-sm">
              <AlertCircle className="h-4 w-4" />
              {error}
            </div>
          )}
        </CardContent>
      </Card>

      {repoData && (
        <Card>
          <CardHeader>
            <CardTitle>Repository Overview</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div>
                <h3 className="text-lg font-semibold">{repoData.name}</h3>
                {repoData.description && <p className="text-muted-foreground">{repoData.description}</p>}
              </div>

              <div className="flex gap-4 text-sm text-muted-foreground">
                {repoData.language && <span>Language: {repoData.language}</span>}
                <span>Stars: {repoData.stargazers_count}</span>
                <span>Forks: {repoData.forks_count}</span>
              </div>

              {repoData.topics.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {repoData.topics.map((topic) => (
                    <span key={topic} className="px-2 py-1 bg-secondary text-secondary-foreground rounded-md text-xs">
                      {topic}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {generatedDescription && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              Generated Repository Description
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
            <CardDescription>Use this description for your repository README or documentation</CardDescription>
          </CardHeader>
          <CardContent>
            <Textarea value={generatedDescription} readOnly className="min-h-[300px] font-mono text-sm" />
          </CardContent>
        </Card>
      )}
    </div>
  )
}
