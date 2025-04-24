import { ReactNode } from "react";

// Override the PageProps type from Next.js to fix the TypeScript error
declare module "next" {
  export interface PageProps {
    params?: { [key: string]: string };
    searchParams?: { [key: string]: string | string[] | undefined };
    children?: ReactNode;
  }
}
