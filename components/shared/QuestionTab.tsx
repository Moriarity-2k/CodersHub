import { getUserQuestions } from "@/lib/actions/user.action";
import { SearchParamsProps } from "@/types";
import React from "react";
import QuestionCard from "../cards/QuestionCard";
import Pagination from "./Pagination";

interface Props extends SearchParamsProps {
    userId: string;
    clerkId?: string | null;
}

const QuestionTab = async ({ searchParams, userId, clerkId }: Props) => {
    const result = await getUserQuestions({
        userId,
        page: searchParams.page ? +searchParams.page : 1,
    });

    return (
        <>
            {result.questions.map((item) => (
                <QuestionCard
                    key={item._id}
                    _id={item._id}
                    clerkId={clerkId || undefined}
                    title={item.title}
                    tags={item.tags}
                    author={item.author}
                    upvotes={item.upvotes}
                    views={item.views}
                    answers={item.answers}
                    createdAt={item.createdAt}
                />
            ))}

            <div className="mt-10">
                <Pagination
                    pageNumber={searchParams?.page ? +searchParams.page : 1}
                    isNext={result.isNext}
                />
            </div>
        </>
    );
};

export default QuestionTab;
