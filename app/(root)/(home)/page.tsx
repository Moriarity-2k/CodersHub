import Link from "next/link";

import { Button } from "@/components/ui/button";
import LocalSearchbar from "@/components/shared/search/LocalSearchbar";
import Filter from "@/components/shared/Filter";
import HomeFilters from "@/components/home/HomeFilters";
import { HomePageFilters } from "@/constants/filters";
import NoResult from "@/components/shared/NoResult";
import QuestionCard from "@/components/cards/QuestionCard";

const questions = [
  {
    _id: "1",
    title: "Some Question to be asked",
    tags: [
      { _id: "1", name: "react" },
      { _id: "2", name: "nextJs" },
      { _id: "3", name: "nodeJs" },
    ],
    author: {
      _id: "1",
      name: "John Doe",
      picture: "john-doe.jpg",
    },
    upvotes: 10,
    views: 100,
    answers: [],
    createdAt: new Date("2021-1-1"),
  },
  {
    _id: "2",
    title: "Some Question to be asked",
    tags: [
      { _id: "1", name: "react" },
      { _id: "2", name: "nextJs" },
      { _id: "3", name: "nodeJs" },
    ],
    author: {
      _id: "2",
      name: "John Doe 2",
      picture: "john-doe-2.jpg",
    },
    upvotes: 10,
    views: 100,
    answers: [],
    createdAt: new Date("2021-1-1"),
  },
];

export default function Home() {
  return (
    <>
      <div className="flex w-full flex-col-reverse justify-between gap-4 sm:flex-row sm:items-center">
        <h1 className="h1-bold text-dark100_light900">All Questions</h1>
        <Link href="/ask-question" className="flex justify-end max-sm:w-full">
          <Button className="primary-gradient min-h-[46px] px-4 py-3 !text-light-900">
            Ask a Question
          </Button>
        </Link>
      </div>
      <div className="mt-11 flex justify-between gap-5 max-sm:flex-col sm:items-center">
        <LocalSearchbar
          route="/"
          iconPosition="left"
          imgSrc="/assets/icons/search.svg"
          placeholder="search for Questions ..."
          otherClasses="flex-1"
        />

        <Filter
          filters={HomePageFilters}
          otherClasses="min-h-[56px] sm:min-w-[170px]"
          containerClasses="hidden max-md:flex"
        />
      </div>
      <HomeFilters />

      <div className="mt-10 flex w-full flex-col gap-6">
        {/* Looping through questions */}
        {questions.length > 0 ? (
          questions.map((item) => (
            <QuestionCard
              key={item._id}
              _id={item._id}
              title={item.title}
              tags={item.tags}
              author={item.author}
              upvotes={item.upvotes}
              views={item.views}
              answers={item.answers}
              createdAt={item.createdAt}
            />
          ))
        ) : (
          <NoResult
            title="There is no Questions to show"
            description="Be the first to break the silence! 🚀 Ask a Question and kickstart the
          discussion. our query could be the next big thing others learn from. Get
          involved! 💡"
            link="/ask-question"
            linkTitle="Ask a Question"
          />
        )}
      </div>
    </>
  );
}
