"use client";
import { usePathname, useRouter } from "next/navigation";
import { deleteThread } from "@/lib/actions/thread.actions";
import Image from "next/image";

interface Props {
  threadId: string;
}

function DeleteThread({ threadId }: Props) {
  const router = useRouter();
  const pathname = usePathname();

  return (
    <Image 
        className="cursor-pointer"
        src="/assets/delete.svg"
        alt="delete"
        width={18}
        height={18}
        onClick={async() =>{
            await deleteThread(threadId, pathname);
            router.push(pathname);
        }}
    />
  );
}

export default DeleteThread;