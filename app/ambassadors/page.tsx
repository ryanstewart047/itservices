import type { Metadata } from 'next';
import AmbassadorCards from './AmbassadorCards';

export const metadata: Metadata = {
  title: 'Global Ambassadors | EARPI',
  description: 'Meet EARPI\'s global ambassadors and international advisors championing climate resilience and sustainable development worldwide.',
};

export default function AmbassadorsPage() {
  return <AmbassadorCards />;
}
