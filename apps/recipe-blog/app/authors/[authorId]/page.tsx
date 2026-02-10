import { Metadata } from "next";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { getAllAuthors, getAuthorById } from "@/lib/authors";
import { getAllRecipes } from "@/lib/api";
import { Card, CardContent } from "@/components/ui/card";

interface AuthorPageProps {
  params: Promise<{
    authorId: string;
  }>;
}

// Generate static paths for all authors
export async function generateStaticParams() {
  const authors = getAllAuthors();
  return authors.map((author) => ({
    authorId: author.id,
  }));
}

// Generate metadata for SEO
export async function generateMetadata({ params }: AuthorPageProps): Promise<Metadata> {
  const { authorId } = await params;
  const author = getAuthorById(authorId);

  if (!author) {
    return {
      title: "Author Not Found",
    };
  }

  return {
    title: `${author.name} - ${author.role} | Cozy Bites Kitchen`,
    description: author.longBio,
    openGraph: {
      title: `${author.name} - ${author.role}`,
      description: author.longBio,
      images: [author.image],
    },
  };
}

export default async function AuthorPage({ params }: AuthorPageProps) {
  const { authorId } = await params;
  const author = getAuthorById(authorId);

  if (!author) {
    notFound();
  }

  // Fetch all recipes and filter by author
  // Note: In production, you'd want to query WordPress by author
  // For now, we'll show a placeholder
  const allRecipes: any[] = [];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Author Header */}
      <div className="bg-gradient-to-br from-primary/10 to-white py-16">
        <div className="max-w-4xl mx-auto px-6">
          <div className="flex flex-col md:flex-row items-center gap-8">
            {/* Author Image */}
            <div className="relative w-40 h-40 rounded-full overflow-hidden border-4 border-white shadow-xl shrink-0">
              <Image
                src={author.image}
                alt={author.name}
                width={160}
                height={160}
                className="object-cover"
              />
            </div>

            {/* Author Info */}
            <div className="flex-1 text-center md:text-left">
              <h1 className="text-4xl font-serif font-bold text-gray-900 mb-2">
                {author.name}
              </h1>
              <p className="text-xl text-primary font-medium mb-4">
                {author.role}
              </p>
              <p className="text-gray-700 leading-relaxed mb-6">
                {author.longBio}
              </p>

              {/* Specialties */}
              <div className="flex flex-wrap gap-2 justify-center md:justify-start">
                {author.specialties.map((specialty) => (
                  <span
                    key={specialty}
                    className="px-4 py-2 bg-white text-primary text-sm font-medium rounded-full shadow-sm"
                  >
                    {specialty}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Quote */}
          <div className="mt-12 bg-white p-8 rounded-lg border-l-4 border-primary shadow-md">
            <p className="text-lg italic text-gray-700 mb-3">
              "{author.signature}"
            </p>
            <p className="text-sm text-gray-600">
              — {author.favoriteQuote}
            </p>
          </div>

          {/* Social Links */}
          <div className="mt-8 flex gap-4 justify-center md:justify-start">
            <a
              href={author.social.pinterest}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 bg-red-600 hover:bg-red-700 text-white font-medium rounded-lg transition-colors"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 5.079 3.158 9.417 7.618 11.174-.105-.949-.199-2.405.042-3.441.219-.937 1.407-5.965 1.407-5.965s-.359-.719-.359-1.782c0-1.668.967-2.914 2.171-2.914 1.023 0 1.518.769 1.518 1.69 0 1.029-.655 2.568-.994 3.995-.283 1.194.599 2.169 1.777 2.169 2.133 0 3.772-2.249 3.772-5.495 0-2.873-2.064-4.882-5.012-4.882-3.414 0-5.418 2.561-5.418 5.207 0 1.031.397 2.138.893 2.738a.36.36 0 01.083.345l-.333 1.36c-.053.22-.174.267-.402.161-1.499-.698-2.436-2.888-2.436-4.649 0-3.785 2.75-7.262 7.929-7.262 4.163 0 7.398 2.967 7.398 6.931 0 4.136-2.607 7.464-6.227 7.464-1.216 0-2.357-.631-2.75-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24.009 12.017 24c6.624 0 11.99-5.367 11.99-11.013C24.007 5.367 18.641.001 12.017.001z"/>
              </svg>
              Follow on Pinterest
            </a>
            <a
              href={`https://instagram.com/${author.social.instagram.replace('@', '')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-medium rounded-lg transition-colors"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
              </svg>
              {author.social.instagram}
            </a>
          </div>
        </div>
      </div>

      {/* Recipes Section */}
      <div className="max-w-6xl mx-auto px-6 py-16">
        <h2 className="text-3xl font-serif font-bold text-gray-900 mb-8">
          Recipes by {author.name}
        </h2>

        {allRecipes.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {allRecipes.map((recipe) => (
              <Card key={recipe.slug} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-0">
                  <Link href={`/recipes/${recipe.slug}`}>
                    <div className="relative h-48 w-full">
                      <Image
                        src={recipe.image}
                        alt={recipe.title}
                        fill
                        className="object-cover rounded-t-lg"
                      />
                    </div>
                    <div className="p-4">
                      <h3 className="font-semibold text-gray-900 mb-2">
                        {recipe.title}
                      </h3>
                      <p className="text-sm text-gray-600 line-clamp-2">
                        {recipe.description}
                      </p>
                    </div>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-600 mb-4">
              {author.name}'s recipes are coming soon!
            </p>
            <Link
              href="/recipes"
              className="inline-block px-6 py-3 bg-primary hover:bg-primary/90 text-white font-medium rounded-lg transition-colors"
            >
              Browse All Recipes
            </Link>
          </div>
        )}
      </div>

      {/* Recipe Approach Section */}
      <div className="bg-white py-16">
        <div className="max-w-4xl mx-auto px-6">
          <h2 className="text-3xl font-serif font-bold text-gray-900 mb-6">
            {author.name}'s Recipe Approach
          </h2>
          <p className="text-lg text-gray-700 leading-relaxed">
            {author.recipeApproach}
          </p>
        </div>
      </div>
    </div>
  );
}
