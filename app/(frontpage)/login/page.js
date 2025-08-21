import Link from "next/link";
import React from "react";

function page() {
  return (
    <>
      <section className="auth-section">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-lg-7">
              <div className="auth-logo text-center">
                <Link href="/">
                  <img src="/images/dark-logo.svg" alt="Logo" />
                </Link>
              </div>
              <div className="auth-cards login">
                <h3>Welcome Back, Champion!</h3>
                <p>
                  Sign in to track your progress and get personalised fitness
                  insights with Al.
                </p>
                <div className="login-innr">
                  <div className="login-btn">
                    <Link href="/select-gender">
                      <img src="/images/apple-logo.svg" />
                      Continue with Apple
                    </Link>
                    <Link href="/select-gender">
                      <img src="/images/google-logo.svg" />
                      Continue with Google
                    </Link>
                  </div>
                  <p className="or-line">
                    <span>or</span>
                  </p>
                  <p className="fz-16 fw-400">
                    Don't have an account?{" "}
                    <Link href="/register" className="fw-600 clr">
                      Sign up
                    </Link>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

export default page;
