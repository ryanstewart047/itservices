import type { Metadata } from 'next';
import pageData from '@/data/pages/project-one.json';

export const metadata: Metadata = {
  title: 'Projects | EARPI',
  description: pageData.description,
};

export default function ProjectsPage() {
  return (
    <div>
      <div dangerouslySetInnerHTML={{ __html: pageData.content }} />
    </div>
  );
}
