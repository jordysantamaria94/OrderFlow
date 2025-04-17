'use client'

import Navbar from "@/components/navbar";
import { LoggedProvider } from "@/context/Context";
import { Suspense } from "react";

export default function Content({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <LoggedProvider>
            <Suspense>
                <Navbar />
                {children}
            </Suspense>
        </LoggedProvider>
    );
}