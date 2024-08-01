import { ReactNode } from 'react';

export const LoadingPage = ({ children }: { children: ReactNode }) => {
  return (
    <>
      <div className="fixed bottom-0 left-0 right-0 top-0 z-[999] flex h-screen items-center justify-center space-x-2 bg-black/20">
        <div className="h-8 w-8 animate-bounce rounded-full bg-primary [animation-delay:-0.3s] dark:bg-primary" />
        <div className="h-8 w-8 animate-bounce rounded-full bg-primary [animation-delay:-0.15s] dark:bg-primary" />
        <div className="h-8 w-8 animate-bounce rounded-full bg-primary" />
        <span className="sr-only">Loading...</span>
      </div>
      <div className="blur-[1px]">{children}</div>
    </>
  );
};
