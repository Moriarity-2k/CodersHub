import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Link from "next/link";

type Props = {};

export default function Contact({}: Props) {
    return (
        <>
            <div className="flex w-full flex-col-reverse justify-between gap-4 sm:flex-row sm:items-center">
                <h1 className="h1-bold text-dark100_light900 tracking-wider">
                    Contact Me
                </h1>
            </div>

            <div className="mt-11 md:py-4 md:pl-12 p-6">
                <div className="mt-4 md:flex md:gap-16 ">
                    <p className="h3-bold text-dark100_light900 tracking-wider">
                        Tech Stack :
                    </p>
                    <ul className="flex flex-wrap gap-4 md:flex-center md:gap-8 max-md:mt-4 text-dark100_light900">
                        {Techused.map((x, i) => {
                            return <RenderFrameworks name={x} key={i} />;
                        })}
                    </ul>
                </div>
            </div>

            <div className="mt-11 space-y-8 ">
                <div className="md:mt-11 text-light400_light500 space-y-6">
                    <div>
                        Hello 👋, I'm{" "}
                        <strong className="text-dark300_light900 base-semibold mx-2 capitalize">
                            surya teja gorle
                        </strong>
                    </div>

                    <div>
                        Welcome to my personal practise project! This platform
                        serves as a practice space where I demonstrate my skills
                        and stay updated with the latest technologies in the
                        field. Feel free to explore and reach out with any
                        feedback or inquiries. Thank you for visiting!
                    </div>
                    <div className="">
                        <span>I'm looking for</span>
                        <strong className="inline text-dark300_light900 base-semibold mx-2 capitalize">
                            Job opportunities ( SDE 1 Roles and Internships ) .
                        </strong>
                        <span>Any Referrals would be appreciated !!!</span>
                    </div>
                    <div className="flex gap-8 max-sm:w-full">
                        <Button className="primary-gradient min-h-[46px] px-4 py-3 !text-light-900 uppercase">
                            <a
                                href="mailto:suryatejagorle1@gmail.com"
                                target="_blank"
                            >
                                email me
                            </a>
                        </Button>
                        <Button className="primary-gradient min-h-[46px] px-4 py-3 !text-light-900 uppercase">
                            <Link
                                href="https://linkedin.com/in/surya-teja-g"
                                target="_blank"
                            >
                                Linked In
                            </Link>
                        </Button>
                    </div>
                </div>
            </div>
        </>
    );
}

function RenderFrameworks({ name }: { name: string }) {
    return (
        <Badge
            variant="outline"
            className=" background-light800_dark300 subtle-medium text-light400_light500 rounded-md border-none px-4 py-2 uppercase"
        >
            {name}
        </Badge>
    );
}

const Techused: string[] = ["NextJs", "Typescript", "MongoDB", "Tailwind Css"];
