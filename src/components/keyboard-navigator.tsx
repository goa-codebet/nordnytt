'use client';

import { Story } from '@/types';
import { useRouter, usePathname } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';

interface KeyboardNavigatorProps {
  stories: Story[];
  currentArticleId: number;
}

export const KeyboardNavigator = ({
  stories,
  currentArticleId,
}: KeyboardNavigatorProps) => {
  const router = useRouter();
  const pathname = usePathname();
  const [input, setInput] = useState('');
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    let currentId = currentArticleId;
    if (pathname !== '/') {
      const pathId = pathname.replace('/', '');
      if (pathId) {
        currentId = parseInt(pathId, 10);
      }
    }

    const currentIndex = stories.findIndex((story) => story.id === currentId);

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
      } else if (key === 'n') {
        if (currentIndex !== -1 && currentIndex < stories.length - 1) {
          const nextStory = stories[currentIndex + 1];
          router.push(`/${nextStory.id}`);
        }
      } else if (key === 'p') {
        if (currentIndex !== -1 && currentIndex > 0) {
          const prevStory = stories[currentIndex - 1];
          router.push(`/${prevStory.id}`);
        }
      }
    };

    document.addEventListener('keydown', handleKeyPress);

    return () => {
      document.removeEventListener('keydown', handleKeyPress);
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [stories, router, currentArticleId, pathname]);

  return null;
};
