import Image from "next/image";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import type { Author } from "@/lib/authors";

interface AuthorBioCardProps {
  author: Author;
  variant?: 'full' | 'compact';
}

export function AuthorBioCard({ author, variant = 'full' }: AuthorBioCardProps) {
  if (variant === 'compact') {
    return (
      <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg">
        <div className="relative w-16 h-16 rounded-full overflow-hidden shrink-0">
          <Image
            src={author.image}
            alt={author.name}
            width={64}
            height={64}
            className="w-full h-full object-cover"
          />
        </div>
        <div className="flex-1">
          <h4 className="font-semibold text-gray-900">{author.name}</h4>
          <p className="text-sm text-gray-600 mb-1">{author.role}</p>
          <p className="text-sm text-gray-700 line-clamp-2">{author.bio}</p>
        </div>
      </div>
    );
  }

  return (
    <Card className="bg-gradient-to-br from-gray-50 to-white border-2 border-gray-200">
      <CardContent className="p-6">
        <div className="flex items-start gap-6">
          {/* Author Image */}
          <div className="relative w-24 h-24 rounded-full overflow-hidden border-4 border-white shadow-lg shrink-0">
            <Image
              src={author.image}
              alt={author.name}
              width={96}
              height={96}
              className="w-full h-full object-cover"
            />
          </div>

          {/* Author Info */}
          <div className="flex-1">
            <h3 className="text-2xl font-serif font-bold text-gray-900 mb-1">
              {author.name}
            </h3>
            <p className="text-sm text-primary font-medium mb-3">
              {author.role}
            </p>
            
            <p className="text-gray-700 leading-relaxed mb-4">
              {author.longBio}
            </p>

            {/* Signature Quote */}
            <div className="bg-white p-4 rounded-lg border-l-4 border-primary mb-4">
              <p className="text-sm italic text-gray-700">
                "{author.signature}"
              </p>
            </div>

            {/* Specialties */}
            <div className="mb-4">
              <p className="text-sm font-semibold text-gray-900 mb-2">Specialties:</p>
              <div className="flex flex-wrap gap-2">
                {author.specialties.map((specialty) => (
                  <span
                    key={specialty}
                    className="px-3 py-1 bg-primary/10 text-primary text-xs font-medium rounded-full"
                  >
                    {specialty}
                  </span>
                ))}
              </div>
            </div>

            {/* Social Links */}
            <div className="flex gap-3">
              <a
                href={author.social.pinterest}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-sm font-medium rounded-lg transition-colors"
                aria-label={`Follow ${author.name} on Pinterest`}
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 5.079 3.158 9.417 7.618 11.174-.105-.949-.199-2.405.042-3.441.219-.937 1.407-5.965 1.407-5.965s-.359-.719-.359-1.782c0-1.668.967-2.914 2.171-2.914 1.023 0 1.518.769 1.518 1.69 0 1.029-.655 2.568-.994 3.995-.283 1.194.599 2.169 1.777 2.169 2.133 0 3.772-2.249 3.772-5.495 0-2.873-2.064-4.882-5.012-4.882-3.414 0-5.418 2.561-5.418 5.207 0 1.031.397 2.138.893 2.738a.36.36 0 01.083.345l-.333 1.36c-.053.22-.174.267-.402.161-1.499-.698-2.436-2.888-2.436-4.649 0-3.785 2.75-7.262 7.929-7.262 4.163 0 7.398 2.967 7.398 6.931 0 4.136-2.607 7.464-6.227 7.464-1.216 0-2.357-.631-2.75-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24.009 12.017 24c6.624 0 11.99-5.367 11.99-11.013C24.007 5.367 18.641.001 12.017.001z"/>
                </svg>
                Follow on Pinterest
              </a>
              
              <span className="inline-flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 text-sm font-medium rounded-lg">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                </svg>
                {author.social.instagram}
              </span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
