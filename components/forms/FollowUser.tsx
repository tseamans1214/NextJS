"use client";
import { usePathname, useRouter } from "next/navigation";
import { addUserLike } from "@/lib/actions/thread.actions";
import Image from "next/image";
import { Button } from "../ui/button";
import { followUser } from "@/lib/actions/user.actions";

interface Props {
    followId: string;
    currentUserId: string;
    follows: {
        user: {
            id: string;
        }
    }[];
}

function FollowUser({ followId, currentUserId, follows }: Props) {
  const router = useRouter();
  const pathname = usePathname();

  return (
    <Button className="user-card_btn" onClick={async() =>{
        await followUser(
            JSON.parse(currentUserId), JSON.parse(followId), pathname);
            router.refresh();
        }}>
        {follows && follows.includes(JSON.parse(followId)) ? (
                            "Unfollow"
                        ) : (
                            "Follow"
                        )
        }
    </Button>
  );
}

export default FollowUser;