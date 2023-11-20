"use server";

import User from "@/database/user.model";
import { connectToDatabase } from "../mongoose";
import { GetAllTagsParams, GetTopInteractedTagsParams } from "./shared.types";
import Tag from "@/database/tag.model";

export async function getTopInteractedTags(params: GetTopInteractedTagsParams) {
    try {
        connectToDatabase();

        const { userId, limit = 3 } = params;

        const user = await User.findById(userId);

        if (!user) throw new Error("User Not Found");

        // finding the tags , of the all questions asked/answered

        // By a new DB model , interaction

        return [{ _id: "1", name: "reactJs" }];
    } catch (err) {
        console.log(err);
        throw err;
    }
}

export async function getAllTags(params: GetAllTagsParams) {
    try {
        connectToDatabase();

        const tags = await Tag.find({});

        return { tags };
    } catch (err) {
        console.log(err);
        throw err;
    }
}
