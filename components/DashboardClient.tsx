"use client"; 
import * as Accordion from '@radix-ui/react-accordion';
import { ChevronDownIcon } from '@radix-ui/react-icons';
import styles from './styles.module.scss'

interface Message {
  id: number;
  question: string;
  answer: string;
  createdAt: string;
}

interface DashboardClientProps {
  data: Message[];
}

export default function DashboardClient({ data }: DashboardClientProps) {
  return (
  <div className={styles.container}>
    <div className="flex flex-col gap-5 w-full justify-center items-center content-center">
      <div className='w-[65%]'>
      {data.length > 0 ? (
        data.map((item) => (
             <Accordion.Root type="multiple" key={item.id} className="border-2 rounded mb-5">
                <Accordion.Item value={`${item.id}`} className='px-6 py-6'>
                    <Accordion.Trigger className={styles.AccordionTrigger}>
                        <Accordion.Header className={styles.AccordionHeader}>
                            Question: {item.question}{' '}
                            <span> Time: {new Date(item.createdAt).toLocaleString()} </span>
                        </Accordion.Header>
                        <ChevronDownIcon className={styles.AccordionChevron} />
                    </Accordion.Trigger>
                    <Accordion.Content>Answer: {item.answer}</Accordion.Content>
                </Accordion.Item>
        </Accordion.Root> 
           
        ))
      ) : (
        <p>No data found.</p>
      )}
      </div>
    </div>
  </div>
  );
}
