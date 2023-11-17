import Navbar from "@/components/shared/navbar/Navbar";
import React from "react";

const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <main className="  background-light850_dark100 relative">
      <Navbar />
      <div className="flex">
        LeftSide Bar
        <section className="flex min-h-screen flex-1 flex-col px-6 pb-6  pt-36 max-md:pb-14 sm:px-14">
          <div className=" mx-auto max-w-5xl ">{children}</div>
        </section>
        RightSide Bar
      </div>
      Toaster
    </main>
  );
};

export default Layout;