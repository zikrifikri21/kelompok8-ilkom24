import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function SignUpSuccessPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-sage-50 to-earth-50 p-6">
      <div className="w-full max-w-sm">
        <Card>
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold text-forest-800">Pendaftaran Berhasil!</CardTitle>
            <CardDescription>Periksa email Anda untuk konfirmasi</CardDescription>
          </CardHeader>
          <CardContent className="text-center space-y-4">
            <p className="text-sm text-muted-foreground">
              Kami telah mengirimkan email konfirmasi ke alamat email Anda. Silakan periksa inbox dan klik link
              konfirmasi untuk mengaktifkan akun admin Anda.
            </p>
            <div className="space-y-2">
              <Button asChild className="w-full">
                <Link href="/auth/login">Masuk Sekarang</Link>
              </Button>
              <Button variant="outline" asChild className="w-full bg-transparent">
                <Link href="/">Kembali ke Beranda</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
