"use client"; // Needed for all forms to run code on client side

import * as z from "zod";
// Import form itself
import { useForm } from "react-hook-form";
// Import form fields
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
  } from "@/components/ui/form";
// Import form button
import { Button } from "@/components/ui/button";
// Import form input
import { Input } from "@/components/ui/input";
// Import Zod for form validation
import { zodResolver } from "@hookform/resolvers/zod";
import { usePathname, useRouter } from "next/navigation";

import { CommentValidation } from "@/lib/validations/thread";
import Image from "next/image";
import { addCommentToThread } from "@/lib/actions/thread.actions";
//import { createThread } from "@/lib/actions/thread.actions";

interface Props {
    threadId: string;
    currentuserImg: string;
    currentUserId: string;
}

const Comment = ({ threadId, currentuserImg, currentUserId } : Props) => {
    const router = useRouter();
    const pathname = usePathname();
  
    const form = useForm({
      resolver: zodResolver(CommentValidation),
      defaultValues: {
        thread: '',
      },
    });

    const onSubmit = async (values: z.infer<typeof CommentValidation>) => {
        // Pass in values:
        //  threadId: current thread id
        //  values.thread: comment text
        //  JSON.parse(currentUserId): author
        // pathname: current url
        await addCommentToThread(threadId, values.thread, JSON.parse(currentUserId), pathname); 
        router.refresh()
        // Clear and reset the form
        form.reset();
    }


    return (
        <Form {...form}>
            <form 
                onSubmit={form.handleSubmit(onSubmit)}
                className="comment-form"
            >
                <FormField
                control={form.control}
                name="thread"
                render={({ field }) => (
                <FormItem className='flex gap-3 items-center w-full'>
                    <FormLabel>
                        <Image 
                        src={currentuserImg}
                        alt="Profile Image"
                        width={48}
                        height={48}
                        className="rounded-full object-cover"/>
                    </FormLabel>
                    <FormControl className='border-none bg-transparent'>
                        <Input
                        type="text"
                        placeholder="Comment..."
                        className="no-focus text-light-1 outline-none"
                        {...field}
                        />
                    </FormControl>
                </FormItem>
                )}
            />

            <Button type='submit' className="comment-form_btn">
                Reply
            </Button>
            </form>
        </Form>
    )
}

export default Comment;