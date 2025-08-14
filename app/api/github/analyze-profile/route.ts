import { type NextRequest, NextResponse } from "next/server"

interface GitHubUser {
  login: string
  name: string
  bio: string
  public_repos: number
  followers: number
  following: number
  avatar_url: string
  html_url: string
  location: string
  company: string
  blog: string
  twitter_username: string
}

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
}

export async function POST(request: NextRequest) {
  try {
    const { username } = await request.json()

    if (!username) {
      return NextResponse.json({ error: "Username is required" }, { status: 400 })
    }

    // Fetch user profile
    const userResponse = await fetch(`https://api.github.com/users/${username}`, {
      headers: {
        Accept: "application/vnd.github.v3+json",
        "User-Agent": "GitHub-Profile-Generator",
      },
    })

    if (!userResponse.ok) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    const user: GitHubUser = await userResponse.json()

    // Fetch user repositories
    const reposResponse = await fetch(`https://api.github.com/users/${username}/repos?sort=stars&per_page=100`, {
      headers: {
        Accept: "application/vnd.github.v3+json",
        "User-Agent": "GitHub-Profile-Generator",
      },
    })

    const repositories: GitHubRepo[] = await reposResponse.json()

    // Generate README using AI analysis
    const readme = await generateReadme(user, repositories)

    return NextResponse.json({
      profile: user,
      repositories: repositories.slice(0, 10), // Return top 10 repos
      readme,
    })
  } catch (error) {
    console.error("Error analyzing profile:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

async function generateReadme(user: GitHubUser, repositories: GitHubRepo[]): Promise<string> {
  // Analyze user's programming languages with weighted scoring
  const languageStats = repositories
    .filter((repo) => repo.language)
    .reduce(
      (acc, repo) => {
        const weight = Math.log(repo.stargazers_count + 1) + Math.log(repo.forks_count + 1) + 1
        acc[repo.language] = (acc[repo.language] || 0) + weight
        return acc
      },
      {} as Record<string, number>,
    )

  const topLanguages = Object.entries(languageStats)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 6)
    .map(([lang]) => lang)

  // Advanced repository analysis
  const totalStars = repositories.reduce((sum, repo) => sum + repo.stargazers_count, 0)
  const totalForks = repositories.reduce((sum, repo) => sum + repo.forks_count, 0)
  const avgStarsPerRepo = repositories.length > 0 ? Math.round(totalStars / repositories.length) : 0

  // Categorize repositories by type and purpose
  const webProjects = repositories.filter(
    (repo) =>
      repo.topics.some((topic) =>
        ["web", "frontend", "backend", "fullstack", "react", "vue", "angular", "nextjs"].includes(topic.toLowerCase()),
      ) || ["JavaScript", "TypeScript", "HTML", "CSS", "PHP"].includes(repo.language),
  )

  const dataProjects = repositories.filter(
    (repo) =>
      repo.topics.some((topic) => ["data", "ml", "ai", "analytics", "science"].includes(topic.toLowerCase())) ||
      ["Python", "R", "Jupyter Notebook"].includes(repo.language),
  )

  const mobileProjects = repositories.filter(
    (repo) =>
      repo.topics.some((topic) =>
        ["mobile", "ios", "android", "flutter", "react-native"].includes(topic.toLowerCase()),
      ) || ["Swift", "Kotlin", "Dart", "Objective-C"].includes(repo.language),
  )

  // Get top repositories with better scoring
  const topRepos = repositories
    .map((repo) => ({
      ...repo,
      score: repo.stargazers_count * 2 + repo.forks_count + repo.topics.length * 0.5,
    }))
    .sort((a, b) => b.score - a.score)
    .slice(0, 6)

  // Determine user's development focus
  let focusArea = "Full-Stack Development"
  if (dataProjects.length > webProjects.length && dataProjects.length > mobileProjects.length) {
    focusArea = "Data Science & AI"
  } else if (mobileProjects.length > webProjects.length) {
    focusArea = "Mobile Development"
  } else if (webProjects.length > 0) {
    focusArea = "Web Development"
  }

  // Generate activity level description
  const recentRepos = repositories.filter((repo) => {
    const lastUpdate = new Date(repo.updated_at)
    const sixMonthsAgo = new Date()
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6)
    return lastUpdate > sixMonthsAgo
  }).length

  const activityLevel = recentRepos > 10 ? "Highly Active" : recentRepos > 5 ? "Active" : "Selective"

  // Enhanced README generation
  const readme = `# Hi there! 👋 I'm ${user.name || user.login}

${user.bio ? `*${user.bio}*` : `*${focusArea} enthusiast with a passion for building innovative solutions*`}

## 🚀 About Me

${user.location ? `📍 Based in ${user.location}` : ""}
${user.company ? `🏢 Working at ${user.company}` : ""}
${user.blog ? `🌐 Website: [${user.blog}](${user.blog})` : ""}
${user.twitter_username ? `🐦 Twitter: [@${user.twitter_username}](https://twitter.com/${user.twitter_username})` : ""}

🎯 **Focus Area:** ${focusArea}  
📊 **Activity Level:** ${activityLevel} Developer  
⭐ **Total Stars Earned:** ${totalStars}  
🍴 **Community Forks:** ${totalForks}  

## 💻 Tech Stack & Expertise

${
  topLanguages.length > 0
    ? topLanguages
        .map((lang) => {
          const langMap: Record<string, string> = {
            JavaScript: "javascript",
            TypeScript: "typescript",
            Python: "python",
            Java: "java",
            "C++": "cplusplus",
            "C#": "csharp",
            Go: "go",
            Rust: "rust",
            Swift: "swift",
            Kotlin: "kotlin",
            PHP: "php",
            Ruby: "ruby",
            HTML: "html5",
            CSS: "css3",
          }
          const logoName = langMap[lang] || lang.toLowerCase().replace(/\s+/g, "")
          return `![${lang}](https://img.shields.io/badge/-${lang}-05122A?style=flat&logo=${logoName}&logoColor=white)`
        })
        .join(" ")
    : "Exploring various technologies..."
}

### 🌟 Specializations
${webProjects.length > 0 ? `- **Web Development**: ${webProjects.length} projects focusing on modern web technologies` : ""}
${dataProjects.length > 0 ? `- **Data Science & AI**: ${dataProjects.length} projects in machine learning and analytics` : ""}
${mobileProjects.length > 0 ? `- **Mobile Development**: ${mobileProjects.length} projects for iOS and Android platforms` : ""}

## 📊 GitHub Analytics

<div align="center">

![${user.login}'s GitHub stats](https://github-readme-stats.vercel.app/api?username=${user.login}&show_icons=true&theme=tokyonight&hide_border=true&count_private=true)

![Top Languages](https://github-readme-stats.vercel.app/api/top-langs/?username=${user.login}&layout=compact&theme=tokyonight&hide_border=true&langs_count=8)

</div>

## 🏆 Featured Projects

${topRepos
  .map(
    (repo) => `
### [${repo.name}](${repo.html_url}) ${repo.stargazers_count > 10 ? "🌟" : repo.stargazers_count > 5 ? "⭐" : ""}
${repo.description || "Innovative project showcasing modern development practices"}

**Tech Stack:** ${repo.language || "Multiple"} ${repo.topics.length > 0 ? `| **Topics:** ${repo.topics.slice(0, 3).join(", ")}` : ""}  
**Impact:** ${repo.stargazers_count} stars • ${repo.forks_count} forks • Last updated ${new Date(repo.updated_at).toLocaleDateString()}
`,
  )
  .join("\n")}

## 📈 Contribution Activity

![${user.login}'s github activity graph](https://github-readme-activity-graph.vercel.app/graph?username=${user.login}&theme=tokyo-night&hide_border=true)

## 🎯 Current Focus

- 🔭 Working on innovative projects in ${focusArea}
- 🌱 Continuously learning and exploring new technologies
- 👯 Open to collaborating on interesting open-source projects
- 💬 Ask me about ${topLanguages.slice(0, 3).join(", ")} and ${focusArea.toLowerCase()}

## 🤝 Let's Connect!

<div align="center">

[![GitHub](https://img.shields.io/badge/-GitHub-181717?style=for-the-badge&logo=github&logoColor=white)](${user.html_url})
${user.twitter_username ? `[![Twitter](https://img.shields.io/badge/-Twitter-1DA1F2?style=for-the-badge&logo=twitter&logoColor=white)](https://twitter.com/${user.twitter_username})` : ""}
${user.blog ? `[![Website](https://img.shields.io/badge/-Website-FF7139?style=for-the-badge&logo=firefox-browser&logoColor=white)](${user.blog})` : ""}

</div>

---

<div align="center">

**"${getInspirationalQuote(focusArea)}"**

⭐️ From [${user.login}](${user.html_url}) | Generated with ❤️ using AI-powered analysis

</div>`

  return readme
}

function getInspirationalQuote(focusArea: string): string {
  const quotes: Record<string, string[]> = {
    "Web Development": [
      "The web is the platform. Build for everyone, everywhere.",
      "Great web experiences are built with users in mind.",
      "Code is poetry written for machines and humans alike.",
    ],
    "Data Science & AI": [
      "In data we trust, in AI we innovate.",
      "Data is the new oil, but insights are the refined fuel.",
      "Machine learning is not magic, it's mathematics with purpose.",
    ],
    "Mobile Development": [
      "Mobile-first isn't just design, it's a mindset.",
      "Great apps solve real problems beautifully.",
      "The best mobile experiences feel effortless.",
    ],
    "Full-Stack Development": [
      "Full-stack means full responsibility for the user experience.",
      "From database to UI, every layer matters.",
      "Building bridges between frontend dreams and backend reality.",
    ],
  }

  const areaQuotes = quotes[focusArea] || quotes["Full-Stack Development"]
  return areaQuotes[Math.floor(Math.random() * areaQuotes.length)]
}
