"use client";
import React from 'react';
import * as Accordion from '@radix-ui/react-accordion';
import { ChevronDownIcon } from '@radix-ui/react-icons';
import { useEffect, useState } from 'react';
import styles from './styles.module.scss';
import Link from 'next/link';


interface Message {
  id: number;
  question: string;
  answer: string;
  createdAt: string;
}

interface DashboardClientProps {
  messages: Message[];
  totalCount: number;
  currentPage: number;
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

const DashboardClient: React.FC<DashboardClientProps> = ({ messages, totalCount, currentPage }) => {
  const [isMounted, setIsMounted] = useState(false);
  const pageSize = 50;
  const totalPages = Math.ceil(totalCount / pageSize);


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
          {messages.length > 0 ? (
            messages.map((item) => (
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

      <div>
        {currentPage > 1 && (
          <Link href={`/dashboard?page=${currentPage - 1}`}>
            Previous
          </Link>
        )}
        {currentPage < totalPages && (
          <Link href={`/dashboard?page=${currentPage + 1}`}>
            Next
          </Link>
        )}
      </div>
      
      <p>Page {currentPage} of {totalPages}</p>

        </div>
      </div>
    </div>
  );
}

export default DashboardClient;