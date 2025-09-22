import { Suspense } from "react"
import { LoginForm, LoadingFallback } from "@/components/login-form"

export const metadata = {
  title: "Login - Green Energy Platform",
  description:
    "Login to your green energy platform account. Access renewable energy solutions and sustainable technology.",
  keywords: "login, green energy, renewable energy, wind turbines, sustainable technology",
  openGraph: {
    title: "Login - Green Energy Platform",
    description:
      "Login to your green energy platform account. Access renewable energy solutions and sustainable technology.",
    images: [
      {
        url: "https://www.omv.com/images/GvflD8YyeyxOOJFgPN1juD8YainJ-lH3HR5e-kVPCCk/c:4000:2250:fp:0.589:0.512/resize:fill-down:768:432/plain/local:///2024/06/9eb4fa9b-6881-65bd-c3e3-d8ca49a106e8/OMV_Energy_Green-Hydrogen_Wind-Turbine-Aerial-View-01_RGB_web.jpg@webp",
        alt: "Aerial view of wind turbines generating green energy",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Login - Green Energy Platform",
    description:
      "Login to your green energy platform account. Access renewable energy solutions and sustainable technology.",
    images: [
      "https://www.omv.com/images/GvflD8YyeyxOOJFgPN1juD8YainJ-lH3HR5e-kVPCCk/c:4000:2250:fp:0.589:0.512/resize:fill-down:768:432/plain/local:///2024/06/9eb4fa9b-6881-65bd-c3e3-d8ca49a106e8/OMV_Energy_Green-Hydrogen_Wind-Turbine-Aerial-View-01_RGB_web.jpg@webp",
    ],
  },
}

export default function LoginPage() {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <LoginForm />
    </Suspense>
  )
}
