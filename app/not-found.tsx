import type { Metadata } from 'next';
import pageData from '@/data/pages/not-found.json';

export const metadata: Metadata = {
  title: pageData.title,
  description: pageData.description,
};

export default function NotFoundPage() {
  return (
    <div>
      <div dangerouslySetInnerHTML={{ __html: pageData.content }} />
    </div>
  );
}
