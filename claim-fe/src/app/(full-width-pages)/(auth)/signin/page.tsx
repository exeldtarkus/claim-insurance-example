import SignInForm from "@/components/auth/SignInForm";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sign In | CLAIM Example",
  description: "Login to your CLAIM Example Dashboard account.",
};

export default function SignIn() {
  return <SignInForm />;
}
