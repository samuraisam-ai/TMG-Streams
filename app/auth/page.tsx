"use client";

import { FormEvent, useEffect, useState } from "react";
import { supabaseBrowser } from "@/lib/supabase";

type AuthTab = "signin" | "signup";

export default function AuthPage() {
  const supabase = supabaseBrowser;

  const [activeTab, setActiveTab] = useState<AuthTab>("signin");

  const [signInEmail, setSignInEmail] = useState("");
  const [signInPassword, setSignInPassword] = useState("");
  const [signInError, setSignInError] = useState("");
  const [signInLoading, setSignInLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);

  useEffect(() => {
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        window.location.href = "/library";
      }
    };
    checkSession();
  }, [supabase]);

  const [fullName, setFullName] = useState("");
  const [signUpEmail, setSignUpEmail] = useState("");
  const [signUpPassword, setSignUpPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [confirmError, setConfirmError] = useState("");
  const [signUpError, setSignUpError] = useState("");
  const [signUpLoading, setSignUpLoading] = useState(false);
  const [signUpSuccess, setSignUpSuccess] = useState(false);

  const handleSignIn = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSignInError("");
    setSignInLoading(true);

    const { error } = await supabase.auth.signInWithPassword({
      email: signInEmail,
      password: signInPassword,
    });

    if (error) {
      setSignInError(error.message);
      setSignInLoading(false);
      return;
    }

    setSignInLoading(false);
    window.location.href = "/library";
  };

  const handleCreateAccount = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setConfirmError("");
    setSignUpError("");
    setSignUpSuccess(false);

    if (signUpPassword.length < 8) {
      setSignUpError("Password must be at least 8 characters.");
      return;
    }

    if (signUpPassword !== confirmPassword) {
      setConfirmError("Passwords do not match.");
      return;
    }

    setSignUpLoading(true);

    const { data, error } = await supabase.auth.signUp({
      email: signUpEmail,
      password: signUpPassword,
    });

    if (error) {
      setSignUpError(error.message);
      setSignUpLoading(false);
      return;
    }

    const user = data.user;

    if (!user) {
      setSignUpError("Could not create account. Please try again.");
      setSignUpLoading(false);
      return;
    }

    await supabase.from("profiles").upsert({
      id: user.id,
      email: user.email ?? signUpEmail,
      full_name: fullName,
    });

    setSignUpLoading(false);
    setSignUpSuccess(true);
  };

  return (
    <section className="flex min-h-[calc(100vh-130px)] items-center justify-center px-4 py-10">
      <div className="w-full max-w-[420px]">
        <div className="mb-8 text-center">
          <p className="font-serif text-3xl tracking-wide text-text">TMG Streams</p>
        </div>

        <div className="border border-border bg-surface p-6 sm:p-7 rounded-none">
          <div className="mb-6 flex border-b border-border">
            <button
              type="button"
              onClick={() => setActiveTab("signin")}
              className={`w-1/2 border-b-2 px-3 py-3 text-sm font-medium transition-colors rounded-none ${
                activeTab === "signin"
                  ? "border-white text-text"
                  : "border-transparent text-text-secondary"
              }`}
            >
              Sign In
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("signup")}
              className={`w-1/2 border-b-2 px-3 py-3 text-sm font-medium transition-colors rounded-none ${
                activeTab === "signup"
                  ? "border-white text-text"
                  : "border-transparent text-text-secondary"
              }`}
            >
              Create Account
            </button>
          </div>

          {activeTab === "signin" && (
            <form onSubmit={handleSignIn} className="space-y-4">
              <div>
                <label htmlFor="sign-in-email" className="mb-2 block text-xs uppercase tracking-wide text-text-secondary">
                  Email
                </label>
                <input
                  id="sign-in-email"
                  type="email"
                  required
                  value={signInEmail}
                  onChange={(event) => setSignInEmail(event.target.value)}
                  className="w-full border border-border bg-bg px-3 py-3 text-text outline-none focus:border-white rounded-none"
                />
              </div>

              <div>
                <label htmlFor="sign-in-password" className="mb-2 block text-xs uppercase tracking-wide text-text-secondary">
                  Password
                </label>
                <input
                  id="sign-in-password"
                  type="password"
                  required
                  value={signInPassword}
                  onChange={(event) => setSignInPassword(event.target.value)}
                  className="w-full border border-border bg-bg px-3 py-3 text-text outline-none focus:border-white rounded-none"
                />
                {signInError && <p className="mt-2 text-xs text-red-500">{signInError}</p>}
              </div>

              <div className="flex items-center gap-2">
                <input
                  id="remember-me"
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(event) => setRememberMe(event.target.checked)}
                  className="h-4 w-4 accent-white cursor-pointer"
                />
                <label htmlFor="remember-me" className="text-sm text-text-secondary cursor-pointer select-none">
                  Remember me
                </label>
              </div>

              <button
                type="submit"
                disabled={signInLoading}
                className="w-full border border-accent bg-accent px-4 py-3.5 font-medium text-bg disabled:opacity-70 rounded-none"
              >
                {signInLoading ? "Signing In..." : "Sign In"}
              </button>

              <a href="#" className="text-sm text-text-secondary hover:text-text rounded-none">
                Forgot password?
              </a>
            </form>
          )}

          {activeTab === "signup" && (
            <form onSubmit={handleCreateAccount} className="space-y-4">
              <div>
                <label htmlFor="full-name" className="mb-2 block text-xs uppercase tracking-wide text-text-secondary">
                  Full Name
                </label>
                <input
                  id="full-name"
                  type="text"
                  required
                  value={fullName}
                  onChange={(event) => setFullName(event.target.value)}
                  className="w-full border border-border bg-bg px-3 py-3 text-text outline-none focus:border-white rounded-none"
                />
              </div>

              <div>
                <label htmlFor="sign-up-email" className="mb-2 block text-xs uppercase tracking-wide text-text-secondary">
                  Email
                </label>
                <input
                  id="sign-up-email"
                  type="email"
                  required
                  value={signUpEmail}
                  onChange={(event) => setSignUpEmail(event.target.value)}
                  className="w-full border border-border bg-bg px-3 py-3 text-text outline-none focus:border-white rounded-none"
                />
              </div>

              <div>
                <label htmlFor="sign-up-password" className="mb-2 block text-xs uppercase tracking-wide text-text-secondary">
                  Password
                </label>
                <input
                  id="sign-up-password"
                  type="password"
                  minLength={8}
                  required
                  value={signUpPassword}
                  onChange={(event) => setSignUpPassword(event.target.value)}
                  className="w-full border border-border bg-bg px-3 py-3 text-text outline-none focus:border-white rounded-none"
                />
              </div>

              <div>
                <label htmlFor="confirm-password" className="mb-2 block text-xs uppercase tracking-wide text-text-secondary">
                  Confirm Password
                </label>
                <input
                  id="confirm-password"
                  type="password"
                  required
                  value={confirmPassword}
                  onChange={(event) => setConfirmPassword(event.target.value)}
                  className="w-full border border-border bg-bg px-3 py-3 text-text outline-none focus:border-white rounded-none"
                />
                {confirmError && <p className="mt-2 text-xs text-red-500">{confirmError}</p>}
              </div>

              {signUpError && <p className="text-xs text-red-500">{signUpError}</p>}

              {signUpSuccess && (
                <p className="text-xs text-text">Account created successfully! Check your email to confirm before signing in.</p>
              )}

              <button
                type="submit"
                disabled={signUpLoading || signUpSuccess}
                className="w-full border border-accent bg-accent px-4 py-3.5 font-medium text-bg disabled:opacity-70 rounded-none"
              >
                {signUpLoading ? "Creating Account..." : "Create Account"}
              </button>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}