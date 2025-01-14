'use client';

import Image from "next/image";

export default function Loading() {
    return (
        <div className="flex items-center justify-center h-screen">
            <Image
                src="/zarivka_thinking_modre.svg"
                alt="Loading image of thinking Zářivka"
                width={100}
                height={100}
            />
            <h1 className="text-2xl ml-4 dark:text-white font-bold">Loading...</h1>
        </div>
    );
}
