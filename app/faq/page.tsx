import type { Metadata } from 'next';
import pageData from '@/data/pages/faq.json';

export const metadata: Metadata = {
  title: pageData.title,
  description: pageData.description,
};

export default function FaqPage() {
  return (
    <div>
      <div dangerouslySetInnerHTML={{ __html: pageData.content }} />
    </div>
  );
}
