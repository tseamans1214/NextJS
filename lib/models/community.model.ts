import mongoose from "mongoose";

const communitySchema = new mongoose.Schema({
  id: {
    type: String,
    required: true,
  },
  username: {
    type: String,
    unique: true,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  image: String,
  bio: String,
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Thread",
  },
  threads: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Thread",
    },
  ],
  members: [
    {
        tyype: mongoose.Schema.Types.ObjectId,
        ref: "User",
    },
  ],
});

// First checks if the model of the user exist on the Database,
//  if not, it creates one using the userSchema
const Community = mongoose.models.User || mongoose.model("Community", communitySchema);

export default Community;