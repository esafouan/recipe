import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { getAllAuthors } from "@/lib/authors";
import { Card, CardContent } from "@/components/ui/card";

export const metadata: Metadata = {
  title: "Our Authors - Cozy Bites Kitchen",
  description: "Meet the talented team of recipe creators behind Cozy Bites Kitchen. Each brings their unique expertise and passion for cooking.",
  openGraph: {
    title: "Our Authors - Cozy Bites Kitchen",
    description: "Meet the talented team of recipe creators behind Cozy Bites Kitchen.",
  },
};

export default function AuthorsPage() {
  const authors = getAllAuthors();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-primary/10 to-white py-16">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-12">
            <h1 className="text-5xl font-serif font-bold text-gray-900 mb-4">
              Meet Our Authors
            </h1>
            <p className="text-xl text-gray-700 max-w-3xl mx-auto leading-relaxed">
              Behind every recipe is a passionate cook with a unique story. Our diverse team 
              brings expertise in everything from quick weeknight meals to traditional comfort 
              food, international cuisine, and healthy eating.
            </p>
          </div>
        </div>
      </div>

      {/* Authors Grid */}
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {authors.map((author) => (
            <Link
              key={author.id}
              href={`/authors/${author.id}`}
              className="group"
            >
              <Card className="h-full transition-all duration-300 hover:shadow-xl hover:-translate-y-1 border-2 hover:border-primary">
                <CardContent className="p-6">
                  {/* Author Image */}
                  <div className="relative w-32 h-32 mx-auto mb-6 rounded-full overflow-hidden border-4 border-white shadow-lg group-hover:scale-110 transition-transform duration-300">
                    <Image
                      src={author.image}
                      alt={author.name}
                      width={128}
                      height={128}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  {/* Author Info */}
                  <div className="text-center">
                    <h2 className="text-2xl font-serif font-bold text-gray-900 mb-2 group-hover:text-primary transition-colors">
                      {author.name}
                    </h2>
                    <p className="text-sm text-primary font-medium mb-3">
                      {author.role}
                    </p>
                    <p className="text-gray-700 text-sm leading-relaxed mb-4 line-clamp-3">
                      {author.bio}
                    </p>

                    {/* Specialties */}
                    <div className="flex flex-wrap gap-2 justify-center mb-4">
                      {author.specialties.slice(0, 3).map((specialty) => (
                        <span
                          key={specialty}
                          className="px-3 py-1 bg-primary/10 text-primary text-xs font-medium rounded-full"
                        >
                          {specialty}
                        </span>
                      ))}
                    </div>

                    {/* View Profile Link */}
                    <div className="flex items-center justify-center gap-2 text-primary font-medium text-sm group-hover:gap-3 transition-all">
                      <span>View Profile</span>
                      <svg
                        className="w-4 h-4 group-hover:translate-x-1 transition-transform"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 5l7 7-7 7"
                        />
                      </svg>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-white py-16">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-3xl font-serif font-bold text-gray-900 mb-4">
            Explore Recipes by Author
          </h2>
          <p className="text-lg text-gray-700 mb-8">
            Each author brings their unique perspective and expertise. Browse their 
            recipes to find the perfect dish for any occasion.
          </p>
          <Link
            href="/recipes"
            className="inline-block px-8 py-4 bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all duration-200"
          >
            Browse All Recipes
          </Link>
        </div>
      </div>

      {/* Why Multiple Authors Section */}
      <div className="bg-gray-50 py-16">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="text-3xl font-serif font-bold text-gray-900 mb-8 text-center">
            Why We Have Multiple Authors
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg
                  className="w-8 h-8 text-primary"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Diverse Perspectives
              </h3>
              <p className="text-gray-600 text-sm">
                Each author brings unique experiences, cultural backgrounds, and cooking styles.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg
                  className="w-8 h-8 text-primary"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Expert Knowledge
              </h3>
              <p className="text-gray-600 text-sm">
                From family meals to healthy eating, each author specializes in their craft.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg
                  className="w-8 h-8 text-primary"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Personal Connection
              </h3>
              <p className="text-gray-600 text-sm">
                Real stories, tested recipes, and authentic tips from real home cooks.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
