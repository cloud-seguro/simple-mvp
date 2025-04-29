import { Brain } from "lucide-react"
import Link from "next/link"

interface Props {
    children: React.ReactNode
  }
  
  export default function AuthLayout({ children }: Props) {
    return (
      <div className="container grid h-svh flex-col items-center justify-center bg-primary-foreground lg:max-w-none lg:px-0">
        <div className="mx-auto flex w-full flex-col justify-center space-y-2 sm:w-[480px] lg:p-8">
          <Link 
            href="/"
            className="mb-4 flex items-center justify-center hover:opacity-80 transition-opacity cursor-pointer"
          >
            <Brain className="mr-2 h-6 w-6" />
            <h1 className="text-xl font-medium">SIMPLE</h1>
          </Link>
          {children}
        </div>
      </div>
    );
  }