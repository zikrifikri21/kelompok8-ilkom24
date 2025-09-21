import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { ContentManagement } from "@/components/content-management"
import { AdminHeader } from "@/components/admin-header"

export default async function AdminPage() {
  const supabase = await createClient()

  const { data, error } = await supabase.auth.getUser()
  if (error || !data?.user) {
    redirect("/auth/login")
  }

  // Check if user is admin
  const { data: adminUser } = await supabase.from("admin_users").select("*").eq("id", data.user.id).single()

  if (!adminUser) {
    redirect("/auth/login?error=unauthorized")
  }

  return (
    <div className="min-h-screen bg-background">
      <AdminHeader />
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Panel Admin</h1>
          <p className="text-muted-foreground">Kelola konten edukasi hemat energi</p>
        </div>
        <ContentManagement />
      </div>
    </div>
  )
}
