"use client"
import Image from "next/image";
import { Button } from "../ui/button";
import { usePathname, useRouter } from "next/navigation";
import { followUser } from "@/lib/actions/user.actions";

interface Props {
    id: string;
    followId: string;
    name: string;
    username: string;
    imgUrl: string;
    personType: string;
    currentUserId: string;
    follows: {
        user: {
            id: string;
        }
    }[];
}

const UserCard = ({id, name, username, imgUrl, personType, currentUserId, followId, follows } : Props) => {
    const router = useRouter();
    const pathname = usePathname();
    return (
        <article className="user-card">
            <div className="user-card_avatar">
                <Image 
                    src={imgUrl}
                    alt="logo"
                    width={48}
                    height={48}
                    className="rounded-full"
                />

                <div className="flex-1 text-ellipsis">
                    <h4 className="text-base-semibold text-light-1">{name}</h4>
                    <p className="text-small-medium text-gray-1">@{username}</p>
                </div>
            </div>
            <Button className="user-card_btn" onClick={() => router.push(`/profile/${id}`)}>
                View
            </Button>
            <Button className="user-card_btn" onClick={async() =>{
                console.log("ID: ", id);
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
            
        </article>
    );
};

export default UserCard;