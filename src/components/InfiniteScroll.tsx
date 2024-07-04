"use client";
import { useEffect, useState } from "react";
import { getTopStories, getStory } from "../services/hn";
import Link from "next/link";
import { Story } from "@/types";

const InfiniteScroll = () => {
  const [stories, setStories] = useState<Story[]>([]);
  const [page, setPage] = useState(0);
  const [loading, setLoading] = useState<boolean>(false);
  const [hasMoreItems, setHasMoreItems] = useState<boolean>(true);
  const batchSize = 10;

  useEffect(() => {
    const loadTopStories = async () => {
      setLoading(true);
      const newStories = await getTopStories(page, batchSize);
      setStories(prevStories => [...prevStories, ...newStories]);
      setLoading(false);

      if (newStories.length === 0) {
        setHasMoreItems(false);
      }
    };

    loadTopStories();
  }, [page]);

  // Infinite scroll handler
  // Doesn't quite work as expected.
  useEffect(() => {
    const handleScroll = () => {
      if (loading || !hasMoreItems) return;
      setPage(prevPage => prevPage + 1);
      if (
        window.innerHeight + document.documentElement.scrollTop ===
        document.documentElement.offsetHeight
      ) {
        
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [loading, hasMoreItems]);

  return (
    <div>
      {stories.map((story, index) => (
        <div className="leading-none mb-4" key={`${story.id}-${index}`}>
          <a
            title={story.title}
            href={story.url || `/${story.id}`}
            target={story.url ? '_blank' : ''}
            className="pb-1 whitespace-nowrap text-ellipsis overflow-hidden block font-bold visited:text-slate-500"
          >
            {story.title}
          </a>
          <div className="text-xs text-slate-700">
            {story.url && (
              <span>
                <Link href={`/${story.id}`}>
                  {story.score} points - {story.descendants || 'No'} comments -{' '}
                  {Math.floor((Date.now() / 1000 - story.time))} seconds ago
                </Link>
              </span>
            )}
          </div>
        </div>
      ))}
      {loading && <p>Loading...</p>}
      {!hasMoreItems && <p>No more stories to load</p>}
    </div>
  );
};

export default InfiniteScroll;
