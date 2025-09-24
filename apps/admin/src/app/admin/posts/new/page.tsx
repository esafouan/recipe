import { Metadata } from 'next';
import PostEditor from '@/components/admin/PostEditor';

export const metadata: Metadata = {
  title: 'Create New Post | Admin Dashboard',
  description: 'Create a new blog post or recipe',
  robots: 'noindex, nofollow',
};

export default function NewPostPage() {
  return <PostEditor />;
}
