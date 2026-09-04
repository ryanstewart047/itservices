import type { Metadata } from 'next';
import pageData from '@/data/pages/team-hassan-details.json';

export const metadata: Metadata = {
  title: pageData.title,
  description: pageData.description,
};

export default function TeamHassanDetailsPage() {
  return (
    <div>
      <div dangerouslySetInnerHTML={{ __html: pageData.content }} />
    </div>
  );
}
