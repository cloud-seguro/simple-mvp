import { CheckCircle } from "lucide-react";

export default function About() {
  return (
    <section id="about" className="py-20 bg-secondary">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-8">
            About POSITIVE-Next
          </h2>
          <p className="text-lg text-muted-foreground mb-12">
            POSITIVE-Next is a revolutionary app designed to help you harness
            the power of your mind. Our mission is to empower individuals to
            overcome mental saboteurs and achieve their full potential.
          </p>
        </div>
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <h3 className="text-2xl font-semibold text-foreground mb-4">
              Why Choose POSITIVE-Next?
            </h3>
            {[
              { id: "science", text: "Science-based approach" },
              { id: "personal", text: "Personalized experience" },
              { id: "progress", text: "Track your progress" },
              { id: "expert", text: "Expert guidance" },
            ].map((item) => (
              <div
                key={item.id}
                className="flex items-center space-x-3 animate-in fade-in slide-in-from-left-4 duration-700"
                style={{ animationDelay: `${item.id.length * 100}ms` }}
              >
                <CheckCircle className="h-6 w-6 text-primary" />
                <span className="text-foreground">{item.text}</span>
              </div>
            ))}
          </div>
          <div className="bg-primary/10 rounded-lg p-8 animate-in fade-in slide-in-from-right-4 duration-700">
            <h3 className="text-2xl font-semibold text-foreground mb-4">
              Our Vision
            </h3>
            <p className="text-muted-foreground">
              We envision a world where everyone has the tools and knowledge to
              cultivate a positive, resilient mindset. Through POSITIVE-Next,
              we&apos;re making mental fitness accessible and engaging for all.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
