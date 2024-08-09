import { getComment, getStory } from '@/services/hn';
import Link from 'next/link';
import { notFound } from 'next/navigation';

export default async function Home({ params }: { params: { id: number } }) {
  const story = await getStory(params.id);

  if (!story) return notFound();

  const url = story.url ? new URL(story.url) : null;
  const comments = story.kids
    ? await Promise.all(story.kids?.map(getComment))
    : await Promise.resolve([]);

  return (
    <main>
      <div className='leading-none mb-10'>
        <h1 className='block font-bold visited:text-slate-500 text-2xl'>
          {story.title}
        </h1>
        <div className='text-xs text-slate-700'>
          {url?.host ? `${url?.host} - ` : ''}{' '}
          <Link href={`/${story.id}`}>{story.score} poäng</Link> -{' '}
          <Link href={`/${story.id}`}>
            {story.descendants || 'Inga'} kommentarer
          </Link>{' '}
          - {Math.floor(Date.now() / 1000 - story.time)} sekunder sedan
        </div>
      </div>
      {story.text && (
        <div
          className='mb-10'
          dangerouslySetInnerHTML={{ __html: story.text }}
        />
      )}
      <div className='text-lg font-bold'>Kommentarer ({comments.length})</div>
      <ul className='mb-10'>
        {comments.map((comment) => (
          <li className='mb-10' key={comment?.id}>
            <div className='text-sm text-slate-700 italic'>
              {comment?.by} - {Math.floor(Date.now() / 1000 - comment?.time)}{' '}
              sekunder sedan
            </div>
            <div dangerouslySetInnerHTML={{ __html: comment?.text || '' }} />
          </li>
        ))}
      </ul>
    </main>
  );
}
