'use client';

import { Story } from '@/types';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

interface KeyboardNavigatorProps {
  stories: Story[];
}

export const KeyboardNavigator = ({ stories }: KeyboardNavigatorProps) => {
  const router = useRouter();

  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      const key = event.key;
      if (/^[1-9]$/.test(key)) {
        const index = parseInt(key, 10) - 1;
        if (index < stories.length) {
          const story = stories[index];
          if (story.url) {
            window.open(story.url, '_blank');
          } else {
            router.push(`/${story.id}`);
          }
        }
      }
    };

    document.addEventListener('keydown', handleKeyPress);
    return () => {
      document.removeEventListener('keydown', handleKeyPress);
    };
  }, [stories, router]);
  return null;
};
