import type { Metadata } from 'next';
import pageData from '@/data/pages/posts-by-category.json';

export const metadata: Metadata = {
  title: pageData.title,
  description: pageData.description,
};

export default function PostsByCategoryPage() {
  return (
    <div>
      <div dangerouslySetInnerHTML={{ __html: pageData.content }} />
    </div>
  );
}
