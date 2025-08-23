'use client';

import React from 'react';

const PrivacyPolicy = () => {
  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const tocItems = [
    { id: 'information-we-collect', label: 'Information We Collect' },
    { id: 'how-we-use', label: 'How We Use Your Information' },
    { id: 'information-sharing', label: 'Information Sharing and Disclosure' },
    { id: 'data-security', label: 'Data Security' },
    { id: 'your-rights', label: 'Your Rights and Choices' },
    { id: 'cookies', label: 'Cookies and Tracking Technologies' },
    { id: 'third-party', label: 'Third-Party Services' },
    { id: 'children', label: 'Children\'s Privacy' },
    { id: 'changes', label: 'Changes to This Policy' },
    { id: 'contact', label: 'Contact Us' }
  ];

  return (
    <div className="min-h-screen bg-white font-sans">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-5 py-16">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-3 tracking-tight">
            Privacy Policy
          </h1>
          <p className="text-lg text-gray-600 mb-2">
            Your privacy is important to us
          </p>
          <p className="text-sm text-gray-500">
            Last updated: January 15, 2025
          </p>
        </div>
      </header>

      {/* Main Content */}
      <main className="py-12">
        <div className="max-w-4xl mx-auto px-5">
          <div className="policy-content">
            {/* Table of Contents */}
            <div className="bg-gray-50 p-6 rounded-lg border border-gray-200 mb-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Table of Contents
              </h3>
              <ul className="space-y-2">
                {tocItems.map((item) => (
                  <li key={item.id}>
                    <button
                      onClick={() => scrollToSection(item.id)}
                      className="text-gray-600 text-sm hover:text-blue-600 transition-colors duration-200 text-left"
                    >
                      {item.label}
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            {/* Quick Summary */}
            <div className="bg-gray-50 border-l-4 border-blue-500 p-6 rounded-r-lg mb-8">
              <p className="text-gray-700">
                <strong>Quick Summary:</strong> We collect information you provide directly, usage data, and device information to provide and improve our services. We don't sell your personal information and only share it when necessary to provide our services or when required by law.
              </p>
            </div>

            {/* Information We Collect */}
            <section id="information-we-collect" className="mb-10">
              <h2 className="text-3xl font-semibold text-gray-900 mb-5 border-b-2 border-gray-100 pb-2">
                Information We Collect
              </h2>
              
              <div className="mb-8">
                <h3 className="text-xl font-semibold text-gray-800 mb-4">
                  Information You Provide to Us
                </h3>
                <p className="text-gray-600 mb-4 leading-relaxed">
                  We collect information you directly provide to us, such as when you:
                </p>
                <ul className="list-disc pl-8 text-gray-600 space-y-2">
                  <li>Create an account or profile</li>
                  <li>Make a purchase or transaction</li>
                  <li>Subscribe to our newsletter or communications</li>
                  <li>Contact us for support or inquiries</li>
                  <li>Participate in surveys, contests, or promotions</li>
                  <li>Submit reviews, comments, or other content</li>
                </ul>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-gray-800 mb-4">
                  Information We Collect Automatically
                </h3>
                <p className="text-gray-600 mb-4 leading-relaxed">
                  When you use our services, we automatically collect certain information, including:
                </p>
                <ul className="list-disc pl-8 text-gray-600 space-y-2">
                  <li>Device information (IP address, browser type, operating system)</li>
                  <li>Usage data (pages viewed, time spent, clicks, searches)</li>
                  <li>Location information (when you enable location services)</li>
                  <li>Log data (access times, error logs, referrer URLs)</li>
                </ul>
              </div>
            </section>

            {/* How We Use Your Information */}
            <section id="how-we-use" className="mb-10">
              <h2 className="text-3xl font-semibold text-gray-900 mb-5 border-b-2 border-gray-100 pb-2">
                How We Use Your Information
              </h2>
              <p className="text-gray-600 mb-4 leading-relaxed">
                We use the information we collect for various purposes, including:
              </p>
              <ul className="list-disc pl-8 text-gray-600 space-y-2">
                <li>Providing and maintaining our services</li>
                <li>Processing transactions and sending confirmations</li>
                <li>Communicating with you about our services</li>
                <li>Personalizing your experience and content</li>
                <li>Analyzing and improving our services</li>
                <li>Preventing fraud and ensuring security</li>
                <li>Complying with legal obligations</li>
              </ul>
            </section>

            {/* Information Sharing and Disclosure */}
            <section id="information-sharing" className="mb-10">
              <h2 className="text-3xl font-semibold text-gray-900 mb-5 border-b-2 border-gray-100 pb-2">
                Information Sharing and Disclosure
              </h2>
              <p className="text-gray-600 mb-6 leading-relaxed">
                We may share your information in the following circumstances:
              </p>

              <div className="mb-6">
                <h3 className="text-xl font-semibold text-gray-800 mb-4">
                  Service Providers
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  We may share information with third-party service providers who perform services on our behalf, such as payment processing, data analysis, email delivery, and customer support.
                </p>
              </div>

              <div className="mb-6">
                <h3 className="text-xl font-semibold text-gray-800 mb-4">
                  Legal Requirements
                </h3>
                <p className="text-gray-600 mb-4 leading-relaxed">
                  We may disclose information if required by law, legal process, or government request, or if we believe it's necessary to:
                </p>
                <ul className="list-disc pl-8 text-gray-600 space-y-2">
                  <li>Comply with legal obligations</li>
                  <li>Protect our rights and property</li>
                  <li>Prevent fraud or security issues</li>
                  <li>Protect the safety of users and the public</li>
                </ul>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-gray-800 mb-4">
                  Business Transfers
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  If we're involved in a merger, acquisition, or sale of assets, your information may be transferred as part of that transaction.
                </p>
              </div>
            </section>

            {/* Data Security */}
            <section id="data-security" className="mb-10">
              <h2 className="text-3xl font-semibold text-gray-900 mb-5 border-b-2 border-gray-100 pb-2">
                Data Security
              </h2>
              <p className="text-gray-600 mb-4 leading-relaxed">
                We implement appropriate technical and organizational measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction. However, no method of transmission over the internet or electronic storage is 100% secure.
              </p>
              <p className="text-gray-600 mb-4 leading-relaxed">
                Our security measures include:
              </p>
              <ul className="list-disc pl-8 text-gray-600 space-y-2">
                <li>Encryption of data in transit and at rest</li>
                <li>Regular security assessments and updates</li>
                <li>Access controls and authentication requirements</li>
                <li>Employee training on data protection practices</li>
              </ul>
            </section>

            {/* Your Rights and Choices */}
            <section id="your-rights" className="mb-10">
              <h2 className="text-3xl font-semibold text-gray-900 mb-5 border-b-2 border-gray-100 pb-2">
                Your Rights and Choices
              </h2>
              <p className="text-gray-600 mb-6 leading-relaxed">
                Depending on your location, you may have certain rights regarding your personal information:
              </p>

              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-semibold text-gray-800 mb-3">
                    Access and Portability
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    You can request access to the personal information we hold about you and request a copy in a portable format.
                  </p>
                </div>

                <div>
                  <h3 className="text-xl font-semibold text-gray-800 mb-3">
                    Correction and Updates
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    You can update or correct your personal information through your account settings or by contacting us.
                  </p>
                </div>

                <div>
                  <h3 className="text-xl font-semibold text-gray-800 mb-3">
                    Deletion
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    You can request deletion of your personal information, subject to certain exceptions for legal compliance or legitimate business purposes.
                  </p>
                </div>

                <div>
                  <h3 className="text-xl font-semibold text-gray-800 mb-3">
                    Opt-Out
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    You can opt out of certain communications and data processing activities by adjusting your preferences or contacting us.
                  </p>
                </div>
              </div>
            </section>

            {/* Cookies and Tracking Technologies */}
            <section id="cookies" className="mb-10">
              <h2 className="text-3xl font-semibold text-gray-900 mb-5 border-b-2 border-gray-100 pb-2">
                Cookies and Tracking Technologies
              </h2>
              <p className="text-gray-600 mb-4 leading-relaxed">
                We use cookies and similar tracking technologies to collect and store information when you visit our website. These technologies help us:
              </p>
              <ul className="list-disc pl-8 text-gray-600 space-y-2 mb-6">
                <li>Remember your preferences and settings</li>
                <li>Analyze website traffic and user behavior</li>
                <li>Provide personalized content and advertisements</li>
                <li>Improve website functionality and user experience</li>
              </ul>
              <p className="text-gray-600 leading-relaxed">
                You can control cookie settings through your browser preferences. Note that disabling cookies may affect the functionality of our services.
              </p>
            </section>

            {/* Third-Party Services */}
            <section id="third-party" className="mb-10">
              <h2 className="text-3xl font-semibold text-gray-900 mb-5 border-b-2 border-gray-100 pb-2">
                Third-Party Services
              </h2>
              <p className="text-gray-600 mb-4 leading-relaxed">
                Our website may contain links to third-party websites or services. We are not responsible for the privacy practices of these third parties. We encourage you to read their privacy policies before providing any personal information.
              </p>
              <p className="text-gray-600 mb-4 leading-relaxed">
                We may also integrate third-party services such as:
              </p>
              <ul className="list-disc pl-8 text-gray-600 space-y-2">
                <li>Analytics tools (e.g., Google Analytics)</li>
                <li>Social media platforms</li>
                <li>Payment processors</li>
                <li>Customer support tools</li>
              </ul>
            </section>

            {/* Children's Privacy */}
            <section id="children" className="mb-10">
              <h2 className="text-3xl font-semibold text-gray-900 mb-5 border-b-2 border-gray-100 pb-2">
                Children's Privacy
              </h2>
              <p className="text-gray-600 leading-relaxed">
                Our services are not intended for children under the age of 13. We do not knowingly collect personal information from children under 13. If we become aware that we have collected personal information from a child under 13, we will take steps to delete such information.
              </p>
            </section>

            {/* Changes to This Privacy Policy */}
            <section id="changes" className="mb-10">
              <h2 className="text-3xl font-semibold text-gray-900 mb-5 border-b-2 border-gray-100 pb-2">
                Changes to This Privacy Policy
              </h2>
              <p className="text-gray-600 mb-4 leading-relaxed">
                We may update this Privacy Policy from time to time to reflect changes in our practices or applicable laws. We will notify you of any material changes by:
              </p>
              <ul className="list-disc pl-8 text-gray-600 space-y-2 mb-6">
                <li>Posting the updated policy on our website</li>
                <li>Sending you an email notification (if you have an account)</li>
                <li>Providing notice through our services</li>
              </ul>
              <p className="text-gray-600 leading-relaxed">
                Your continued use of our services after any changes constitutes acceptance of the updated Privacy Policy.
              </p>
            </section>

            {/* Contact Us */}
            <section id="contact" className="mb-10">
              <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
                <h2 className="text-3xl font-semibold text-gray-900 mb-5">
                  Contact Us
                </h2>
                <p className="text-gray-600 mb-4 leading-relaxed">
                  If you have any questions, concerns, or requests regarding this Privacy Policy or our data practices, please contact us:
                </p>
                <div className="space-y-2 text-gray-600">
                  <p><strong>Email:</strong> privacy@yourcompany.com</p>
                  <p><strong>Address:</strong> 123 Privacy Street, Data City, DC 12345</p>
                  <p><strong>Phone:</strong> +1 (555) 123-4567</p>
                </div>
                <p className="text-gray-600 mt-4">
                  We will respond to your inquiry within 30 days.
                </p>
              </div>
            </section>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-50 border-t border-gray-200 mt-16">
        <div className="max-w-4xl mx-auto px-5 py-10">
          <p className="text-center text-gray-500 text-sm">
            &copy; 2025 Your Company Name. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default PrivacyPolicy;