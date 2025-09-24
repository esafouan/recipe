import { Metadata } from 'next';
import PostEditor from '@/components/admin/PostEditor';

export const metadata: Metadata = {
  title: 'Edit Post | Admin Dashboard',
  description: 'Edit blog post or recipe',
  robots: 'noindex, nofollow',
};

interface PageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function EditPostPage({ params }: PageProps) {
  const { id } = await params;
  return <PostEditor postId={id} />;
}
