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
