'use client';

import { Story } from '@/types';
import { useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';

interface KeyboardNavigatorProps {
  stories: Story[];
}

export const KeyboardNavigator = ({ stories }: KeyboardNavigatorProps) => {
  const router = useRouter();
  const [input, setInput] = useState('');
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      const key = event.key;

      if (/^\d$/.test(key)) {
        setInput((prevInput) => {
          const newInput = prevInput + key;

          if (timeoutRef.current) clearTimeout(timeoutRef.current);

          timeoutRef.current = setTimeout(() => {
            const index = parseInt(newInput, 10) - 1;

            if (index >= 0 && index < stories.length) {
              const story = stories[index];

              if (story.url) {
                window.open(story.url, '_blank');
              } else {
                router.push(`/${story.id}`);
              }
            }

            setInput('');
          }, 500);

          return newInput;
        });
      }
    };

    document.addEventListener('keydown', handleKeyPress);

    return () => {
      document.removeEventListener('keydown', handleKeyPress);

      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [stories, router]);

  return null;
};
