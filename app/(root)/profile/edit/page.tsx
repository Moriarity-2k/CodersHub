import Profile from "@/components/forms/Profile";
import { getQuestionById } from "@/lib/actions/question.action";
import { getUserByID } from "@/lib/actions/user.action";
import { ParamsProps } from "@/types";
import { auth } from "@clerk/nextjs";
import React from "react";

const Page = async ({ params }: ParamsProps) => {
    const { userId } = auth();

    if (!userId) return null;

    const mongoUser = await getUserByID({ userId });
    const result = await getQuestionById({ questionId: params.id });

    return (
        <>
            <h1 className="h1-bold text-dark100_light900 ">Edit Profile</h1>

            <div className="mt-9">
                <Profile clerkId={userId} user={JSON.stringify(mongoUser)} />
            </div>
        </>
    );
};

export default Page;
