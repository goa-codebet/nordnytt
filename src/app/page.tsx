"use client";

import React, { useState, useEffect } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import { getTopStories } from "@/services/hn";
import Link from "next/link";

const ITEMS_PER_PAGE = 10; // Number of items displayed per page in paginated views from API

const Home = () => {
  const [stories, setStories] = useState<any[]>([]);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(0);

  const fetchMoreStories = async () => {
    try {
      const topStories = await getTopStories();
      setStories((prevStories) => [...prevStories, ...topStories]);
      setPage((prevPage) => prevPage + 1);
      if (topStories.length < ITEMS_PER_PAGE) {
        setHasMore(false);
      }
    } catch (error) {
      console.error("Error fetching more stories:", error);
      setHasMore(false); // Stops infinite scroll if an error occurs
    }
  };
  

  useEffect(() => {
    fetchMoreStories(); // Initial fetching of data
  }, []);

  return (
    <main>
      <InfiniteScroll
        dataLength={stories.length}
        next={fetchMoreStories}
        hasMore={hasMore}
        loader={
        <img
          alt="Loading"
          width="200px"
          src="https://cdn.dribbble.com/users/2882885/screenshots/7861928/media/a4c4da396c3da907e7ed9dd0b55e5031.gif"
        />}
        endMessage={<p>No more stories to show</p>} // Displaying message to user if no more stories to fetch
      >
        {stories.map((story) => {
          const url = story.url ? new URL(story.url) : null;

          return (
            <div className="leading-none mb-4" key={story.id}>
              <a
                title={story.title}
                href={story.url || `/${story.id}`}
                target={url?.host ? "_blank" : ""}
                className="pb-1 whitespace-nowrap text-ellipsis overflow-hidden block font-bold visited:text-slate-500"
              >
                {story.title}
              </a>
              <div className="text-xs text-slate-700">
                {url?.host ? `${url?.host} - ` : ""}
                <Link href={`/${story.id}`}>
                  {story.score} poäng - {story.descendants || "Inga"} kommentarer -{" "}
                  {Math.floor(Date.now() / 1000 - story.time)} sekunder sedan
                </Link>
              </div>
            </div>
          );
        })}
      </InfiniteScroll>
    </main>
  );
};

export default Home;
