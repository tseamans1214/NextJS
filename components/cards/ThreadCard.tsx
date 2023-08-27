import { formatDateString } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";
import DeleteThread from "../forms/DeleteThread";

// "|" means OR
interface Props {
    id: string;
    currentUserId: string;
    parentId: string | null;
    content: string;
    author: {
      name: string;
      image: string;
      id: string;
    };
    community: {
      id: string;
      name: string;
      image: string;
    } | null;
    createdAt: string;
    comments: {
      author: {
        image: string;
      };
    }[]; // <- Specifies it as an array (of comments)
    isComment?: boolean;
  }

// Thread Card is the section containing all the thread info such as
//  author, community, created at time, author image, etc.
const ThreadCard = ({
    id,
    currentUserId,
    parentId,
    content,
    author,
    community,
    createdAt,
    comments,
    isComment,
}: Props) => {
    console.log(`content:${content}`);
    console.log(`isComment:${isComment}`);
    return (
        <article className={`flex w-full flex-col rounded- ${isComment ?
         'px-0 xs:px-7' : 'bg-dark-2 p-7'} `}>
            <div className="flex items-start justify-between">
                <div className="flex w-full flex-1 felx-row gap-4">
                    <div className="flex flex-col items-center">
                        <Link href={`/profile/${author.id}`} className="relative h-11 w-11">
                            <Image
                                src={author.image}
                                alt="Profile image"
                                fill
                                className="cursor-pointer rounded-full"
                            />
                        </Link>
                        
                        {/* Line below profile pick showing thread line */}
                        <div className="thread-card_bar" /> 
                    </div>

                    <div className="flex w-full flex-col">
                        <Link href={`/profile/${author.id}`} className="w-fit">
                            <h4 className="cursor-pointer text-base-semibold text-light-1">{author.name}</h4>
                        </Link>

                        <p className="mt-2 text-small-regular text-light-2">{content}</p>

                        <div className={`${isComment && 'mb-10' } mt-5 flex flex-col gap-3`}>
                            <div className="flex gap-3.5">
                                <Image src="/assets/heart-gray.svg" alt="heart" width="24"
                                height={24} className="cursor-pointer object-contain" />
                                <Link href={`/thread/${id}`}>
                                    <Image src="/assets/reply.svg" alt="reply" width="24"
                                    height={24} className="cursor-pointer object-contain" />
                                </Link>
                                <Image src="/assets/repost.svg" alt="repost" width="24"
                                height={24} className="cursor-pointer object-contain" />
                                <Image src="/assets/share.svg" alt="share" width="24"
                                height={24} className="cursor-pointer object-contain" />
                            </div>
                        {/* Shows link with text for # of replies and likes */}
                        <Link href={`/thread/${id}`}>
                            <p className="mt-1 text-subtle-medium text-gray-1">{comments.length} replies - 0 likes</p>
                        </Link>    
                        </div>
                    </div>
                </div>
                {/* DeleteThread Button (shows if currentUser matches thread author) */}
                {(currentUserId === author.id) && (<DeleteThread
                    threadId={JSON.parse(JSON.stringify(id))}
                />
                )
                }
                {/* TODO: Show comment logos */}
                
                
            </div>
            {!isComment && community && (
                <Link href={`/communities/${community.id}`} className='mt-5 flex items-center'>
                <p className='text-subtle-medium text-gray-1'>
                    {formatDateString(createdAt)}
                    {community && ` - ${community.name} Community`}
                </p>

                <Image
                    src={community.image}
                    alt={community.name}
                    width={14}
                    height={14}
                    className='ml-1 rounded-full object-cover'
                />
                </Link>
            )}
        </article>
    )
}

export default ThreadCard;