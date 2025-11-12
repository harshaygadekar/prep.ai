import Providers from "@/components/providers";
import { Toaster } from "sonner";

export default function UserLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Providers>
      {children}
      <Toaster
        toastOptions={{
          classNames: {
            toast: "bg-white border-2 border-indigo-400",
            title: "text-black",
            description: "text-red-400",
            actionButton: "bg-indigo-400",
            cancelButton: "bg-orange-400",
            closeButton: "bg-lime-400",
          },
        }}
      />
    </Providers>
  );
}
