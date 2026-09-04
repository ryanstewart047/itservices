import type { Metadata } from 'next';
import pageData from '@/data/pages/recover-password.json';

export const metadata: Metadata = {
  title: pageData.title,
  description: pageData.description,
};

export default function RecoverPasswordPage() {
  return (
    <div>
      <div dangerouslySetInnerHTML={{ __html: pageData.content }} />
    </div>
  );
}
