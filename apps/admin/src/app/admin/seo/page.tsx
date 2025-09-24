import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'SEO Analysis | Admin Dashboard',
  description: 'SEO analysis and recommendations',
  robots: 'noindex, nofollow',
};

export default function SEOPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">SEO Analysis</h1>
      </div>
      
      <div className="bg-white shadow rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">SEO Overview</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <h4 className="font-medium text-green-900">SEO Score</h4>
              <p className="text-2xl font-bold text-green-600 mt-1">85%</p>
              <p className="text-sm text-green-700 mt-1">Good optimization</p>
            </div>
            
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h4 className="font-medium text-blue-900">Indexed Pages</h4>
              <p className="text-2xl font-bold text-blue-600 mt-1">12</p>
              <p className="text-sm text-blue-700 mt-1">Pages searchable</p>
            </div>
            
            <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
              <h4 className="font-medium text-orange-900">Issues Found</h4>
              <p className="text-2xl font-bold text-orange-600 mt-1">3</p>
              <p className="text-sm text-orange-700 mt-1">Need attention</p>
            </div>
          </div>
          
          <div className="space-y-4">
            <h4 className="font-medium text-gray-900">SEO Features</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center space-x-3">
                <div className="h-2 w-2 bg-green-500 rounded-full"></div>
                <span className="text-sm">Structured Data (Schema.org)</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="h-2 w-2 bg-green-500 rounded-full"></div>
                <span className="text-sm">Meta Tags Optimization</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="h-2 w-2 bg-green-500 rounded-full"></div>
                <span className="text-sm">Open Graph Tags</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="h-2 w-2 bg-green-500 rounded-full"></div>
                <span className="text-sm">Image Optimization</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="h-2 w-2 bg-green-500 rounded-full"></div>
                <span className="text-sm">Real-time SEO Analysis</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="h-2 w-2 bg-green-500 rounded-full"></div>
                <span className="text-sm">Recipe Schema Markup</span>
              </div>
            </div>
          </div>
          
          <div className="mt-6 bg-gray-50 border border-gray-200 rounded-lg p-4">
            <h4 className="font-medium text-gray-900 mb-2">How SEO Works</h4>
            <p className="text-sm text-gray-700">
              SEO analysis is built into the post editor. When creating or editing recipes, 
              the system automatically analyzes your content and provides real-time recommendations 
              for improving search engine optimization.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
