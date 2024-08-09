'use client';

import { getTopStories } from '@/services/hn';
import Link from 'next/link';
import { useRef, useEffect, useState } from 'react';

export default function Home() {
  const [start, setStart] = useState(0);
  const limit = 10;
  const [topstories, setTopStories] = useState([]);
  const scrollTrigger = useRef(null);

  useEffect(() => {
    const fetchStories = async () => {
      const newStories = await getTopStories(start, limit);
      setTopStories((prevStories) => [...prevStories, ...newStories]);
    };

    fetchStories();
  }, [start]);

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
        <p>Läser in nyheter</p>
      </div>
    </main>
  );
}
