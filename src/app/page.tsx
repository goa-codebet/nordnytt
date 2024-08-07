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
      const topStories = await getTopStories(page, ITEMS_PER_PAGE);
      setStories((prevStories) => [...prevStories, ...topStories]);
      setPage((prevPage) => prevPage + 1);
      if (topStories.length < ITEMS_PER_PAGE) {
        setHasMore(false);
      }
    } catch (error) {
      console.error("Error fetching more stories:", error);
      setHasMore(false); // Stops infinite scroll, if error occurs
    }
  };

  return (
    <main>
      <p>Loading...</p>
    </main>
  );
};

export default Home;
