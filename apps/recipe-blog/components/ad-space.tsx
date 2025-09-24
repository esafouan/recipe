import { Card } from "@/components/ui/card"

interface AdSpaceProps {
  slot: "header" | "sidebar" | "content" | "footer"
  size?: "small" | "medium" | "large" | "responsive"
  className?: string
}

export function AdSpace({ slot, size = "responsive", className = "" }: AdSpaceProps) {
  const getAdDimensions = () => {
    switch (size) {
      case "small":
        return "w-full h-24 md:h-32"
      case "medium":
        return "w-full h-32 md:h-48"
      case "large":
        return "w-full h-48 md:h-64"
      case "responsive":
        return "w-full min-h-24 md:min-h-32"
      default:
        return "w-full h-32"
    }
  }

  const getAdLabel = () => {
    switch (slot) {
      case "header":
        return "Recipe Inspiration"
      case "sidebar":
        return "Kitchen Essentials"
      case "content":
        return "Cooking Tools"
      case "footer":
        return "Food & Lifestyle"
      default:
        return "Advertisement"
    }
  }

  return (
    <div className={`ad-space ad-space-${slot} ${className}`}>
      <Card className={`${getAdDimensions()} flex items-center justify-center bg-muted/30 border-dashed border-2 border-muted-foreground/20`}>
        <div className="text-center space-y-2">
          <div className="text-xs text-muted-foreground/60 uppercase tracking-wide font-medium">
            {getAdLabel()}
          </div>
          <div className="text-xs text-muted-foreground/40">
            Advertisement Space
          </div>
        </div>
      </Card>
    </div>
  )
}

// Helper component for specific ad placements
export function HeaderAd() {
  return <AdSpace slot="header" size="medium" className="mb-6" />
}

export function SidebarAd() {
  return <AdSpace slot="sidebar" size="small" className="mb-4" />
}

export function ContentAd() {
  return <AdSpace slot="content" size="responsive" className="my-8" />
}

export function FooterAd() {
  return <AdSpace slot="footer" size="large" className="mt-8" />
}
