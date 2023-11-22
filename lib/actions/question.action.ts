"use server";

import Question from "@/database/question.model";
import { connectToDatabase } from "../mongoose";
import Tag from "@/database/tag.model";
import {
    CreateQuestionParams,
    DeleteQuestionParams,
    EditQuestionParams,
    GetQuestionByIdParams,
    GetQuestionsParams,
    QuestionVoteParams,
} from "./shared.types";
import User from "@/database/user.model";
import { revalidatePath } from "next/cache";
import Answer from "@/database/answer.model";
import Interaction from "@/database/interaction.model";
import { FilterQuery } from "mongoose";

export async function getQuestions(params: GetQuestionsParams) {
    try {
        connectToDatabase();

        const { searchQuery, filter, page = 1, pageSize = 10 } = params;

        const skipAmount = (page - 1) * pageSize;

        const query: FilterQuery<typeof Question> = {};

        if (searchQuery) {
            query.$or = [
                { title: { $regex: new RegExp(searchQuery, "i") } },
                { content: { $regex: new RegExp(searchQuery, "i") } },
            ];
        }

        let sortOptions = {};

        switch (filter) {
            case "newest":
                sortOptions = { createdAt: -1 };
                break;

            case "frequent":
                sortOptions = { views: -1 };
                break;

            case "unanswered":
                query.answers = { $size: 0 };
                break;

            default:
                break;
        }

        const questions = await Question.find(query)
            .populate({ path: "tags", model: Tag })
            .populate({ path: "author", model: User })
            .skip(skipAmount)
            .limit(pageSize)
            .sort(sortOptions);

        const totalQuestions = await Question.countDocuments(query);

        const isNext = totalQuestions > skipAmount + questions.length;

        return { questions, isNext };
    } catch (err) {
        console.log(err);
        throw err;
    }
}

export async function getQuestionById(params: GetQuestionByIdParams) {
    try {
        connectToDatabase();

        const { questionId } = params;

        const question = await Question.findById(questionId)
            .populate({ path: "tags", model: Tag, select: "_id name" })
            .populate({
                path: "author",
                model: User,
                select: "_id name clerkId picture",
            });

        return question;
    } catch (err) {
        console.log(err);
        throw err;
    }
}

export async function createQuestion(params: CreateQuestionParams) {
    try {
        connectToDatabase();
        const { title, content, tags, author, path } = params;

        const question = await Question.create({
            title,
            content,
            author,
        });

        const tagDocuments = [];

        // For Each of the tags , push the question Id , in them , then get the tag Id's
        for (const tag of tags) {
            const existingTag = await Tag.findOneAndUpdate(
                {
                    name: { $regex: new RegExp(`^${tag}$`, "i") },
                },
                {
                    $setOnInsert: { name: tag },
                    $push: { questions: question._id },
                },
                { upsert: true, new: true },
            );

            tagDocuments.push(existingTag._id);
        }

        await Question.findByIdAndUpdate(question._id, {
            $push: { tags: { $each: tagDocuments } },
        });

        // creating An interaction record for the user's ask question
        await Interaction.create({
            user: author,
            action: "ask_question",
            question: question._id,
            tags: tagDocuments,
        });

        // +5 reputation for creating a question
        await User.findByIdAndUpdate(author, { $inc: { reputation: 5 } });

        revalidatePath(path);
    } catch (err) {
        console.log(err);
        throw err;
    }
}

export async function upvoteQuestion(params: QuestionVoteParams) {
    try {
        connectToDatabase();

        const { questionId, userId, hasdownVoted, hasupVoted, path } = params;

        let updateQuery = {};

        if (hasupVoted) {
            updateQuery = { $pull: { upvotes: userId } };
        } else if (hasdownVoted) {
            updateQuery = {
                $pull: { downvotes: userId },
                $push: { upvotes: userId },
            };
        } else {
            updateQuery = { $addToSet: { upvotes: userId } };
        }

        const question = await Question.findByIdAndUpdate(
            questionId,
            updateQuery,
            { new: true },
        );

        if (!question) throw new Error("Question not found");

        //  1. Increment authro's reputation by 1/-1 for upvoting and revoking an upvote

        await User.findByIdAndUpdate(userId, {
            $inc: { reputation: hasupVoted ? -1 : 1 },
        });

        // +10/-10 receiving an upvote or downvote

        await User.findByIdAndUpdate(question.author, {
            $inc: { reputation: hasupVoted ? -10 : 10 },
        });

        revalidatePath(path);
    } catch (err) {
        console.log(err);
        throw err;
    }
}

export async function downvoteQuestion(params: QuestionVoteParams) {
    try {
        connectToDatabase();

        const { questionId, userId, hasdownVoted, hasupVoted, path } = params;

        let updateQuery = {};

        if (hasdownVoted) {
            updateQuery = { $pull: { downvotes: userId } };
        } else if (hasupVoted) {
            updateQuery = {
                $pull: { upvotes: userId },
                $push: { downvotes: userId },
            };
        } else {
            updateQuery = { $addToSet: { downvotes: userId } };
        }

        const question = await Question.findByIdAndUpdate(
            questionId,
            updateQuery,
            { new: true },
        );

        if (!question) throw new Error("Question not found");

        //  1. Increment authro's reputation

        await User.findByIdAndUpdate(userId, {
            $inc: { reputation: hasupVoted ? -2 : 2 },
        });

        await User.findByIdAndUpdate(question.author, {
            $inc: { reputation: hasupVoted ? -10 : 10 },
        });

        revalidatePath(path);
    } catch (err) {
        console.log(err);
        throw err;
    }
}

export async function deleteQuestion(params: DeleteQuestionParams) {
    try {
        connectToDatabase();

        const { questionId, path } = params;

        await Question.deleteOne({ _id: questionId });
        await Answer.deleteMany({ question: questionId });
        await Interaction.deleteMany({ question: questionId });
        await Tag.updateMany(
            { questions: questionId },
            {
                $pull: { questions: questionId },
            },
        );

        revalidatePath(path);
    } catch (err) {
        console.log(err);
        throw err;
    }
}

export async function editQuestion(params: EditQuestionParams) {
    try {
        connectToDatabase();

        const { questionId, title, content, path } = params;

        const question = await Question.findById(questionId).populate("tags");

        if (!question) {
            throw new Error("Question Not Found");
        }

        question.title = title;
        question.content = content;

        await question.save();

        revalidatePath(path);
    } catch (err) {
        console.log(err);
        throw err;
    }
}

export async function getHotQuestions() {
    try {
        connectToDatabase();

        const hotQuestions = await Question.find({})
            .sort({
                views: -1,
                upvotes: -1,
            })
            .limit(5);

        return hotQuestions;
    } catch (err) {
        console.log(err);
        throw err;
    }
}

