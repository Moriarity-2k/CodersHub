import LocalSearchbar from "@/components/shared/search/LocalSearchbar";
import Filter from "@/components/shared/Filter";
import { QuestionFilters } from "@/constants/filters";
import NoResult from "@/components/shared/NoResult";
import QuestionCard from "@/components/cards/QuestionCard";
import { getSavedQuestion } from "@/lib/actions/user.action";
import { auth } from "@clerk/nextjs";

export default async function Home() {
    const { userId } = auth();

    if (!userId) return null;
    const result = await getSavedQuestion({
        clerkId: userId,
    });

    console.log({result})

    return (
        <>
            <h1 className="h1-bold text-dark100_light900">Saved Question</h1>

            <div className="mt-11 flex justify-between gap-5 max-sm:flex-col sm:items-center">
                <LocalSearchbar
                    route="/"
                    iconPosition="left"
                    imgSrc="/assets/icons/search.svg"
                    placeholder="search for Questions ..."
                    otherClasses="flex-1"
                />

                <Filter
                    filters={QuestionFilters}
                    otherClasses="min-h-[56px] sm:min-w-[170px]"
                />
            </div>

            <div className="mt-10 flex w-full flex-col gap-6">
                {/* Looping through questions */}
                {result.questions.length > 0 ? (
                    result.questions.map((item) => (
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
                        title="There is no saved Questions to show"
                        description="Be the first to break the silence! 🚀 Ask a Question and kickstart the discussion. our query could be the next big thing others learn from. Get involved! 💡"
                        link="/ask-question"
                        linkTitle="Ask a Question"
                    />
                )}
            </div>
        </>
    );
}
