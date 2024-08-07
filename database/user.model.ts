import { Schema, Document, models, model } from "mongoose";

export interface IUser extends Document {
    clerkId: string;
    name: string;
    username: string;
    email: string;
    password?: string;
    bio?: string;
    picture?: string;
    location?: string;
    portfolioWebsite?: string;
    reputation?: number;
    saved: Schema.Types.ObjectId[];
    joinedAt: Date;
}

const UserSchema = new Schema({
    clerkId: { type: String, required: true },
    name: { type: String, required: true },
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: String,
    bio: String,
    picture: String,
    location: String,
    portfolioWebsite: String,
    reputation: { type: Number, default: 0 },
    saved: [{ type: Schema.Types.ObjectId, ref: "Question" }],
    joinedAt: { type: Date, default: Date.now() },
});

UserSchema.index({ reputation: 1 });

const User = models.User || model("User", UserSchema);

export default User;
