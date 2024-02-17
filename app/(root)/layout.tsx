import Sidebar from "@/components/shared/sidebar";
import React, { ReactNode } from "react";

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <main className="root">
      <Sidebar />
      <div className="root-container">
        <div className="wrapper">{children}</div>
      </div>
    </main>
  );
}
