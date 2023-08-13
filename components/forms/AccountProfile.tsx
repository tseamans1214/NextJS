"use client";

import * as z from "zod";
import Image from "next/image";
import { useForm } from "react-hook-form";
import { usePathname, useRouter } from "next/navigation";
import { ChangeEvent, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

import { useUploadThing } from "@/lib/uploadthing";
import { isBase64Image } from "@/lib/utils";

import { UserValidation } from "@/lib/validations/user";
import { updateUser } from "@/lib/actions/user.actions";


interface Props {
    user: {
        id: string;
        objectId: string;
        username: string;
        name: string;
        bio: string;
        image: string;
    };
    btnTitle: string;
}

const AccountProfile = ({ user, btnTitle }: Props) => {
    const router = useRouter();
    const pathname = usePathname();
    const { startUpload } = useUploadThing("media");
  
    const [files, setFiles] = useState<File[]>([]);
  
    const form = useForm<z.infer<typeof UserValidation>>({
      resolver: zodResolver(UserValidation),
      defaultValues: {
        profile_photo: user?.image ? user.image : "",
        name: user?.name ? user.name : "",
        username: user?.username ? user.username : "",
        bio: user?.bio ? user.bio : "",
      },
    });

  const handleImage = (e: ChangeEvent<HTMLInputElement>, fieldChange: (value: string) => void) => {
    e.preventDefault(); // Prevents browser from preloading

    const fileReader = new FileReader();

    // if files is given and isDefaultNamespace.length is greater than 0 (array so if it contains a value)
    if (e.target.files && e.target.isDefaultNamespace.length > 0) {
        const file = e.target.files[0];

        setFiles(Array.from(e.target.files));

        // if file given is not an image
        if (!file.type.includes('image')) return;
        
        // On file reader load, it sets the fieldChange value as the url of the image given
        fileReader.onload = async (event) => {
            const imageDataUrl = event.target?.result?.toString() || '';

            fieldChange(imageDataUrl);
        }

        fileReader.readAsDataURL(file);
    }
  };

  // 2. Define a submit handler.
  const onSubmit = async (values: z.infer<typeof UserValidation>) => {
    // blob is term for photo 
    const blob = values.profile_photo;

    const hasImageChanged = isBase64Image(blob);

    // If user uploaded a different image
    if (hasImageChanged) {
        // Upload the image using startUpload function in api folder (see uploadthing.com for docs)
        const imgRes = await startUpload(files);

        // Check if the image exists
        if (imgRes && imgRes[0].fileUrl) {
            values.profile_photo = imgRes[0].fileUrl;
        }
    }
    // Update user profile
    // Parameters
    //  object with properties:
        //  userId
        //  username
        //  name
        //  bio
        //  image
        //  path
    await updateUser({
        userId: user.id,
        username: values.username,
        name: values.name,
        bio: values.bio,
        image: values.profile_photo,
        path: pathname,
    });

    // If the pathname is edit profile page
    if (pathname === '/profile/edit') {
        // Go back to previous age
        router.back();
    } else {
        // Go back to homepage
        router.push('/');
    }
  };
    return (
        <Form {...form}>
            <form 
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex flex-col justify-start gap-10">
            {/* profile photo input */}
            <FormField
                control={form.control}
                name="profile_photo"
                render={({ field }) => (
                <FormItem className='flex items-center gap-4'>
                    <FormLabel className='account-form_image-label'>
                        {field.value ?(
                            <Image 
                                src={field.value}
                                alt="profile phto"
                                width={96}
                                height={96}
                                priority
                                className="rounded-full object-contain"
                            />
                        ) : (
                            <Image 
                                src="/assets/profile.svg"
                                alt="profile phto"
                                width={24}
                                height={24}
                                className="object-contain"
                            />
                        )}
                    </FormLabel>
                    <FormControl className='flex-1 textbase-semibold text-gray-200'>
                        <Input 
                        type="file"
                        accept='image/*'
                        placeholder='Upload a photo'
                        className='account-form_image-input'
                        onChange={(e) => handleImage(e, field.onChange)}
                        />
                    </FormControl>
                    <FormMessage />
                </FormItem>
                )}
            />
            {/* Name input */}
            <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                <FormItem className='flex flex-col gap-3 w-full'>
                    <FormLabel className='text-base-semibold text-light-2'>
                        Name
                    </FormLabel>
                    <FormControl className=''>
                        <Input
                        type="text"
                        className='account-form_input no-focus'
                        {...field}
                        />
                    </FormControl>
                    <FormMessage />
                </FormItem>
                )}
            />
            {/* Username input */}
            <FormField
                control={form.control}
                name="username"
                render={({ field }) => (
                <FormItem className='flex flex-col gap-3 w-full'>
                    <FormLabel className='text-base-semibold text-light-2'>
                        Username
                    </FormLabel>
                    <FormControl className=''>
                        <Input
                        type="text"
                        className='account-form_input no-focus'
                        {...field}
                        />
                    </FormControl>
                    <FormMessage />
                </FormItem>
                )}
            />
            {/* Bio input */}
            <FormField
                control={form.control}
                name="bio"
                render={({ field }) => (
                    <FormItem className='flex flex-col gap-3 w-full'>
                    <FormLabel className='text-base-semibold text-light-2'>
                        Bio
                    </FormLabel>
                    <FormControl className=''>
                        <Textarea
                        rows={10}
                        className='account-form_input no-focus'
                        {...field}
                        />
                    </FormControl>
                    <FormMessage />
                </FormItem>
                )}
            />
            <Button type="submit" className='bg-primary-500'>Submit</Button>
            </form>
        </Form>
    );
};

export default AccountProfile;