import { getTopStories } from "@/services/hn";
import Stories from "./components/Stories";

export default async function Home() {
  const topstories = await getTopStories();

  return (
    <main>
      <Stories></Stories>
    </main>
  );
}
