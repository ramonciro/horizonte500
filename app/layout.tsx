import type { Metadata } from "next";
import "./globals.css";
import Sidebar from "@/components/Sidebar";

export const metadata: Metadata = {
  title: "Horizonte 500",
  description: "Sistema Operacional de Crescimento Pessoal — Ramon Ciro",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <body className="font-sans">
        <div className="flex min-h-screen">
          <Sidebar />
          <div className="flex-1 px-9 py-7 max-w-[1100px]">{children}</div>
        </div>
      </body>
    </html>
  );
}
