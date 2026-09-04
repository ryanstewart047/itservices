import type { Metadata } from 'next';
import pageData from '@/data/pages/priority-two.json';

export const metadata: Metadata = {
  title: pageData.title,
  description: pageData.description,
};

export default function PriorityTwoPage() {
  return (
    <div>
      <div dangerouslySetInnerHTML={{ __html: pageData.content }} />
    </div>
  );
}
