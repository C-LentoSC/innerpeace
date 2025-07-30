"use client";

import { Button } from "@/components/Button";
import {
  Heart,
  Star,
  Download,
  Plus,
  Trash2,
  ArrowRight,
  ArrowLeft,
  Mail,
  Settings,
} from "lucide-react";
import Link from "next/link";

export default function ButtonDemo() {
  return (
    <div className="min-h-screen bg-background text-foreground p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-12">
          <div className="flex items-center gap-4 mb-6">
            <Link
              href="/"
              className="text-warm-gold hover:text-accent transition-colors flex items-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Home
            </Link>
          </div>
          <h1 className="text-4xl font-bold text-warm-gold mb-4">
            Button Component Demo
          </h1>
          <p className="text-lg text-foreground/80 leading-relaxed">
            Comprehensive showcase of the InnerPeace button component with all
            variants, sizes, and states.
          </p>
        </div>

        {/* Variants Section */}
        <section className="mb-16">
          <h2 className="text-2xl font-semibold text-sage-green mb-8">
            Button Variants
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-foreground/90">
                Default (Primary)
              </h3>
              <Button>Default Button</Button>
              <Button leftIcon={<Heart className="w-4 h-4" />}>
                With Left Icon
              </Button>
              <Button rightIcon={<ArrowRight className="w-4 h-4" />}>
                With Right Icon
              </Button>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-medium text-foreground/90">
                Secondary
              </h3>
              <Button variant="secondary">Secondary Button</Button>
              <Button
                variant="secondary"
                leftIcon={<Star className="w-4 h-4" />}
              >
                With Icon
              </Button>
              <Button variant="secondary" loading>
                Loading State
              </Button>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-medium text-foreground/90">Accent</h3>
              <Button variant="accent">Accent Button</Button>
              <Button
                variant="accent"
                rightIcon={<Download className="w-4 h-4" />}
              >
                Download
              </Button>
              <Button variant="accent" disabled>
                Disabled
              </Button>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-medium text-foreground/90">
                Destructive
              </h3>
              <Button variant="destructive">Delete</Button>
              <Button
                variant="destructive"
                leftIcon={<Trash2 className="w-4 h-4" />}
              >
                Delete Item
              </Button>
              <Button variant="destructive" loading>
                Deleting...
              </Button>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-medium text-foreground/90">
                Outline
              </h3>
              <Button variant="outline">Outline Button</Button>
              <Button variant="outline" leftIcon={<Plus className="w-4 h-4" />}>
                Add New
              </Button>
              <Button variant="outline" disabled>
                Disabled
              </Button>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-medium text-foreground/90">
                Ghost & Link
              </h3>
              <Button variant="ghost">Ghost Button</Button>
              <Button variant="link">Link Button</Button>
              <Button variant="muted">Muted Button</Button>
            </div>
          </div>
        </section>

        {/* Sizes Section */}
        <section className="mb-16">
          <h2 className="text-2xl font-semibold text-sage-green mb-8">
            Button Sizes
          </h2>
          <div className="space-y-6">
            <div className="flex flex-wrap items-center gap-4">
              <Button size="xs">Extra Small</Button>
              <Button size="sm">Small</Button>
              <Button size="default">Default</Button>
              <Button size="lg">Large</Button>
              <Button size="xl">Extra Large</Button>
            </div>

            <div className="flex flex-wrap items-center gap-4">
              <Button size="icon-sm" variant="outline">
                <Settings className="w-4 h-4" />
              </Button>
              <Button size="icon" variant="secondary">
                <Mail className="w-4 h-4" />
              </Button>
              <Button size="icon-lg" variant="accent">
                <Heart className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </section>

        {/* Full Width Section */}
        <section className="mb-16">
          <h2 className="text-2xl font-semibold text-sage-green mb-8">
            Full Width Buttons
          </h2>
          <div className="max-w-md space-y-4">
            <Button fullWidth>Full Width Default</Button>
            <Button
              fullWidth
              variant="secondary"
              leftIcon={<Star className="w-4 h-4" />}
            >
              Full Width with Icon
            </Button>
            <Button fullWidth variant="outline" loading>
              Loading Full Width
            </Button>
          </div>
        </section>

        {/* States Section */}
        <section className="mb-16">
          <h2 className="text-2xl font-semibold text-sage-green mb-8">
            Button States
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-foreground/90">
                Normal States
              </h3>
              <Button>Normal Button</Button>
              <Button variant="secondary">Hover Me</Button>
              <Button variant="accent">Click Me</Button>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-medium text-foreground/90">
                Loading States
              </h3>
              <Button loading>Loading...</Button>
              <Button variant="secondary" loading>
                Processing
              </Button>
              <Button
                variant="outline"
                loading
                leftIcon={<Download className="w-4 h-4" />}
              >
                Downloading
              </Button>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-medium text-foreground/90">
                Disabled States
              </h3>
              <Button disabled>Disabled Default</Button>
              <Button variant="secondary" disabled>
                Disabled Secondary
              </Button>
              <Button variant="destructive" disabled>
                Disabled Destructive
              </Button>
            </div>
          </div>
        </section>

        {/* Interactive Demo */}
        <section className="mb-16">
          <h2 className="text-2xl font-semibold text-sage-green mb-8">
            Interactive Demo
          </h2>
          <div className="bg-card p-8 rounded-lg border border-border">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-lg font-medium text-foreground/90 mb-4">
                  Form Actions
                </h3>
                <div className="space-y-4">
                  <Button fullWidth leftIcon={<Mail className="w-4 h-4" />}>
                    Send Message
                  </Button>
                  <Button fullWidth variant="secondary">
                    Save Draft
                  </Button>
                  <div className="flex gap-2">
                    <Button variant="outline" className="flex-1">
                      Cancel
                    </Button>
                    <Button variant="destructive" className="flex-1">
                      Delete
                    </Button>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-medium text-foreground/90 mb-4">
                  Navigation
                </h3>
                <div className="space-y-4">
                  <Button
                    fullWidth
                    rightIcon={<ArrowRight className="w-4 h-4" />}
                  >
                    Continue
                  </Button>
                  <Button
                    fullWidth
                    variant="outline"
                    leftIcon={<ArrowLeft className="w-4 h-4" />}
                  >
                    Go Back
                  </Button>
                  <Button fullWidth variant="link">
                    Skip for now
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Usage Examples */}
        <section className="mb-16">
          <h2 className="text-2xl font-semibold text-sage-green mb-8">
            Usage Examples
          </h2>
          <div className="bg-card p-6 rounded-lg border border-border">
            <pre className="text-sm text-foreground/80 overflow-x-auto">
              {`// Basic usage
<Button>Click me</Button>

// With variants and sizes
<Button variant="secondary" size="lg">Large Secondary</Button>

// With icons
<Button leftIcon={<Heart />} rightIcon={<ArrowRight />}>
  Love this
</Button>

// Loading state
<Button loading>Processing...</Button>

// Disabled state
<Button disabled>Not available</Button>

// Full width
<Button fullWidth>Full width button</Button>`}
            </pre>
          </div>
        </section>
      </div>
    </div>
  );
}
