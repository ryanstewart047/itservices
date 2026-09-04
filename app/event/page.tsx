import type { Metadata } from 'next';
import pageData from '@/data/pages/event.json';

export const metadata: Metadata = {
  title: pageData.title,
  description: pageData.description,
};

export default function EventPage() {
  return (
    <div>
      <div dangerouslySetInnerHTML={{ __html: pageData.content }} />
    </div>
  );
}
