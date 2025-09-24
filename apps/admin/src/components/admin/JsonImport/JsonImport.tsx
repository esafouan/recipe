'use client';

import { useState, useRef } from 'react';
import { Upload, FileText, AlertCircle } from 'lucide-react';
import toast from 'react-hot-toast';

interface RecipeJsonData {
  title: string;
  description: string;
  content?: string;
  category: string;
  tags: string[];
  prepTime: number;
  cookTime: number;
  totalTime?: number;
  servings: number;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  ingredients: string[];
  instructions: string[];
  notes?: string;
  seoTitle?: string;
  seoDescription?: string;
  seoKeywords?: string[];
}

interface JsonImportProps {
  onImport: (data: RecipeJsonData) => void;
  className?: string;
}

export default function JsonImport({ onImport, className = '' }: JsonImportProps) {
  const [dragActive, setDragActive] = useState(false);
  const [isValidating, setIsValidating] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const validateJsonData = (data: unknown): data is RecipeJsonData => {
    if (typeof data !== 'object' || data === null) {
      throw new Error('JSON must be an object');
    }

    const obj = data as Record<string, unknown>;
    const required = ['title', 'description', 'category', 'tags', 'prepTime', 'cookTime', 'servings', 'difficulty', 'ingredients', 'instructions'];
    
    for (const field of required) {
      if (!(field in obj)) {
        throw new Error(`Missing required field: ${field}`);
      }
    }

    if (!Array.isArray(obj.tags) || obj.tags.length === 0) {
      throw new Error('Tags must be a non-empty array');
    }

    if (!Array.isArray(obj.ingredients) || obj.ingredients.length === 0) {
      throw new Error('Ingredients must be a non-empty array');
    }

    if (!Array.isArray(obj.instructions) || obj.instructions.length === 0) {
      throw new Error('Instructions must be a non-empty array');
    }

    if (!['Easy', 'Medium', 'Hard'].includes(obj.difficulty as string)) {
      throw new Error('Difficulty must be Easy, Medium, or Hard');
    }

    if (typeof obj.prepTime !== 'number' || obj.prepTime <= 0) {
      throw new Error('Prep time must be a positive number');
    }

    if (typeof obj.cookTime !== 'number' || obj.cookTime < 0) {
      throw new Error('Cook time must be a non-negative number');
    }

    if (typeof obj.servings !== 'number' || obj.servings <= 0) {
      throw new Error('Servings must be a positive number');
    }

    return true;
  };

  const processJsonFile = async (file: File) => {
    setIsValidating(true);
    
    try {
      const text = await file.text();
      const jsonData = JSON.parse(text);
      
      if (validateJsonData(jsonData)) {
        // Calculate total time if not provided
        if (!jsonData.totalTime) {
          jsonData.totalTime = jsonData.prepTime + jsonData.cookTime;
        }
        
        onImport(jsonData);
        toast.success('Recipe data imported successfully!');
      }
    } catch (error) {
      console.error('JSON import error:', error);
      if (error instanceof SyntaxError) {
        toast.error('Invalid JSON format');
      } else {
        toast.error(error instanceof Error ? error.message : 'Import failed');
      }
    } finally {
      setIsValidating(false);
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    const file = e.dataTransfer.files?.[0];
    if (file && file.type === 'application/json') {
      processJsonFile(file);
    } else {
      toast.error('Please drop a valid JSON file');
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      processJsonFile(file);
    }
  };

  const openFileDialog = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className={`${className}`}>
      <div
        className={`relative border-2 border-dashed rounded-lg p-6 text-center transition-all duration-200 ${
          dragActive
            ? 'border-orange-500 bg-orange-50'
            : 'border-gray-300 hover:border-gray-400'
        } ${isValidating ? 'opacity-50 pointer-events-none' : ''}`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept=".json"
          onChange={handleFileInput}
          className="hidden"
        />
        
        {isValidating ? (
          <div className="flex items-center justify-center space-x-2">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-orange-500"></div>
            <span className="text-sm text-gray-600">Validating JSON...</span>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex justify-center">
              <FileText className="h-12 w-12 text-gray-400" />
            </div>
            
            <div>
              <p className="text-sm font-medium text-gray-900">
                Import Recipe from JSON
              </p>
              <p className="text-xs text-gray-500 mt-1">
                Drag & drop a JSON file here, or click to browse
              </p>
            </div>
            
            <button
              type="button"
              onClick={openFileDialog}
              className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500"
            >
              <Upload className="h-4 w-4 mr-2" />
              Choose JSON File
            </button>
          </div>
        )}
      </div>
      
      <div className="mt-4 p-3 bg-blue-50 rounded-lg">
        <div className="flex items-start space-x-2">
          <AlertCircle className="h-4 w-4 text-blue-500 mt-0.5" />
          <div className="text-xs text-blue-700">
            <p className="font-medium mb-1">JSON Format Requirements:</p>
            <div className="space-y-1 text-blue-600">
              <p>• <strong>Required:</strong> title, description, category, tags, prepTime, cookTime, servings, difficulty, ingredients, instructions</p>
              <p>• <strong>Optional:</strong> content, notes, totalTime, seoTitle, seoDescription, seoKeywords</p>
              <p>• <strong>Difficulty:</strong> Must be &ldquo;Easy&rdquo;, &ldquo;Medium&rdquo;, or &ldquo;Hard&rdquo;</p>
              <p>• <strong>Arrays:</strong> tags, ingredients, instructions must be arrays</p>
              <p>Download the template below for a properly formatted example.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
