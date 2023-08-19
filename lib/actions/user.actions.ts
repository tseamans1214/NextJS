// Put "use server" when specifying code that should only run on the server
"use server"

import { connect } from "http2"
import { connectToDB } from "../mongoose"
import User from "../models/user.model";
import { revalidatePath } from "next/cache";
import Thread from "../models/thread.model";

// setup interface Params which is for updateUser function
//  Allows use of an object as parameter to avoid
//  mistakes of entering the incorrect order of parameters
interface Params {
    userId: string;
    username: string;
    name: string;
    bio: string;
    image: string;
    path: string;
}

// Updates user in database
//  Parameter - object with properties:
//    userId,
//    username,
//    name,
//    bio,
//    image,
//    path,
export async function updateUser({
    userId,
    username,
    name,
    bio,
    image,
    path,
    }: Params): Promise<void> {
    connectToDB();

    try {
        await User.findOneAndUpdate(
            { id: userId }, // Finds one user with given id
            { // Updates given properties
                username: username.toLowerCase(),
                name,
                bio,
                image,
                onboarded: true,
            },
            { upsert: true } // Means function will update an existing user if they exist, or insert a new one
        );

        // Revalidate data asscociated with the specfied path.
        //  Updates the cached data without waiting for the revalidation period to expire
        if (path === 'profile/edit') {
            revalidatePath(path);
        }
    } catch (error: any) {
        throw new Error(`Failed to create/update user: ${error.message}`)
    }
}

export async function fetchUser(userId: string) {
    try {
        connectToDB();

        return await User
        .findOne({ id: userId })
        // .populate({
        //     path: 'communities',
        //     model: Community
        // })
    } catch (error: any) {
        throw new Error(`Failed to fetch user: ${error.message}`);
    }
}

export async function fetchUserPosts(userId: string) {
    try {
        connectToDB()

        // Find all threads authored by the user with the given userId
        // TODO: POPULATE COMMUNITY
        const threads = await User.findOne({ id: userId })
        .populate({
            path: 'threads',
            model: Thread,
            populate: {
                path: 'children',
                model: Thread,
                populate: {
                    path: 'author',
                    model: User,
                    select: 'name image id',
                }
            }
        })
        return threads;
    } catch (error: any) {
        throw new Error(`Failed to fetch user posts: ${error.message}`);
    }
}