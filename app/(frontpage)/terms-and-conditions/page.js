'use client';
import React from "react";
import { Activity } from "lucide-react";

// Terms content
const TermsContent = () => (
  <div className="container mx-auto max-w-4xl px-6 pb-20">
    <div className="prose prose-lg max-w-none">
      <h1 className="text-4xl font-bold mb-4 text-foreground">Terms of Use</h1>
      <p className="text-muted-foreground mb-8">Effective Date: July 11, 2025</p>

      <h2 className="text-2xl font-semibold mb-4 text-foreground">Welcome to Troms!</h2>
      <p className="text-foreground mb-8 leading-relaxed">
        These Terms of Use ("Terms") govern your access to and use of our app and services...
      </p>

      <h2 className="text-2xl font-semibold mb-4 text-foreground">1. Subscription and Payment</h2>
      <p className="text-foreground mb-4 leading-relaxed">
        Troms offers auto-renewing subscription plans to access premium features...
      </p>
      <ul className="mb-4 space-y-2 text-foreground">
        <li><strong>Monthly Subscription:</strong> $9.99 per month.</li>
        <li><strong>Yearly Subscription:</strong> $24.99 per year.</li>
      </ul>
      <p className="text-foreground mb-8 leading-relaxed">
        Your subscription automatically renews unless canceled at least 24 hours before the end of the current period...
      </p>

      <h2 className="text-2xl font-semibold mb-4 text-foreground">2. User Responsibilities</h2>
      <p className="text-foreground mb-4 leading-relaxed">
        You agree to use the app only for lawful purposes and in accordance with these Terms. You will not:
      </p>
      <ul className="mb-4 space-y-2 text-foreground">
        <li>- Violate any applicable laws or regulations.</li>
        <li>- Infringe on the rights of others.</li>
        <li>- Use the app in any way that may damage or impair it.</li>
        <li>- The AI-generated recommendations are for informational purposes only and not a substitute for professional advice.</li>
      </ul>

      <h2 className="text-2xl font-semibold mb-4 text-foreground">3. Intellectual Property</h2>
      <p className="text-foreground mb-8 leading-relaxed">
        All content and materials within the app are the property of Troms and protected by copyright...
      </p>

      <h2 className="text-2xl font-semibold mb-4 text-foreground">4. Termination</h2>
      <p className="text-foreground mb-8 leading-relaxed">
        We may suspend or terminate your access to the app at any time, without notice or liability, if you violate these Terms.
      </p>

      <h2 className="text-2xl font-semibold mb-4 text-foreground">5. Changes to Terms</h2>
      <p className="text-foreground mb-8 leading-relaxed">
        We reserve the right to modify these Terms at any time. Continued use of the app after changes means you accept the updated Terms.
      </p>

      <h2 className="text-2xl font-semibold mb-4 text-foreground">6. Contact</h2>
      <p className="text-foreground mb-4 leading-relaxed">
        If you have any questions, please contact us at <a href="mailto:nazim@bratesai.com" className="text-primary hover:underline">nazim@bratesai.com</a>.
      </p>
      <p className="text-foreground leading-relaxed">
        Privacy Policy: <a href="#" className="text-primary hover:underline">Link to Privacy Policy</a>
      </p>
    </div>
  </div>
);

const TermsAndConditions = () => {
  return (
    <div className="min-h-screen bg-background">

      <TermsContent />
    </div>
  );
};

export default TermsAndConditions;