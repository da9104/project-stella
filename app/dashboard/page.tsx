// app/dashboard/page.tsx (Server Component)
import { neon } from '@neondatabase/serverless';
import DashboardClient from '@/components/DashboardClient';
// Server-side data fetching
async function getData() {
  if (!process.env.DATABASE_URL) {
    throw new Error("DATABASE_URL is not defined");
  }
  const sql = neon(process.env.DATABASE_URL);
  const response = await sql`SELECT * FROM "Message"`;
  return response;
}

// Server Component (No 'use client' here)
export default async function Dashboard() {
  const data = await getData();
  
  // Pass data to Client Component
  return <DashboardClient data={data} />;
}
