// Put "use server" when specifying code that should only run on the server
"use server"

import { connect } from "http2"
import { connectToDB } from "../mongoose"
import User from "../models/user.model";
import { revalidatePath } from "next/cache";
import Thread from "../models/thread.model";
import { getJsPageSizeInKb } from "next/dist/build/utils";
import { FilterQuery, SortOrder } from "mongoose";
import { Sedgwick_Ave_Display } from "next/font/google";

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

export async function fetchUsers({
    userId,
    searchString = "",
    pageNumber = 1,
    pageSize = 20,
    sortBy = "desc",
} : {
    userId: string;
    searchString?: string;
    pageNumber?: number;
    pageSize?: number; // "?" means optional
    sortBy?: SortOrder
}) {
    try {
        connectToDB();

        const skipAmount = (pageNumber - 1 ) * pageSize;

        const regex = new RegExp(searchString, "i");

        // Create the query
        //  Query all the users except the logged in user
        const query: FilterQuery<typeof User> = {
            id: {$ne: userId } //$ne = not equal
        }

        //  Check that the search string is not empty
        if (searchString.trim() !== '') {
            // Add filter the query to only show users that have 
            //  a username or name that contain the search string
            query.$or = [
                { username: { $regex: regex } },
                { name: { $regex: regex } }
            ]
        }

        // Create sort options for query using sortBy parameter
        const sortOptions = { createdAt: sortBy };

        // Create get users query using the created query with sort, skip, and limit options
        const usersQuery = User.find(query)
            .sort(sortOptions)
            .skip(skipAmount)
            .limit(pageSize)
        
        // Get the total number of users found it query
        const totalUsersCount = await User.countDocuments(query);

        // Execute the query to get the list of users
        const users = await usersQuery.exec();

        // Check if there is going to be 2nd page or more of users based on how many returned
        const isNext = totalUsersCount > skipAmount + users.length;

        return { users, isNext };
    } catch (error: any) {
        throw new Error(`Failed to fetch users: ${error.message}`);
    }
}