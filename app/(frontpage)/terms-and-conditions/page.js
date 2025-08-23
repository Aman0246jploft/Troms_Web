"use client";
import React from "react";
import { Activity } from "lucide-react";

const TermsAndConditions = () => {
  return (
    <>
      <div className="container">
        <main className="terms">
          <header className="terms__header">
            <h1 className="terms__title">Terms of Use</h1>
            <p className="terms__welcome">Welcome to Troms!</p>
          </header>

          <section className="terms__section" id="introduction">
            <p className="terms__text">
              These Terms of Use (“Terms”) govern your access to and use of our
              app and services. Troms is an AI-powered fitness companion
              designed to help you achieve your health and fitness goals through
              personalized meal plans and workout routines. Our service includes
              personalized content, tracking tools, and community features, all
              powered by advanced AI.
            </p>
          </section>

          <section className="terms__section" id="subscription">
            <h2 className="terms__section-title">
              1. Subscription and Payment
            </h2>
            <p className="terms__text">
              Troms offers auto-renewing subscription plans to access premium
              features. By subscribing, you agree to the pricing, payment, and
              billing policies applicable to such fees and charges.
            </p>
            <ul className="terms__list">
              <li className="terms__list-item">
                <strong>Monthly Subscription:</strong> $9.99 per month.
              </li>
              <li className="terms__list-item">
                <strong>Yearly Subscription:</strong> $24.99 per year.
              </li>
            </ul>
            <p className="terms__text">
              We may offer a 3-day free trial period for new users. After the
              3-day free trial, your subscription will automatically renew to a
              monthly subscription at $9.99, unless you cancel before the trial
              period ends.
            </p>
            <p className="terms__text">
              Subscription charges will be billed to your Apple ID account.
            </p>
            <p className="terms__text">
              Your subscription automatically renews unless canceled at least 24
              hours before the end of the current period. You can manage or
              cancel your subscription in your device Settings &gt; Apple ID
              &gt; Subscriptions. No refunds will be provided for partial
              subscription periods.
            </p>
          </section>

          <section className="terms__section" id="user-responsibilities">
            <h2 className="terms__section-title">2. User Responsibilities</h2>
            <p className="terms__text">
              You agree to use the app only for lawful purposes and in
              accordance with these Terms. You will not:
            </p>
            <ul className="terms__list">
              <li className="terms__list-item">
                Violate any applicable laws or regulations.
              </li>
              <li className="terms__list-item">
                Infringe on the rights of others.
              </li>
              <li className="terms__list-item">
                Use the app in any way that may damage, disable, or impair the
                app or interfere with another user’s access.
              </li>
            </ul>
            <p className="terms__text">
              The AI-generated recommendations are for informational purposes
              only and are not a substitute for professional medical or
              nutritional advice. Always consult with a qualified healthcare
              professional before making any decisions about your health.
            </p>
          </section>

          <section className="terms__section" id="intellectual-property">
            <h2 className="terms__section-title">3. Intellectual Property</h2>
            <p className="terms__text">
              All content and materials within the app are the property of Troms
              and protected by copyright and other intellectual property laws.
            </p>
          </section>

          <section className="terms__section" id="termination">
            <h2 className="terms__section-title">4. Termination</h2>
            <p className="terms__text">
              We may suspend or terminate your access to the app at any time,
              without notice or liability, if you violate these Terms.
            </p>
          </section>

          <section className="terms__section" id="changes">
            <h2 className="terms__section-title">5. Changes to Terms</h2>
            <p className="terms__text">
              We reserve the right to modify these Terms at any time. Continued
              use of the app after changes means you accept the updated Terms.
            </p>
          </section>

          <section className="terms__section" id="contact">
            <h2 className="terms__section-title">6. Contact</h2>
            <p className="terms__text">
              If you have any questions or concerns, please contact us at{" "}
              <a className="terms__link" href="mailto:nazim@bratesai.com">
                nazim@bratesai.com
              </a>
              .
            </p>
          </section>
        </main>
      </div>
    </>
  );
};

export default TermsAndConditions;
