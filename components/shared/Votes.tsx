"use client";

import { downvoteAnswer, upvoteAnswer } from "@/lib/actions/answer.action";
import { viewQuestion } from "@/lib/actions/interaction.action";
import {
    downvoteQuestion,
    upvoteQuestion,
} from "@/lib/actions/question.action";
import { toggleSaveQuestion } from "@/lib/actions/user.action";
import { formatDivideNumber } from "@/lib/utils";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import React, { useEffect } from "react";
import { toast } from "../ui/use-toast";

interface Props {
    type: string;
    itemId: string;
    userId: string;
    upvotes: number;
    downvotes: number;
    hasupVoted: boolean;
    hasdownVoted: boolean;
    hasSaved?: boolean;
}

const Votes = ({
    type,
    itemId,
    userId,
    upvotes,
    downvotes,
    hasupVoted,
    hasdownVoted,
    hasSaved,
}: Props) => {
    const pathname = usePathname();
    const router = useRouter();

    const handleSave = async () => {
        await toggleSaveQuestion({
            userId: JSON.parse(userId),
            questionId: JSON.parse(itemId),
            path: pathname,
        });

        return toast({ title: "Saved to your collections successfully" });
    };

    const handleVote = async (action: string) => {
        if (!userId) {
            return toast({
                title: "Please Login !",
                description: "Only logged in users can preform this action",
            });
        }

        if (action === "upvote") {
            if (type === "Question") {
                await upvoteQuestion({
                    questionId: JSON.parse(itemId),
                    userId: JSON.parse(userId),
                    hasupVoted,
                    hasdownVoted,
                    path: pathname,
                });
            } else if (type === "Answer") {
                await upvoteAnswer({
                    answerId: JSON.parse(itemId),
                    userId: JSON.parse(userId),
                    hasupVoted,
                    hasdownVoted,
                    path: pathname,
                });
            }

            // todo: show a toast

            return toast({
                title: `${
                    !hasupVoted ? "Upvoted Successfully" : "Upvote Removed"
                }`,
                variant: !hasupVoted ? "default" : "destructive",
            });
        }

        if (action === "downvote") {
            if (type === "Question") {
                await downvoteQuestion({
                    questionId: JSON.parse(itemId),
                    userId: JSON.parse(userId),
                    hasupVoted,
                    hasdownVoted,
                    path: pathname,
                });
            } else if (type === "Answer") {
                await downvoteAnswer({
                    answerId: JSON.parse(itemId),
                    userId: JSON.parse(userId),
                    hasupVoted,
                    hasdownVoted,
                    path: pathname,
                });
            }

            // todo: show a toast
            return toast({
                title: `${
                    !hasdownVoted
                        ? "downvoted Successfully"
                        : "downvote Removed"
                }`,
                variant: !hasdownVoted ? "default" : "destructive",
            });
        }
    };

    useEffect(() => {
        viewQuestion({
            questionId: JSON.parse(itemId),
            userId: userId ? JSON.parse(userId) : undefined,
        });
    }, [itemId, userId, pathname, router]);

    return (
        <div className="flex gap-5">
            <div className="flex-center gap-2.5">
                <div className="flex-center gap-1.5">
                    <Image
                        src={
                            hasupVoted
                                ? "/assets/icons/upvoted.svg"
                                : "/assets/icons/upvote.svg"
                        }
                        alt="upvote"
                        width={18}
                        height={18}
                        className="cursor-pointer"
                        onClick={() => handleVote("upvote")}
                    />

                    <div className=" flex-center background-light700_dark400 rounded-sm min-w-[18px] p-1">
                        <p className="subtle-medium text-dark400_light900">
                            {formatDivideNumber(upvotes)}
                        </p>
                    </div>
                </div>

                <div className="flex-center gap-1.5">
                    <Image
                        src={
                            hasdownVoted
                                ? "/assets/icons/downvoted.svg"
                                : "/assets/icons/downvote.svg"
                        }
                        alt="upvote"
                        width={18}
                        height={18}
                        className="cursor-pointer"
                        onClick={() => handleVote("downvote")}
                    />

                    <div className=" flex-center background-light700_dark400 rounded-sm min-w-[18px] p-1">
                        <p className="subtle-medium text-dark400_light900">
                            {formatDivideNumber(downvotes)}
                        </p>
                    </div>
                </div>
            </div>

            {type === "Question" && (
                <Image
                    src={
                        hasSaved
                            ? "/assets/icons/star-filled.svg"
                            : "/assets/icons/star-red.svg"
                    }
                    alt="star"
                    width={18}
                    height={18}
                    className="cursor-pointer"
                    onClick={handleSave}
                />
            )}
        </div>
    );
};
export default Votes;
