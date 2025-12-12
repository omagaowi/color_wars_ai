"use client";

import { ModalProvider } from "@/contexts/modalContext";
import dynamic from "next/dynamic";

// 👇 we'll create this in step 3
const App = dynamic(() => import("../fe/app"), { ssr: false });

export default function Home() {
  return (
    <ModalProvider>
      <App />
    </ModalProvider>
  );
}
