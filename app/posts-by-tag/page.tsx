import type { Metadata } from 'next';
import pageData from '@/data/pages/posts-by-tag.json';

export const metadata: Metadata = {
  title: pageData.title,
  description: pageData.description,
};

export default function PostsByTagPage() {
  return (
    <div>
      <div dangerouslySetInnerHTML={{ __html: pageData.content }} />
    </div>
  );
}
