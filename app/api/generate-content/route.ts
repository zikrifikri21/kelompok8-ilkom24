import { GoogleGenAI } from "@google/genai"
import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

const genAI = new GoogleGenAI({ apiKey: process.env.GOOGLE_AI_API_KEY! })

export async function POST(request: NextRequest) {
  try {
    // Check authentication
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Check if user is admin
    const { data: adminUser } = await supabase.from("admin_users").select("*").eq("id", user.id).single()

    if (!adminUser) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    const { topic, category, style } = await request.json()

    if (!topic) {
      return NextResponse.json({ error: "Topic is required" }, { status: 400 })
    }

    const response = await genAI.models.generateContent({
      model: "gemini-2.0-flash-001",
      contents: `Buatlah artikel edukasi tentang hemat energi dengan topik: "${topic}".

Kategori: ${category || "umum"}
Gaya penulisan: ${style || "informatif dan mudah dipahami"}

Artikel harus:
1. Ditulis dalam bahasa Indonesia yang baik dan benar
2. Fokus pada tips praktis dan actionable
3. Menggunakan contoh yang relevan dengan kehidupan sehari-hari di Indonesia
4. Panjang artikel sekitar 500-800 kata
5. Menggunakan format yang mudah dibaca dengan poin-poin dan subjudul
6. Menyertakan manfaat lingkungan dan ekonomi
7. Memberikan tips yang dapat diterapkan langsung

Format output:
- Judul yang menarik
- Ringkasan singkat (1-2 kalimat)
- Konten artikel lengkap dengan subjudul dan poin-poin
- 3-5 tags yang relevan (pisahkan dengan koma)

Pastikan informasi akurat dan bermanfaat untuk pembaca Indonesia.`,
    })

    const text = response.text

    // Parse the generated content
    const lines = text.split("\n").filter((line) => line.trim())
    let title = ""
    let summary = ""
    let content = ""
    let tags = ""

    const currentSection = ""
    const contentLines: string[] = []

    for (const line of lines) {
      const trimmedLine = line.trim()

      if (trimmedLine.toLowerCase().startsWith("judul:") || trimmedLine.toLowerCase().startsWith("title:")) {
        title = trimmedLine.replace(/^(judul:|title:)/i, "").trim()
      } else if (
        trimmedLine.toLowerCase().startsWith("ringkasan:") ||
        trimmedLine.toLowerCase().startsWith("summary:")
      ) {
        summary = trimmedLine.replace(/^(ringkasan:|summary:)/i, "").trim()
      } else if (trimmedLine.toLowerCase().startsWith("tags:") || trimmedLine.toLowerCase().startsWith("tag:")) {
        tags = trimmedLine.replace(/^(tags?:|tag:)/i, "").trim()
      } else if (
        !trimmedLine.toLowerCase().includes("judul:") &&
        !trimmedLine.toLowerCase().includes("ringkasan:") &&
        !trimmedLine.toLowerCase().includes("tags:") &&
        !trimmedLine.toLowerCase().includes("title:") &&
        !trimmedLine.toLowerCase().includes("summary:") &&
        trimmedLine.length > 0
      ) {
        contentLines.push(trimmedLine)
      }
    }

    content = contentLines.join("\n\n")

    // Fallback parsing if structured format is not followed
    if (!title && contentLines.length > 0) {
      title = contentLines[0].replace(/^#+\s*/, "")
      content = contentLines.slice(1).join("\n\n")
    }

    if (!summary && content) {
      // Extract first sentence as summary
      const sentences = content.split(".")
      summary = sentences[0] + "."
    }

    if (!tags) {
      // Generate default tags based on category and topic
      const defaultTags = ["hemat energi", category || "umum", "tips", "lingkungan"]
      tags = defaultTags.join(", ")
    }

    return NextResponse.json({
      title: title || `Tips Hemat Energi: ${topic}`,
      summary: summary || `Panduan praktis tentang ${topic} untuk menghemat energi.`,
      content: content || text,
      tags: tags,
    })
  } catch (error) {
    console.error("Error generating content:", error)
    return NextResponse.json({ error: "Failed to generate content" }, { status: 500 })
  }
}
