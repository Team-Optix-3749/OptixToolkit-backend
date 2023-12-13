import React from "react";

import "./signInForm.css";

type SignInFormType = {
  loginState: { email: string; password: string };
  SETloginState: React.Dispatch<
    React.SetStateAction<{ email: string; password: string }>
  >;
  handleSubmit: any;
  handleGoogleLogin: any;
};

export function SignInForm({
  loginState,
  SETloginState,
  handleSubmit,
  handleGoogleLogin
}: SignInFormType) {
  const handleEmailChange = function (
    evt: React.ChangeEvent<HTMLInputElement>
  ) {
    const email = evt.target.value as string;

    SETloginState({
      ...loginState,
      email
    });
  };

  const handlePassChange = function (evt: React.ChangeEvent<HTMLInputElement>) {
    const password = evt.target.value as string;

    SETloginState({
      ...loginState,
      password
    });
  };

  return (
    <main className="container_signIn">
      <form onSubmit={handleSubmit}>
        <h1>Sign in</h1>
        <input
          className="email"
          type="text"
          placeholder="EMAIL"
          value={loginState.email}
          onChange={handleEmailChange}
        />
        <input
          className="password"
          type="password"
          placeholder="PASSWORD"
          value={loginState.password}
          onChange={handlePassChange}
        />
        <button className="submitBtn">Submit</button>
      </form>
      <section className="otherSignIn">
        <a onClick={handleGoogleLogin}>
          <img
            src="./googleLogo.svg"
            alt="google"
            className="otherSignInItem"
          />
        </a>
      </section>
    </main>
  );
}
