import { Metadata } from 'next';
import PostsList from '@/components/admin/PostsList';

export const metadata: Metadata = {
  title: 'Posts Management | Admin Dashboard',
  description: 'Manage your blog posts and recipes',
  robots: 'noindex, nofollow',
};

export default function PostsPage() {
  return <PostsList />;
}
