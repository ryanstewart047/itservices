import type { Metadata } from 'next';
import pageData from '@/data/pages/privacy-policy.json';

export const metadata: Metadata = {
  title: pageData.title,
  description: pageData.description,
};

export default function PrivacyPolicyPage() {
  return (
    <div>
      <div dangerouslySetInnerHTML={{ __html: pageData.content }} />
    </div>
  );
}
