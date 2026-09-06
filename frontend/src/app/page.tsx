import { PublicRoute } from "@/components/auth/public-route"
import { LandingPage } from "@/components/common/landing-page"

export default function HomePage() {
  return (
    <PublicRoute>
      <LandingPage />
    </PublicRoute>
  )
}
