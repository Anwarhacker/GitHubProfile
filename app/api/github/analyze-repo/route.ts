import { type NextRequest, NextResponse } from "next/server"

interface GitHubRepo {
  name: string
  description: string
  language: string
  stargazers_count: number
  forks_count: number
  html_url: string
  topics: string[]
  created_at: string
  updated_at: string
  size: number
  default_branch: string
  license: {
    name: string
  } | null
}

interface GitHubContent {
  name: string
  path: string
  type: string
  content?: string
}

export async function POST(request: NextRequest) {
  try {
    const { repoUrl } = await request.json()

    if (!repoUrl) {
      return NextResponse.json({ error: "Repository URL is required" }, { status: 400 })
    }

    const cleanUrl = repoUrl.trim().replace(/\/$/, "") // Remove trailing slash
    const match = cleanUrl.match(/github\.com\/([^/]+)\/([^/]+)(?:\/.*)?$/)

    if (!match) {
      console.error("URL parsing failed for:", cleanUrl)
      return NextResponse.json({ error: "Invalid GitHub repository URL format" }, { status: 400 })
    }

    const [, owner, repo] = match

    const cleanRepoName = repo.replace(/\.git$/, "")

    console.log(`Fetching repository: ${owner}/${cleanRepoName}`)

    const repoResponse = await fetch(`https://api.github.com/repos/${owner}/${cleanRepoName}`, {
      headers: {
        Accept: "application/vnd.github.v3+json",
        "User-Agent": "GitHub-Repo-Analyzer/1.0",
        // Add cache control to avoid stale data
        "Cache-Control": "no-cache",
      },
    })

    console.log(`Repository API response status: ${repoResponse.status}`)

    if (!repoResponse.ok) {
      const errorText = await repoResponse.text()
      console.error(`GitHub API error: ${repoResponse.status} - ${errorText}`)

      if (repoResponse.status === 404) {
        return NextResponse.json(
          {
            error: `Repository '${owner}/${cleanRepoName}' not found. Please check the URL and ensure the repository is public.`,
          },
          { status: 404 },
        )
      } else if (repoResponse.status === 403) {
        return NextResponse.json(
          {
            error: "GitHub API rate limit exceeded. Please try again later.",
          },
          { status: 429 },
        )
      } else {
        return NextResponse.json(
          {
            error: `GitHub API error: ${repoResponse.status}`,
          },
          { status: repoResponse.status },
        )
      }
    }

    const repository: GitHubRepo = await repoResponse.json()
    console.log(`Successfully fetched repository: ${repository.name}`)

    const contentsResponse = await fetch(`https://api.github.com/repos/${owner}/${cleanRepoName}/contents`, {
      headers: {
        Accept: "application/vnd.github.v3+json",
        "User-Agent": "GitHub-Repo-Analyzer/1.0",
        "Cache-Control": "no-cache",
      },
    })

    let contents: GitHubContent[] = []
    if (contentsResponse.ok) {
      contents = await contentsResponse.json()
      console.log(`Fetched ${contents.length} files from repository contents`)
    } else {
      console.warn(`Could not fetch repository contents: ${contentsResponse.status}`)
      // Continue without contents - we can still generate a description
    }

    // Generate comprehensive description
    const description = await generateRepoDescription(repository, contents)

    return NextResponse.json({
      repository,
      description,
    })
  } catch (error) {
    console.error("Error analyzing repository:", error)
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Internal server error",
      },
      { status: 500 },
    )
  }
}

