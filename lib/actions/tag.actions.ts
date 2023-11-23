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

        const { searchQuery, filter, page = 1, pageSize = 10 } = params;

        const query: FilterQuery<typeof Tag> = {};

        if (searchQuery) {
            query.$or = [{ name: { $regex: new RegExp(searchQuery, "i") } }];
        }

        const skipAmount = (page - 1) * pageSize;

        let sortOptions = {};

        switch (filter) {
            case "popular":
                sortOptions = { questions: -1 };
                break;
            case "recent":
                sortOptions = { createdAt: -1 };
                break;
            case "name":
                sortOptions = { name: 1 };
                break;
            case "old":
                sortOptions = { createdAt: 1 };
                break;
            default:
                break;
        }

        const tags = await Tag.find(query)
            .sort(sortOptions)
            .skip(skipAmount)
            .limit(pageSize);

        const totalTags = await Tag.countDocuments(query);
        const isNext = totalTags > skipAmount + tags.length;

        return { tags, isNext };
    } catch (err) {
        console.log(err);
        throw err;
    }
}

export async function getQuestionsByTagId(params: GetQuestionsByTagIdParams) {
    try {
        connectToDatabase();
        const { tagId, page = 1, pageSize = 10, searchQuery } = params;

        const skipAmount = (page - 1) * pageSize;

        const tagFilter: FilterQuery<ITag> = { _id: tagId };

        const tag = await Tag.findOne(tagFilter).populate({
            path: "questions",
            model: Question,
            match: searchQuery
                ? { title: { $regex: searchQuery, $options: "i" } }
                : {},
            options: {
                sort: { createdAt: -1 },
                skip: skipAmount,
                limit: pageSize + 1,
            },
            populate: [
                { path: "tags", model: Tag, select: "_id name" },
                {
                    path: "author",
                    model: User,
                    select: "_id clerkId name picture",
                    // select: "clerkId name picture -_id",
                },
            ],
        });

        if (!tag) {
            throw new Error("Tag not Found");
        }

        const isNext = tag.questions.length > pageSize;

        const questions = tag.questions;

        console.log(questions)

        return { questions, tagTitle: tag.name, isNext };
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
