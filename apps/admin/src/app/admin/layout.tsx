'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { User } from 'firebase/auth';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '@/lib/firebase/config';
import { getUserRole } from '@/lib/firebase/auth';
import { Toaster } from 'react-hot-toast';
import AdminSidebar from '@/components/admin/AdminSidebar';
import AdminHeader from '@/components/admin/AdminHeader';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [userRole, setUserRole] = useState<string | null>(null);

  // Routes that don't require authentication
  const publicAdminRoutes = ['/admin/login', '/admin/setup'];
  const isPublicRoute = publicAdminRoutes.includes(pathname);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        try {
          const role = await getUserRole(user.uid);
          if (role === 'admin' || role === 'editor') {
            setUser(user);
            setUserRole(role);
          } else {
            // User exists but no proper role, redirect to login
            if (!isPublicRoute) {
              router.push('/admin/login');
            }
          }
        } catch (error) {
          console.error('Error checking user role:', error);
          if (!isPublicRoute) {
            router.push('/admin/login');
          }
        }
      } else {
        // No user, redirect to login unless already on a public route
        if (!isPublicRoute) {
          router.push('/admin/login');
        }
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [router, isPublicRoute]);

  // Show loading spinner
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-orange-600"></div>
      </div>
    );
  }

  // For public routes (login, setup), show without admin layout
  if (isPublicRoute) {
    return (
      <>
        {children}
        <Toaster position="top-right" />
      </>
    );
  }

  // For protected routes, require authentication
  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <AdminHeader user={user} userRole={userRole} />
      <div className="flex">
        <AdminSidebar />
        <main className="flex-1 p-6">
          {children}
        </main>
      </div>
      <Toaster position="top-right" />
    </div>
  );
}
