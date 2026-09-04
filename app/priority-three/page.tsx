import type { Metadata } from 'next';
import pageData from '@/data/pages/priority-three.json';

export const metadata: Metadata = {
  title: pageData.title,
  description: pageData.description,
};

export default function PriorityThreePage() {
  return (
    <div>
      <div dangerouslySetInnerHTML={{ __html: pageData.content }} />
    </div>
  );
}
