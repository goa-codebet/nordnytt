import { getTopStoryIDs, getStoriesByIDs } from "@/services/hn";
import { STORIES_PER_PAGE } from "@/lib/constants";
import StoriesList from "@/app/components/StoriesList";

export default async function Home({
  searchParams,
}: {
  searchParams: { page?: string };
}) {
  let page = parseInt(searchParams.page || "1");
  const storyIDs = await getTopStoryIDs();

  if (isNaN(page) || page < 1) page = 1; // Prevent invalid pages
  if (!storyIDs.length) return <p>No stories available.</p>;

  const startIndex = (page - 1) * STORIES_PER_PAGE;
  const endIndex = startIndex + STORIES_PER_PAGE;
  const currentPageIDs = storyIDs.slice(startIndex, endIndex);

  const stories = await getStoriesByIDs(currentPageIDs);

  return (
    <main>
      <StoriesList stories={stories} page={page} />
    </main>
  );
}
