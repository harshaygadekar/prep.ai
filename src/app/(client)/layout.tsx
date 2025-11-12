"use client";

import Navbar from "@/components/navbar";
import Providers from "@/components/providers";
import { Toaster } from "sonner";
import SideMenu from "@/components/sideMenu";
import { usePathname } from "next/navigation";

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  return (
    <Providers>
      {!pathname.includes("/sign-in") &&
        !pathname.includes("/sign-up") && <Navbar />}
      <div className="flex flex-row min-h-screen">
        {!pathname.includes("/sign-in") &&
          !pathname.includes("/sign-up") && <SideMenu />}
        <div className={`flex-grow ${
          !pathname.includes("/sign-in") && !pathname.includes("/sign-up")
            ? "ml-[240px] pt-[64px]"
            : ""
        } min-h-screen overflow-y-auto bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50`}>
          {children}
        </div>
      </div>
      <Toaster
        toastOptions={{
          classNames: {
            toast: "bg-white",
            title: "text-black",
            description: "text-red-400",
            actionButton: "bg-indigo-400",
            cancelButton: "bg-orange-400",
            closeButton: "bg-white-400",
          },
        }}
      />
    </Providers>
  );
}
