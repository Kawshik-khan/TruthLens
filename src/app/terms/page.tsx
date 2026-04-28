"use client";

import Link from "next/link";
import { config } from "@/lib/config";

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-[#0A0F1F] text-[#F8FAFC] py-12 px-6">
      <div className="max-w-4xl mx-auto space-y-12">
        {/* Header */}
        <div className="text-center space-y-4">
          <Link href="/auth" className="inline-flex items-center text-[#4F7CFF] hover:text-[#6B8FFF] transition-colors">
            <span className="material-icons mr-2">arrow_back</span>
            Back to Authentication
          </Link>
          <h1 className="text-4xl font-bold">Terms & Privacy Policy</h1>
          <p className="text-[#94A3B8] text-lg">
            Last updated: {new Date().toLocaleDateString()}
          </p>
        </div>

        {/* Terms of Service */}
        <section className="space-y-6">
          <h2 className="text-2xl font-bold text-[#4F7CFF]">Terms of Service</h2>
          
          <div className="space-y-4 text-[#94A3B8]">
            <div>
              <h3 className="text-xl font-semibold text-[#F8FAFC] mb-2">1. Acceptance of Terms</h3>
              <p>
                By accessing and using {config.app.name}, you accept and agree to be bound by the terms and provision of this agreement.
              </p>
            </div>

            <div>
              <h3 className="text-xl font-semibold text-[#F8FAFC] mb-2">2. Use License</h3>
              <p>
                Permission is granted to temporarily download one copy of {config.app.name} materials for personal, non-commercial transitory viewing only. This is the grant of a license, not a transfer of title.
              </p>
            </div>

            <div>
              <h3 className="text-xl font-semibold text-[#F8FAFC] mb-2">3. Disclaimer</h3>
              <p>
                The materials on {config.app.name} are provided on an 'as is' basis. {config.app.name} makes no warranties, expressed or implied, and hereby disclaims and negates all other warranties including without limitation, implied warranties or conditions of merchantability, fitness for a particular purpose, or non-infringement of intellectual property or other violation of rights.
              </p>
            </div>

            <div>
              <h3 className="text-xl font-semibold text-[#F8FAFC] mb-2">4. Limitations</h3>
              <p>
                In no event shall {config.app.name} or its suppliers be liable for any damages (including, without limitation, damages for loss of data or profit, or due to business interruption) arising out of the use or inability to use the materials on {config.app.name}.
              </p>
            </div>

            <div>
              <h3 className="text-xl font-semibold text-[#F8FAFC] mb-2">5. Accuracy of Materials</h3>
              <p>
                The materials appearing on {config.app.name} could include technical, typographical, or photographic errors. {config.app.name} does not warrant that any of the materials on its website are accurate, complete, or current.
              </p>
            </div>

            <div>
              <h3 className="text-xl font-semibold text-[#F8FAFC] mb-2">6. User Content</h3>
              <p>
                Users are responsible for the content they submit to {config.app.name}. By submitting content, you grant {config.app.name} a worldwide, non-exclusive, royalty-free license to use, reproduce, and display such content.
              </p>
            </div>
          </div>
        </section>

        {/* Privacy Policy */}
        <section className="space-y-6">
          <h2 className="text-2xl font-bold text-[#4F7CFF]">Privacy Policy</h2>
          
          <div className="space-y-4 text-[#94A3B8]">
            <div>
              <h3 className="text-xl font-semibold text-[#F8FAFC] mb-2">1. Information We Collect</h3>
              <p>
                We collect information you provide directly to us, such as when you create an account, use our services, or contact us for support.
              </p>
            </div>

            <div>
              <h3 className="text-xl font-semibold text-[#F8FAFC] mb-2">2. How We Use Your Information</h3>
              <p>
                We use the information we collect to provide, maintain, and improve our services, process transactions, and communicate with you.
              </p>
            </div>

            <div>
              <h3 className="text-xl font-semibold text-[#F8FAFC] mb-2">3. Data Security</h3>
              <p>
                We implement appropriate technical and organizational measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction.
              </p>
            </div>

            <div>
              <h3 className="text-xl font-semibold text-[#F8FAFC] mb-2">4. Cookies and Tracking</h3>
              <p>
                We use cookies and similar tracking technologies to track activity on our service and hold certain information to improve your experience.
              </p>
            </div>

            <div>
              <h3 className="text-xl font-semibold text-[#F8FAFC] mb-2">5. Third-Party Services</h3>
              <p>
                Our service may contain links to third-party websites or services. We are not responsible for the privacy practices of these third-party services.
              </p>
            </div>

            <div>
              <h3 className="text-xl font-semibold text-[#F8FAFC] mb-2">6. Data Retention</h3>
              <p>
                We retain your personal information for as long as necessary to provide our services and fulfill the purposes outlined in this privacy policy.
              </p>
            </div>

            <div>
              <h3 className="text-xl font-semibold text-[#F8FAFC] mb-2">7. Your Rights</h3>
              <p>
                You have the right to access, update, or delete your personal information. You may also opt out of certain communications from us.
              </p>
            </div>

            <div>
              <h3 className="text-xl font-semibold text-[#F8FAFC] mb-2">8. Children's Privacy</h3>
              <p>
                Our service is not intended for children under the age of 13. We do not knowingly collect personally identifiable information from children under 13.
              </p>
            </div>
          </div>
        </section>

        {/* Contact Information */}
        <section className="space-y-6">
          <h2 className="text-2xl font-bold text-[#4F7CFF]">Contact Us</h2>
          <div className="text-[#94A3B8] space-y-2">
            <p>If you have any questions about these Terms & Privacy Policy, please contact us:</p>
            <p>Email: <a href={`mailto:${config.app.supportEmail}`} className="text-[#4F7CFF] hover:text-[#6B8FFF] transition-colors">{config.app.supportEmail}</a></p>
          </div>
        </section>

        {/* Footer */}
        <div className="border-t border-[#1e293b] pt-8 text-center text-[#94A3B8]">
          <p>&copy; {new Date().getFullYear()} {config.app.name}. All rights reserved.</p>
        </div>
      </div>
    </div>
  );
}
