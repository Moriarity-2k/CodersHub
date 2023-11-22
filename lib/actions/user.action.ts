"use server";

import { FilterQuery } from "mongoose";
import { connectToDatabase } from "../mongoose";
import User from "@/database/user.model";
import {
    CreateUserParams,
    DeleteUserParams,
    GetAllUsersParams,
    GetSavedQuestionsParams,
    GetUserByIdParams,
    GetUserStatsParams,
    ToggleSaveQuestionParams,
    UpdateUserParams,
} from "./shared.types";
import { revalidatePath } from "next/cache";
// import path from "path";
import Question from "@/database/question.model";
import Tag from "@/database/tag.model";
import Answer from "@/database/answer.model";
import { BadgeCriteriaType } from "@/types";
import { assignBadge } from "../utils";

export async function getUserByID(params: GetUserByIdParams) {
    try {
        connectToDatabase();
        const { userId } = params;

        console.log(userId);

        const user = await User.findOne({ clerkId: userId });

        return user;
    } catch (err) {
        console.log(err);
        throw err;
    }
}
export async function createUser(userData: CreateUserParams) {
    try {
        connectToDatabase();

        const newUser = await User.create(userData);

        return newUser;
    } catch (err) {
        console.log(err);
        throw err;
    }
}

export async function updateUser(params: UpdateUserParams) {
    try {
        connectToDatabase();

        const { clerkId, updateData, path } = params;

        await User.findOneAndUpdate({ clerkId }, updateData, {
            new: true,
        });

        revalidatePath(path);
    } catch (err) {
        console.log(err);
        throw err;
    }
}

export async function deleteUser(params: DeleteUserParams) {
    try {
        connectToDatabase();

        const { clerkId } = params;

        const user = await User.findOneAndDelete({ clerkId });

        if (!user) {
            throw new Error("User Not Found");
        }

        // If there is a user , then delete -> user , [question , aswers , likes ...] by that user;

        const userQuestionIds = await Question.find({
            author: user._id,
        }).distinct("_id");

        await Question.deleteMany({ author: user._id });

        const deletedUser = await User.findByIdAndDelete(user._id);

        return deletedUser;
    } catch (err) {
        console.log(err);
        throw err;
    }
}

export async function getAllUsers(params: GetAllUsersParams) {
    try {
        connectToDatabase();

        // const { page = 1, pageSize = 10, searchQuery, filter } = params;

        const { searchQuery, filter, page = 1, pageSize = 10 } = params;

        const skipAmount = (page - 1) * pageSize;

        const query: FilterQuery<typeof User> = {};

        // i is for case sensitive search in DB
        if (searchQuery) {
            query.$or = [
                { name: { $regex: new RegExp(searchQuery, "i") } },
                { username: { $regex: new RegExp(searchQuery, "i") } },
            ];
        }

        let sortOptions = {};

        switch (filter) {
            case "new_users":
                sortOptions = { joinedAt: -1 };
                break;
            case "old_users":
                sortOptions = { joinedAt: 1 };
                break;
            case "top_contributors":
                sortOptions = { reputation: -1 };
                break;
            default:
                break;
        }

        const users = await User.find(query)
            .sort(sortOptions)
            .skip(skipAmount)
            .limit(pageSize);

        const totalUsers = await User.countDocuments(query);
        const isNext = totalUsers > skipAmount + users.length;

        return { users, isNext };
    } catch (err) {
        console.log(err);
        throw err;
    }
}

export async function toggleSaveQuestion(params: ToggleSaveQuestionParams) {
    try {
        connectToDatabase();
        const { userId, questionId, path } = params;

        const user = await User.findById(userId);

        if (!user) {
            throw new Error("User not Found");
        }

        const isQuestionSaved = user?.saved?.includes(questionId);

        if (isQuestionSaved) {
            await User.findByIdAndUpdate(
                userId,
                { $pull: { saved: questionId } },
                { new: true },
            );
        } else {
            await User.findByIdAndUpdate(
                userId,
                { $addToSet: { saved: questionId } },
                { new: true },
            );
        }

        revalidatePath(path);
    } catch (err) {
        console.log(err);
        throw err;
    }
}

