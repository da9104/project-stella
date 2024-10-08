import { neon } from '@neondatabase/serverless'
import DashboardClient from '@/components/DashboardClient'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

interface Message {
  id: number;
  question: string;
  answer: string;
  createdAt: string;
  userId: string;
}

const MAX_TEXT_LENGTH = 2000;
function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength) + '...';
}
async function getData(userId: string, page: number = 1, pageSize: number = 50): Promise<{ messages: Message[], totalCount: number }> {
  if (!process.env.DATABASE_URL) {
    throw new Error("DATABASE_URL is not defined");
  }
  
  const sql = neon(process.env.DATABASE_URL);
  const offset = (page - 1) * pageSize;

  const [{ count }] = await sql`SELECT COUNT(*) FROM "Message" WHERE "userId" = ${userId}`

    const messages = await sql`
    SELECT 
      id, 
      LEFT(question, ${MAX_TEXT_LENGTH}) as question, 
      LEFT(answer, ${MAX_TEXT_LENGTH}) as answer, 
      "createdAt"
    FROM "Message"
    WHERE "userId" = ${userId}
    ORDER BY "createdAt" DESC
    LIMIT ${pageSize} OFFSET ${offset}
  `;

  console.log("Response size:", Buffer.byteLength(JSON.stringify(messages)), "bytes");

  const data: Message[] = messages.map((item) => ({
    id: item.id,
    question: truncateText(item.question, MAX_TEXT_LENGTH),
    answer: truncateText(item.answer, MAX_TEXT_LENGTH),
    createdAt: item.createdAt,
    userId: item.userId,
  }));

  return { messages: data, totalCount: Number(count) };
}
// revalidate = 0; force to fetch a fresh data from DB
export const revalidate = 0;
export default async function Dashboard({ searchParams }: { searchParams: { page?: string } }) {
  const session = await getServerSession(authOptions);

  if (!session || !session.user) {
    return <div>You must be logged in to view your messages.</div>;
  }

  const userId = session.user.id;
  
  const page = searchParams.page ? parseInt(searchParams.page) : 1;
  
  const { messages, totalCount } = await getData(userId, page);

  return <DashboardClient messages={messages} totalCount={totalCount} currentPage={page} />;
}