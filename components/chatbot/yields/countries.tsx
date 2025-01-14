"use client";

import { AI } from "@/action/chatbot";
import { useActions, useUIState } from "ai/rsc";

type Country = {
  name: string;
  flag: string;
};

export function Countries({ props: countries }: { props: Country[] }) {
  const [, setMessages] = useUIState<typeof AI>();
  const { submitUserMessage } = useActions();

  return (
    <>
      <div className="mb-4 flex flex-col gap-2 overflow-y-scroll pb-4 text-sm sm:flex-row">
        {countries.map((country) => (
          <div
            key={country.name}
            className="flex h-[60px] w-full cursor-pointer flex-row items-center justify-center gap-2 rounded-lg bg-main-foreground dark:bg-main-component p-2 text-left hover:bg-main-foreground/70 dark:hover:bg-main-component/70 hover:scale-105 sm:w-[208px]"
            onClick={async () => {
              const response = await submitUserMessage(
                "Bạn có những thông tin này từ đâu?"
              );
              setMessages((currentMessages) => [...currentMessages, response]);
            }}
          >
            <img src={country.flag} className="h-8 w-8" />
            <span className="text-main dark:text-main-foreground font-medium">
              {country.name}
            </span>
          </div>
        ))}
      </div>
    </>
  );
}
