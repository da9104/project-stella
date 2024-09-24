"use client";
import * as Accordion from '@radix-ui/react-accordion';
import { ChevronDownIcon } from '@radix-ui/react-icons';
import { useEffect, useState } from 'react';
import styles from './styles.module.scss';

interface Message {
  id: number;
  question: string;
  answer: string;
  createdAt: string;
}

interface DashboardClientProps {
  data: Message[];
}

function cleanHtml(htmlString: string): string {
  if (typeof window === 'undefined') {
 
    let cleanedHtml = htmlString.replace(/<br\s*\/?>/gi, '');
    cleanedHtml = cleanedHtml.replace(/^&para;/, '');
    cleanedHtml = cleanedHtml.replace(/0:"/g, '')
    cleanedHtml = cleanedHtml.replace(/0:"[^"]*"&para;/g, '');
    cleanedHtml = cleanedHtml.replace(/&para;/g, '');
    cleanedHtml = cleanedHtml.replace(/"/g, '');
    return cleanedHtml;
  } else {
 
    const parser = new DOMParser();
    const doc = parser.parseFromString(htmlString, 'text/html');
    const brElements = doc.querySelectorAll('br');
    brElements.forEach((br) => br.remove());
  
    let cleanedHtml = doc.body.innerHTML;
  
    cleanedHtml = cleanedHtml.replace(/^&para;/, '');
    cleanedHtml = cleanedHtml.replace(/0:"/g, '')
    cleanedHtml = cleanedHtml.replace(/0:"[^"]*"&para;/g, '');
    cleanedHtml = cleanedHtml.replace(/&para;/g, '');
    cleanedHtml = cleanedHtml.replace(/"/g, '');
  
    return cleanedHtml;
  }
}

export default function DashboardClient({ data }: DashboardClientProps) {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null; // or a loading spinner
  }

  return (
    <div className={styles.container}>
      <div className="flex flex-col gap-5 w-full justify-center items-center content-center">
        <div className='w-[65%]'>
          {data.length > 0 ? (
            data.map((item) => (
              <Accordion.Root type="multiple" key={item.id} className="border-2 rounded mb-5 hover:border-purple-300">
                <Accordion.Item value={`${item.id}`} className='px-6 py-6'>
                  <Accordion.Trigger className={styles.AccordionTrigger}>
                    <Accordion.Header className={styles.AccordionHeader}>
                      {item.question.length > 15
                        ? `${item.question.slice(0, 15)}...`
                        : item.question}{' '}
                      <span> {new Date(item.createdAt).toLocaleString()} </span>
                    </Accordion.Header>
                    <ChevronDownIcon className={styles.AccordionChevron} />
                  </Accordion.Trigger>
                  <Accordion.Content>
                    <div
                      dangerouslySetInnerHTML={{ __html: cleanHtml(item.answer) }}
                    />
                  </Accordion.Content>
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