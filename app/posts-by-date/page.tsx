import type { Metadata } from 'next';
import pageData from '@/data/pages/posts-by-date.json';

export const metadata: Metadata = {
  title: pageData.title,
  description: pageData.description,
};

export default function PostsByDatePage() {
  return (
    <div>
      <div dangerouslySetInnerHTML={{ __html: pageData.content }} />
    </div>
  );
}
