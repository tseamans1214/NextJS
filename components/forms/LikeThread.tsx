"use client";
import { usePathname, useRouter } from "next/navigation";
import { addUserLike } from "@/lib/actions/thread.actions";
import Image from "next/image";

interface Props {
  threadId: string;
  currentUserId: string;
  imageSource: string;
}

function LikeThread({ threadId, currentUserId, imageSource }: Props) {
  const router = useRouter();
  const pathname = usePathname();

  return (
    <Image 
        src={imageSource}
        alt="heart" width="24"
        height={24}
        className="cursor-pointer object-contain"
        onClick={async() =>{
            await addUserLike(threadId, JSON.parse(currentUserId), pathname);
            router.push(pathname);
        }}
    />
  );
}

export default LikeThread;