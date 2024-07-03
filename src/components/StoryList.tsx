'use client';
import StoryCard from "./StoryCard"
import { Story } from "@/types"
import { useEffect, useState } from "react";
import { getPaginatedStories } from "@/services/hn";
import { useInView } from "react-intersection-observer";
import Loading from "@/app/loading";

type StoryListProps = {
  initialStories: Story[]
}

const LIMIT = 10;

export default function StoryList({ initialStories }: StoryListProps) {
  const [offset, setOffset] = useState(LIMIT);
  const [stories, setStories] = useState<Story[]>(initialStories);
  const [message, setMessage] = useState<string>();
  const { ref, inView } = useInView({
    threshold: 1, 
  });

  const loadMoreStories = async () => {
    try {
      const newStories = await getPaginatedStories(offset, LIMIT);
      if (newStories.length === 0) {
        setMessage("There is no more stories to load")
        return; 
      }
      setStories([...stories, ...newStories]);
      setOffset(prevOffset => prevOffset + LIMIT);
    } catch (error) {
      console.error('Error loading more stories:', error);
    }
  };

  useEffect(() => {
    if (inView) {
      loadMoreStories();
    }
  }, [inView]);

  return (
    <div className='flex flex-col gap-3'>
      {stories.map((story) => (
        <StoryCard key={story.id} story={story} />
      ))}
      <div ref={ref} style={{ minHeight: '10px' }}>
        {inView && !message && <Loading/>}
      </div>
      <p>{message && message}</p>
    </div>
  );
}
