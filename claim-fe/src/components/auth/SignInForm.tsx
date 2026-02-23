/* eslint-disable @next/next/no-img-element */
"use client";

import React, { useState } from "react";
import Input from "@/components/form/input/InputField";
import Label from "@/components/form/Label";
import Button from "@/components/ui/button/Button";
import { EyeCloseIcon, EyeIcon } from "@/icons";
import Checkbox from "../form/input/Checkbox";
import { useRouter } from "next/navigation";
import Auth from "@/services/auth";
import Alert from "@/components/ui/alert/Alert";
import LoadingBoxJump from "../loading/LoadingBoxJump";
import { useReCaptcha } from "next-recaptcha-v3";

const SignInForm = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [isKeepMeLogin, setKeepMeLogin] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const { executeRecaptcha } = useReCaptcha();

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrorMsg("");
    setIsLoading(true);

    if (!executeRecaptcha) {
      setErrorMsg("reCAPTCHA belum siap. Silakan refresh halaman.");
      setIsLoading(false);
      return;
    }

    const captchaToken = await executeRecaptcha("login");
    const loginRequest = {
      username,
      password,
      captchaToken,
      rememberMe: isKeepMeLogin,
    };

    const login = await Auth.login(loginRequest);

    setIsLoading(false);

    if (login.errorMessage) {
      setErrorMsg(login.errorMessage || "Login failed");
      return;
    }

    router.push("/");
    window.location.reload();
  };

  return (
    <div className="flex flex-col flex-1 lg:w-1/2 w-full relative">
      <div className="flex flex-col justify-center flex-1 w-full max-w-md mx-auto">
        <form onSubmit={handleLogin}>
          <div className="mb-5 sm:mb-8">
            <h1 className="mb-2 font-semibold text-gray-800 text-title-sm dark:text-white/90 sm:text-title-md">
              Sign In
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Enter your Email and Password to sign in!
            </p>
          </div>

          <div className="space-y-6">
            {errorMsg && (
              <Alert
                variant="error"
                title="Login failed"
                message={errorMsg}
                showLink={false}
              />
            )}

            <div>
              <Label>
                Email <span className="text-error-500">*</span>
              </Label>
              <Input
                placeholder="Enter your email"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>

            <div>
              <Label>
                Password <span className="text-error-500">*</span>
              </Label>
              <div className="relative">
                <Input
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <span
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute z-30 -translate-y-1/2 cursor-pointer right-4 top-1/2"
                >
                  {showPassword ? (
                    <EyeIcon className="fill-gray-500 dark:fill-gray-400" />
                  ) : (
                    <EyeCloseIcon className="fill-gray-500 dark:fill-gray-400" />
                  )}
                </span>
              </div>
            </div>

            <div className="flex items-center justify-between flex-wrap gap-3">
              <Checkbox
                checked={isKeepMeLogin}
                onChange={setKeepMeLogin}
                label="Keep me logged in"
                id="keep-me-login"
              />

              <div className="flex items-center gap-2">
                <img
                  src="https://www.gstatic.com/recaptcha/api2/logo_48.png"
                  alt="reCAPTCHA"
                  className="w-5 h-auto opacity-70"
                />
                <span className="text-[11px] text-gray-500 dark:text-gray-400">
                  Protected by reCAPTCHA
                </span>
              </div>
            </div>



            <div>
              {isLoading ? (
                <LoadingBoxJump />
              ) : (
                <Button className="w-full" size="sm" type="submit">
                  Sign in
                </Button>
              )}
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SignInForm;
