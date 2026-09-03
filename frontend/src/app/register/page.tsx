import { Metadata } from "next"
import Link from "next/link"
import { Kanban } from "lucide-react"

import { RegisterForm } from "@/components/auth/register-form"

export const metadata: Metadata = {
  title: "Register - Mini Kanban Board",
  description: "Create a new Mini Kanban Board account",
}

export default function RegisterPage() {
  return (
    <div className="container relative min-h-screen flex-col items-center justify-center grid lg:max-w-none lg:px-0">
      <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[400px]">
        <div className="flex flex-col items-center space-y-2 text-center">
          <Link
            href="/"
            className="flex items-center gap-2 font-bold text-xl tracking-tight transition-transform hover:scale-105"
          >
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-primary-foreground shadow-md">
              <Kanban className="h-5 w-5" />
            </div>
            <span>Mini Kanban</span>
          </Link>
        </div>
        <RegisterForm />
      </div>
    </div>
  )
}
