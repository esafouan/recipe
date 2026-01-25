"use client";

import { useState } from "react";
import { CheckCircle } from "lucide-react";

export function NewsletterSignup() {
  const [email, setEmail] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    
    setIsLoading(true);
    
    // Simulate submission (replace with actual newsletter API)
    setTimeout(() => {
      setIsSubmitted(true);
      setIsLoading(false);
    }, 800);
  };

  return (
    <section className="py-12 md:py-16 bg-gray-100">
      <div className="container mx-auto px-4 md:px-6 max-w-2xl text-center">
        {!isSubmitted ? (
          <>
            {/* Heading */}
            <h2 className="text-xl md:text-2xl lg:text-3xl font-serif font-bold text-gray-900 mb-3">
              Get Fresh Recipes Delivered
            </h2>
            <p className="text-gray-600 mb-6">
              Join our community for weekly recipes and cooking tips.
            </p>

            {/* Form */}
            <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto mb-4">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className="flex-1 px-4 py-3 rounded-full text-gray-800 placeholder-gray-500 bg-white border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary shadow-sm"
                required
              />
              <button
                type="submit"
                disabled={isLoading}
                className="px-6 py-3 bg-primary text-white rounded-full font-semibold hover:bg-primary/90 transition-colors duration-200 shadow-sm disabled:opacity-70"
              >
                {isLoading ? "..." : "Subscribe"}
              </button>
            </form>

            {/* Trust */}
            <p className="text-gray-500 text-sm">
              Free forever. No spam. Unsubscribe anytime.
            </p>
          </>
        ) : (
          /* Success State */
          <div className="py-4">
            <div className="inline-flex items-center justify-center w-14 h-14 bg-green-100 rounded-full mb-4">
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
            
            <h3 className="text-xl md:text-2xl font-serif font-bold text-gray-900 mb-2">
              You're Subscribed!
            </h3>
            
            <p className="text-gray-600">
              Thanks for joining! You'll receive our next recipe update soon.
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