async function generateRepoDescription(repo: GitHubRepo, contents: GitHubContent[]): Promise<string> {
  // Advanced project structure analysis
  const fileAnalysis = {
    hasPackageJson: contents.some((file) => file.name === "package.json"),
    hasRequirementsTxt: contents.some((file) => file.name === "requirements.txt"),
    hasDockerfile: contents.some((file) => file.name === "Dockerfile" || file.name === "docker-compose.yml"),
    hasReadme: contents.some((file) => file.name.toLowerCase().includes("readme")),
    hasTests: contents.some(
      (file) => file.name.includes("test") || file.name.includes("spec") || file.path.includes("test"),
    ),
    hasCI: contents.some(
      (file) => file.name.includes(".yml") || file.name.includes(".yaml") || file.path.includes(".github"),
    ),
    hasLicense: contents.some((file) => file.name.toLowerCase().includes("license")),
    hasContributing: contents.some((file) => file.name.toLowerCase().includes("contributing")),
    configFiles: contents.filter(
      (file) =>
        file.name.includes("config") ||
        file.name.startsWith(".") ||
        file.name.includes("tsconfig") ||
        file.name.includes("webpack") ||
        file.name.includes("vite"),
    ).length,
  }

  // Determine project complexity and type
  const complexityScore =
    fileAnalysis.configFiles +
    (fileAnalysis.hasTests ? 2 : 0) +
    (fileAnalysis.hasCI ? 2 : 0) +
    (fileAnalysis.hasDockerfile ? 1 : 0) +
    Math.min(repo.topics.length, 5)

  const complexity =
    complexityScore > 8
      ? "Enterprise-grade"
      : complexityScore > 5
        ? "Professional"
        : complexityScore > 2
          ? "Intermediate"
          : "Beginner-friendly"

  // Enhanced project type detection
  let projectType = "Software Project"
  const techStack: string[] = []
  let projectCategory = "General Development"

  if (fileAnalysis.hasPackageJson) {
    projectType = "Node.js Application"
    techStack.push("Node.js", "npm")

    // Detect framework based on common patterns
    if (repo.topics.some((t) => t.includes("react"))) {
      projectCategory = "React Application"
      techStack.push("React")
    } else if (repo.topics.some((t) => t.includes("vue"))) {
      projectCategory = "Vue.js Application"
      techStack.push("Vue.js")
    } else if (repo.topics.some((t) => t.includes("angular"))) {
      projectCategory = "Angular Application"
      techStack.push("Angular")
    } else if (repo.topics.some((t) => t.includes("next"))) {
      projectCategory = "Next.js Application"
      techStack.push("Next.js", "React")
    }
  }

  if (fileAnalysis.hasRequirementsTxt) {
    projectType = "Python Application"
    techStack.push("Python", "pip")

    if (repo.topics.some((t) => ["ml", "ai", "data", "science"].includes(t))) {
      projectCategory = "Data Science Project"
      techStack.push("Data Science")
    } else if (repo.topics.some((t) => ["django", "flask", "fastapi"].includes(t))) {
      projectCategory = "Web API/Backend"
      techStack.push("Web Framework")
    }
  }

  // Language-specific enhancements
  const languageInsights: Record<string, string> = {
    JavaScript: "Dynamic and versatile language powering modern web experiences",
    TypeScript: "Type-safe JavaScript for scalable application development",
    Python: "Versatile language excellent for rapid development and data processing",
    Java: "Enterprise-grade language with robust ecosystem and performance",
    Go: "Modern language designed for concurrent and networked applications",
    Rust: "Systems programming language focused on safety and performance",
    Swift: "Modern language for iOS and macOS application development",
    Kotlin: "Modern JVM language with excellent Android development support",
  }

  // Generate quality indicators
  const qualityIndicators: string[] = []
  if (fileAnalysis.hasTests) qualityIndicators.push("✅ Comprehensive Testing")
  if (fileAnalysis.hasCI) qualityIndicators.push("🔄 Continuous Integration")
  if (fileAnalysis.hasDockerfile) qualityIndicators.push("🐳 Containerized Deployment")
  if (fileAnalysis.hasLicense) qualityIndicators.push("📄 Open Source Licensed")
  if (fileAnalysis.hasContributing) qualityIndicators.push("🤝 Contribution Guidelines")
  if (repo.topics.length > 3) qualityIndicators.push("🏷️ Well-Categorized")

  // Calculate project maturity
  const createdDate = new Date(repo.created_at)
  const updatedDate = new Date(repo.updated_at)
  const ageInMonths = Math.floor((Date.now() - createdDate.getTime()) / (1000 * 60 * 60 * 24 * 30))
  const daysSinceUpdate = Math.floor((Date.now() - updatedDate.getTime()) / (1000 * 60 * 60 * 24))

  const maturity = ageInMonths > 12 ? "Mature" : ageInMonths > 6 ? "Established" : "Growing"
  const maintenance =
    daysSinceUpdate < 30 ? "Actively Maintained" : daysSinceUpdate < 90 ? "Recently Updated" : "Stable Release"

  // Enhanced description generation
  const description = `# ${repo.name}

${repo.description || `A ${complexity.toLowerCase()} ${projectCategory.toLowerCase()} showcasing modern development practices and clean architecture.`}

## 🎯 Project Overview

This **${complexity} ${projectCategory}** represents a ${maturity.toLowerCase()} codebase that demonstrates ${repo.language ? `${repo.language} development` : "modern software development"} excellence. ${languageInsights[repo.language || ""] || "Built with attention to detail and industry best practices."}

### 📋 Project Details
- **Category:** ${projectCategory}
- **Complexity:** ${complexity}
- **Maturity:** ${maturity} (${ageInMonths} months old)
- **Status:** ${maintenance}
- **Community Impact:** ${repo.stargazers_count} stars, ${repo.forks_count} forks

## ✨ Key Features & Highlights

${qualityIndicators.length > 0 ? qualityIndicators.map((indicator) => `- ${indicator}`).join("\n") : "- 🚀 Modern development practices\n- 📱 User-focused design\n- ⚡ Performance optimized"}

### 🛠️ Technical Excellence
- **Architecture:** ${complexity} design patterns and structure
- **Code Quality:** ${fileAnalysis.hasTests ? "Test-driven development with comprehensive coverage" : "Clean, maintainable codebase"}
- **DevOps:** ${fileAnalysis.hasCI ? "Automated CI/CD pipeline" : "Standard development workflow"}
- **Deployment:** ${fileAnalysis.hasDockerfile ? "Container-ready with Docker support" : "Traditional deployment methods"}

## 🔧 Technology Stack

**Core Technology:** ${repo.language || "Multi-language"}
${techStack.length > 0 ? `\n**Framework/Tools:** ${techStack.join(", ")}` : ""}

**Development Environment:**
${fileAnalysis.hasPackageJson ? "- Node.js ecosystem with npm package management" : ""}
${fileAnalysis.hasRequirementsTxt ? "- Python environment with pip dependencies" : ""}
${fileAnalysis.hasDockerfile ? "- Containerized development and deployment" : ""}
${fileAnalysis.configFiles > 0 ? `- ${fileAnalysis.configFiles} configuration files for optimal setup` : ""}

## 📊 Repository Metrics

<div align="center">

| Metric | Value | Status |
|--------|-------|--------|
| ⭐ **Stars** | ${repo.stargazers_count} | ${repo.stargazers_count > 100 ? "🔥 Popular" : repo.stargazers_count > 10 ? "📈 Growing" : "🌱 Emerging"} |
| 🍴 **Forks** | ${repo.forks_count} | ${repo.forks_count > 50 ? "🌟 Community Driven" : repo.forks_count > 5 ? "👥 Collaborative" : "🔧 Personal"} |
| 📦 **Size** | ${Math.round(repo.size / 1024)} MB | ${repo.size > 10000 ? "📚 Comprehensive" : repo.size > 1000 ? "📖 Substantial" : "📄 Focused"} |
| 🏷️ **Topics** | ${repo.topics.length} | ${repo.topics.length > 5 ? "🎯 Well-Categorized" : repo.topics.length > 0 ? "📝 Tagged" : "🏷️ General"} |

</div>

${repo.topics.length > 0 ? `\n**Project Topics:** ${repo.topics.map((topic) => `\`${topic}\``).join(" • ")}\n` : ""}

## 🚀 Quick Start Guide

### Prerequisites
${fileAnalysis.hasPackageJson ? "- Node.js (v14 or higher)\n- npm or yarn package manager" : ""}
${fileAnalysis.hasRequirementsTxt ? "- Python (v3.7 or higher)\n- pip package manager" : ""}
${repo.language === "Java" ? "- Java Development Kit (JDK 11+)\n- Maven or Gradle" : ""}
${repo.language === "Go" ? "- Go (v1.16 or higher)" : ""}

### Installation & Setup

1. **Clone the repository**
   \`\`\`bash
   git clone ${repo.html_url}
   cd ${repo.name}
   \`\`\`

2. **Install dependencies**
   ${
     fileAnalysis.hasPackageJson
       ? "```bash\n   npm install\n   # or\n   yarn install\n   ```"
       : fileAnalysis.hasRequirementsTxt
         ? "```bash\n   pip install -r requirements.txt\n   # or for virtual environment\n   python -m venv venv\n   source venv/bin/activate  # On Windows: venv\\Scripts\\activate\n   pip install -r requirements.txt\n   ```"
         : "```bash\n   # Follow language-specific dependency installation\n   ```"
   }

