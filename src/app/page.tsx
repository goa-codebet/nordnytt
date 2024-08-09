'use client';
import { getTopStories } from '@/services/hn';
import Link from 'next/link';
import { useRef, useEffect, useState } from 'react';

export default function Home() {
  const [start, setStart] = useState(0);
  const limit = 10;
  const [topstories, setTopStories] = useState([]);
  const [message, setMessage] = useState('Läser in nyheter...');
  const scrollTrigger = useRef(null);

  useEffect(() => {
    const fetchStories = async () => {
      setMessage('Läser in nyheter...');
      try {
        const newStories = await getTopStories(start, limit);
        if (newStories.length < limit) {
          setMessage('Det finns inte fler nyheter att läsa in.');
        } else {
          setMessage('Läser in nyheter...');
        }
        setTopStories((prevStories) => [...prevStories, ...newStories]);
      } catch (error) {
        console.error('Failed to fetch stories:', error);
        setMessage('Något gick fel vid inläsning av nyheter.');
      }
    };
    fetchStories();
  }, [start, limit]);

  useEffect(() => {
    if (!window.IntersectionObserver) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setStart((prevStart) => prevStart + limit);
        }
      },
      { threshold: 1.0 }
    );

    if (scrollTrigger.current) {
      observer.observe(scrollTrigger.current);
    }

    return () => {
      if (scrollTrigger.current) {
        observer.unobserve(scrollTrigger.current);
      }
    };
  }, [scrollTrigger, limit]);

  return (
    <main>
      {topstories.map((story, index) => {
        const url = story.url ? new URL(story.url) : null;

        return (
          <div className='leading-none mb-4' key={story.id}>
            <a
              title={story.title}
              href={story.url || `/${story.id}`}
              target={url?.host ? '_blank' : ''}
              className='pb-1 whitespace-nowrap text-ellipsis overflow-hidden block font-bold visited:text-slate-500'
            >
              {index + 1}. {story.title}
            </a>
            <div className='text-xs text-slate-700'>
              {url?.host ? `${url?.host} - ` : ''}{' '}
              <Link href={`/${story.id}`}>
                {story.score} poäng - {story.descendants || 'Inga'} kommentarer
                - {Math.floor(Date.now() / 1000 - story.time)} sekunder sedan
              </Link>
            </div>
          </div>
        );
      })}
      <div ref={scrollTrigger} className='text-s mt-4 mb-4'>
        <p>{message}</p>
      </div>
    </main>
  );
}
