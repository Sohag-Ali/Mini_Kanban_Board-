import { ThemeToggle } from "@/components/common/theme-toggle"

export default function SettingsPage() {
  return (
    <div className="container mx-auto max-w-2xl px-4 py-8 sm:px-6">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold tracking-tight">Settings</h1>
        <p className="mt-1 text-sm text-muted-foreground">Manage your application preferences.</p>
      </div>
      <section className="flex items-center justify-between rounded-xl border bg-card p-5 shadow-sm">
        <div>
          <h2 className="font-medium">Appearance</h2>
          <p className="mt-1 text-sm text-muted-foreground">Switch between light and dark mode.</p>
        </div>
        <ThemeToggle />
      </section>
    </div>
  )
}
