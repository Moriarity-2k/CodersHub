import Image from "next/image";
import Link from "next/link";
import React from "react";
import RenderTag from "./RenderTag";

const hotQuestions = [
  { _id: "1", title: "Test Question 1" },
  { _id: "2", title: "Test Question 1" },
  { _id: "3", title: "Test Question 1" },
  { _id: "4", title: "Test Question 1" },
  { _id: "5", title: "Test Question 1" },
];
const popularTage = [
  { _id: "1", name: "NextJS", totalQuestions: 2 },
  { _id: "2", name: "NextJS", totalQuestions: 2 },
  { _id: "3", name: "NextJS", totalQuestions: 2 },
];

const RightSidebar = () => {
  return (
    <section className=" background-light900_dark200  light-border custom-scrollbar sticky right-0 top-0 flex h-screen w-[350px] flex-col overflow-y-auto border-l p-6 pt-36 shadow-light-300  dark:shadow-none max-xl:hidden">
      <div>
        <h3 className="h3-bold text-dark200_light900">Top Questions</h3>
        <div className="mt-7 flex w-full flex-col gap-[30px]">
          {hotQuestions.map((question) => (
            <Link
              href={`questions/${question._id}`}
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
        <div>
          {popularTage.map((tag) => (
            <RenderTag
              key={tag._id}
              totalQuestions={tag.totalQuestions}
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