3. **Run the application**
   ${
     fileAnalysis.hasPackageJson
       ? "```bash\n   npm start\n   # or for development\n   npm run dev\n   ```"
       : fileAnalysis.hasRequirementsTxt
         ? "```bash\n   python main.py\n   # or\n   python app.py\n   ```"
         : "```bash\n   # Follow project-specific execution instructions\n   ```"
   }

${
  fileAnalysis.hasDockerfile
    ? `
### 🐳 Docker Deployment

\`\`\`bash
# Build the Docker image
docker build -t ${repo.name} .

# Run the container
docker run -p 3000:3000 ${repo.name}
\`\`\`
`
    : ""
}

## 🤝 Contributing

${fileAnalysis.hasContributing ? "This project welcomes contributions! Please see [CONTRIBUTING.md](./CONTRIBUTING.md) for detailed guidelines." : "Contributions are welcome! Please follow these steps:"}

1. **Fork** the repository
2. **Create** a feature branch (\`git checkout -b feature/amazing-feature\`)
3. **Commit** your changes (\`git commit -m 'Add amazing feature'\`)
4. **Push** to the branch (\`git push origin feature/amazing-feature\`)
5. **Open** a Pull Request

${fileAnalysis.hasTests ? "\n### 🧪 Running Tests\n\n```bash\nnpm test  # or appropriate test command\n```\n" : ""}

## 📈 Project Timeline

- **🎉 Created:** ${createdDate.toLocaleDateString()} (${ageInMonths} months ago)
- **🔄 Last Updated:** ${updatedDate.toLocaleDateString()} (${daysSinceUpdate} days ago)
- **🌿 Default Branch:** \`${repo.default_branch}\`
- **📊 Activity Level:** ${maintenance}

## 🔗 Important Links

- **🏠 Repository:** [${repo.html_url}](${repo.html_url})
- **🐛 Issues:** [Report bugs or request features](${repo.html_url}/issues)
- **💬 Discussions:** [Join the community](${repo.html_url}/discussions)
${repo.license ? `- **📄 License:** ${repo.license.name}` : ""}

## 🌟 Show Your Support

If you find this project helpful, please consider:
- ⭐ **Starring** the repository
- 🍴 **Forking** for your own experiments  
- 🐛 **Reporting** issues or bugs
- 💡 **Suggesting** new features
- 🤝 **Contributing** to the codebase

---

<div align="center">

**Built with ❤️ and modern development practices**

*This comprehensive analysis was generated using AI-powered repository inspection*

</div>`

  return description
}
