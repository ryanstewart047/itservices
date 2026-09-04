import type { Metadata } from 'next';
import pageData from '@/data/pages/home.json';

export const metadata: Metadata = {
  title: pageData.title,
  description: pageData.description,
};

export default function HomePage() {
  return (
    <div>
      <div dangerouslySetInnerHTML={{ __html: pageData.content }} />
    </div>
  );
}
