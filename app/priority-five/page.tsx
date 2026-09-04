import type { Metadata } from 'next';
import pageData from '@/data/pages/priority-five.json';

export const metadata: Metadata = {
  title: pageData.title,
  description: pageData.description,
};

export default function PriorityFivePage() {
  return (
    <div>
      <div dangerouslySetInnerHTML={{ __html: pageData.content }} />
    </div>
  );
}
