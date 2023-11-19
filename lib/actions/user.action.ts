"use server";

import { connectToDatabase } from "../mongoose";
import User from "@/database/user.model";
import {
  CreateUserParams,
  DeleteUserParams,
  GetUserByIdParams,
  UpdateUserParams,
} from "./shared.types";
import { revalidatePath } from "next/cache";
import path from "path";
import Question from "@/database/question.model";

export async function getUserByID(params: GetUserByIdParams) {
  try {
    connectToDatabase();
    const { userId } = params;

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

      if(!user) {
        throw new Error('User Not Found');
      }

      // If there is a user , then delete -> user , [question , aswers , likes ...] by that user;

      const userQuestionIds = await Question.find({author : user._id}).distinct('_id');

      await Question.deleteMany({author : user._id});

      const deleteUser = await User.findByIdAndDelete(user._id)

      return deleteUser
  
    } catch (err) {
      console.log(err);
      throw err;
    }
  }


