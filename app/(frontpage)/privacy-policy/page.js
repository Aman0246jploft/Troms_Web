import React from "react";

function page() {
  return (
    <>
      <div className="container">
        <main className="policy">
          <h1 className="policy__title text-center">Privacy Policy</h1>
          We use Google's Gemini AI API to process your fitness data and
          generate personalized recommendations. Your data is transmitted
          securely to Google's servers for AI processing.
          <p className="policy__text">
            Google's use of your data is governed by their own privacy policy.
            We recommend reviewing Google's AI Privacy Policy for detailed
            information.
          </p>
          <p className="policy__text">
            We may also use other trusted third-party services for:
          </p>
          <ul className="policy__list">
            <li className="policy__list-item">
              Analytics and app performance monitoring
            </li>
            <li className="policy__list-item">Cloud storage and data backup</li>
            <li className="policy__list-item">
              Customer support and communication
            </li>
            <li className="policy__list-item">
              Payment processing (if applicable)
            </li>
          </ul>
          <section className="policy__section" id="data-security">
            <h2 className="policy__section-title">Data Security</h2>
            <ul className="policy__list">
              <li className="policy__list-item">
                <strong>Encryption:</strong> All data is encrypted in transit
                and at rest using industry-standard protocols.
              </li>
              <li className="policy__list-item">
                <strong>Access Controls:</strong> Strict access controls ensure
                only authorized personnel can access your data.
              </li>
              <li className="policy__list-item">
                <strong>Regular Audits:</strong> We conduct regular security
                audits and vulnerability assessments.
              </li>
              <li className="policy__list-item">
                <strong>Minimal Data:</strong> We collect only the minimum data
                necessary to provide our services.
              </li>
            </ul>
          </section>
          <section className="policy__section" id="your-rights">
            <h2 className="policy__section-title">Your Rights and Choices</h2>
            <ul className="policy__list">
              <li className="policy__list-item">
                <strong>Access Your Data:</strong> Request a copy of the
                personal information we hold about you.
              </li>
              <li className="policy__list-item">
                <strong>Correct Your Data:</strong> Update or correct any
                inaccurate personal information.
              </li>
              <li className="policy__list-item">
                <strong>Delete Your Data:</strong> Request deletion of your
                personal information (subject to legal requirements).
              </li>
              <li className="policy__list-item">
                <strong>Data Portability:</strong> Receive your data in a
                structured, commonly used format.
              </li>
            </ul>
          </section>
          <section className="policy__section" id="data-retention">
            <h2 className="policy__section-title">Data Retention</h2>
            <p className="policy__text">
              We retain your personal information only as long as necessary to
              provide our services and fulfill the purposes outlined in this
              policy. Specifically:
            </p>
            <ul className="policy__list">
              <li className="policy__list-item">
                Account data is retained while your account is active
              </li>
              <li className="policy__list-item">
                Usage data is typically retained for 24 months for analytics
                purposes
              </li>
              <li className="policy__list-item">
                Data required for legal compliance may be retained longer as
                required by law
              </li>
              <li className="policy__list-item">
                Upon account deletion, most data is removed within 30 days
              </li>
            </ul>
          </section>
          <section className="policy__section" id="children">
            <h2 className="policy__section-title">Children's Privacy</h2>
            <p className="policy__text">
              Our app is not intended for children under 17 years of age. We do
              not knowingly collect personal information from children under 17.
              If you become aware that a child has provided us with personal
              information, please contact us immediately.
            </p>
          </section>
          <section className="policy__section" id="international-transfers">
            <h2 className="policy__section-title">
              International Data Transfers
            </h2>
            <p className="policy__text">
              Your information may be transferred to and processed in countries
              other than your country of residence. These countries may have
              data protection laws that are different from those of your
              country. We ensure appropriate safeguards are in place to protect
              your information in accordance with this Privacy Policy.
            </p>
          </section>
          <section className="policy__section" id="changes">
            <h2 className="policy__section-title">Changes to This Policy</h2>
            <p className="policy__text">
              We may update this Privacy Policy from time to time. We will
              notify you of any material changes by posting the new Privacy
              Policy in the app and updating the "Last updated" date. Your
              continued use of the app after such modifications constitutes
              acceptance of the updated Privacy Policy.
            </p>
          </section>
          <section className="policy__section" id="contact">
            <h2 className="policy__section-title">Contact Us</h2>
            <p className="policy__text">
              If you have any questions about this Privacy Policy or our data
              practices, please contact us:
            </p>
            <address className="policy__contact">
              Email:{" "}
              <a className="policy__link" href="mailto:nazim@bratesai.com">
                nazim@bratesai.com
              </a>
            </address>
          </section>
        </main>
      </div>
    </>
  );
}

export default page;
