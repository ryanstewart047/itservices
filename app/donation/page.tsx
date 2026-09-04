import type { Metadata } from 'next';
import pageData from '@/data/pages/donation.json';

export const metadata: Metadata = {
  title: pageData.title,
  description: pageData.description,
};

export default function DonationPage() {
  return (
    <div>
      <div dangerouslySetInnerHTML={{ __html: pageData.content }} />
    </div>
  );
}
