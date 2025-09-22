"use client"

import type React from "react"
import { useState, useEffect, useRef, useCallback } from "react"
import { createClient } from "@/lib/supabase/client"
import { ContentGrid } from "@/components/content-grid"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Search, Loader2 } from "lucide-react"
import { cn } from "@/lib/utils"

interface ContentItem {
  id: string
  title: string
  content: string
  summary: string
  thumbnail_url?: string
  category: string
  tags: string[]
  created_at: string
}

const ITEMS_PER_PAGE = 10

const CATEGORIES = [
  { id: null, label: "Semua Kategori" },
  { id: "rumah_tangga", label: "Rumah Tangga" },
  { id: "energi_terbarukan", label: "Energi Terbarukan" },
  { id: "lingkungan", label: "Lingkungan" },
  { id: "teknologi", label: "Teknologi" },
  { id: "general", label: "Umum" },
]

export function ContentLayout() {
  const [contents, setContents] = useState<ContentItem[]>([])
  const [search, setSearch] = useState("")
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [hasMore, setHasMore] = useState(true)
  const [loading, setLoading] = useState(false)
  const [initialLoading, setInitialLoading] = useState(true)

  const observerRef = useRef<HTMLDivElement>(null)
  const supabase = createClient()
  const isFetchingRef = useRef(false)

  const fetchContents = useCallback(
    async (offset = 0, searchTerm = "", category: string | null = null, reset = false) => {
      if (isFetchingRef.current) return

      isFetchingRef.current = true
      setLoading(true)

      try {
        let query = supabase
          .from("educational_content")
          .select("*")
          .order("created_at", { ascending: false })
          .range(offset, offset + ITEMS_PER_PAGE - 1)

        // Apply search filter
        if (searchTerm.trim()) {
          query = query.or(`title.ilike.%${searchTerm}%,summary.ilike.%${searchTerm}%,tags.cs.{${searchTerm}}`)
        }

        // Apply category filter
        if (category) {
          query = query.eq("category", category)
        }

        const { data, error } = await query

        if (error) {
          console.error("Error fetching contents:", error)
          return
        }

        const newContents = data || []

        setHasMore(newContents.length === ITEMS_PER_PAGE)

        if (reset) {
          setContents(newContents)
        } else {
          setContents((prev) => [...prev, ...newContents])
        }
      } catch (error) {
        console.error("Error fetching contents:", error)
      } finally {
        setLoading(false)
        setInitialLoading(false)
        isFetchingRef.current = false
      }
    },
    [supabase],
  )

  useEffect(() => {
    fetchContents(0, "", null, true)
  }, [])

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setContents([])
      setHasMore(true)
      fetchContents(0, search, selectedCategory, true)
    }, 500)

    return () => clearTimeout(timeoutId)
  }, [search, selectedCategory])

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const target = entries[0]
        if (
          target.isIntersecting &&
          hasMore &&
          !loading &&
          !initialLoading &&
          !isFetchingRef.current &&
          contents.length > 0
        ) {
          console.log("[v0] Triggering infinite scroll fetch", {
            contentsLength: contents.length,
            hasMore,
            loading,
            initialLoading,
          })
          fetchContents(contents.length, search, selectedCategory, false)
        }
      },
      {
        threshold: 0.1,
        rootMargin: "50px",
      },
    )

    const currentRef = observerRef.current
    if (currentRef) {
      observer.observe(currentRef)
    }

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef)
      }
    }
  }, [contents.length, hasMore, loading, initialLoading, search, selectedCategory])

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value)
  }

  const clearSearch = () => {
    setSearch("")
  }

  const handleCategoryClick = (categoryId: string | null) => {
    setSelectedCategory(categoryId)
  }

  if (initialLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
        <span className="ml-2 text-muted-foreground">Memuat konten...</span>
      </div>
    )
  }

  return (
    <div className="grid lg:grid-cols-[250px_1fr] gap-6">
      {/* Sticky Sidebar */}
      <div className="lg:sticky lg:top-18 lg:h-fit space-y-6">
        {/* Search Bar */}
        <div className="space-y-2">
          <h3 className="font-semibold text-foreground">Cari Artikel</h3>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Cari berdasarkan judul, ringkasan, atau tag..."
              value={search}
              onChange={handleSearchChange}
              className="pl-10 pr-10"
            />
            {search && (
              <Button
                variant="ghost"
                size="sm"
                onClick={clearSearch}
                className="absolute right-1 top-1/2 transform -translate-y-1/2 h-8 w-8 p-0"
              >
                ×
              </Button>
            )}
          </div>
        </div>

        {/* Categories */}
        <div className="space-y-2 bg-card p-4 rounded-2xl shadow border">
          <h3 className="font-semibold text-foreground">Kategori</h3>
          <div className="space-y-1">
            {CATEGORIES.map((category) => (
              <button
                key={category.id || "all"}
                onClick={() => handleCategoryClick(category.id)}
                className={cn(
                  "w-full text-left px-3 py-2 rounded-md text-sm transition-colors",
                  selectedCategory === category.id
                    ? "bg-primary text-primary-foreground"
                    : "hover:bg-muted text-muted-foreground hover:text-foreground",
                )}
              >
                {category.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="space-y-6">
        <ContentGrid contents={contents} />

        {loading && !initialLoading && (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="w-6 h-6 animate-spin text-primary" />
            <span className="ml-2 text-muted-foreground">Memuat lebih banyak...</span>
          </div>
        )}

        <div ref={observerRef} className="h-4" />

        {!hasMore && contents.length > 0 && (
          <div className="text-center py-8">
            <p className="text-muted-foreground">Semua artikel telah dimuat</p>
          </div>
        )}
      </div>
    </div>
  )
}
