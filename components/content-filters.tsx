"use client"

import type React from "react"

import { useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Search, Filter } from "lucide-react"

const categories = [
  { value: "all", label: "Semua Kategori", count: 0 },
  { value: "rumah_tangga", label: "Rumah Tangga", count: 0 },
  { value: "energi_terbarukan", label: "Energi Terbarukan", count: 0 },
  { value: "lingkungan", label: "Lingkungan", count: 0 },
  { value: "teknologi", label: "Teknologi", count: 0 },
  { value: "general", label: "Umum", count: 0 },
]

export function ContentFilters() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [searchTerm, setSearchTerm] = useState(searchParams.get("search") || "")
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get("category") || "all")

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    updateFilters({ search: searchTerm })
  }

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category)
    updateFilters({ category })
  }

  const updateFilters = (newParams: Record<string, string>) => {
    const params = new URLSearchParams(searchParams.toString())

    Object.entries(newParams).forEach(([key, value]) => {
      if (value && value !== "all") {
        params.set(key, value)
      } else {
        params.delete(key)
      }
    })

    router.push(`/content?${params.toString()}`)
  }

  const clearFilters = () => {
    setSearchTerm("")
    setSelectedCategory("all")
    router.push("/content")
  }

  return (
    <div className="space-y-6">
      {/* Search */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <Search className="w-5 h-5" />
            Pencarian
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSearch} className="space-y-3">
            <Input placeholder="Cari artikel..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
            <Button type="submit" className="w-full">
              Cari
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Categories */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <Filter className="w-5 h-5" />
            Kategori
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {categories.map((category) => (
              <button
                key={category.value}
                onClick={() => handleCategoryChange(category.value)}
                className={`w-full text-left p-3 rounded-lg transition-colors ${
                  selectedCategory === category.value
                    ? "bg-primary text-primary-foreground"
                    : "hover:bg-muted text-muted-foreground hover:text-foreground"
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">{category.label}</span>
                  {category.count > 0 && (
                    <Badge variant="secondary" className="text-xs">
                      {category.count}
                    </Badge>
                  )}
                </div>
              </button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Clear Filters */}
      {(searchTerm || selectedCategory !== "all") && (
        <Button variant="outline" onClick={clearFilters} className="w-full bg-transparent">
          Hapus Filter
        </Button>
      )}
    </div>
  )
}
