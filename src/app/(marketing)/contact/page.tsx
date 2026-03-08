"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Mail, MapPin } from "lucide-react";

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitted(true);
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold text-gray-900">Contact Us</h1>
      <p className="mt-2 text-gray-600">
        Have questions? We&apos;d love to hear from you.
      </p>

      <div className="mt-12 grid gap-12 lg:grid-cols-2">
        <div>
          {submitted ? (
            <div className="rounded-lg bg-accent-light p-6 text-center">
              <h3 className="text-lg font-semibold text-accent-dark">
                Message Sent!
              </h3>
              <p className="mt-2 text-sm text-accent">
                We&apos;ll get back to you within 24 hours.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <Input id="name" label="Name" placeholder="Your name" required />
              <Input
                id="email"
                type="email"
                label="Email"
                placeholder="you@example.com"
                required
              />
              <Textarea
                id="message"
                label="Message"
                placeholder="How can we help?"
                rows={5}
                required
              />
              <Button type="submit" className="w-full">
                Send Message
              </Button>
            </form>
          )}
        </div>

        <div className="space-y-6">
          <div className="flex items-start gap-3">
            <Mail className="mt-1 h-5 w-5 text-primary" />
            <div>
              <h3 className="font-medium text-gray-900">Email</h3>
              <p className="mt-1 text-sm text-gray-500">
                info@madeinuzbekistan.com
              </p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <MapPin className="mt-1 h-5 w-5 text-primary" />
            <div>
              <h3 className="font-medium text-gray-900">Location</h3>
              <p className="mt-1 text-sm text-gray-500">
                Tashkent, Uzbekistan
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
