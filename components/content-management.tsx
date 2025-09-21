"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Plus, Edit, Trash2 } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { AIContentGenerator } from "@/components/ai-content-generator"

interface ContentItem {
  id: string
  title: string
  content: string
  summary: string
  thumbnail_url?: string
  category: string
  tags: string[]
  is_published: boolean
  created_at: string
}

export function ContentManagement() {
  const [contents, setContents] = useState<ContentItem[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingContent, setEditingContent] = useState<ContentItem | null>(null)
  const { toast } = useToast()

  const [formData, setFormData] = useState({
    title: "",
    content: "",
    summary: "",
    category: "general",
    tags: "",
    thumbnail_url: "",
    is_published: true,
  })

  const supabase = createClient()

  useEffect(() => {
    fetchContents()
  }, [])

  const fetchContents = async () => {
    try {
      const { data, error } = await supabase
        .from("educational_content")
        .select("*")
        .order("created_at", { ascending: false })

      if (error) throw error
      setContents(data || [])
    } catch (error) {
      toast({
        title: "Error",
        description: "Gagal memuat konten",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const contentData = {
        ...formData,
        tags: formData.tags
          .split(",")
          .map((tag) => tag.trim())
          .filter(Boolean),
      }

      if (editingContent) {
        const { error } = await supabase.from("educational_content").update(contentData).eq("id", editingContent.id)

        if (error) throw error
        toast({ title: "Berhasil", description: "Konten berhasil diperbarui" })
      } else {
        const { error } = await supabase.from("educational_content").insert([contentData])

        if (error) throw error
        toast({ title: "Berhasil", description: "Konten berhasil dibuat" })
      }

      resetForm()
      setIsDialogOpen(false)
      fetchContents()
    } catch (error) {
      toast({
        title: "Error",
        description: "Gagal menyimpan konten",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleEdit = (content: ContentItem) => {
    setEditingContent(content)
    setFormData({
      title: content.title,
      content: content.content,
      summary: content.summary,
      category: content.category,
      tags: content.tags.join(", "),
      thumbnail_url: content.thumbnail_url || "",
      is_published: content.is_published,
    })
    setIsDialogOpen(true)
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Apakah Anda yakin ingin menghapus konten ini?")) return

    try {
      const { error } = await supabase.from("educational_content").delete().eq("id", id)

      if (error) throw error
      toast({ title: "Berhasil", description: "Konten berhasil dihapus" })
      fetchContents()
    } catch (error) {
      toast({
        title: "Error",
        description: "Gagal menghapus konten",
        variant: "destructive",
      })
    }
  }

  const handleAIContentGenerated = (generatedContent: {
    title: string
    summary: string
    content: string
    tags: string
  }) => {
    setFormData({
      title: generatedContent.title,
      content: generatedContent.content,
      summary: generatedContent.summary,
      category: formData.category,
      tags: generatedContent.tags,
      thumbnail_url: formData.thumbnail_url,
      is_published: formData.is_published,
    })
    setIsDialogOpen(true)
  }

  const resetForm = () => {
    setFormData({
      title: "",
      content: "",
      summary: "",
      category: "general",
      tags: "",
      thumbnail_url: "",
      is_published: true,
    })
    setEditingContent(null)
  }

  const categories = [
    { value: "general", label: "Umum" },
    { value: "rumah_tangga", label: "Rumah Tangga" },
    { value: "energi_terbarukan", label: "Energi Terbarukan" },
    { value: "lingkungan", label: "Lingkungan" },
    { value: "teknologi", label: "Teknologi" },
  ]

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold">Manajemen Konten</h2>
        <div className="flex gap-2">
          <AIContentGenerator onContentGenerated={handleAIContentGenerated} />
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={resetForm}>
                <Plus className="w-4 h-4 mr-2" />
                Tambah Konten
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>{editingContent ? "Edit Konten" : "Tambah Konten Baru"}</DialogTitle>
                <DialogDescription>
                  {editingContent ? "Perbarui informasi konten" : "Buat konten edukasi baru tentang hemat energi"}
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="title">Judul</Label>
                    <Input
                      id="title"
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      placeholder="Masukkan judul konten"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="category">Kategori</Label>
                    <Select
                      value={formData.category}
                      onValueChange={(value) => setFormData({ ...formData, category: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Pilih kategori" />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map((cat) => (
                          <SelectItem key={cat.value} value={cat.value}>
                            {cat.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="summary">Ringkasan</Label>
                  <Textarea
                    id="summary"
                    value={formData.summary}
                    onChange={(e) => setFormData({ ...formData, summary: e.target.value })}
                    placeholder="Ringkasan singkat konten"
                    rows={2}
                  />
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="content">Konten</Label>
                  </div>
                  <Textarea
                    id="content"
                    value={formData.content}
                    onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                    placeholder="Tulis konten lengkap di sini..."
                    rows={10}
                    required
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="tags">Tags (pisahkan dengan koma)</Label>
                    <Input
                      id="tags"
                      value={formData.tags}
                      onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                      placeholder="hemat energi, tips, rumah"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="thumbnail">URL Thumbnail</Label>
                    <Input
                      id="thumbnail"
                      value={formData.thumbnail_url}
                      onChange={(e) => setFormData({ ...formData, thumbnail_url: e.target.value })}
                      placeholder="https://example.com/image.jpg"
                    />
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="published"
                    checked={formData.is_published}
                    onChange={(e) => setFormData({ ...formData, is_published: e.target.checked })}
                    className="rounded"
                  />
                  <Label htmlFor="published">Publikasikan konten</Label>
                </div>

                <div className="flex justify-end space-x-2 pt-4">
                  <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                    Batal
                  </Button>
                  <Button type="submit" disabled={isLoading}>
                    {isLoading ? "Menyimpan..." : editingContent ? "Perbarui" : "Simpan"}
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <Tabs defaultValue="all" className="w-full">
        <TabsList>
          <TabsTrigger value="all">Semua Konten</TabsTrigger>
          <TabsTrigger value="published">Dipublikasi</TabsTrigger>
          <TabsTrigger value="draft">Draft</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-4">
          <ContentList contents={contents} onEdit={handleEdit} onDelete={handleDelete} />
        </TabsContent>

        <TabsContent value="published" className="space-y-4">
          <ContentList contents={contents.filter((c) => c.is_published)} onEdit={handleEdit} onDelete={handleDelete} />
        </TabsContent>

        <TabsContent value="draft" className="space-y-4">
          <ContentList contents={contents.filter((c) => !c.is_published)} onEdit={handleEdit} onDelete={handleDelete} />
        </TabsContent>
      </Tabs>
    </div>
  )
}

interface ContentListProps {
  contents: ContentItem[]
  onEdit: (content: ContentItem) => void
  onDelete: (id: string) => void
}

function ContentList({ contents, onEdit, onDelete }: ContentListProps) {
  if (contents.length === 0) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-12">
          <p className="text-muted-foreground">Belum ada konten</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="grid gap-4">
      {contents.map((content) => (
        <Card key={content.id}>
          <CardHeader>
            <div className="flex items-start justify-between">
              <div className="space-y-1">
                <CardTitle className="text-lg">{content.title}</CardTitle>
                <CardDescription>{content.summary}</CardDescription>
              </div>
              <div className="flex items-center space-x-2">
                <Badge variant={content.is_published ? "default" : "secondary"}>
                  {content.is_published ? "Published" : "Draft"}
                </Badge>
                <Button variant="ghost" size="sm" onClick={() => onEdit(content)}>
                  <Edit className="w-4 h-4" />
                </Button>
                <Button variant="ghost" size="sm" onClick={() => onDelete(content.id)}>
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Badge variant="outline">{content.category}</Badge>
                {content.tags.map((tag) => (
                  <Badge key={tag} variant="secondary" className="text-xs">
                    {tag}
                  </Badge>
                ))}
              </div>
              <p className="text-sm text-muted-foreground">
                Dibuat: {new Date(content.created_at).toLocaleDateString("id-ID")}
              </p>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
