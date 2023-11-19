import Link from "next/link";
import React from "react";
import RenderTag from "@/components/shared/RenderTag";
import Metric from "../shared/Metric";
import { formatDivideNumber, getTimeStamp } from "@/lib/utils";

interface Props {
  _id: string;
  title: string;
  tags: { _id: string; name: string }[];
  author: {
    _id: string;
    name: string;
    picture: string;
  };
  answers: Array<object>;
  createdAt: Date;
  upvotes: number;
  views: number;
}

const QuestionCard = ({
  _id,
  title,
  tags,
  author,
  views,
  answers,
  createdAt,
  upvotes,
}: Props) => {
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
      </div>

      {/* Question tags */}
      <div className="mt-3.5 flex flex-wrap gap-2">
        {tags.map((tag) => (
          <RenderTag key={tag._id} _id={tag._id} name={tag.name} />
        ))}
      </div>

      {/* Details */}
      <div className="flex-between mt-6 w-full flex-wrap gap-3">
        <Metric
          imgUrl={author.picture}
          alt="user"
          title={`- asked ${getTimeStamp(createdAt)}`}
          href={`/profile/${author._id}`}
          isAuthor
          textStyles="body-medium text-dark400_light700"
          value={author.name}
        />

        <Metric
          imgUrl="/assets/icons/like.svg"
          alt="Upvotes"
          title=" Votes"
          textStyles="small-medium text-dark400_light800"
          value={formatDivideNumber(upvotes)}
        />

        <Metric
          imgUrl="/assets/icons/message.svg"
          alt="message"
          title=" Answers"
          textStyles="small-medium text-dark400_light800"
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
  );
};

export default QuestionCard;
