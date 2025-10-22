"use client";

import type React from "react";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Plus, Edit, Trash2, FileText, Search, ChevronLeft, ChevronRight } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { AIContentGenerator } from "@/components/ai-content-generator";

interface ContentItem {
  id: string;
  title: string;
  content: string;
  summary: string;
  thumbnail_url?: string;
  category: string;
  tags: string[];
  is_published: boolean;
  created_at: string;
}

export function ContentManagement() {
  const [contents, setContents] = useState<ContentItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingContent, setEditingContent] = useState<ContentItem | null>(null);

  const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage] = useState(1);
  const [pageSize] = useState(6);
  const [totalCount, setTotalCount] = useState(0);
  const [activeTab, setActiveTab] = useState("all");

  const { toast } = useToast();

  const [formData, setFormData] = useState({
    title: "",
    content: "",
    summary: "",
    category: "general",
    tags: "",
    thumbnail_url: "",
    is_published: true,
  });

  const supabase = createClient();

  useEffect(() => {
    fetchContents(page, searchQuery, activeTab);
  }, [page, searchQuery, activeTab]);

  useEffect(() => {
    if (searchQuery) {
      setPage(1);
    }
  }, [searchQuery]);

  const fetchContents = async (currentPage = 1, search = "", tab = "all") => {
    try {
      setIsLoading(true);

      let query = supabase.from("educational_content").select("*", { count: "exact" });

      // Apply search filter
      if (search.trim()) {
        query = query.or(`title.ilike.%${search}%,summary.ilike.%${search}%,tags.cs.{${search}}`);
      }

      // Apply tab filter
      if (tab === "published") {
        query = query.eq("is_published", true);
      } else if (tab === "draft") {
        query = query.eq("is_published", false);
      }

      // Apply pagination
      const from = (currentPage - 1) * pageSize;
      const to = from + pageSize - 1;

      const { data, error, count } = await query.range(from, to).order("created_at", { ascending: false });

      if (error) throw error;

      setContents(data || []);
      setTotalCount(count || 0);
    } catch (error) {
      toast({
        title: "Error",
        description: "Gagal memuat konten",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const contentData = {
        ...formData,
        tags: formData.tags
          .split(",")
          .map((tag) => tag.trim())
          .filter(Boolean),
      };

      if (editingContent) {
        const { error } = await supabase.from("educational_content").update(contentData).eq("id", editingContent.id);

        if (error) throw error;
        toast({ title: "Berhasil", description: "Konten berhasil diperbarui" });
      } else {
        const { error } = await supabase.from("educational_content").insert([contentData]);

        if (error) throw error;
        toast({ title: "Berhasil", description: "Konten berhasil dibuat" });
      }

      resetForm();
      setIsDialogOpen(false);
      fetchContents(page, searchQuery, activeTab);
    } catch (error) {
      toast({
        title: "Error",
        description: "Gagal menyimpan konten",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = (content: ContentItem) => {
    setEditingContent(content);
    setFormData({
      title: content.title,
      content: content.content,
      summary: content.summary,
      category: content.category,
      tags: content.tags.join(", "),
      thumbnail_url: content.thumbnail_url || "",
      is_published: content.is_published,
    });
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Apakah Anda yakin ingin menghapus konten ini?")) return;

    try {
      const { error } = await supabase.from("educational_content").delete().eq("id", id);

      if (error) throw error;
      toast({ title: "Berhasil", description: "Konten berhasil dihapus" });
      fetchContents(page, searchQuery, activeTab);
    } catch (error) {
      toast({
        title: "Error",
        description: "Gagal menghapus konten",
        variant: "destructive",
      });
    }
  };

  const handleAIContentGenerated = (generatedContent: { title: string; summary: string; content: string; tags: string }) => {
    setFormData({
      title: generatedContent.title,
      content: generatedContent.content,
      summary: generatedContent.summary,
      category: formData.category,
      tags: generatedContent.tags,
      thumbnail_url: formData.thumbnail_url,
      is_published: formData.is_published,
    });
    setIsDialogOpen(true);
  };

  const resetForm = () => {
    setFormData({
      title: "",
      content: "",
      summary: "",
      category: "general",
      tags: "",
      thumbnail_url: "",
      is_published: true,
    });
    setEditingContent(null);
  };

  const totalPages = Math.ceil(totalCount / pageSize);
  const startItem = totalCount === 0 ? 0 : (page - 1) * pageSize + 1;
  const endItem = Math.min(page * pageSize, totalCount);

  const handlePreviousPage = () => {
    if (page > 1) {
      setPage(page - 1);
    }
  };

  const handleNextPage = () => {
    if (page < totalPages) {
      setPage(page + 1);
    }
  };

  const handleTabChange = (value: string) => {
    setActiveTab(value);
    setPage(1); // Reset to first page when changing tabs
  };

  const categories = [
    { value: "general", label: "Umum" },
    { value: "rumah_tangga", label: "Rumah Tangga" },
    { value: "energi_terbarukan", label: "Energi Terbarukan" },
    { value: "lingkungan", label: "Lingkungan" },
    { value: "teknologi", label: "Teknologi" },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold">Manajemen Konten</h2>
        <div className="flex gap-2">
          <AIContentGenerator onContentGenerated={handleAIContentGenerated} />
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={resetForm}>
                <Plus className="w-4 h-4" />
                <p className="hidden md:block">Tambah Konten</p>
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>{editingContent ? "Edit Konten" : "Tambah Konten Baru"}</DialogTitle>
                <DialogDescription>{editingContent ? "Perbarui informasi konten" : "Buat konten edukasi baru tentang hemat energi"}</DialogDescription>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="title">Judul</Label>
                    <Input id="title" value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} placeholder="Masukkan judul konten" required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="category">Kategori</Label>
                    <Select value={formData.category} onValueChange={(value) => setFormData({ ...formData, category: value })}>
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
                  <Textarea id="summary" value={formData.summary} onChange={(e) => setFormData({ ...formData, summary: e.target.value })} placeholder="Ringkasan singkat konten" rows={2} />
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="content">Konten</Label>
                  </div>
                  <Textarea id="content" value={formData.content} onChange={(e) => setFormData({ ...formData, content: e.target.value })} placeholder="Tulis konten lengkap di sini..." rows={10} required />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="tags">Tags (pisahkan dengan koma)</Label>
                    <Input id="tags" value={formData.tags} onChange={(e) => setFormData({ ...formData, tags: e.target.value })} placeholder="hemat energi, tips, rumah" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="thumbnail">URL Thumbnail</Label>
                    <Input id="thumbnail" value={formData.thumbnail_url} onChange={(e) => setFormData({ ...formData, thumbnail_url: e.target.value })} placeholder="https://example.com/image.jpg" />
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <input type="checkbox" id="published" checked={formData.is_published} onChange={(e) => setFormData({ ...formData, is_published: e.target.checked })} className="rounded" />
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

      <div className="flex justify-end">
        <div className="relative w-full max-w-sm">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
          <Input placeholder="Cari berdasarkan judul, ringkasan, atau tags..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="pl-10" />
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
        <TabsList>
          <TabsTrigger value="all">Semua Konten</TabsTrigger>
          <TabsTrigger value="published">Dipublikasi</TabsTrigger>
          <TabsTrigger value="draft">Draft</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-4">
          <ContentList contents={contents} onEdit={handleEdit} onDelete={handleDelete} isLoading={isLoading} />
        </TabsContent>

        <TabsContent value="published" className="space-y-4">
          <ContentList contents={contents} onEdit={handleEdit} onDelete={handleDelete} isLoading={isLoading} />
        </TabsContent>

        <TabsContent value="draft" className="space-y-4">
          <ContentList contents={contents} onEdit={handleEdit} onDelete={handleDelete} isLoading={isLoading} />
        </TabsContent>
      </Tabs>

      {totalCount > 0 && (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4">
          <div className="text-sm text-muted-foreground">
            Menampilkan {startItem} – {endItem} dari total {totalCount} konten
          </div>

          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={handlePreviousPage} disabled={page === 1}>
              <ChevronLeft className="w-4 h-4" />
              Previous
            </Button>

            <div className="flex items-center gap-1">
              <span className="text-sm">
                Halaman {page} dari {totalPages}
              </span>
            </div>

            <Button variant="outline" size="sm" onClick={handleNextPage} disabled={page === totalPages}>
              Next
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

interface ContentListProps {
  contents: ContentItem[];
  onEdit: (content: ContentItem) => void;
  onDelete: (id: string) => void;
  isLoading?: boolean;
}

function ContentList({ contents, onEdit, onDelete, isLoading }: ContentListProps) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardHeader>
              <div className="h-4 bg-muted rounded w-3/4"></div>
              <div className="h-3 bg-muted rounded w-1/2"></div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="h-3 bg-muted rounded"></div>
                <div className="h-3 bg-muted rounded w-2/3"></div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (contents.length === 0) {
    return (
      <Card className="border-dashed border-2">
        <CardContent className="flex items-center justify-center py-16">
          <div className="text-center">
            <FileText className="mx-auto h-12 w-12 text-muted-foreground" />
            <h3 className="mt-4 font-medium">Belum ada konten</h3>
            <p className="mt-1 text-sm text-muted-foreground">Konten yang Anda buat akan muncul di sini</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-y-4 gap-x-4 sm:grid-cols-2 lg:grid-cols-3">
      {contents.map((content) => (
        <Card key={content.id} className="flex flex-col transition-all hover:shadow-md">
          <CardHeader className="flex-1">
            <div className="flex flex-col sm:flex-row sm:items-start gap-3">
              <div className="flex-1 space-y-2">
                <CardTitle className="text-base sm:text-lg line-clamp-2">{content.title}</CardTitle>
                <CardDescription className="text-sm line-clamp-2">{content.summary}</CardDescription>
              </div>
              <Badge variant={content.is_published ? "default" : "secondary"} className="self-start whitespace-nowrap">
                {content.is_published ? "Published" : "Draft"}
              </Badge>
            </div>
          </CardHeader>

          <CardContent className="space-y-3">
            <div className="flex flex-wrap gap-2">
              <Badge variant="outline">{content.category}</Badge>
              {content.tags.slice(0, 3).map((tag, index) => (
                <Badge key={`${content.id}-${tag}-${index}`} variant="secondary" className="text-xs">
                  {tag}
                </Badge>
              ))}
              {content.tags.length > 3 && (
                <Badge variant="secondary" className="text-xs">
                  +{content.tags.length - 3}
                </Badge>
              )}
            </div>

            <p className="text-xs sm:text-sm text-muted-foreground">Dibuat: {new Date(content.created_at).toLocaleDateString("id-ID")}</p>
          </CardContent>

          <CardFooter className="flex flex-col sm:flex-row justify-end gap-2 mt-auto">
            <Button variant="outline" size="sm" onClick={() => onEdit(content)} className="w-full sm:w-auto flex justify-center sm:justify-start">
              <Edit className="w-4 h-4 mr-0 sm:mr-2" />
              <span className="hidden sm:inline">Edit</span>
            </Button>

            <Button variant="outline" size="sm" onClick={() => onDelete(content.id)} className="w-full sm:w-auto flex justify-center sm:justify-start">
              <Trash2 className="w-4 h-4 mr-0 sm:mr-2" />
              <span className="hidden sm:inline">Hapus</span>
            </Button>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
}
