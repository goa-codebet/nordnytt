"use client";

import React, { useState, useEffect } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import { getTopStories } from "@/services/hn";
import Link from "next/link";

const ITEMS_PER_PAGE = 10; // Number of items displayed per page in paginated views from API

const Home = () => {
  // Placeholder for state and effects
  return (
    <main>
      <p>Loading...</p>
    </main>
  );
};

export default Home;
