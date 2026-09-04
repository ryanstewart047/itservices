import type { Metadata } from 'next';
import pageData from '@/data/pages/blogdetails.json';

export const metadata: Metadata = {
  title: pageData.title,
  description: pageData.description,
};

export default function BlogdetailsPage() {
  return (
    <div>
      <div dangerouslySetInnerHTML={{ __html: pageData.content }} />
    </div>
  );
}
