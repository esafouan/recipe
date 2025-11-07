interface SectionHeaderProps {
  title: string;
  className?: string;
}

export function SectionHeader({ title, className = "" }: SectionHeaderProps) {
  return (
    <div className={`flex items-center justify-center mb-4 ${className}`}>
      <div className="flex-1 h-0.5 bg-primary max-w-32 md:max-w-48"></div>
      <h2 className="text-xl md:text-2xl lg:text-3xl font-serif font-bold text-foreground px-6 md:px-8">
        {title}
      </h2>
      <div className="flex-1 h-0.5 bg-primary max-w-32 md:max-w-48"></div>
    </div>
  );
}
