import { formatDateString } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";
import DeleteThread from "../forms/DeleteThread";
import { addUserLike } from "@/lib/actions/thread.actions";
import LikeThread from "../forms/LikeThread";

// "|" means OR
interface Props {
    id: string;
    currentUserId: string;
    currentUserInfoID: string;
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
    likes: {
        user: {
            id: string;
        }
    }[];
    comments: {
      author: {
        image: string;
        name: string;
      };
    }[]; // <- Specifies it as an array (of comments)
    isComment?: boolean;
  }

// Thread Card is the section containing all the thread info such as
//  author, community, created at time, author image, etc.
const ThreadCard = ({
    id,
    currentUserId,
    currentUserInfoID,
    parentId,
    content,
    author,
    community,
    createdAt,
    likes,
    comments,
    isComment,
}: Props) => {
    let commentProfileImages = [];
    for (let i=0; i<3 && i<comments.length; i++) {
        commentProfileImages.push(
        <Link href={`/thread/${id}`}>
            <Image 
                src={comments[i].author.image}
                alt={comments[i].author.name}
                width={24}
                height={24}
                className={`cursor-pointer rounded-full`} />
        </Link>    
        );
    }
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
                        {/* TODO: Show comment logos */}
                        <div className="flex flex-hor">
                            {commentProfileImages}
                        </div>
                        {/* {comments.map((comment) => (
                                <Link href={`/thread/${id}`}>
                                    <Image 
                                        src={comment.author.image}
                                        alt={comment.author.name}
                                        width={24}
                                        height={24}
                                        className="cursor-pointer rounded-full" />
                                </Link>
                        ))}  */}
                    </div>

                    <div className="flex w-full flex-col">
                        <Link href={`/profile/${author.id}`} className="w-fit">
                            <h4 className="cursor-pointer text-base-semibold text-light-1">{author.name}</h4>
                        </Link>

                        <p className="mt-2 text-small-regular text-light-2">{content}</p>

                        <div className={`${isComment && 'mb-10' } mt-5 flex flex-col gap-3`}>
                            <div className="flex gap-3.5">
                                {likes && likes.includes(JSON.parse(currentUserInfoID)) ? (
                                    <LikeThread threadId={JSON.parse(JSON.stringify(id))} currentUserId={currentUserInfoID} imageSource="/assets/heart-filled.svg"/>
                                ) : (
                                    <LikeThread threadId={JSON.parse(JSON.stringify(id))} currentUserId={currentUserInfoID} imageSource="/assets/heart-gray.svg"/>
                                )
                                }
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
                                <p className="mt-1 text-subtle-medium text-gray-1">{comments.length} replies - {likes && (likes.length)} likes</p>
                            </Link>
                             
                        </div>
                         
                    </div>
                    
                </div>
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