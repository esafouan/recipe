import React from 'react';

interface AdSpaceProps {
  slot: string;
  format?: 'auto' | 'rectangle' | 'vertical' | 'horizontal';
  className?: string;
  responsive?: boolean;
}

export default function AdSpace({ 
  slot, 
  format = 'auto', 
  className = '', 
  responsive = true 
}: AdSpaceProps) {
  // In development, show a placeholder
  const isDevelopment = process.env.NODE_ENV === 'development';

  if (isDevelopment) {
    return (
      <div className={`bg-gray-100 border-2 border-dashed border-gray-300 p-4 text-center text-gray-500 ${className}`}>
        <div className="text-sm font-medium">AdSense Placeholder</div>
        <div className="text-xs">Slot: {slot}</div>
        <div className="text-xs">Format: {format}</div>
        {responsive && <div className="text-xs">Responsive</div>}
      </div>
    );
  }

  // In production, render the actual AdSense ad
  return (
    <div className={className}>
      <ins 
        className="adsbygoogle"
        style={{ display: 'block' }}
        data-ad-client="ca-pub-XXXXXXXXXXXXXXXXX" // Replace with your AdSense publisher ID
        data-ad-slot={slot}
        data-ad-format={responsive ? 'auto' : format}
        data-full-width-responsive={responsive ? 'true' : 'false'}
      />
    </div>
  );
}
