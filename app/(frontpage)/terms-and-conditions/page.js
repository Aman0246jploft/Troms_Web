"use client";
import React, { useState, useEffect } from "react";
import { apiService } from "../../../lib/api";

const TermsAndConditions = () => {
  const [termsContent, setTermsContent] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTermsAndConditions();
  }, []);

  const fetchTermsAndConditions = async () => {
    try {
      const response = await apiService.termsandconditions();

      if (response.success) {
        const data = await response;
        if (data.success && data.result) {
          setTermsContent(data.result.content);
        } else {
          // Fallback content if no terms found
          setTermsContent(getDefaultTermsContent());
        }
      } else {
        setTermsContent(getDefaultTermsContent());
      }
    } catch (error) {
      console.error("Failed to fetch terms and conditions:", error);
      setTermsContent(getDefaultTermsContent());
    } finally {
      setLoading(false);
    }
  };

  const getDefaultTermsContent = () => {
    return `
      <h1>Terms of Use</h1>
      <p>Welcome to Troms!</p>
      
      <p>These Terms of Use ("Terms") govern your access to and use of our app and services. Troms is an AI-powered fitness companion designed to help you achieve your health and fitness goals through personalized meal plans and workout routines. Our service includes personalized content, tracking tools, and community features, all powered by advanced AI.</p>
      
      <h2>1. Subscription and Payment</h2>
      <p>Troms offers auto-renewing subscription plans to access premium features. By subscribing, you agree to the pricing, payment, and billing policies applicable to such fees and charges.</p>
      
      <ul>
        <li><strong>Monthly Subscription:</strong> $9.99 per month.</li>
        <li><strong>Yearly Subscription:</strong> $24.99 per year.</li>
      </ul>
      
      <p>We may offer a 3-day free trial period for new users. After the 3-day free trial, your subscription will automatically renew to a monthly subscription at $9.99, unless you cancel before the trial period ends.</p>
      
      <p>Subscription charges will be billed to your Apple ID account. Your subscription will automatically renew unless auto-renew is turned off at least 24 hours before the end of the current period.</p>
      
      <h2>2. Use of AI Technology</h2>
      <p>Troms utilizes artificial intelligence to provide personalized fitness and nutrition recommendations. While we strive for accuracy, AI-generated content should not replace professional medical or fitness advice.</p>
      
      <h2>3. User Responsibilities</h2>
      <p>You are responsible for maintaining the confidentiality of your account and for all activities that occur under your account. You agree to use the service only for lawful purposes.</p>
      
      <h2>4. Privacy and Data</h2>
      <p>Your privacy is important to us. Please review our Privacy Policy to understand how we collect, use, and protect your information.</p>
      
      <h2>5. Limitation of Liability</h2>
      <p>Troms is provided "as is" without warranties of any kind. We shall not be liable for any indirect, incidental, special, or consequential damages.</p>
      
      <h2>6. Changes to Terms</h2>
      <p>We reserve the right to modify these terms at any time. Continued use of the service after changes constitutes acceptance of the new terms.</p>
      
      <p>For questions about these Terms of Use, please contact us at support@troms.app</p>
    `;
  };

  if (loading) {
    return (
      <div className="container">
        <main className="terms">
          <div className="flex justify-center items-center min-h-[400px]">
            <div className="text-gray-600">Loading terms and conditions...</div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <>
      <div className="container">
        <main className="terms">
          <div
            className="terms-content"
            dangerouslySetInnerHTML={{ __html: termsContent }}
          />
        </main>
      </div>

      <style jsx>{`
        .terms {
          max-width: 800px;
          margin: 0 auto;
          padding: 20px;
          line-height: 1.6;
        }

        .terms-content h1 {
          font-size: 2.5rem;
          font-weight: bold;
          margin-bottom: 1rem;
          text-align: center;
          color: #1f2937;
        }

        .terms-content h2 {
          font-size: 1.5rem;
          font-weight: 600;
          margin-top: 2rem;
          margin-bottom: 1rem;
          color: #374151;
        }

        .terms-content p {
          margin-bottom: 1rem;
          color: #6b7280;
        }

        .terms-content ul {
          margin-bottom: 1rem;
          padding-left: 2rem;
        }

        .terms-content li {
          margin-bottom: 0.5rem;
          color: #6b7280;
        }

        .terms-content strong {
          font-weight: 600;
          color: #374151;
        }
      `}</style>
    </>
  );
};

export default TermsAndConditions;
