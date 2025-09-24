'use client';

import { User } from 'firebase/auth';
import { AuthService } from '@/lib/firebase/auth';
import { useRouter } from 'next/navigation';
import { Bell, Search, LogOut, User as UserIcon } from 'lucide-react';
import { useState } from 'react';
import toast from 'react-hot-toast';
import Image from 'next/image';

interface AdminHeaderProps {
  user: User;
  userRole: string | null;
}

export default function AdminHeader({ user, userRole }: AdminHeaderProps) {
  const router = useRouter();
  const [showUserMenu, setShowUserMenu] = useState(false);

  const handleLogout = async () => {
    try {
      await AuthService.signOut();
      toast.success('Logged out successfully');
      router.push('/admin/login');
    } catch (error) {
      console.error('Logout error:', error);
      toast.error('Error logging out');
    }
  };

  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="flex items-center justify-between px-6 py-4">
        <div className="flex items-center space-x-4">
          <h1 className="text-xl font-semibold text-gray-900">
            Admin Dashboard
          </h1>
          <span className="px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full">
            {userRole?.toUpperCase()}
          </span>
        </div>

        <div className="flex items-center space-x-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <input
              type="text"
              placeholder="Search posts..."
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
          </div>

          {/* Notifications */}
          <button className="relative p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100">
            <Bell className="h-5 w-5" />
            <span className="absolute top-1 right-1 h-2 w-2 bg-red-500 rounded-full"></span>
          </button>

          {/* User Menu */}
          <div className="relative">
            <button
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="flex items-center space-x-2 p-2 text-gray-700 hover:text-gray-900 rounded-lg hover:bg-gray-100"
            >
              <div className="h-8 w-8 bg-green-600 rounded-full flex items-center justify-center">
                {user.photoURL ? (
                <Image
                    src={user.photoURL}
                    alt={user.displayName || 'User'}
                    width={32}
                    height={32}
                    className="h-8 w-8 rounded-full"
                  />
                ) : (
                  <UserIcon className="h-4 w-4 text-white" />
                )}
              </div>
              <span className="text-sm font-medium">
                {user.displayName || user.email}
              </span>
            </button>

            {showUserMenu && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10 border">
                <div className="px-4 py-2 text-sm text-gray-700 border-b">
                  <p className="font-medium">{user.displayName || 'User'}</p>
                  <p className="text-gray-500">{user.email}</p>
                </div>
                <button
                  onClick={() => router.push('/admin/profile')}
                  className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  Profile Settings
                </button>
                <button
                  onClick={handleLogout}
                  className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  <LogOut className="inline h-4 w-4 mr-2" />
                  Sign Out
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
