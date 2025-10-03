"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { apiService } from "../../../lib/api";
import { useOnboarding } from "../../../context/OnboardingContext";

export default function AppleCallbackPage() {
  const router = useRouter();
  const { setUser, updateStep } = useOnboarding();
  const [error, setError] = useState(null);
  const [processing, setProcessing] = useState(true);

  useEffect(() => {
    const handleRedirect = async () => {
      const params = new URLSearchParams(window.location.search);
      const code = params.get("code");
      const state = params.get("state");
      const user = params.get("user"); // Apple may send user data on first sign-in

      console.log("Apple callback params:", { code, state, user });

      if (!code) {
        console.error("No code returned from Apple");
        setError("Apple Sign-In failed: No authorization code received");
        setProcessing(false);
        setTimeout(() => router.push("/register"), 3000);
        return;
      }

      try {
        // Send the code to your backend to exchange for id_token & validate
        const response = await apiService.appleLogin({ code, state });

        console.log("Apple login response:", response);

        if (response.success) {
          const needsOnboarding = response.message === "User information is required";
          
          // Update user state with data from response
          const userData = {
            email: response.data?.userInfo?.email || "",
            username: response.data?.userInfo?.username || "",
            platform: response.data?.userInfo?.platform || "ios",
            userInfoId: response.data?.userInfo?.userInfoId || response.data?.userInfo?.id,
          };

          setUser({
            userData: userData,
            needsOnboarding: needsOnboarding,
          });
          updateStep(2);

          if (needsOnboarding) {
            // New user - proceed to onboarding
            router.push("/select-gender");
          } else {
            // Existing user - redirect to dashboard
            window.alert("You have already completed onboarding. Redirecting to dashboard.");
            router.push("/");
          }
        } else {
          setError(response.message || "Apple Sign-In failed");
          console.error("Apple login error:", response.message);
          setTimeout(() => router.push("/register"), 3000);
        }
      } catch (err) {
        console.error("Apple login failed:", err);
        setError("An error occurred during Apple Sign-In");
        setTimeout(() => router.push("/register"), 3000);
      } finally {
        setProcessing(false);
      }
    };

    handleRedirect();
  }, [router, setUser, updateStep]);

  return (
    <div style={{ 
      display: 'flex', 
      flexDirection: 'column',
      alignItems: 'center', 
      justifyContent: 'center', 
      minHeight: '100vh',
      padding: '20px',
      textAlign: 'center'
    }}>
      {processing && (
        <>
          <div style={{ marginBottom: '20px' }}>
            <img src="/images/dark-logo.svg" alt="Troms Logo" style={{ width: '150px' }} />
          </div>
          <h2>Logging in with Apple...</h2>
          <p>Please wait while we complete your sign-in.</p>
        </>
      )}
      {error && (
        <>
          <h2 style={{ color: 'red' }}>Error</h2>
          <p>{error}</p>
          <p>Redirecting you back to the registration page...</p>
        </>
      )}
    </div>
  );
}
