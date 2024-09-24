import { neon } from '@neondatabase/serverless';
import DashboardClient from '@/components/DashboardClient';

// Define the Message type
type Message = {
  id: number;
  question: string;
  answer: string;
  createdAt: string;
};

// Server-side data fetching
async function getData() {
  if (!process.env.DATABASE_URL) {
    throw new Error("DATABASE_URL is not defined");
  }
  const sql = neon(process.env.DATABASE_URL);
  const response = await sql`SELECT * FROM "Message"`;
  return response;
}

export default async function Dashboard() {
  const data = await getData();
  
  // Pass data to Client Component
  // Map the data to the Message type
  const messages: Message[] = data.map((item: Record<string, any>) => ({
    id: item.id,
    question: item.question,
    answer: item.answer,
    createdAt: item.createdAt,
  }));

  return <DashboardClient data={messages} />;
}
