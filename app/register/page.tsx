import type { Metadata } from 'next';
import pageData from '@/data/pages/register.json';

export const metadata: Metadata = {
  title: pageData.title,
  description: pageData.description,
};

export default function RegisterPage() {
  return (
    <div>
      <div dangerouslySetInnerHTML={{ __html: pageData.content }} />
    </div>
  );
}
