
import React from "react";
import StoreProvider from "../StoreProvider";
import Header from "@/components/shared/Header";

const layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div>
      <StoreProvider>
        <Header />
        <main className="min-h-screen max-w-screen-xl mx-auto container px-4">
          {children}
        </main>
      </StoreProvider>
    </div>
  );
};

export default layout;
