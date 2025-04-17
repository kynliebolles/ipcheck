import { redirect } from 'next/navigation'

export default function SpeedTestRedirect() {
  // Redirect to the English version by default
  redirect('/en/speedtest');
}
