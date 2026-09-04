import type { Metadata } from 'next';
import pageData from '@/data/pages/about.json';

export const metadata: Metadata = {
  title: pageData.title,
  description: pageData.description,
};

export default function AboutPage() {
  return (
    <div>
      <div dangerouslySetInnerHTML={{ __html: pageData.content }} />
    </div>
  );
}
