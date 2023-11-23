import Link from "next/link";
import React from "react";
import RenderTag from "@/components/shared/RenderTag";
import Metric from "../shared/Metric";
import { formatDivideNumber, getTimeStamp } from "@/lib/utils";
import { SignedIn } from "@clerk/nextjs";
import EditDeleteAction from "../shared/EditDeleteAction";
// import { ObjectId, Schema } from "mongoose";

interface Props {
    _id: any;
    title: string;
    // tags: { _id: string; name: string }[];
    tags: any;
    // author: {
    //     _id: any;
    //     name: string;
    //     picture: string;
    //     clerkId: string;
    // };
    author: any;
    answers: Array<object>;
    createdAt: Date;
    // upvotes: string[];
    upvotes: any;
    views: number;
    clerkId?: string;
}

const QuestionCard = ({
    _id,
    clerkId,
    title,
    tags,
    author,
    views,
    answers,
    createdAt,
    upvotes,
}: Props) => {
    // const showActionButtons = clerkId && clerkId === author._id
    const showActionButtons = clerkId && clerkId === author.clerkId;
    return (
        <div className="card-wrapper rounded-[10px] p-9 sm:px-11">
            <div className="flex flex-col-reverse items-start justify-between gap-5 sm:flex-row">
                <div>
                    <span className="subtle-regular text-dark400_light700 line-clamp-1 flex sm:hidden">
                        {getTimeStamp(createdAt)}
                    </span>
                    <Link href={`/question/${_id}`}>
                        <h3 className="sm:h3-semibold base-semibold text-dark200_light900 line-clamp-1 flex-1">
                            {title}
                        </h3>
                    </Link>
                </div>

                <SignedIn>
                    {showActionButtons && (
                        <EditDeleteAction
                            type="Question"
                            itemId={JSON.stringify(_id)}
                        />
                    )}
                </SignedIn>
            </div>

            {/* Question tags */}
            <div className="mt-3.5 flex flex-wrap gap-2">
                {tags.map((tag : any) => (
                    <RenderTag key={tag._id} _id={tag._id} name={tag.name} />
                ))}
            </div>

            {/* Details */}
            <div className="flex-between mt-6 w-full flex-wrap gap-3">
                <Metric
                    imgUrl={author.picture}
                    alt="user"
                    title={`- asked ${getTimeStamp(createdAt)}`}
                    // href={`/profile/${author._id}`}
                    href={`/profile/${JSON.stringify(author._id)}`}
                    isAuthor
                    textStyles="body-medium text-dark400_light700"
                    value={author.name}
                />

                <div className="flex items-center gap-3 max-sm:flex-wrap max-sm:justify-start">
                    <Metric
                        imgUrl="/assets/icons/like.svg"
                        alt="Upvotes"
                        title=" Votes"
                        textStyles="small-medium text-dark400_light800"
                        value={formatDivideNumber(upvotes.length)}
                    />

                    <Metric
                        imgUrl="/assets/icons/message.svg"
                        alt="message"
                        title=" Answers"
                        textStyles="small-medium text   -dark400_light800"
                        value={formatDivideNumber(answers.length)}
                    />

                    <Metric
                        imgUrl="/assets/icons/eye.svg"
                        alt="Eye"
                        title=" Views"
                        textStyles="small-medium text-dark400_light800"
                        value={formatDivideNumber(views)}
                    />
                </div>
            </div>
        </div>
    );
};

export default QuestionCard;
