'use client';

import { useState } from 'react';
import { ChevronDown, ChevronUp, TrendingUp, Target, Eye, BookOpen, Search, Star, Lightbulb } from 'lucide-react';

interface SEOAnalysis {
  focusKeyword: string;
  keywordDensity: string;
  readabilityScore: string;
  contentLength: number;
  headingStructure: string[];
  metaTagsOptimization: {
    titleOptimization: string;
    descriptionOptimization: string;
    keywordOptimization: string;
  };
  competitiveAnalysis: {
    searchVolume: string;
    difficulty: string;
    opportunities: string[];
  };
  recommendations: string[];
}

interface AISeOAnalysisPanelProps {
  seoAnalysis: SEOAnalysis;
}

export default function AISeOAnalysisPanel({ seoAnalysis }: AISeOAnalysisPanelProps) {
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    overview: true,
    metaTags: false,
    competitive: false,
    recommendations: false,
  });

  const toggleSection = (section: string) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const getScoreColor = (text: string) => {
    if (text.toLowerCase().includes('excellent') || text.toLowerCase().includes('strong')) {
      return 'text-green-600 bg-green-50 border-green-200';
    }
    if (text.toLowerCase().includes('good') || text.toLowerCase().includes('medium')) {
      return 'text-yellow-600 bg-yellow-50 border-yellow-200';
    }
    if (text.toLowerCase().includes('poor') || text.toLowerCase().includes('low')) {
      return 'text-red-600 bg-red-50 border-red-200';
    }
    return 'text-blue-600 bg-blue-50 border-blue-200';
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty.toLowerCase()) {
      case 'low': return 'text-green-600 bg-green-100';
      case 'medium': return 'text-yellow-600 bg-yellow-100';
      case 'high': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="flex items-center gap-2 mb-6">
        <TrendingUp className="h-6 w-6 text-purple-600" />
        <h3 className="text-xl font-bold text-gray-900">AI SEO Analysis</h3>
        <span className="bg-purple-100 text-purple-800 text-xs font-medium px-2 py-1 rounded-full">
          AI Generated
        </span>
      </div>

      {/* Overview Section */}
      <div className="mb-6">
        <button
          onClick={() => toggleSection('overview')}
          className="flex items-center justify-between w-full p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
        >
          <div className="flex items-center gap-2">
            <Eye className="h-5 w-5 text-gray-600" />
            <span className="font-medium text-gray-900">SEO Overview</span>
          </div>
          {expandedSections.overview ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
        </button>
        
        {expandedSections.overview && (
          <div className="mt-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white border border-gray-200 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <Target className="h-4 w-4 text-blue-600" />
                <span className="text-sm font-medium text-gray-700">Focus Keyword</span>
              </div>
              <p className="text-lg font-semibold text-gray-900">{seoAnalysis.focusKeyword}</p>
            </div>
            
            <div className="bg-white border border-gray-200 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <Search className="h-4 w-4 text-green-600" />
                <span className="text-sm font-medium text-gray-700">Keyword Density</span>
              </div>
              <p className="text-lg font-semibold text-gray-900">{seoAnalysis.keywordDensity}</p>
            </div>
            
            <div className="bg-white border border-gray-200 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <BookOpen className="h-4 w-4 text-purple-600" />
                <span className="text-sm font-medium text-gray-700">Readability</span>
              </div>
              <p className="text-lg font-semibold text-gray-900">{seoAnalysis.readabilityScore}</p>
            </div>
            
            <div className="bg-white border border-gray-200 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <Star className="h-4 w-4 text-orange-600" />
                <span className="text-sm font-medium text-gray-700">Content Length</span>
              </div>
              <p className="text-lg font-semibold text-gray-900">{seoAnalysis.contentLength} words</p>
              <p className="text-xs text-gray-500 mt-1">
                {seoAnalysis.contentLength < 600 
                  ? "⚠️ Too short - aim for 600+ words" 
                  : seoAnalysis.contentLength > 2500 
                  ? "⚠️ Very long - consider splitting" 
                  : "✅ Good length for SEO"}
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Meta Tags Optimization */}
      <div className="mb-6">
        <button
          onClick={() => toggleSection('metaTags')}
          className="flex items-center justify-between w-full p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
        >
          <div className="flex items-center gap-2">
            <Search className="h-5 w-5 text-gray-600" />
            <span className="font-medium text-gray-900">Meta Tags Optimization</span>
          </div>
          {expandedSections.metaTags ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
        </button>
        
        {expandedSections.metaTags && (
          <div className="mt-4 space-y-3">
            <div className={`p-3 rounded-lg border ${getScoreColor(seoAnalysis.metaTagsOptimization.titleOptimization)}`}>
              <div className="font-medium mb-1">Title Optimization</div>
              <p className="text-sm">{seoAnalysis.metaTagsOptimization.titleOptimization}</p>
            </div>
            
            <div className={`p-3 rounded-lg border ${getScoreColor(seoAnalysis.metaTagsOptimization.descriptionOptimization)}`}>
              <div className="font-medium mb-1">Description Optimization</div>
              <p className="text-sm">{seoAnalysis.metaTagsOptimization.descriptionOptimization}</p>
            </div>
            
            <div className={`p-3 rounded-lg border ${getScoreColor(seoAnalysis.metaTagsOptimization.keywordOptimization)}`}>
              <div className="font-medium mb-1">Keyword Optimization</div>
              <p className="text-sm">{seoAnalysis.metaTagsOptimization.keywordOptimization}</p>
            </div>
          </div>
        )}
      </div>

      {/* Competitive Analysis */}
      <div className="mb-6">
        <button
          onClick={() => toggleSection('competitive')}
          className="flex items-center justify-between w-full p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
        >
          <div className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-gray-600" />
            <span className="font-medium text-gray-900">Competitive Analysis</span>
          </div>
          {expandedSections.competitive ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
        </button>
        
        {expandedSections.competitive && (
          <div className="mt-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div className="bg-white border border-gray-200 rounded-lg p-4">
                <div className="font-medium text-gray-700 mb-2">Search Volume</div>
                <p className="text-lg font-semibold text-gray-900">{seoAnalysis.competitiveAnalysis.searchVolume}</p>
              </div>
              
              <div className="bg-white border border-gray-200 rounded-lg p-4">
                <div className="font-medium text-gray-700 mb-2">Competition Difficulty</div>
                <span className={`inline-flex px-3 py-1 rounded-full text-sm font-medium ${getDifficultyColor(seoAnalysis.competitiveAnalysis.difficulty)}`}>
                  {seoAnalysis.competitiveAnalysis.difficulty}
                </span>
              </div>
            </div>
            
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="font-medium text-blue-800 mb-2">Opportunities</div>
              <ul className="space-y-1">
                {seoAnalysis.competitiveAnalysis.opportunities.map((opportunity, index) => (
                  <li key={index} className="text-sm text-blue-700 flex items-start gap-2">
                    <Star className="h-3 w-3 mt-1 flex-shrink-0" />
                    {opportunity}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </div>

      {/* Recommendations */}
      <div className="mb-6">
        <button
          onClick={() => toggleSection('recommendations')}
          className="flex items-center justify-between w-full p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
        >
          <div className="flex items-center gap-2">
            <Lightbulb className="h-5 w-5 text-gray-600" />
            <span className="font-medium text-gray-900">AI Recommendations</span>
            <span className="bg-green-100 text-green-800 text-xs font-medium px-2 py-1 rounded-full">
              {seoAnalysis.recommendations.length} tips
            </span>
          </div>
          {expandedSections.recommendations ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
        </button>
        
        {expandedSections.recommendations && (
          <div className="mt-4">
            <div className="space-y-3">
              {seoAnalysis.recommendations.map((recommendation, index) => (
                <div key={index} className="bg-green-50 border border-green-200 rounded-lg p-3">
                  <div className="flex items-start gap-2">
                    <Lightbulb className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                    <p className="text-sm text-green-800">{recommendation}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Heading Structure */}
      {seoAnalysis.headingStructure && seoAnalysis.headingStructure.length > 0 && (
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
          <div className="font-medium text-gray-700 mb-2">Suggested Heading Structure</div>
          <div className="space-y-1">
            {seoAnalysis.headingStructure.map((heading, index) => (
              <div key={index} className="text-sm text-gray-600 font-mono bg-white px-2 py-1 rounded">
                {heading}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
