import type { Metadata } from 'next';
import pageData from '@/data/pages/priority-four.json';

export const metadata: Metadata = {
  title: pageData.title,
  description: pageData.description,
};

export default function PriorityFourPage() {
  return (
    <div>
      <div dangerouslySetInnerHTML={{ __html: pageData.content }} />
    </div>
  );
}
