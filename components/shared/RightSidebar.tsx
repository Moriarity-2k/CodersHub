import Image from "next/image";
import Link from "next/link";
import React from "react";
import RenderTag from "./RenderTag";
import { getHotQuestions } from "@/lib/actions/question.action";
import { getTopPopularTags } from "@/lib/actions/tag.actions";

const RightSidebar = async () => {
    const hotQuestions = await getHotQuestions();
    const popularTags = await getTopPopularTags();

    return (
        <section className=" background-light900_dark200  light-border custom-scrollbar sticky right-0 top-0 flex h-screen w-[350px] flex-col overflow-y-auto border-l p-6 pt-36 shadow-light-300  dark:shadow-none max-xl:hidden">
            <div>
                <h3 className="h3-bold text-dark200_light900">Top Questions</h3>
                <div className="mt-7 flex w-full flex-col gap-[30px]">
                    {hotQuestions.map((question) => (
                        <Link
                            href={`question/${question._id}`}
                            key={question._id}
                            className="flex cursor-pointer items-center justify-between gap-7"
                        >
                            <p className="body-medium text-dark500_light700">
                                {question.title}
                            </p>
                            <Image
                                src="/assets/icons/chevron-right.svg"
                                alt="chevron-light"
                                className="invert-colors"
                                width={20}
                                height={20}
                            />
                        </Link>
                    ))}
                </div>
            </div>
            <div className="mt-16">
                <h3 className="h3-bold text-dark200_light900">Popular Tags</h3>
                <div className=" space-y-4 mt-4">
                    {popularTags.map((tag) => (
                        <RenderTag
                            key={tag._id}
                            totalQuestions={tag.numberOfQuestions}
                            _id={tag._id}
                            name={tag.name}
                            showCount
                        />
                    ))}
                </div>
            </div>
        </section>
    );
};

export default RightSidebar;
