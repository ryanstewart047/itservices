import type { Metadata } from 'next';
import pageData from '@/data/pages/project-two.json';

export const metadata: Metadata = {
  title: pageData.title,
  description: pageData.description,
};

export default function ProjectTwoPage() {
  return (
    <div>
      <div dangerouslySetInnerHTML={{ __html: pageData.content }} />
    </div>
  );
}
