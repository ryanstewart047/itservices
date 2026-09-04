import type { Metadata } from 'next';
import pageData from '@/data/pages/posts-by-author.json';

export const metadata: Metadata = {
  title: pageData.title,
  description: pageData.description,
};

export default function PostsByAuthorPage() {
  return (
    <div>
      <div dangerouslySetInnerHTML={{ __html: pageData.content }} />
    </div>
  );
}
