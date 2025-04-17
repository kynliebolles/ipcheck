import { redirect } from 'next/navigation'

export default function IPDistanceRedirect() {
  // Redirect to the English version by default
  redirect('/en/ipdistance');
} 