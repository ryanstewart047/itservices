import type { Metadata } from 'next';
import pageData from '@/data/pages/project-one.json';

export const metadata: Metadata = {
  title: pageData.title,
  description: pageData.description,
};

export default function ProjectOnePage() {
  return (
    <div>
      <div dangerouslySetInnerHTML={{ __html: pageData.content }} />
    </div>
  );
}
