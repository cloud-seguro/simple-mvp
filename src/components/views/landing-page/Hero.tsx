import Link from "next/link"
import { ArrowRight, Sparkles } from "lucide-react"

export default function Hero() {
  return (
    <section className="py-20 md:py-32 bg-gradient-to-b from-background to-secondary">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto text-center">
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-foreground mb-6 leading-tight">
              Your mind is your best friend—
              <br />
              But it can also be your worst enemy.
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground mb-8">
              Learn to harness the power of your mind with POSITIVE-Next.
            </p>
            <Link
              href="/sign-up"
              className="inline-flex items-center bg-primary text-primary-foreground px-8 py-3 rounded-md text-lg font-medium hover:bg-primary/90 transition-colors animate-pulse"
            >
              Get Started
              <ArrowRight className="ml-2" size={20} />
            </Link>
          </div>
          <div className="mt-12 animate-in fade-in slide-in-from-bottom-4 duration-1000 delay-300">
            <Sparkles className="h-16 w-16 text-primary mx-auto" />
          </div>
        </div>
      </div>
    </section>
  )
}

