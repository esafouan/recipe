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
            <div>
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
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
