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

        const { searchQuery } = params;

        const query: FilterQuery<typeof User> = {};

        // i is for case sensitive search in DB
        if (searchQuery) {
            query.$or = [
                { name: { $regex: new RegExp(searchQuery, "i") } },
                { username: { $regex: new RegExp(searchQuery, "i") } },
            ]
        }

        const users = await User.find(query).sort({ createdAt: -1 });

        return { users };
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

        const query: FilterQuery<typeof Question> = searchQuery
            ? { title: { $regex: new RegExp(searchQuery, "i") } }
            : {};

        const user = await User.findOne({ clerkId }).populate({
            path: "saved",
            match: query,
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

        if (!user) {
            throw new Error("User not Found");
        }

        const savedQuestions = user.saved;

        return { questions: savedQuestions };
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

        return {
            user,
            totalQuestions,
            totalAnswers,
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

        const totalQuestions = await Question.countDocuments({
            author: userId,
        });

        const userQuestions = await Question.find({ author: userId })
            .sort({
                views: -1,
                upvotes: -1,
            })
            .populate("tags", "_id name")
            .populate("author", "_id name clerkId picture");

        return { totalQuestions, questions: userQuestions };
    } catch (err) {
        console.log(err);
        throw err;
    }
}

export async function getUserAnswers(params: GetUserStatsParams) {
    try {
        connectToDatabase();

        const { userId, page = 1, pageSize = 10 } = params;

        const totalAnswers = await Answer.countDocuments({
            author: userId,
        });

        const userAnswers = await Answer.find({ author: userId })
            .sort({
                upvotes: -1,
            })
            .populate("question", "_id title")
            .populate("author", "_id name clerkId picture");

        return { totalAnswers, answers: userAnswers };
    } catch (err) {
        console.log(err);
        throw err;
    }
}
