"use client";
import { useSearchParams } from "next/navigation"; 
import { useState, useEffect } from "react";
import { getAllStories } from "@/services/hn";
import { Story } from "@/types";
import Link from "next/link";


export default function Home() {
  const searchParam = useSearchParams()

  const currentPage = parseInt(searchParam.get("page") || "1")

  const [stories, setStories] = useState<Story[]>([])
  const [totalPages, setTotalPages] = useState(1)


  useEffect(() => {
    async function fetchStories() {
      const { stories, totalPages } = await getAllStories(currentPage)
      setStories(stories)
      setTotalPages(totalPages)
      
    }
    fetchStories();
  },[currentPage])

  return (
    <main>
      { stories.map((story, index) => {
        const url = story.url ? new URL(story.url) : null;
        return (
          <div className="leading-none mb-4" key={story.id}>
            <a title={story.title} href={story.url || `/${story.id}`} target={url?.host ? "_blank" : ""} className="pb-1 whitespace-nowrap text-ellipsis overflow-hidden block font-bold visited:text-slate-500">{index + (currentPage - 1) * 10 +1}. {story.title}</a>
            <div className="text-xs text-slate-700">{url?.host ? `${url?.host} - ` : ''} <Link href={`/${story.id}`}>{story.score} poäng - {story.descendants || 'Inga'} kommentarer - {Math.floor(Date.now()/1000 - story.time)} sekunder sedan</Link></div>
          </div>
        )
      }) }
        <Link href={`/?page=${currentPage - 1}`} passHref>
          <button
            disabled={currentPage === 1}
            className={`px-4 py-2 text-white font-semibold rounded-lg transition-all duration-300
              ${currentPage === 1 ? "bg-gray-300 cursor-not-allowed" : "bg-blue-500 hover:bg-blue-600"} `}
            aria-label="Previous page">
            Previous
          </button>
        </Link>
      <span> Page {currentPage} of {totalPages} </span>
      
      <Link href={`/?page=${currentPage + 1}`} passHref>
          <button
            disabled={currentPage === totalPages}
            className={`px-4 py-2 text-white font-semibold rounded-lg transition-all duration-300
              ${currentPage === totalPages ? "bg-gray-300 cursor-not-allowed" : "bg-blue-500 hover:bg-blue-600"} `}
            aria-label="Next page">
            Next
          </button>
      </Link>
    </main>
  );
}


