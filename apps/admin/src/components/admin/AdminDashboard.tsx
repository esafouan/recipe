'use client';

import { useState, useEffect } from 'react';
import { FileText, Eye } from 'lucide-react';
import { RecipeService } from '@/lib/firebase/recipes';
import Link from 'next/link';

interface DashboardStats {
  totalPosts: number;
  publishedPosts: number;
  draftPosts: number;
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats>({
    totalPosts: 0,
    publishedPosts: 0,
    draftPosts: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      // Get all recipes (published, drafts, etc.)
      const allRecipes = await RecipeService.getAllRecipes();
      const publishedRecipes = allRecipes.filter(recipe => recipe.status === 'published');
      const draftRecipes = allRecipes.filter(recipe => recipe.status === 'draft');
      
      setStats({
        totalPosts: allRecipes.length,
        publishedPosts: publishedRecipes.length,
        draftPosts: draftRecipes.length,
      });
    } catch (error) {
      console.error('Error loading stats:', error);
      // Fallback to basic stats
      try {
        const publishedRecipes = await RecipeService.getPublishedRecipes();
        setStats({
          totalPosts: publishedRecipes.length,
          publishedPosts: publishedRecipes.length,
          draftPosts: 0,
        });
      } catch (fallbackError) {
        console.error('Fallback stats loading failed:', fallbackError);
        setStats({
          totalPosts: 0,
          publishedPosts: 0,
          draftPosts: 0,
        });
      }
    } finally {
      setLoading(false);
    }
  };

  const statCards = [
    {
      name: 'Total Posts',
      value: stats.totalPosts,
      icon: FileText,
      color: 'blue',
      href: '/admin/posts',
    },
    {
      name: 'Published',
      value: stats.publishedPosts,
      icon: Eye,
      color: 'green',
      href: '/admin/posts?status=published',
    },
    {
      name: 'Drafts',
      value: stats.draftPosts,
      icon: FileText,
      color: 'yellow',
      href: '/admin/posts?status=draft',
    },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <div className="flex space-x-3">
          <Link
            href="/admin/posts/new"
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-orange-600 hover:bg-orange-700"
          >
            <FileText className="h-4 w-4 mr-2" />
            New Recipe
          </Link>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {statCards.map((stat) => {
          const getColorClasses = (color: string) => {
            switch (color) {
              case 'blue':
                return 'text-blue-600';
              case 'green':
                return 'text-green-600';
              case 'yellow':
                return 'text-yellow-600';
              case 'purple':
                return 'text-purple-600';
              default:
                return 'text-gray-600';
            }
          };

          return (
            <Link key={stat.name} href={stat.href}>
              <div className="bg-white overflow-hidden shadow rounded-lg hover:shadow-md transition-shadow">
                <div className="p-5">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <stat.icon className={`h-6 w-6 ${getColorClasses(stat.color)}`} />
                    </div>
                    <div className="ml-5 w-0 flex-1">
                      <dl>
                        <dt className="text-sm font-medium text-gray-500 truncate">
                          {stat.name}
                        </dt>
                        <dd className="text-lg font-medium text-gray-900">
                          {stat.value}
                        </dd>
                      </dl>
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          );
        })}
      </div>

      {/* Recent Activity */}
      <div className="bg-white shadow rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
            Recent Activity
          </h3>
          <div className="text-sm text-gray-500">
            No recent activity to show.
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white shadow rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
            Quick Actions
          </h3>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Link
              href="/admin/posts/new"
              className="relative group bg-white border border-gray-300 rounded-lg px-6 py-5 cursor-pointer hover:border-gray-400 focus:border-orange-500 focus:ring-1 focus:ring-orange-500"
            >
              <div>
                <span className="rounded-lg inline-flex p-3 bg-orange-50 text-orange-700 group-hover:bg-orange-100">
                  <FileText className="h-6 w-6" />
                </span>
              </div>
              <div className="mt-8">
                <h3 className="text-lg font-medium">
                  <span className="absolute inset-0" aria-hidden="true" />
                  Create New Recipe
                </h3>
                <p className="mt-2 text-sm text-gray-500">
                  Start writing a new recipe with SEO optimization
                </p>
              </div>
            </Link>

            <Link
              href="/admin/seo"
              className="relative group bg-white border border-gray-300 rounded-lg px-6 py-5 cursor-pointer hover:border-gray-400 focus:border-green-500 focus:ring-1 focus:ring-green-500"
            >
              <div>
                <span className="rounded-lg inline-flex p-3 bg-blue-50 text-blue-700 group-hover:bg-blue-100">
                  <Eye className="h-6 w-6" />
                </span>
              </div>
              <div className="mt-8">
                <h3 className="text-lg font-medium">
                  <span className="absolute inset-0" aria-hidden="true" />
                  SEO Analysis
                </h3>
                <p className="mt-2 text-sm text-gray-500">
                  Analyze and optimize your content for search engines
                </p>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
