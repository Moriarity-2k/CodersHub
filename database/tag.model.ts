import { Schema, Document, models, model } from "mongoose";

export interface ITag extends Document {
    name: string;
    description: string;
    questions: Schema.Types.ObjectId[];
    followers: Schema.Types.ObjectId[];
    createdAt: Date;
}

const TagSchema = new Schema({
    name: { type: String, required: true, unique: true },
    description: { type: String, required: true },
    questions: [{ type: Schema.Types.ObjectId, ref: "Question" }],
    followers: [{ type: Schema.Types.ObjectId, ref: "User" }],
    createdAt: {
        type: Date,
        default: Date.now(),
    },
});

TagSchema.index({ followers: 1 });
TagSchema.index({ questions: 1 });
TagSchema.index({ createdAt: -1, followers: 1 });
TagSchema.index({ name: 1 }, { unique: true });

const Tag = models.Tag || model("Tag", TagSchema);

export default Tag;
