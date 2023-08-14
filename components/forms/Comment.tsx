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
        // await createthread({
        //     text: values.thread,
        //     author: userId,
        //     communityId: null,
        //     path: pathname,
        // });

        // // 
        router.push("/");
    }


    return (
        <Form {...form}>
            <form 
                onSubmit={form.handleSubmit(onSubmit)}
                className="mt-10 flex flex-col justify-start gap-10"
            >
                <FormField
                control={form.control}
                name="thread"
                render={({ field }) => (
                <FormItem className='flex flex-col gap-3 w-full'>
                    <FormLabel className='text-base-semibold text-light-2'>
                        Content
                    </FormLabel>
                    <FormControl className='no-focus border border-dark-4 bg-dark-3 text-light-1'>
                        <Input
                        type="text"
                        placeholder="Comment..."
                        className="no-focus text-light-1 outline-none"
                        {...field}
                        />
                    </FormControl>
                    <FormMessage />
                </FormItem>
                )}
            />

            <Button type='submit' className="bg-primary-500">
                Post Thread
            </Button>
            </form>
        </Form>
    )
}

export default Comment;