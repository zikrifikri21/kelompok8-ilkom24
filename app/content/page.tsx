import { createClient } from "@/lib/supabase/server"
import { ContentLayout } from "@/components/content-layout"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { BookOpen, Leaf } from "lucide-react"
import Link from "next/link"
import { Suspense } from "react"
import { ContentList } from "@/components/content-list"

export default async function ContentPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string; search?: string }>
}) {
  const params = await searchParams
  const supabase = await createClient()

  // Build query based on filters
  let query = supabase
    .from("educational_content")
    .select("*")
    .eq("is_published", true)
    .order("created_at", { ascending: false })

  if (params.category && params.category !== "all") {
    query = query.eq("category", params.category)
  }

  if (params.search) {
    query = query.or(`title.ilike.%${params.search}%,content.ilike.%${params.search}%,summary.ilike.%${params.search}%`)
  }

  const { data: contents, error } = await query

  if (error) {
    console.error("Error fetching contents:", error)
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
              <Link href="/content" className="text-foreground font-medium">
                Konten Edukasi
              </Link>
              <Button variant="outline" size="sm" asChild>
                <Link href="/auth/login">Masuk</Link>
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Header */}
      <section className="py-16 px-4 bg-gradient-to-br from-primary/5 via-transparent to-accent/5">
        <div className="container mx-auto text-center">
          <div className="flex items-center justify-center gap-3 mb-6">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
              <BookOpen className="w-8 h-8 text-primary" />
            </div>
          </div>
          <h1 className="text-4xl md:text-5xl font-playfair text-retro text-foreground mb-4">Konten Edukasi</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto text-vintage">
            Jelajahi koleksi artikel, tips, dan panduan lengkap tentang hemat energi dan energi terbarukan
          </p>
          <div className="mt-6">
            <Badge variant="secondary" className="text-sm">
              {contents?.length || 0} artikel tersedia
            </Badge>
          </div>
        </div>
      </section>

      {/* Content Section */}
      <section className="py-12 px-4">
        <div className="container mx-auto">
          <ContentLayout  />
        </div>
      </section>
    </div>
  )
}
