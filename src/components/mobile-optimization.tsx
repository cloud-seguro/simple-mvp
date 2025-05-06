"use client";

import { useState } from "react";
import { AlertTriangle, CheckCircle, Smartphone } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const mobileGuidelines = [
  {
    title: "Responsive Layout",
    description: "Use flexible layouts with proper viewport meta tags",
    tips: [
      "Set viewport meta tag with width=device-width, initial-scale=1",
      "Use relative units (%, rem, em) instead of fixed pixel sizes",
      "Test on multiple device sizes",
    ],
    implementation:
      "Add className='w-full max-w-full sm:max-w-[size]' for responsive width",
  },
  {
    title: "Touch Targets",
    description: "Make touch targets large enough for comfortable tapping",
    tips: [
      "Minimum 44×44px for interactive elements",
      "Provide adequate spacing between interactive elements",
      "Use the mobile-touch-target utility class",
    ],
    implementation:
      "Add className='min-h-[44px] min-w-[44px]' or use .mobile-touch-target",
  },
  {
    title: "Typography",
    description: "Ensure text is legible on small screens",
    tips: [
      "Minimum 16px font size for body text",
      "Increase line height for better readability",
      "Use system fonts for performance",
    ],
    implementation: "Add className='text-base sm:text-lg' or use .mobile-font",
  },
  {
    title: "Form Elements",
    description: "Optimize forms for mobile input",
    tips: [
      "Use full-width inputs on mobile",
      "Set minimum height of 44px for inputs",
      "Stack form elements vertically on mobile",
      "Use native input types (email, tel, etc.)",
    ],
    implementation: "Use className='form-row' for responsive form layouts",
  },
  {
    title: "Navigation",
    description: "Simplify navigation for mobile users",
    tips: [
      "Implement collapsible menus",
      "Use bottom navigation for critical actions",
      "Reduce number of navigation items on mobile",
    ],
    implementation: "Use a burger menu pattern with a drawer/sidebar component",
  },
];

interface MobileOptimizationProps {
  className?: string;
}

export function MobileOptimization({ className }: MobileOptimizationProps) {
  const [showDetails, setShowDetails] = useState(false);

  return (
    <Card className={cn("w-full", className)}>
      <CardHeader>
        <div className="flex items-center gap-2">
          <Smartphone className="h-5 w-5 text-primary" />
          <CardTitle>Mobile Optimization Guide</CardTitle>
        </div>
        <CardDescription>
          Best practices for creating mobile-responsive interfaces
        </CardDescription>
      </CardHeader>
      <CardContent>
        {showDetails ? (
          <Accordion type="single" collapsible className="w-full">
            {mobileGuidelines.map((guideline, index) => (
              <AccordionItem key={index} value={`item-${index}`}>
                <AccordionTrigger className="text-left">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0" />
                    <span>{guideline.title}</span>
                  </div>
                </AccordionTrigger>
                <AccordionContent>
                  <div className="pl-6 space-y-2">
                    <p className="text-sm">{guideline.description}</p>
                    <div className="mt-2">
                      <p className="text-xs font-medium text-muted-foreground mb-1">
                        Tips:
                      </p>
                      <ul className="list-disc pl-5 text-xs space-y-1">
                        {guideline.tips.map((tip, idx) => (
                          <li key={idx}>{tip}</li>
                        ))}
                      </ul>
                    </div>
                    <div className="mt-2">
                      <p className="text-xs font-medium text-muted-foreground mb-1">
                        Implementation:
                      </p>
                      <code className="text-xs bg-muted p-1 rounded">
                        {guideline.implementation}
                      </code>
                    </div>
                  </div>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        ) : (
          <div className="flex items-center gap-3 p-3 bg-amber-50 border border-amber-200 rounded-md">
            <AlertTriangle className="h-5 w-5 text-amber-500 flex-shrink-0" />
            <p className="text-sm text-amber-800">
              Mobile optimization improves user experience on small screens.
              Click below to see guidelines.
            </p>
          </div>
        )}
      </CardContent>
      <CardFooter>
        <Button
          variant="outline"
          onClick={() => setShowDetails(!showDetails)}
          className="w-full"
        >
          {showDetails ? "Hide Guidelines" : "Show Mobile Guidelines"}
        </Button>
      </CardFooter>
    </Card>
  );
}
