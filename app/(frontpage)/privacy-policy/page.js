"use client";
import React, { useState, useEffect } from "react";
import { apiService } from "../../../lib/api";

const PrivacyPolicy = () => {
  const [privacyContent, setPrivacyContent] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPrivacyPolicy();
  }, []);

  const fetchPrivacyPolicy = async () => {
    try {
      const response = await apiService.privacyPolicy();
      if (response.success) {
        const data = await response;
        if (data.success && data.result) {
          setPrivacyContent(data.result.content);
        } else {
          // Fallback content if no privacy policy found
          setPrivacyContent(getDefaultPrivacyContent());
        }
      } else {
        setPrivacyContent(getDefaultPrivacyContent());
      }
    } catch (error) {
      console.error("Failed to fetch privacy policy:", error);
      setPrivacyContent(getDefaultPrivacyContent());
    } finally {
      setLoading(false);
    }
  };

  const getDefaultPrivacyContent = () => {
    return `
      <h1>Privacy Policy</h1>
      
      <p>We use Google's Gemini AI API to process your fitness data and generate personalized recommendations. Your data is transmitted securely to Google's servers for AI processing.</p>
      
      <p>Google's use of your data is governed by their own privacy policy. We recommend reviewing Google's AI Privacy Policy for detailed information.</p>
      
      <p>We may also use other trusted third-party services for:</p>
      
      <ul>
        <li>Analytics and app performance monitoring</li>
        <li>Cloud storage and data backup</li>
        <li>Customer support and communication</li>
        <li>Payment processing (if applicable)</li>
      </ul>
      
      <h2>Data Security</h2>
      <ul>
        <li><strong>Encryption:</strong> All data is encrypted in transit and at rest using industry-standard protocols.</li>
        <li><strong>Access Controls:</strong> Strict access controls ensure only authorized personnel can access your data.</li>
        <li><strong>Regular Audits:</strong> We conduct regular security audits and vulnerability assessments.</li>
        <li><strong>Data Minimization:</strong> We only collect and process data necessary for providing our services.</li>
      </ul>
      
      <h2>Your Rights</h2>
      <p>You have the right to:</p>
      <ul>
        <li>Access your personal data</li>
        <li>Correct inaccurate information</li>
        <li>Delete your account and data</li>
        <li>Export your data</li>
        <li>Opt-out of certain data processing activities</li>
      </ul>
      
      <h2>Data Retention</h2>
      <p>We retain your data only as long as necessary to provide our services and comply with legal obligations. You can request deletion of your account and associated data at any time.</p>
      
      <h2>Children's Privacy</h2>
      <p>Our service is not intended for children under 13. We do not knowingly collect personal information from children under 13.</p>
      
      <h2>International Data Transfers</h2>
      <p>Your data may be transferred to and processed in countries other than your own. We ensure appropriate safeguards are in place for such transfers.</p>
      
      <h2>Contact Us</h2>
      <p>If you have any questions about this Privacy Policy, please contact us at privacy@troms.app</p>
    `;
  };

  if (loading) {
    return (
      <div className="container">
        <main className="policy">
          <div className="flex justify-center items-center min-h-[400px]">
            <div className="text-gray-600">Loading privacy policy...</div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <>
      <div className="container">
        <main className="policy">
          <div
            className="policy-content"
            dangerouslySetInnerHTML={{ __html: privacyContent }}
          />
        </main>
      </div>

      <style jsx>{`
        .policy {
          max-width: 800px;
          margin: 0 auto;
          padding: 20px;
          line-height: 1.6;
        }

        .policy-content h1 {
          font-size: 2.5rem;
          font-weight: bold;
          margin-bottom: 1rem;
          text-align: center;
          color: #1f2937;
        }

        .policy-content h2 {
          font-size: 1.5rem;
          font-weight: 600;
          margin-top: 2rem;
          margin-bottom: 1rem;
          color: #374151;
        }

        .policy-content p {
          margin-bottom: 1rem;
          color: #6b7280;
        }

        .policy-content ul {
          margin-bottom: 1rem;
          padding-left: 2rem;
        }

        .policy-content li {
          margin-bottom: 0.5rem;
          color: #6b7280;
        }

        .policy-content strong {
          font-weight: 600;
          color: #374151;
        }
      `}</style>
    </>
  );
};

export default PrivacyPolicy;
