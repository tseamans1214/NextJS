import ProfileHeader from '@/components/shared/ProfileHeader';
import { fetchUser } from "@/lib/actions/user.actions";
import { currentUser } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { profileTabs } from '@/constants';
import Image from "next/image";
import ThreadsTab from '@/components/shared/ThreadsTab';

async function Page({ params }: { params: {id: string}}) {
    const loggedInUser = await currentUser();

    if (!loggedInUser) return null;
    // currently logged in user's info
    const currentUserInfo = await fetchUser(loggedInUser.id);
    if (!currentUserInfo?.onboarded) redirect('/onboarding');

    // User's page info
    const userInfo = await fetchUser(params.id);

    
    return (
        <section>
            <ProfileHeader 
                accountId={userInfo._id}
                authUserId={currentUserInfo._id}
                follows={currentUserInfo.follows}
                name={userInfo.name}
                username={userInfo.username}
                imgUrl={userInfo.image}
                bio={userInfo.bio}
            />
            <div className='mt-9'>
                <Tabs defaultValue="threads" className="w-full">
                    <TabsList className="tab">
                        {profileTabs.map((tab) => (
                            <TabsTrigger key={tab.label} value={tab.value} className="tab">
                                <Image 
                                    src={tab.icon}
                                    alt={tab.label}
                                    width={24}
                                    height={24}
                                    className="object-contain"
                                />
                                <p className='max-sm:hidden'>{tab.label}</p>

                                {tab.label === 'Threads' && (
                                    <p className="ml-1 rounded-sm bg-light-4 px-2 py-1 !text-tiny-medium text-light-2">
                                    {userInfo?.threads?.length}
                                    </p>
                                )}
                            </TabsTrigger>
                        ))}
                    </TabsList>
                    {profileTabs.map((tab) => (
                        <TabsContent key={`content-${tab.label}`} value={tab.value} className="w-full text-light-1">
                            {/* @ts-ignore ignores the error*/} 
                            <ThreadsTab 
                                currentUserId={loggedInUser.id}
                                currentUserInfoID={JSON.stringify(userInfo._id) || ""}
                                accountId={userInfo.id}
                                accountType="User"
                            />
                            
                        </TabsContent>
                    ))}
                </Tabs>
            </div>
        </section>

        
    )
}

export default Page;