export async function getSavedQuestion(params: GetSavedQuestionsParams) {
    try {
        connectToDatabase();
        const {
            clerkId,
            page = 1,
            pageSize = 10,
            filter,
            searchQuery,
        } = params;

        const skipAmount = (page - 1) * pageSize;

        const query: FilterQuery<typeof Question> = searchQuery
            ? { title: { $regex: new RegExp(searchQuery, "i") } }
            : {};

        let sortOptions = {};

        switch (filter) {
            case "most_recent":
                sortOptions = { createdAt: -1 };
                break;
            case "oldest":
                sortOptions = { createdAt: 1 };
                break;
            case "most_voted":
                sortOptions = { upvotes: -1 };
                break;
            case "most_viewed":
                sortOptions = { views: -1 };
                break;
            case "most_answered":
                sortOptions = { answers: -1 };
                break;

            default:
                break;
        }

        const user = await User.findOne({ clerkId }).populate({
            path: "saved",
            match: query,
            options: {
                sort: sortOptions,
                skip: skipAmount,
                limit: pageSize + 1,
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

        if (!user) {
            throw new Error("User not Found");
        }

        const isNext = user.saved.length > pageSize;

        const savedQuestions = user.saved;

        return { questions: savedQuestions, isNext };
    } catch (err) {
        console.log(err);
        throw err;
    }
}

export async function getUserInfo(params: GetUserByIdParams) {
    try {
        connectToDatabase();

        const { userId } = params;

        const user = await User.findOne({ clerkId: userId });

        if (!user) {
            throw new Error("User not Found");
        }

        const totalQuestions = await Question.countDocuments({
            author: user._id,
        });
        const totalAnswers = await Answer.countDocuments({
            author: user._id,
        });

        const [questionUpvotes] = await Question.aggregate([
            { $match: { author: user._id } },
            {
                $project: {
                    _id: 0,
                    upvotes: { $size: "$upvotes" },
                },
            },
            {
                $group: {
                    _id: null,
                    totalUpvotes: { $sum: "$upvotes" },
                },
            },
        ]);

        const [answerUpvotes] = await Answer.aggregate([
            { $match: { author: user._id } },
            {
                $project: {
                    _id: 0,
                    upvotes: { $size: "$upvotes" },
                },
            },
            {
                $group: {
                    _id: null,
                    totalUpvotes: { $sum: "$upvotes" },
                },
            },
        ]);

        const [questionViews] = await Answer.aggregate([
            { $match: { author: user._id } },
            {
                $group: {
                    _id: null,
                    totalUpvotes: { $sum: "$views" },
                },
            },
        ]);

        const criteria = [
            {
                type: "QUESTION_COUNT" as BadgeCriteriaType,
                count: totalQuestions,
            },
            { type: "ANSWER_COUNT" as BadgeCriteriaType, count: totalAnswers },
            {
                type: "QUESTION_UPVOTES" as BadgeCriteriaType,
                count: questionUpvotes?.totalUpvotes || 0,
            },
            {
                type: "ANSWER_UPVOTES" as BadgeCriteriaType,
                count: answerUpvotes?.totalUpvotes || 0,
            },
            {
                type: "TOTAL_VIEWS" as BadgeCriteriaType,
                count: questionViews?.totalViews || 0,
            },
        ];

        const badgeCounts = assignBadge({ criteria });

        return {
            user,
            totalQuestions,
            totalAnswers,
            badgeCounts,
            reputation: user.reputation,
        };
    } catch (err) {
        console.log(err);
        throw err;
    }
}

export async function getUserQuestions(params: GetUserStatsParams) {
    try {
        connectToDatabase();

        const { userId, page = 1, pageSize = 10 } = params;

        const skipAmount = (page - 1) * pageSize;

        const totalQuestions = await Question.countDocuments({
            author: userId,
        });

        const userQuestions = await Question.find({ author: userId })
            .sort({
                createdAt: -1,
                views: -1,
                upvotes: -1,
            })
            .skip(skipAmount)
            .limit(pageSize)
            .populate("tags", "_id name")
            .populate("author", "_id name clerkId picture");

        const isNext = totalQuestions > skipAmount + userQuestions.length;

        return { totalQuestions, questions: userQuestions, isNext };
    } catch (err) {
        console.log(err);
        throw err;
    }
}

export async function getUserAnswers(params: GetUserStatsParams) {
    try {
        connectToDatabase();

        const { userId, page = 1, pageSize = 10 } = params;

        const skipAmount = (page - 1) * pageSize;

        const totalAnswers = await Answer.countDocuments({
            author: userId,
        });

        const userAnswers = await Answer.find({ author: userId })
            .sort({
                upvotes: -1,
            })
            .skip(skipAmount)
            .limit(pageSize)
            .populate("question", "_id title")
            .populate("author", "_id name clerkId picture");

        const isNext = totalAnswers > skipAmount + userAnswers.length;

        return { totalAnswers, answers: userAnswers, isNext };
    } catch (err) {
        console.log(err);
        throw err;
    }
}
