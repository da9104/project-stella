import { neon } from '@neondatabase/serverless';
import DashboardClient from '@/components/DashboardClient';

interface Message {
  id: number;
  question: string;
  answer: string;
  createdAt: string;
}

async function getData(): Promise<Message[]> {
  if (!process.env.DATABASE_URL) {
    throw new Error("DATABASE_URL is not defined");
  }
  
  const sql = neon(process.env.DATABASE_URL);
 interface MessageResponse {
    id: number;
    question: string;
    answer: string;
    createdAt: string;
  }
  
  // Explicitly cast the response to the expected type
  const response = await sql`SELECT * FROM "Message"` as unknown as MessageResponse[];
  
  const data: Message[] = response.map((item) => ({
    id: item.id,
    question: item.question,
    answer: item.answer,
    createdAt: item.createdAt,
  }));
  
  return data;
}

export default async function Dashboard() {
  const data = await getData();
  return <DashboardClient data={data} />;
}