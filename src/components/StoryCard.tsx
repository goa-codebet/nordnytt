import { Story } from "@/types";
import Link from "next/link";


type StoryProps = {
    story: Story;
}

export default function StoryCard({story}: StoryProps) {
    const url = story.url ? new URL(story.url) : null;
    return (
        <div className="leading-none mb-4">
        <a
            title={story.title}
            href={story.url || `/${story.id}`}
            target={url?.host ? "_blank" : ""}
            className="pb-1 whitespace-nowrap text-ellipsis overflow-hidden block font-bold visited:text-slate-500"
        >
            #{story.id}. {story.title}
        </a>
        <div className="text-xs text-slate-700">
            {url?.host ? `${url.host} - ` : ''}
            <Link href={`/${story.id}`}>
                {story.score} poäng - {story.descendants || 'Inga'} kommentarer - {Math.floor((Date.now() / 1000) - story.time)} sekunder sedan
            </Link>
        </div>
    </div>
    )
}