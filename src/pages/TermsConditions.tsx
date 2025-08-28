import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, FileText, CheckCircle, AlertTriangle, Scale, Users } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

const TermsConditions = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Back to Home */}
        <Link 
          to="/" 
          className="inline-flex items-center text-muted-foreground hover:text-primary mb-6 transition-colors"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Home
        </Link>

        {/* Header */}
        <div className="text-center mb-8">
          <div className="bg-primary/10 p-4 rounded-full w-16 h-16 mx-auto mb-4">
            <FileText className="h-8 w-8 text-primary mx-auto" />
          </div>
          <h1 className="text-3xl font-bold text-foreground mb-2">Terms & Conditions</h1>
          <p className="text-muted-foreground">Last updated: {new Date().toLocaleDateString()}</p>
        </div>

        <div className="prose prose-gray max-w-none">
          <div className="bg-card border border-border rounded-lg p-6 mb-6">
            <h2 className="text-xl font-semibold mb-4 flex items-center">
              <CheckCircle className="h-5 w-5 mr-2 text-primary" />
              Acceptance of Terms
            </h2>
            <div className="space-y-4">
              <p className="text-muted-foreground">
                By accessing and using School Finder Odisha ("the Service"), you accept and agree to be bound by the terms and provision of this agreement. If you do not agree to abide by the above, please do not use this service.
              </p>
            </div>
          </div>

          <div className="bg-card border border-border rounded-lg p-6 mb-6">
            <h2 className="text-xl font-semibold mb-4 flex items-center">
              <Users className="h-5 w-5 mr-2 text-primary" />
              User Accounts and Registration
            </h2>
            <div className="space-y-4">
              <p className="text-muted-foreground">
                To access certain features of our service, you must create an account. You agree to:
              </p>
              <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                <li>Provide accurate, current, and complete information during registration</li>
                <li>Maintain and update your account information to keep it accurate</li>
                <li>Maintain the security of your password and account</li>
                <li>Accept responsibility for all activities under your account</li>
                <li>Notify us immediately of any unauthorized use of your account</li>
                <li>Be at least 13 years old to create an account</li>
              </ul>
            </div>
          </div>

          <div className="bg-card border border-border rounded-lg p-6 mb-6">
            <h2 className="text-xl font-semibold mb-4 flex items-center">
              <Scale className="h-5 w-5 mr-2 text-primary" />
              Acceptable Use Policy
            </h2>
            <div className="space-y-4">
              <p className="text-muted-foreground">
                You agree not to use the Service to:
              </p>
              <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                <li>Violate any applicable laws or regulations</li>
                <li>Infringe upon the rights of others</li>
                <li>Submit false, misleading, or fraudulent information</li>
                <li>Harass, abuse, or harm other users</li>
                <li>Attempt to gain unauthorized access to our systems</li>
                <li>Use automated tools to access or scrape our website</li>
                <li>Interfere with the proper functioning of the Service</li>
                <li>Post content that is defamatory, obscene, or inappropriate</li>
              </ul>
            </div>
          </div>

          <div className="bg-card border border-border rounded-lg p-6 mb-6">
            <h2 className="text-xl font-semibold mb-4">School Information and Reviews</h2>
            <div className="space-y-4">
              <p className="text-muted-foreground">
                Our platform provides information about schools and allows users to submit reviews and ratings. You understand that:
              </p>
              <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                <li>School information is provided for informational purposes only</li>
                <li>We strive for accuracy but cannot guarantee all information is current or complete</li>
                <li>Reviews and ratings represent individual user opinions</li>
                <li>You should verify information directly with schools before making decisions</li>
                <li>We reserve the right to moderate and remove inappropriate content</li>
                <li>You are responsible for the accuracy and appropriateness of your reviews</li>
              </ul>
            </div>
          </div>

          <div className="bg-card border border-border rounded-lg p-6 mb-6">
            <h2 className="text-xl font-semibold mb-4">Intellectual Property Rights</h2>
            <div className="space-y-4">
              <p className="text-muted-foreground">
                The Service and its original content, features, and functionality are owned by School Finder Odisha and are protected by international copyright, trademark, patent, trade secret, and other intellectual property laws.
              </p>
              <p className="text-muted-foreground">
                You retain ownership of content you submit, but grant us a license to use, display, and distribute your content in connection with the Service.
              </p>
            </div>
          </div>

          <div className="bg-card border border-border rounded-lg p-6 mb-6">
            <h2 className="text-xl font-semibold mb-4">Privacy and Data Protection</h2>
            <div className="space-y-4">
              <p className="text-muted-foreground">
                Your privacy is important to us. Our collection and use of personal information is governed by our Privacy Policy, which is incorporated into these Terms by reference.
              </p>
              <p className="text-muted-foreground">
                By using our Service, you consent to the collection and use of information as outlined in our Privacy Policy.
              </p>
            </div>
          </div>

          <div className="bg-card border border-border rounded-lg p-6 mb-6">
            <h2 className="text-xl font-semibold mb-4 flex items-center">
              <AlertTriangle className="h-5 w-5 mr-2 text-primary" />
              Disclaimers and Limitations
            </h2>
            <div className="space-y-4">
              <p className="text-muted-foreground">
                The Service is provided "as is" and "as available" without warranties of any kind. We disclaim all warranties, express or implied, including but not limited to:
              </p>
              <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                <li>Warranties of merchantability and fitness for a particular purpose</li>
                <li>Warranties that the Service will be uninterrupted or error-free</li>
                <li>Warranties regarding the accuracy or completeness of information</li>
                <li>Warranties that defects will be corrected</li>
              </ul>
              <p className="text-muted-foreground">
                In no event shall School Finder Odisha be liable for any indirect, incidental, special, consequential, or punitive damages arising out of or relating to your use of the Service.
              </p>
            </div>
          </div>

          <div className="bg-card border border-border rounded-lg p-6 mb-6">
            <h2 className="text-xl font-semibold mb-4">Indemnification</h2>
            <div className="space-y-4">
              <p className="text-muted-foreground">
                You agree to indemnify and hold harmless School Finder Odisha, its officers, directors, employees, and agents from and against any claims, damages, obligations, losses, liabilities, costs, or debt arising from:
              </p>
              <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                <li>Your use of the Service</li>
                <li>Your violation of these Terms</li>
                <li>Your violation of any third-party rights</li>
                <li>Any content you submit to the Service</li>
              </ul>
            </div>
          </div>

          <div className="bg-card border border-border rounded-lg p-6 mb-6">
            <h2 className="text-xl font-semibold mb-4">Termination</h2>
            <div className="space-y-4">
              <p className="text-muted-foreground">
                We may terminate or suspend your account and access to the Service immediately, without prior notice, for any reason, including breach of these Terms. Upon termination:
              </p>
              <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                <li>Your right to use the Service will cease immediately</li>
                <li>We may delete your account and associated data</li>
                <li>Provisions of these Terms that should survive termination will remain in effect</li>
              </ul>
            </div>
          </div>

          <div className="bg-card border border-border rounded-lg p-6 mb-6">
            <h2 className="text-xl font-semibold mb-4">Governing Law</h2>
            <div className="space-y-4">
              <p className="text-muted-foreground">
                These Terms shall be governed by and construed in accordance with the laws of India, without regard to its conflict of law provisions. Any disputes arising from these Terms or your use of the Service shall be subject to the exclusive jurisdiction of the courts in Odisha, India.
              </p>
            </div>
          </div>

          <div className="bg-card border border-border rounded-lg p-6 mb-6">
            <h2 className="text-xl font-semibold mb-4">Changes to Terms</h2>
            <div className="space-y-4">
              <p className="text-muted-foreground">
                We reserve the right to modify these Terms at any time. We will notify users of any material changes by posting the new Terms on this page and updating the "Last updated" date. Your continued use of the Service after such modifications constitutes acceptance of the updated Terms.
              </p>
            </div>
          </div>

          <div className="bg-card border border-border rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-4">Contact Information</h2>
            <div className="space-y-4">
              <p className="text-muted-foreground">
                If you have any questions about these Terms & Conditions, please contact us:
              </p>
              <div className="space-y-2 text-muted-foreground">
                <p>Email: legal@schoolfinderodisha.com</p>
                <p>Phone: +91 63703-55930</p>
                <p>Address: Bhubaneswar, Odisha, India</p>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default TermsConditions;
