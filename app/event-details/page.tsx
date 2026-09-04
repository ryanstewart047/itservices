import type { Metadata } from 'next';
import pageData from '@/data/pages/event-details.json';

export const metadata: Metadata = {
  title: pageData.title,
  description: pageData.description,
};

export default function EventDetailsPage() {
  return (
    <div>
      <div dangerouslySetInnerHTML={{ __html: pageData.content }} />
    </div>
  );
}
