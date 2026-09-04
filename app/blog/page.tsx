import type { Metadata } from 'next';
import pageData from '@/data/pages/blog.json';

export const metadata: Metadata = {
  title: pageData.title,
  description: pageData.description,
};

export default function BlogPage() {
  return (
    <div>
      <div dangerouslySetInnerHTML={{ __html: pageData.content }} />
    </div>
  );
}
