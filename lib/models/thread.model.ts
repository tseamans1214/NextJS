import mongoose from "mongoose";
import { string } from "zod";

const threadSchema = new mongoose.Schema({
    text: { 
        type: String,
        required: true,
    },
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    community: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Community",
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    parentId: { // ID of parent Thread
        type: String
    },
    userLikes: [
        {
            //type: String
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
        }
    ],
    children: [ // Can have an array of children Threads (Comments)
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Thread",
        },
    ],
});

// First checks if the model of the user exist on the Database,
//  if not, it creates one using the threadSchema
const Thread = mongoose.models.Thread || mongoose.model("Thread", threadSchema);

export default Thread;

// Thread is setup to be able to support multilevel comments
// Thread1 (Thread)
//  -> Comment1 (Thread)
//  -> Comment2 (Thread)
//     -> Comment1 on Comment2 (Thread)