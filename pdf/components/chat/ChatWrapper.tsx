"use client";

import React from "react";
import Messages from "./Messages";
import ChatInput from "./ChatInput";
import { trpc } from "@/app/_trpc/client";
import { ChevronLeft, Loader2, XCircle } from "lucide-react";
import Link from "next/link";
import { buttonVariants } from "../ui/button";
import { ChatContextProvider } from "./ChatContext";

interface ChatWrapperProps {
  fileId: string;
}

const ChatWrapper = ({ fileId }: ChatWrapperProps) => {
  const { data, isLoading } = trpc.getFileUploadStatus.useQuery(
    { fileId },
    {
      refetchInterval: (data) =>
        data?.status === "SUCCESS" || data?.status === "FAILED" ? false : 500,
    }
  );

  if (isLoading) {
    return (
      <div className="relative min-h-full bg-zinc-50 flex divide-y divide-zinc-200 flex-col justify-between gap-2">
        <div className="flex-1 flex justify-center flex-col items-center mb-28">
          <div className="flex flex-col items-center gap-2">
            <Loader2 className="h-8 w-8 text-blue-500 animate-spin"></Loader2>
            <h3 className="font-semibold text-xl">Loading...</h3>
            <p className="text-zinc-500 text-sm">We are preparing your PDF</p>
          </div>
        </div>
        <ChatInput isDisabled></ChatInput>
      </div>
    );
  }

  if (data?.status === "PROCESSING")
    return (
      <div className="relative min-h-full bg-zinc-50 flex divide-y divide-zinc-200 flex-col justify-between gap-2">
        <div className="flex-1 flex justify-center flex-col items-center mb-28">
          <div className="flex flex-col items-center gap-2">
            <Loader2 className="h-8 w-8 text-blue-500 animate-spin"></Loader2>
            <h3 className="font-semibold text-xl">Processing PDF...</h3>
            <p className="text-zinc-500 text-sm">This won't take long</p>
          </div>
        </div>
        <ChatInput isDisabled></ChatInput>
      </div>
    );

  if (data?.status === "FAILED")
    return (
      <div className="relative min-h-full bg-zinc-50 flex divide-y divide-zinc-200 flex-col justify-between gap-2">
        <div className="flex-1 flex justify-center flex-col items-center mb-28">
          <div className="flex flex-col items-center gap-2">
            <XCircle className="h-8 w-8 text-red-500 "></XCircle>
            <h3 className="font-semibold text-xl">Too many pages...</h3>
            <p className="text-zinc-500 text-sm">
              Your <span className="font-medium">Free</span> plan supports upto
              5 pages per pdf
            </p>
            <Link
              href="/dashboard"
              className={buttonVariants({
                variant: "secondary",
                className: "mt-4",
              })}
            >
              <ChevronLeft className="h-3 w-3 mr-1.5"></ChevronLeft> Back
            </Link>
          </div>
        </div>
        <ChatInput isDisabled></ChatInput>
      </div>
    );
  return (
    <ChatContextProvider fileId={fileId}>
      <div className="relative min-h-full bg-zinc-50 flex divide-y divide-zinc-200 flex-col justify-between gap-2">
        <div className="flex-1 justify-between flex flex-col mb-32">
          <Messages fileId={fileId}></Messages>
        </div>

        <ChatInput></ChatInput>
      </div>
    </ChatContextProvider>
  );
};

export default ChatWrapper;
