'use server';

import { getPaginatedStories } from "@/services/hn";
import StoryList from "@/components/StoryList";
const LIMIT = 10;

export default async function Home() {
  const topstories = await getPaginatedStories(0 ,LIMIT);
  return (
    <main>
      <StoryList initialStories={topstories}/>
    </main>
  );
}
