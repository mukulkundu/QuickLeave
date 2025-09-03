import { Link } from 'react-router-dom';
import { ArrowLeft, FileText, Shield, Users, AlertTriangle, Scale } from 'lucide-react';

export default function TermsOfService() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center space-x-4">
            <Link 
              to="/" 
              className="inline-flex items-center text-gray-600 hover:text-gray-900 transition-colors"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Home
            </Link>
          </div>
          <div className="mt-4">
            <h1 className="text-3xl font-bold text-gray-900">Terms of Service</h1>
            <p className="text-gray-600 mt-2">Last Updated: September 2025</p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
          
          {/* Introduction */}
          <section className="mb-8">
            <div className="flex items-center space-x-3 mb-4">
              <FileText className="h-6 w-6 text-blue-600" />
              <h2 className="text-2xl font-semibold text-gray-900">1. Acceptance of Terms</h2>
            </div>
            <p className="text-gray-700 leading-relaxed">
              By accessing and using QuickLeave ("the Service"), you accept and agree to be bound by the terms and provision of this agreement. If you do not agree to abide by the above, please do not use this service.
            </p>
          </section>

          {/* Description of Service */}
          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">2. Description of Service</h2>
            <p className="text-gray-700 mb-4">
              QuickLeave is a leave management system that allows organizations to:
            </p>
            <ul className="list-disc list-inside space-y-2 text-gray-700">
              <li>Submit and manage leave requests</li>
              <li>Approve or reject leave applications</li>
              <li>Track leave history and balances</li>
              <li>Integrate with Google Calendar</li>
              <li>Manage user roles and permissions</li>
            </ul>
          </section>

          {/* User Accounts */}
          <section className="mb-8">
            <div className="flex items-center space-x-3 mb-4">
              <Users className="h-6 w-6 text-green-600" />
              <h2 className="text-2xl font-semibold text-gray-900">3. User Accounts and Authentication</h2>
            </div>
            
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-3">3.1 Account Creation</h3>
                <ul className="list-disc list-inside space-y-2 text-gray-700">
                  <li><strong>Google OAuth:</strong> You must authenticate using your Google account</li>
                  <li><strong>Organization Access:</strong> Access is granted by your organization's administrators</li>
                  <li><strong>Account Responsibility:</strong> You are responsible for maintaining the security of your account</li>
                </ul>
              </div>

              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-3">3.2 User Roles</h3>
                <ul className="list-disc list-inside space-y-2 text-gray-700">
                  <li><strong>Member:</strong> Can submit leave requests and view own history</li>
                  <li><strong>Manager:</strong> Can approve/reject leave requests and view team data</li>
                  <li><strong>Admin:</strong> Full access to all features and user management</li>
                </ul>
              </div>
            </div>
          </section>

          {/* Acceptable Use */}
          <section className="mb-8">
            <div className="flex items-center space-x-3 mb-4">
              <Shield className="h-6 w-6 text-purple-600" />
              <h2 className="text-2xl font-semibold text-gray-900">4. Acceptable Use Policy</h2>
            </div>
            
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-3">4.1 Permitted Uses</h3>
                <ul className="list-disc list-inside space-y-2 text-gray-700">
                  <li>Submit legitimate leave requests</li>
                  <li>Review and manage leave data as per your role</li>
                  <li>Use calendar integration features</li>
                  <li>Access your own leave history and status</li>
                </ul>
              </div>

              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-3">4.2 Prohibited Uses</h3>
                <p className="text-gray-700 mb-3">You agree NOT to:</p>
                <ul className="list-disc list-inside space-y-2 text-gray-700">
                  <li><strong>Misuse the System:</strong> Submit false or fraudulent leave requests</li>
                  <li><strong>Unauthorized Access:</strong> Attempt to access other users' data without permission</li>
                  <li><strong>System Abuse:</strong> Overload or damage the system</li>
                  <li><strong>Violate Laws:</strong> Use the service for illegal activities</li>
                  <li><strong>Circumvent Security:</strong> Attempt to bypass security measures</li>
                  <li><strong>Share Credentials:</strong> Share your login credentials with others</li>
                </ul>
              </div>

              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-3">4.3 Data Accuracy</h3>
                <ul className="list-disc list-inside space-y-2 text-gray-700">
                  <li><strong>Accurate Information:</strong> Provide accurate and truthful information</li>
                  <li><strong>Timely Updates:</strong> Update your information when it changes</li>
                  <li><strong>Leave Requests:</strong> Submit leave requests with honest reasons and dates</li>
                </ul>
              </div>
            </div>
          </section>

          {/* Privacy and Data Protection */}
          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">5. Privacy and Data Protection</h2>
            
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-3">5.1 Data Collection</h3>
                <ul className="list-disc list-inside space-y-2 text-gray-700">
                  <li>We collect information necessary for the service to function</li>
                  <li>Your data is handled according to our Privacy Policy</li>
                  <li>We implement appropriate security measures</li>
                </ul>
              </div>

              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-3">5.2 Data Sharing</h3>
                <ul className="list-disc list-inside space-y-2 text-gray-700">
                  <li><strong>Within Organization:</strong> Your data may be visible to managers and admins</li>
                  <li><strong>Third Parties:</strong> We may share data with service providers (Google, Supabase)</li>
                  <li><strong>Legal Requirements:</strong> We may disclose data if required by law</li>
                </ul>
              </div>
            </div>
          </section>

          {/* Service Availability */}
          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">6. Service Availability and Modifications</h2>
            
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-3">6.1 Service Availability</h3>
                <ul className="list-disc list-inside space-y-2 text-gray-700">
                  <li>We strive to maintain high service availability</li>
                  <li>We do not guarantee uninterrupted service</li>
                  <li>Scheduled maintenance may cause temporary downtime</li>
                </ul>
              </div>

              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-3">6.2 Service Modifications</h3>
                <ul className="list-disc list-inside space-y-2 text-gray-700">
                  <li>We may modify or discontinue features at any time</li>
                  <li>We will provide reasonable notice for significant changes</li>
                  <li>Continued use constitutes acceptance of modifications</li>
                </ul>
              </div>
            </div>
          </section>

          {/* Disclaimers */}
          <section className="mb-8">
            <div className="flex items-center space-x-3 mb-4">
              <AlertTriangle className="h-6 w-6 text-yellow-600" />
              <h2 className="text-2xl font-semibold text-gray-900">7. Disclaimers and Limitations</h2>
            </div>
            
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 mb-6">
              <h3 className="text-lg font-medium text-yellow-800 mb-3">7.1 Service Disclaimer</h3>
              <p className="text-yellow-700 font-medium">
                THE SERVICE IS PROVIDED "AS IS" WITHOUT WARRANTIES OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, AND NON-INFRINGEMENT.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-3">7.2 Limitation of Liability</h3>
              <p className="text-gray-700 mb-3">TO THE MAXIMUM EXTENT PERMITTED BY LAW, WE SHALL NOT BE LIABLE FOR:</p>
              <ul className="list-disc list-inside space-y-2 text-gray-700">
                <li><strong>Indirect Damages:</strong> Lost profits, data loss, or business interruption</li>
                <li><strong>Direct Damages:</strong> Beyond the amount paid for the service</li>
                <li><strong>Third-Party Actions:</strong> Actions of other users or third parties</li>
                <li><strong>System Failures:</strong> Technical issues or service interruptions</li>
              </ul>
            </div>
          </section>

          {/* Termination */}
          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">8. Termination</h2>
            
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-3">8.1 Termination by You</h3>
                <ul className="list-disc list-inside space-y-2 text-gray-700">
                  <li>You may stop using the service at any time</li>
                  <li>You may request account deletion</li>
                  <li>Some data may be retained for business purposes</li>
                </ul>
              </div>

              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-3">8.2 Termination by Us</h3>
                <p className="text-gray-700 mb-3">We may terminate your access if you:</p>
                <ul className="list-disc list-inside space-y-2 text-gray-700">
                  <li>Violate these terms of service</li>
                  <li>Engage in fraudulent or illegal activities</li>
                  <li>Fail to pay required fees (if applicable)</li>
                  <li>Pose a security risk to the service</li>
                </ul>
              </div>
            </div>
          </section>

          {/* Governing Law */}
          <section className="mb-8">
            <div className="flex items-center space-x-3 mb-4">
              <Scale className="h-6 w-6 text-indigo-600" />
              <h2 className="text-2xl font-semibold text-gray-900">9. Governing Law and Disputes</h2>
            </div>
            
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-3">9.1 Governing Law</h3>
                <p className="text-gray-700">
                  These terms are governed by the laws of [Your Jurisdiction] without regard to conflict of law principles.
                </p>
              </div>

              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-3">9.2 Dispute Resolution</h3>
                <ul className="list-disc list-inside space-y-2 text-gray-700">
                  <li><strong>Negotiation:</strong> We encourage resolving disputes through direct communication</li>
                  <li><strong>Mediation:</strong> If negotiation fails, disputes may be resolved through mediation</li>
                  <li><strong>Arbitration:</strong> Binding arbitration may be used for unresolved disputes</li>
                  <li><strong>Jurisdiction:</strong> Courts in [Your Jurisdiction] have exclusive jurisdiction</li>
                </ul>
              </div>
            </div>
          </section>

          {/* Contact Information */}
          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">10. Contact Information</h2>
            
            <div className="bg-gray-50 rounded-lg p-6">
              <p className="text-gray-700">
                For questions about these Terms of Service, please contact your organization's administrator or system administrator.
              </p>
            </div>
          </section>

          {/* Updates to Terms */}
          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">11. Updates to Terms</h2>
            <p className="text-gray-700 mb-4">
              We may update these terms from time to time. We will notify you of changes by:
            </p>
            <ul className="list-disc list-inside space-y-2 text-gray-700">
              <li>Posting updated terms on this page</li>
              <li>Sending email notifications for significant changes</li>
              <li>Updating the "Last Updated" date</li>
            </ul>
            <p className="text-gray-700 mt-4">
              Your continued use of the service after changes constitutes acceptance of the new terms.
            </p>
          </section>

          {/* Footer */}
          <div className="border-t border-gray-200 pt-6 mt-8">
            <p className="text-sm text-gray-500">
              <strong>Effective Date:</strong> September 2025 | <strong>Version:</strong> 1.0
            </p>
            <p className="text-sm text-gray-500 mt-2">
              <strong>Note:</strong> These terms are specific to QuickLeave's leave management functionality. Please review and customize them according to your specific business needs and legal requirements.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
