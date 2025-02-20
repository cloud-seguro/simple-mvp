import { Brain, Heart, Zap, Target, Smile, TrendingUp } from "lucide-react";

const features = [
  {
    id: "mental-fitness",
    icon: Brain,
    title: "Mental Fitness",
    description:
      "Train your mind to overcome negative thoughts and boost your mental resilience.",
  },
  {
    id: "emotional-intelligence",
    icon: Heart,
    title: "Emotional Intelligence",
    description:
      "Develop a deeper understanding of your emotions and learn to manage them effectively.",
  },
  {
    id: "peak-performance",
    icon: Zap,
    title: "Peak Performance",
    description:
      "Unlock your full potential and achieve your goals with a positive mindset.",
  },
  {
    id: "goal-setting",
    icon: Target,
    title: "Goal Setting",
    description:
      "Learn to set and achieve meaningful goals that align with your values and aspirations.",
  },
  {
    id: "stress-management",
    icon: Smile,
    title: "Stress Management",
    description:
      "Discover techniques to reduce stress and maintain a calm, focused state of mind.",
  },
  {
    id: "personal-growth",
    icon: TrendingUp,
    title: "Personal Growth",
    description:
      "Embark on a journey of continuous self-improvement and lifelong learning.",
  },
].map((feature, index) => ({
  ...feature,
  animationDelay: index * 100,
}));

export default function Features() {
  return (
    <section id="features" className="py-20 bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl md:text-4xl font-bold text-center text-foreground mb-12">
          Empower Your Mind
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature) => (
            <div
              key={feature.id}
              className="bg-card rounded-lg p-6 shadow-lg hover:shadow-xl transition-shadow duration-300 animate-in fade-in slide-in-from-bottom-4 duration-700"
              style={{ animationDelay: `${feature.animationDelay}ms` }}
            >
              <feature.icon className="h-12 w-12 text-primary mb-4" />
              <h3 className="text-xl font-semibold text-foreground mb-2">
                {feature.title}
              </h3>
              <p className="text-muted-foreground">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
