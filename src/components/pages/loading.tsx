export const LoadingPage = () => (
  <div className="flex h-screen items-center justify-center space-x-2 bg-primary dark:bg-primary-foreground">
    <div className="h-8 w-8 animate-bounce rounded-full bg-primary-foreground [animation-delay:-0.3s] dark:bg-primary" />
    <div className="h-8 w-8 animate-bounce rounded-full bg-primary-foreground [animation-delay:-0.15s] dark:bg-primary" />
    <div className="h-8 w-8 animate-bounce rounded-full bg-primary-foreground dark:bg-primary" />
    <span className="sr-only">Loading...</span>
  </div>
);
