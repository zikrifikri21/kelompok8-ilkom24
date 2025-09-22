import { createClient } from "@/lib/supabase/server"
import { notFound } from "next/navigation"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ShareButtons } from "@/components/share-buttons"
import { Calendar, Clock, ArrowLeft, Leaf } from "lucide-react"
import Link from "next/link"
import Image from "next/image"

export default async function ContentDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const supabase = await createClient()
  const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL || "https://energicerdas.com").trim()
  
  const { data: content, error } = await supabase
    .from("educational_content")
    .select("*")
    .eq("id", id)
    .eq("is_published", true)
    .single()

  if (error || !content) {
    notFound()
  }

  const getCategoryLabel = (category: string) => {
    const categoryMap: Record<string, string> = {
      rumah_tangga: "Rumah Tangga",
      energi_terbarukan: "Energi Terbarukan",
      lingkungan: "Lingkungan",
      teknologi: "Teknologi",
      general: "Umum",
    }
    return categoryMap[category] || category
  }

  const getReadingTime = (content: string) => {
    const wordsPerMinute = 200
    const wordCount = content.split(" ").length
    const readingTime = Math.ceil(wordCount / wordsPerMinute)
    return `${readingTime} menit baca`
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                <Leaf className="w-5 h-5 text-primary-foreground" />
              </div>
              <span className="font-bold text-xl text-foreground">EnergiCerdas</span>
            </Link>
            <div className="hidden md:flex items-center gap-6">
              <Link href="/" className="text-muted-foreground hover:text-foreground transition-colors">
                Beranda
              </Link>
              <Link href="/content" className="text-muted-foreground hover:text-foreground transition-colors">
                Konten Edukasi
              </Link>
              <Button variant="outline" size="sm" asChild>
                <Link href="/auth/login">Masuk</Link>
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Back Button */}
      <div className="container mx-auto px-4 py-4">
        <Button variant="ghost" asChild>
          <Link href="/content">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Kembali ke Konten
          </Link>
        </Button>
      </div>

      {/* Article */}
      <article className="container mx-auto px-4 pb-12">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <header className="mb-8">
            <div className="flex items-center gap-2 mb-4">
              <Badge variant="secondary">{getCategoryLabel(content.category)}</Badge>
              <div className="flex items-center gap-1 text-sm text-muted-foreground">
                <Clock className="w-4 h-4" />
                {getReadingTime(content.content)}
              </div>
            </div>
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-playfair text-retro text-foreground mb-4 text-balance">
              {content.title}
            </h1>
            <p className="text-lg text-muted-foreground mb-6 text-vintage">{content.summary}</p>
            <div className="flex items-center justify-between">
              <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center gap-1 text-sm text-muted-foreground">
                  <Calendar className="w-4 h-4" />
                  {new Date(content.created_at).toLocaleDateString("id-ID", {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  })}
                </div>
                <ShareButtons url={`${siteUrl}/content/${content.id}`} title={content.title} description={content.summary} size="sm" />
              </div>
            </div>
          </header>

          {/* Thumbnail */}
          {content.thumbnail_url && (
            <div className="aspect-video relative overflow-hidden rounded-lg mb-8">
              <Image
                src={content.thumbnail_url || "/placeholder.svg"}
                alt={content.title}
                fill
                className="object-cover"
                priority
              />
            </div>
          )}

          {/* Content */}
          <Card className="mb-8">
            <CardContent className="p-8">
              <div
                className="prose prose-lg max-w-none text-foreground prose-headings:text-foreground prose-p:text-muted-foreground prose-strong:text-foreground prose-a:text-primary hover:prose-a:text-primary/80"
                dangerouslySetInnerHTML={{
                  __html: content.content.replace(/\n/g, "<br />"),
                }}
              />
            </CardContent>
          </Card>

          {/* Tags */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-foreground mb-3">Tags</h3>
            <div className="flex flex-wrap gap-2">
              {content.tags.map((tag) => (
                <Badge key={tag} variant="outline">
                  {tag}
                </Badge>
              ))}
            </div>
          </div>

          {/* Share Section */}
          <Card>
            <CardContent className="p-6">
              <div className="text-center">
                <h3 className="text-lg font-semibold text-foreground mb-3">Bagikan Artikel Ini</h3>
                <p className="text-muted-foreground mb-4">
                  Bantu sebarkan informasi tentang hemat energi kepada teman dan keluarga
                </p>
                <ShareButtons url={`${siteUrl}/content/${content.id}`} title={content.title} description={content.summary} size="sm" />
              </div>
            </CardContent>
          </Card>
        </div>
      </article>
    </div>
  )
}
