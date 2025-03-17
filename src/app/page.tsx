import { getTopStories } from "@/services/hn";
import TopStoryList from "@/components/TopStoryList";

const INITIAL_NUMBER_OF_STORIES = 10;

export default async function Home() {
  const topstories = await getTopStories(0, INITIAL_NUMBER_OF_STORIES);

  return <TopStoryList initialStories={topstories} />;
}
