'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import {
  Home,
  FileText,
  Search
} from 'lucide-react';

const navigation = [
  { name: 'Dashboard', href: '/admin', icon: Home },
  { name: 'Posts', href: '/admin/posts', icon: FileText },
  { name: 'SEO Analysis', href: '/admin/seo', icon: Search },
];

export default function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 bg-white shadow-sm border-r border-gray-200 min-h-screen">
      <nav className="mt-5 px-2">
        <ul className="space-y-1">
          {navigation.map((item) => {
            const isActive = pathname === item.href;
            return (
              <li key={item.name}>
                <Link
                  href={item.href}
                  className={`
                    group flex items-center px-2 py-2 text-sm font-medium rounded-md
                    ${isActive
                      ? 'bg-green-100 text-green-900'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                    }
                  `}
                >
                  <item.icon
                    className={`
                      mr-3 h-5 w-5 flex-shrink-0
                      ${isActive ? 'text-green-500' : 'text-gray-400 group-hover:text-gray-500'}
                    `}
                  />
                  {item.name}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Quick Actions */}
      <div className="mt-8 px-2">
        <h3 className="px-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">
          Quick Actions
        </h3>
        <div className="mt-2 space-y-1">
          <Link
            href="/admin/posts/new"
            className="group flex items-center px-2 py-2 text-sm font-medium text-white bg-green-600 rounded-md hover:bg-green-700"
          >
            <FileText className="mr-3 h-5 w-5 flex-shrink-0" />
            New Post
          </Link>
        </div>
      </div>

      {/* Site Link */}
      <div className="absolute bottom-4 left-2 right-2">
        <Link
          href="/"
          target="_blank"
          className="group flex items-center px-2 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50 hover:text-gray-900 rounded-md"
        >
          <Home className="mr-3 h-5 w-5 flex-shrink-0 text-gray-400 group-hover:text-gray-500" />
          View Site
        </Link>
      </div>
    </aside>
  );
}
