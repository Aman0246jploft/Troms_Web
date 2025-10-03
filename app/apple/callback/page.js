"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { apiService } from "../../../lib/api";



export default function AppleCallbackPage() {
  const router = useRouter();

  useEffect(() => {
    const handleRedirect = async () => {
      const params = new URLSearchParams(window.location.search);
      const code = params.get("code");
      const state = params.get("state");

      if (!code) {
        console.error("No code returned from Apple");
        return;
      }

      try {
        // Send the code to your backend to exchange for id_token & validate
        const response = await apiService.appleLogin({ code, state });

        if (response.success) {
          // Redirect user after successful login
          router.push("/select-gender"); // or dashboard
        } else {
          console.error(response.message);
        }
      } catch (err) {
        console.error("Apple login failed:", err);
      }
    };

    handleRedirect();
  }, [router]);

  return <p>Logging in with Apple...</p>;
}
