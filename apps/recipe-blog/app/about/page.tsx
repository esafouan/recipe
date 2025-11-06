import type { Metadata } from "next";
import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import Link from "next/link";

export const metadata: Metadata = {
  title:
    "About Chef Isabella Martinez | Mini Recipe Creator | Culinary Journey",
  description:
    "Meet Chef Isabella Martinez, CIA graduate and creator of Mini Recipe. Learn her inspiring journey from single mom to celebrated chef, developing perfectly portioned recipes that eliminate food waste and bring joy to home cooking.",
  keywords: [
    "chef isabella martinez",
    "mini recipe creator",
    "culinary institute america graduate",
    "single mom chef",
    "austin chef",
    "small portion recipes",
    "professional chef",
    "food waste reduction chef",
    "sustainable cooking expert",
    "chef biography",
    "recipe developer",
    "culinary journey",
  ],
  openGraph: {
    title: "Meet Chef Isabella Martinez - Creator of Mini Recipe",
    description:
      "From CIA graduate to single mom chef, discover Isabella's inspiring journey creating perfectly portioned recipes that eliminate waste and bring joy to home cooking.",
    type: "article",
    images: [
      {
        url: "/beautiful-food-photography-colorful-ingredients-co.jpg",
        width: 1200,
        height: 630,
        alt: "Mini Recipe - Small batch cooking for busy women",
      },
    ],
  },
};

export default function AboutPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative py-12 md:py-16 lg:py-20 bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50">
          <div className="container mx-auto px-4 md:px-6 max-w-6xl">
            <div className="text-center space-y-6 md:space-y-8">
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-serif font-bold text-gray-900 leading-tight max-w-4xl mx-auto">
                Meet Chef Isabella
                <br />
                <span className="text-primary">
                  The Heart Behind Mini Recipe
                </span>
              </h1>

              <div className="max-w-3xl mx-auto space-y-6">
                <p className="text-lg md:text-xl text-gray-700 leading-relaxed">
                  From **Culinary Institute graduate** to **passionate mom**,
                  discover the inspiring journey of creating **perfectly
                  portioned recipes** that eliminate waste and bring joy to
                  every kitchen.
                </p>

                {/* Call to action */}
                <div className="pt-4">
                  <a
                    href="#story"
                    className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-6 py-3 rounded-full font-medium hover:bg-primary/90 transition-colors duration-200 shadow-md hover:shadow-lg"
                  >
                    Read My Story
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 14l-7 7m0 0l-7-7m7 7V3"
                      />
                    </svg>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* About Me Section */}
        <section id="story" className="py-16 md:py-20 lg:py-24 bg-gray-50">
          <div className="container mx-auto px-4 md:px-6 max-w-7xl">
            {/* Main Content Grid */}
            <div className="grid lg:grid-cols-3 gap-8 lg:gap-12">
              {/* Left Content - Story */}
              <div className="lg:col-span-2 space-y-8">
                {/* Large featured image */}
                <div className="relative rounded-2xl overflow-hidden shadow-lg mb-8 w-full max-w-2xl mx-auto">
                  <Image
                    src="/chef.png"
                    alt="Chef Isabella Martinez cooking in her kitchen"
                    width={800}
                    height={450}
                    className="aspect-video w-full h-auto object-cover"
                    priority
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent"></div>
                </div>

                {/* Story Content */}
                <div className="prose prose-lg max-w-none">
                  <p className="text-lg text-gray-700 leading-relaxed mb-6">
                    Hi there! I'm Isabella, the chef, passionate foodie, and
                    flavor enthusiast behind Mini Recipe. My love affair with
                    cooking began as a young mom, standing beside my mother in
                    the kitchen, fascinated by the way she turned fresh, simple
                    ingredients into unforgettable meals that brought our family
                    together. Those moments planted the seed for what has grown
                    into my greatest passion: creating food that's not just
                    delicious but a celebration of life.
                  </p>

                  <p className="text-lg text-gray-700 leading-relaxed mb-6">
                    After graduating from the Culinary Institute of America in
                    2018, I worked in high-end restaurants where I learned
                    precision and technique. But it wasn't until I became a mom
                    that I truly understood the challenge of home cooking -
                    especially cooking for smaller households without waste.
                  </p>

                  <p className="text-lg text-gray-700 leading-relaxed">
                    Every Mini Recipe reflects my belief that great food doesn't
                    require waste. Whether you're cooking for yourself, your
                    partner, or introducing your kids to new flavors, these
                    perfectly portioned recipes ensure every ingredient has
                    purpose and every meal brings joy.
                  </p>
                </div>
              </div>

              {/* Right Sidebar - Chef Profile Card */}
              <div className="lg:col-span-1">
                <div className="sticky top-8">
                  {/* Chef Profile Card */}
                  <Card className="bg-white shadow-lg border-2 border-primary/20 mb-8">
                    <CardContent className="p-6 text-center">
                      {/* Profile Image */}
                      <div className="relative w-24 h-24 mx-auto mb-4">
                        <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-primary shadow-lg">
                          <Image
                            src="/chef.png"
                            alt="Chef Isabella Martinez"
                            width={96}
                            height={96}
                            className="w-full h-full object-cover"
                            unoptimized={process.env.NODE_ENV === "development"}
                          />
                        </div>
                      </div>

                      {/* Name and Title */}
                      <h3 className="text-xl font-serif font-bold text-gray-900 mb-1">
                        Hi I'm Isabella
                      </h3>

                      {/* Description */}
                      <p className="text-sm text-gray-600 mb-6 leading-relaxed">
                        I'm an passionate chef with a culinary mind behind Mini
                        Recipe. My passion for cooking was born in the heart of
                        my mother's kitchen, where the aroma of fresh herbs, the
                        warmth of family recipes, and the joy of sharing meals
                        inspired my journey. Here, I bring you recipes crafted
                        with love, flavor, and a touch of culinary tradition.
                      </p>

                      {/* Social/Contact Button */}
                      <div className="flex justify-center mb-4">
                        <Link
                          href="https://www.pinterest.com/minirecipe_/#"
                          className="text-muted-foreground hover:text-primary transition-colors"
                        >
                          <svg
                            className="h-5 w-5"
                            fill="currentColor"
                            viewBox="0 0 24 24"
                            aria-hidden="true"
                          >
                            <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 5.079 3.158 9.417 7.618 11.174-.105-.949-.199-2.405.042-3.441.219-.937 1.407-5.965 1.407-5.965s-.359-.719-.359-1.782c0-1.668.967-2.914 2.171-2.914 1.023 0 1.518.769 1.518 1.69 0 1.029-.655 2.568-.994 3.995-.283 1.194.599 2.169 1.777 2.169 2.133 0 3.772-2.249 3.772-5.495 0-2.873-2.064-4.882-5.012-4.882-3.414 0-5.418 2.561-5.418 5.207 0 1.031.397 2.138.893 2.738a.36.36 0 01.083.345l-.333 1.36c-.053.22-.174.267-.402.161-1.499-.698-2.436-2.888-2.436-4.649 0-3.785 2.75-7.262 7.929-7.262 4.163 0 7.398 2.967 7.398 6.931 0 4.136-2.607 7.464-6.227 7.464-1.216 0-2.357-.631-2.75-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24.009 12.017 24c6.624 0 11.99-5.367 11.99-11.013C24.007 5.367 18.641.001 12.017.001z" />
                          </svg>
                        </Link>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
