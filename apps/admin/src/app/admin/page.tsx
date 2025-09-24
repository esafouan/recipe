import { Metadata } from 'next';
import AdminDashboard from '@/components/admin/AdminDashboard';

export const metadata: Metadata = {
  title: 'Admin Dashboard | Recipes Blog',
  description: 'Manage your recipe blog content',
  robots: 'noindex, nofollow',
};

export default function AdminPage() {
  return <AdminDashboard />;
}
