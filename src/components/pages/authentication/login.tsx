'use client';
import { useSearchParams } from 'next/navigation';
import React, { useEffect } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';

import { zodResolver } from '@hookform/resolvers/zod';
import { Form, Typography } from '@src/components';
import {
  LoginModel,
  LoginModelType,
  SignupModel,
  SignupModelType
} from '@src/models';
import { ScreenHeight } from '@src/constants';
import { loginFields, signupFields } from '@src/constants/input-fields';
import { Card } from '@components/ui/card';
import { Button } from '@components/ui/button';

export const Login = () => {
  const search = useSearchParams().get('isNew');
  const loginForm = useForm<LoginModelType>({
    resolver: zodResolver(LoginModel)
  });
  useEffect(() => {
    if (search === 'true') {
      setIsSignUp(true);
    }
  }, [search]);
  const signUpForm = useForm({
    resolver: zodResolver(SignupModel)
  });

  const [isSignUp, setIsSignUp] = React.useState(false);

  const onClickIsLogin = () => {
    loginForm.reset();
    setIsSignUp(false);
  };

  const onClickIsSignUp = () => {
    signUpForm.reset();
    setIsSignUp(true);
  };

  const onSubmit: SubmitHandler<LoginModelType> = (data) => {
    console.log(data);
  };

  const onSubmitSignUp: SubmitHandler<SignupModelType> = (data) => {
    console.log(data);
  };

  return (
    <div className={`h-${ScreenHeight}`}>
      <div className="flex h-full flex-wrap items-center justify-center">
        <Card className="flex w-full max-w-lg flex-col space-y-8 p-10">
          <div>
            <Typography
              size={'h2'}
              weight={'bold'}
              colors="primary"
              className="sm:text-title-xl2 text-center"
            >
              {isSignUp ? 'Sign up' : 'Sign in'}
            </Typography>
            <Typography size={'p'} colors="muted" className="text-center">
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Saepe
              distinctio officiis similique nihil
            </Typography>
          </div>
          <div>
            {isSignUp ? (
              <Form
                fields={signupFields}
                loading={false}
                onSubmit={onSubmitSignUp}
                form={signUpForm}
                btnStyle="w-full md:w-full p-5"
              />
            ) : (
              <Form
                btnStyle="w-full md:w-full p-5"
                fields={loginFields}
                loading={false}
                onSubmit={onSubmit}
                form={loginForm}
              />
            )}
          </div>
          <div className="text-center">
            {!isSignUp ? (
              <p>
                Don’t have any account?{' '}
                <Button
                  variant={'link'}
                  onClick={onClickIsSignUp}
                  className="px-0 text-primary"
                >
                  Sign Up
                </Button>
              </p>
            ) : (
              <p>
                Already have an account?{' '}
                <Button
                  variant={'link'}
                  onClick={onClickIsLogin}
                  className="px-0 text-primary"
                >
                  Sign in
                </Button>
              </p>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
};
