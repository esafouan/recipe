'use client';

import { useState, useEffect } from 'react';
import { Search, CheckCircle, AlertCircle, Info } from 'lucide-react';

interface SEOPanelProps {
  title?: string;
  description?: string;
  seoTitle?: string;
  seoDescription?: string;
  seoKeywords?: string[];
  score: number | null;
  recommendations: string[];
  onSeoTitleChange: (value: string) => void;
  onSeoDescriptionChange: (value: string) => void;
  onSeoKeywordsChange: (value: string[]) => void;
}

export default function SEOPanel({
  title = '',
  description = '',
  seoTitle = '',
  seoDescription = '',
  seoKeywords = [],
  score,
  recommendations,
  onSeoTitleChange,
  onSeoDescriptionChange,
  onSeoKeywordsChange,
}: SEOPanelProps) {
  const [keywordInput, setKeywordInput] = useState('');
  const [localSeoTitle, setLocalSeoTitle] = useState(seoTitle);
  const [localSeoDescription, setLocalSeoDescription] = useState(seoDescription);

  useEffect(() => {
    setLocalSeoTitle(seoTitle);
  }, [seoTitle]);

  useEffect(() => {
    setLocalSeoDescription(seoDescription);
  }, [seoDescription]);

  const displayTitle = localSeoTitle || title;
  const displayDescription = localSeoDescription || description;

  const addKeyword = () => {
    if (keywordInput.trim() && !seoKeywords.includes(keywordInput.trim().toLowerCase())) {
      onSeoKeywordsChange([...seoKeywords, keywordInput.trim().toLowerCase()]);
      setKeywordInput('');
    }
  };

  const removeKeyword = (keyword: string) => {
    onSeoKeywordsChange(seoKeywords.filter(k => k !== keyword));
  };

  const handleKeywordInputKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addKeyword();
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600 bg-green-100';
    if (score >= 60) return 'text-yellow-600 bg-yellow-100';
    return 'text-red-600 bg-red-100';
  };

  const getScoreIcon = (score: number) => {
    if (score >= 80) return CheckCircle;
    return AlertCircle;
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
      <div className="flex items-center gap-2 mb-4">
        <Search className="h-5 w-5 text-blue-600" />
        <h2 className="text-lg font-semibold text-gray-900">SEO Optimization</h2>
      </div>

      {/* SEO Score */}
      {score !== null && (
        <div className="mb-6">
          <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium ${getScoreColor(score)}`}>
            {(() => {
              const Icon = getScoreIcon(score);
              return <Icon className="h-4 w-4" />;
            })()}
            SEO Score: {score}/100
          </div>
          
          {recommendations.length > 0 && (
            <div className="mt-3 p-3 bg-blue-50 rounded-lg">
              <h4 className="text-sm font-medium text-blue-900 mb-2">Recommendations:</h4>
              <ul className="text-sm text-blue-800 space-y-1">
                {recommendations.slice(0, 3).map((rec, index) => (
                  <li key={index} className="flex items-start gap-1">
                    <span className="text-blue-600">•</span>
                    {rec}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}

      {/* SEO Preview */}
      <div className="mb-6">
        <h3 className="text-sm font-medium text-gray-700 mb-2">Search Preview</h3>
        <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
          <div className="text-blue-600 text-lg hover:underline cursor-pointer">
            {displayTitle || 'Your Recipe Title Here'}
          </div>
          <div className="text-green-700 text-sm mt-1">
            example.com/recipes/{title?.toLowerCase().replace(/\s+/g, '-') || 'recipe-slug'}
          </div>
          <div className="text-gray-600 text-sm mt-1 line-clamp-2">
            {displayDescription || 'Your recipe description will appear here...'}
          </div>
        </div>
      </div>

      {/* SEO Fields */}
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            SEO Title
            <span className="text-gray-400 ml-1">
              ({localSeoTitle.length}/60)
            </span>
          </label>
          <input
            type="text"
            value={localSeoTitle}
            onChange={(e) => {
              setLocalSeoTitle(e.target.value);
              onSeoTitleChange(e.target.value);
            }}
            placeholder={title || 'Enter SEO title...'}
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
              localSeoTitle.length > 60 ? 'border-red-300' : 'border-gray-300'
            }`}
          />
          <p className="text-xs text-gray-500 mt-1">
            {localSeoTitle.length > 60 ? (
              <span className="text-red-500">Title too long (over 60 chars)</span>
            ) : (
              'Recommended: 50-60 characters'
            )}
          </p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            SEO Description
            <span className="text-gray-400 ml-1">
              ({localSeoDescription.length}/160)
            </span>
          </label>
          <textarea
            value={localSeoDescription}
            onChange={(e) => {
              setLocalSeoDescription(e.target.value);
              onSeoDescriptionChange(e.target.value);
            }}
            placeholder={description || 'Enter SEO description...'}
            rows={3}
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
              localSeoDescription.length > 160 ? 'border-red-300' : 'border-gray-300'
            }`}
          />
          <p className="text-xs text-gray-500 mt-1">
            {localSeoDescription.length > 160 ? (
              <span className="text-red-500">Description too long (over 160 chars)</span>
            ) : (
              'Recommended: 150-160 characters'
            )}
          </p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            SEO Keywords
          </label>
          <div className="flex gap-2 mb-2">
            <input
              type="text"
              value={keywordInput}
              onChange={(e) => setKeywordInput(e.target.value)}
              onKeyPress={handleKeywordInputKeyPress}
              placeholder="Add keyword and press Enter"
              className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <button
              type="button"
              onClick={addKeyword}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              Add
            </button>
          </div>
          
          {seoKeywords.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {seoKeywords.map((keyword, index) => (
                <span
                  key={index}
                  className="inline-flex items-center gap-1 px-2 py-1 bg-blue-100 text-blue-800 text-sm rounded-full"
                >
                  {keyword}
                  <button
                    type="button"
                    onClick={() => removeKeyword(keyword)}
                    className="hover:text-blue-900"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* SEO Tips */}
      <div className="mt-6 p-4 bg-gray-50 rounded-lg">
        <div className="flex items-center gap-2 mb-2">
          <Info className="h-4 w-4 text-gray-600" />
          <h4 className="text-sm font-medium text-gray-900">SEO Tips</h4>
        </div>
        <ul className="text-xs text-gray-600 space-y-1">
          <li>• Include your main keyword in the title and description</li>
          <li>• Keep titles under 60 characters for better display</li>
          <li>• Write compelling descriptions that encourage clicks</li>
          <li>• Use 3-5 relevant keywords maximum</li>
        </ul>
      </div>
    </div>
  );
}
