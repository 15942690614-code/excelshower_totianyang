import Link from 'next/link';
import { Button } from '@/components/ui/Button';

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50 text-gray-900">
      <main className="flex flex-col items-center gap-8 p-8 text-center">
        <h1 className="text-5xl font-bold tracking-tight text-blue-600">
          Excel Graph Shower
        </h1>
        <p className="max-w-2xl text-xl text-gray-600">
          Turn your data into interactive visualizations instantly. 
          Support for Excel, PDF, Word, and Images.
          Powered by intelligent parsing and ECharts.
        </p>
        <div className="flex gap-4">
          <Link href="/dashboard">
            <Button size="lg">Get Started</Button>
          </Link>
          <Link href="/auth/login">
            <Button variant="outline" size="lg">Login</Button>
          </Link>
        </div>
      </main>
      
      <footer className="mt-16 text-sm text-gray-500">
        Based on mcp-server-chart capabilities
      </footer>
    </div>
  );
}
