"use server";

import User from "@/database/user.model";
import { connectToDatabase } from "../mongoose";
import {
    GetAllTagsParams,
    GetQuestionsByTagIdParams,
    GetTopInteractedTagsParams,
} from "./shared.types";
import Tag, { ITag } from "@/database/tag.model";
import { FilterQuery } from "mongoose";
import Question from "@/database/question.model";

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

export async function getQuestionsByTagId(params: GetQuestionsByTagIdParams) {
    try {
        connectToDatabase();
        const { tagId, page = 1, pageSize = 10, searchQuery } = params;

        const tagFilter: FilterQuery<ITag> = { _id: tagId };

        const tag = await Tag.findOne(tagFilter).populate({
            path: "questions",
            model: Question,
            match: searchQuery
                ? { title: { $regex: searchQuery, $options: "i" } }
                : {},
            options: {
                sort: { createdAt: -1 },
            },
            populate: [
                { path: "tags", model: Tag, select: "_id name" },
                {
                    path: "author",
                    model: User,
                    select: "_id clerkId name picture",
                },
            ],
        });

        if (!tag) {
            throw new Error("Tag not Found");
        }

        const questions = tag.questions;

        return { questions, tagTitle: tag.name };
    } catch (err) {
        console.log(err);
        throw err;
    }
}

export async function getTopPopularTags() {
    try {
        connectToDatabase();

        const popularTags = await Tag.aggregate([
            {
                $project: {
                    name: 1,
                    numberOfQuestions: { $size: "$questions" },
                },
            },
            {
                $sort: { numberOfQuestions: -1 },
            },
            {
                $limit: 5,
            },
        ]);

        return popularTags;
    } catch (err) {
        console.log(err);
        throw err;
    }
}
