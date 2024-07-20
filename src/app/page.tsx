'use client';
import Link from 'next/link';
import { SubmitHandler, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form } from '@src/components';
import { buttonVariants } from '@src/components/ui/button';
import { showToast } from '@src/components/ui/show-toast';
import { loginFields } from '@src/constants/input-fields';
import { FailedToastTitle } from '@src/constants/toast-message';
import { useAuthContext } from '@src/context/auth';
import { cn } from '@src/lib/utils';
import { LoginModel, LoginModelType } from '@src/models';
import { LoadingPage } from '@components/pages/loading';
// TODO https://github.com/vercel/next.js/issues/41964
export default function AuthenticationPage() {
  const { onLogin, isLoading, isLoggedIn } = useAuthContext();
  const form = useForm<LoginModelType>({
    resolver: zodResolver(LoginModel),
    defaultValues: {
      email: '',
      password: ''
    }
  });

  const onSubmit: SubmitHandler<LoginModelType> = async (
    data: LoginModelType
  ) => {
    try {
      await onLogin(data.email, data.password);
      if (isLoggedIn) {
        form.reset();
      }
    } catch (error: any) {
      showToast(FailedToastTitle, error.message);
    }
  };
  if (isLoggedIn || isLoading) {
    return <LoadingPage />;
  }
  return (
    <div className="relative h-screen flex-col items-center justify-center md:grid lg:max-w-none lg:grid-cols-2 lg:px-0">
      <Link
        href="/examples/authentication"
        className={cn(
          buttonVariants({ variant: 'ghost' }),
          'absolute right-4 top-4 hidden  md:right-8 md:top-8'
        )}
      >
        Register
      </Link>

      <div className="relative hidden h-full flex-col bg-muted p-10 text-white lg:flex dark:border-r">
        <div className="absolute inset-0 bg-zinc-900" />
        <div className="relative z-20 flex items-center text-lg font-medium">
          <svg
            xmlns="http://www.w3.org/2000svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="mr-2 h-6 w-6"
          >
            <path d="M15 6v12a3 3 0 1 0 3-3H6a3 3 0 1 0 3 3V6a3 3 0 1 0-3 3h12a3 3 0 1 0-3-3" />
          </svg>
          {process.env.NEXT_PUBLIC_LOGO}
        </div>
        <div className="relative z-20 mt-auto">
          <blockquote className="space-y-2">
            <p className="text-lg">
              &ldquo;Lorem ipsum dolor sit amet consectetur adipisicing elit.
              Debitis mollitia voluptatum modi nihil earum? Quos dicta alias
              laboriosam iure totam sit rerum ad, et, voluptatem eaque debitis
              eveniet aliquam quam!.&rdquo;
            </p>
            <footer className="text-sm">Timothy Alvarado</footer>
          </blockquote>
        </div>
      </div>
      <div className="flex h-full items-center p-4 lg:p-8">
        <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
          <div className="flex flex-col space-y-2 text-center">
            <h1 className="text-2xl font-semibold tracking-tight">
              Welcome back
            </h1>
            <p className="text-sm text-muted-foreground">
              Enter your email and password to sign in
            </p>
          </div>
          <Form
            form={form}
            fields={loginFields}
            onSubmit={onSubmit}
            loading={isLoading || isLoggedIn}
            className="sm:col-span-full"
            btnStyle="w-full md:w-full"
            btnText="Continue"
          />
          <p className="px-8 text-center text-sm text-muted-foreground">
            By clicking continue, you agree to our{' '}
            <Link
              href="/terms"
              className="underline underline-offset-4 hover:text-primary"
            >
              Terms of Service
            </Link>{' '}
            and{' '}
            <Link
              href="/privacy"
              className="underline underline-offset-4 hover:text-primary"
            >
              Privacy Policy
            </Link>
            .
          </p>
        </div>
      </div>
    </div>
  );
}
