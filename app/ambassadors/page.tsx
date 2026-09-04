import type { Metadata } from 'next';
import pageData from '@/data/pages/ambassadors.json';

export const metadata: Metadata = {
  title: pageData.title,
  description: pageData.description,
};

export default function AmbassadorsPage() {
  return (
    <div>
      <div dangerouslySetInnerHTML={{ __html: pageData.content }} />
    </div>
  );
}
