import type { Metadata } from 'next';
import TeamCards from './TeamCards';

export const metadata: Metadata = {
  title: 'Board & Leadership Team | EARPI',
  description: 'Meet the dedicated board members and leadership team driving EARPI\'s climate resilience mission across West Africa.',
};

export default function TeamPage() {
  return <TeamCards />;
}
