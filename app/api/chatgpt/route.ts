import { NextResponse } from "next/server";

export const POST = async (req: Request) => {
    const { question } = await req.json();

    try {
        const response = await fetch(
            "https://api.openai.com/v1/chat/completions",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${process.env.OPENAI_API_K}`,
                },
                body: JSON.stringify({
                    model: "gpt-3.5-turbo",
                    messages: [
                        {
                            role: "system",
                            content:
                                "Even the best of the best seeks help sometimes !",
                        },
                        {
                            role: "user",
                            content: `Tell me ${question}`,
                        },
                    ],
                }),
            },
        );

        const responseData = await response.json();
        const reply = responseData.choices[0].message.content;

        return NextResponse.json({ reply });
    } catch (err: any) {
        return NextResponse.json({ error: err });
    }
};
