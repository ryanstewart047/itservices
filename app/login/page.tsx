import type { Metadata } from 'next';
import pageData from '@/data/pages/login.json';

export const metadata: Metadata = {
  title: pageData.title,
  description: pageData.description,
};

export default function LoginPage() {
  return (
    <div>
      <div dangerouslySetInnerHTML={{ __html: pageData.content }} />
    </div>
  );
}
