"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useOnboarding } from "../../../context/OnboardingContext";
import { apiService } from "../../../lib/api";
import Alert from "../../../Components/Alert";

function RegisterPage() {
  const router = useRouter();
  const { state, setUser, setLoading, setError, updateStep, resetState } =
    useOnboarding();
  const [alert, setAlert] = useState({ show: false, type: "", message: "" });
  const [appleLoading, setAppleLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  useEffect(() => {
    localStorage.removeItem("onboardingState");
    resetState();
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const script = document.createElement("script");
    script.src = "https://accounts.google.com/gsi/client";
    script.async = true;
    script.defer = true;

    script.onload = () => {
      console.log("Google Identity Services script loaded");
    };

    document.head.appendChild(script);
  }, []);

  const showAlert = (type, message) => {
    setAlert({ show: true, type, message });
  };

  const hideAlert = () => {
    setAlert({ show: false, type: "", message: "" });
  };

  const handleSocialLoginAPI = async (userData, loginType = null) => {
    setLoading(true);
    if (loginType === 'apple') setAppleLoading(true);
    if (loginType === 'google') setGoogleLoading(true);
    hideAlert();

    try {
      const payload = {
        email: userData.email,
        username: userData.username || userData.email.split("@")[0],
        platform: userData.platform,
        userInfoId: userData.userInfoId || "",
      };

      console.log("Calling social login API with:", payload);
      const response = await apiService.socialLogin(payload);
      console.log("responseresponse",response)

      if (response.success) {
        // Check if user information is required (new user) or user is already registered
        const needsOnboarding =
          response.message === "User information is required";

        // Update user state with userInfoId from response if available
        const finalUserData = {
          ...payload,
          userInfoId: response.result?.userInfoId || payload.userInfoId,
        };

        setUser({
          userData: finalUserData,
          needsOnboarding: needsOnboarding,
        });
        updateStep(2);

        if (needsOnboarding) {
          // New user - proceed to onboarding
          showAlert(
            "success",
            "Registration successful! Let's set up your profile."
          );

          setTimeout(() => {
            router.push("/select-gender");
          }, 1500);
        } else {
          // Existing user - has completed onboarding, redirect to dashboard/home
          showAlert("success", "Welcome back! You've already completed setup.");

          setTimeout(() => {
            window.alert("You have already completed onboarding. Redirecting to dashboard.");
            // Redirect to BMR page or dashboard since onboarding is complete
            router.push("/");
          }, 1500);
        }
      } else {
        showAlert("error", response.message || "Registration failed");
      }
    } catch (error) {
      console.error("Social login error:", error);
      showAlert(
        "error",
        error.message || "Registration failed. Please try again."
      );
    } finally {
      setLoading(false);
      if (loginType === 'apple') setAppleLoading(false);
      if (loginType === 'google') setGoogleLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    if (typeof window === "undefined") return;
    localStorage.removeItem("onboardingState");
    resetState();

    if (window.google && window.google.accounts) {
      const client = window.google.accounts.oauth2.initTokenClient({
        client_id:
          process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
        scope: "email profile openid",
        callback: (response) => {
          if (response && response.access_token) {
            // Get user info with access_token
            fetch("https://www.googleapis.com/oauth2/v3/userinfo", {
              headers: {
                Authorization: `Bearer ${response.access_token}`,
              },
            })
              .then((res) => res.json())
              .then((userInfo) => {
                const userData = {
                  email: userInfo.email,
                  username: userInfo.name || userInfo.email.split("@")[0],
                  platform: "web",
                  // userInfoId: userInfo.sub,
                };
                handleSocialLoginAPI(userData, 'google');
              })
              .catch((err) => {
                console.error("Google userinfo fetch error:", err);
                showAlert("error", "Google login failed. Please try again.");
              });
          } else {
            showAlert("error", "Google login failed. No token received.");
          }
        },
      });

      // Open the popup
      client.requestAccessToken();
    } else {
      // Mock fallback for dev
      const mockGoogleUser = {
        email: "user@gmail.com",
        username: "testuser",
        platform: "android",
        userInfoId: "google_" + Date.now(),
      };
      handleSocialLoginAPI(mockGoogleUser, 'google');
    }
  };

  useEffect(() => {
    if (!window.google || !window.google.accounts) return;

    window.google.accounts.id.initialize({
      client_id:
        process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
      callback: handleGoogleCallback,
      auto_select: false,
      cancel_on_tap_outside: true,
    });

    // window.google.accounts.id.renderButton(
    //   document.getElementById('google-signin-button'),
    //   { theme: 'outline', size: 'large', width: '100%' }
    // );
  }, []);

  const handleGoogleCallback = (response) => {
    try {
      const userInfo = JSON.parse(atob(response.credential.split(".")[1]));
      const userData = {
        email: userInfo.email,
        username: userInfo.name || userInfo.email.split("@")[0],
        platform: "android",
        userInfoId: userInfo.sub,
        // userInfoId: userInfo.sub
      };
      handleSocialLoginAPI(userData, 'google');
    } catch (error) {
      console.error("Error processing Google callback:", error);
      showAlert("error", "Failed to process Google login. Please try again.");
    }
  };






  useEffect(() => {
    if (typeof window === "undefined") return;

    const script = document.createElement("script");
    script.src =
      "https://appleid.cdn-apple.com/appleauth/static/jsapi/appleid/1/en_US/appleid.auth.js";
    script.async = true;

    script.onload = () => {
      console.log("Apple Sign-In script loaded");
      // Initialize AppleID once SDK is ready
      if (window.AppleID) {
        window.AppleID.auth.init({
          clientId: process.env.NEXT_PUBLIC_APPLE_CLIENT_ID, // replace with your real Apple clientId
          scope: "name email",
          redirectURI: process.env.NEXT_PUBLIC_APPLE_REDIRECT_URI, // must match Apple Dev settings
          usePopup: false,
        });
      }
    };

    document.head.appendChild(script);
  }, []);



  const handleAppleLogin = async () => {
    if (typeof window !== "undefined" && window.AppleID) {
      try {
        const response = await window.AppleID.auth.signIn();
        const userData = {
          email: response.authorization.id_token
            ? JSON.parse(atob(response.authorization.id_token.split(".")[1])).email
            : "user@icloud.com",
          username: response.user?.name?.firstName || "Apple User",
          platform: "ios",
          userInfoId: response.user?.sub || "apple_" + Date.now(),
        };
        handleSocialLoginAPI(userData, "apple");
      } catch (error) {
        console.error("Apple Sign-In error:", error);
        showAlert("error", "Apple Sign-In failed. Please try again.");
      }
    } else {
      showAlert("error", "Apple Sign-In SDK not loaded. Please try again.");
    }
  };


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
                <h3>Welcome To Troms!</h3>
                <p>
                  Join to track your progress and get personalized fitness
                  insights with AI.
                </p>
                <div className="login-innr">
                  <div className="login-btn">
                    <button
                      onClick={handleAppleLogin}
                      disabled={appleLoading || googleLoading}
                      className=""
                    >
                      <img
                        src="/images/apple-logo.svg"
                        className="me-2"
                        alt="Apple"
                      />
                      {appleLoading ? "Signing in..." : "Continue with Apple"}
                    </button>

                    <button
                      onClick={handleGoogleLogin}
                      disabled={appleLoading || googleLoading}
                      className=""
                    >
                      <img
                        src="/images/google-logo.svg"
                        className="me-2"
                        alt="Google"
                      />
                      {googleLoading ? "Signing in..." : "Continue with Google"}
                    </button>
                  </div>

                  {/* <p className="or-line">
                    <span>or</span>
                  </p> */}
                  {/* <p className="fz-16 fw-400">
                    Already have an account?{" "}
                    <Link href="/register" className="fw-600 clr">
                      Sign In
                    </Link>
                  </p> */}
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="auth-bttm">
          <p>
            <span>{state.currentStep}/</span> {state.totalSteps}
          </p>
        </div>
      </section>
    </>
  );
}

export default RegisterPage;
