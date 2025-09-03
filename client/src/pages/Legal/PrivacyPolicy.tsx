import { Link } from 'react-router-dom';
import { ArrowLeft, Shield, Lock, Eye, Database, Mail } from 'lucide-react';

export default function PrivacyPolicy() {
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
            <h1 className="text-3xl font-bold text-gray-900">Privacy Policy</h1>
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
              <Shield className="h-6 w-6 text-blue-600" />
              <h2 className="text-2xl font-semibold text-gray-900">1. Introduction</h2>
            </div>
            <p className="text-gray-700 leading-relaxed">
              QuickLeave ("we," "our," or "us") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our leave management application.
            </p>
          </section>

          {/* Information We Collect */}
          <section className="mb-8">
            <div className="flex items-center space-x-3 mb-4">
              <Database className="h-6 w-6 text-green-600" />
              <h2 className="text-2xl font-semibold text-gray-900">2. Information We Collect</h2>
            </div>
            
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-3">2.1 Personal Information</h3>
                <ul className="list-disc list-inside space-y-2 text-gray-700">
                  <li><strong>Name:</strong> Your full name from Google OAuth</li>
                  <li><strong>Email Address:</strong> Your email address from Google OAuth</li>
                  <li><strong>User Role:</strong> Your assigned role (member, manager, admin)</li>
                  <li><strong>Profile Information:</strong> Any additional profile details you provide</li>
                </ul>
              </div>

              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-3">2.2 Leave Management Data</h3>
                <ul className="list-disc list-inside space-y-2 text-gray-700">
                  <li><strong>Leave Requests:</strong> Start dates, end dates, reasons, and leave types</li>
                  <li><strong>Approval History:</strong> Status updates and approval/rejection records</li>
                  <li><strong>Calendar Integration:</strong> Google Calendar events (if you choose to connect)</li>
                </ul>
              </div>

              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-3">2.3 Authentication Data</h3>
                <ul className="list-disc list-inside space-y-2 text-gray-700">
                  <li><strong>Google OAuth Tokens:</strong> For authentication and calendar integration</li>
                  <li><strong>Session Information:</strong> Login sessions and access tokens</li>
                </ul>
              </div>

              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-3">2.4 Technical Information</h3>
                <ul className="list-disc list-inside space-y-2 text-gray-700">
                  <li><strong>Usage Data:</strong> How you interact with our application</li>
                  <li><strong>Device Information:</strong> Browser type, operating system, IP address</li>
                  <li><strong>Log Data:</strong> Server logs and error reports</li>
                </ul>
              </div>
            </div>
          </section>

          {/* How We Use Your Information */}
          <section className="mb-8">
            <div className="flex items-center space-x-3 mb-4">
              <Eye className="h-6 w-6 text-purple-600" />
              <h2 className="text-2xl font-semibold text-gray-900">3. How We Use Your Information</h2>
            </div>
            
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-3">3.1 Core Functionality</h3>
                <ul className="list-disc list-inside space-y-2 text-gray-700">
                  <li><strong>Leave Management:</strong> Process and track your leave requests</li>
                  <li><strong>User Authentication:</strong> Verify your identity and manage access</li>
                  <li><strong>Role-Based Access:</strong> Control access to features based on your role</li>
                  <li><strong>Notifications:</strong> Send email notifications about leave status updates</li>
                </ul>
              </div>

              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-3">3.2 Calendar Integration</h3>
                <ul className="list-disc list-inside space-y-2 text-gray-700">
                  <li><strong>Google Calendar Sync:</strong> Create, update, and delete calendar events (with your consent)</li>
                  <li><strong>Event Management:</strong> Manage leave events in your connected calendar</li>
                </ul>
              </div>

              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-3">3.3 Communication</h3>
                <ul className="list-disc list-inside space-y-2 text-gray-700">
                  <li><strong>Email Notifications:</strong> Send leave approval/rejection notifications</li>
                  <li><strong>System Updates:</strong> Inform you about important changes to the service</li>
                </ul>
              </div>
            </div>
          </section>

          {/* Information Sharing */}
          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">4. Information Sharing and Disclosure</h2>
            
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-3">4.1 Third-Party Services</h3>
                <ul className="list-disc list-inside space-y-2 text-gray-700">
                  <li><strong>Google:</strong> For authentication and calendar integration</li>
                  <li><strong>Supabase:</strong> For database storage and authentication services</li>
                  <li><strong>Email Providers:</strong> For sending notifications (SMTP)</li>
                </ul>
              </div>

              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-3">4.2 Within Your Organization</h3>
                <ul className="list-disc list-inside space-y-2 text-gray-700">
                  <li><strong>Managers and Admins:</strong> Can view and manage leave requests as per their role</li>
                  <li><strong>HR Department:</strong> May have access to leave data for administrative purposes</li>
                </ul>
              </div>
            </div>
          </section>

          {/* Data Security */}
          <section className="mb-8">
            <div className="flex items-center space-x-3 mb-4">
              <Lock className="h-6 w-6 text-red-600" />
              <h2 className="text-2xl font-semibold text-gray-900">5. Data Security</h2>
            </div>
            
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-3">5.1 Security Measures</h3>
                <ul className="list-disc list-inside space-y-2 text-gray-700">
                  <li><strong>Encryption:</strong> Data is encrypted in transit and at rest</li>
                  <li><strong>Access Controls:</strong> Role-based access to sensitive information</li>
                  <li><strong>Secure Authentication:</strong> OAuth 2.0 with Google</li>
                  <li><strong>Regular Updates:</strong> Security patches and updates</li>
                </ul>
              </div>

              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-3">5.2 Data Storage</h3>
                <ul className="list-disc list-inside space-y-2 text-gray-700">
                  <li><strong>Supabase:</strong> Your data is stored securely in Supabase's PostgreSQL database</li>
                  <li><strong>Backup:</strong> Regular backups are maintained</li>
                  <li><strong>Retention:</strong> Data is retained as long as your account is active</li>
                </ul>
              </div>
            </div>
          </section>

          {/* Your Rights */}
          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">6. Your Rights and Choices</h2>
            
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-3">6.1 Access and Control</h3>
                <ul className="list-disc list-inside space-y-2 text-gray-700">
                  <li><strong>View Your Data:</strong> Access your leave history and profile information</li>
                  <li><strong>Update Information:</strong> Modify your profile and preferences</li>
                  <li><strong>Delete Account:</strong> Request account deletion (subject to organizational policies)</li>
                </ul>
              </div>

              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-3">6.2 Calendar Integration</h3>
                <ul className="list-disc list-inside space-y-2 text-gray-700">
                  <li><strong>Connect/Disconnect:</strong> You can connect or disconnect your Google Calendar at any time</li>
                  <li><strong>Revoke Access:</strong> Revoke calendar permissions through Google's settings</li>
                </ul>
              </div>
            </div>
          </section>

          {/* Data Retention */}
          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">7. Data Retention</h2>
            
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-3">7.1 Retention Period</h3>
                <ul className="list-disc list-inside space-y-2 text-gray-700">
                  <li><strong>Active Accounts:</strong> Data is retained while your account is active</li>
                  <li><strong>Inactive Accounts:</strong> Data may be retained for up to 2 years after last activity</li>
                  <li><strong>Legal Requirements:</strong> Some data may be retained longer for legal compliance</li>
                </ul>
              </div>
            </div>
          </section>

          {/* Contact Information */}
          <section className="mb-8">
            <div className="flex items-center space-x-3 mb-4">
              <Mail className="h-6 w-6 text-blue-600" />
              <h2 className="text-2xl font-semibold text-gray-900">8. Contact Information</h2>
            </div>
            
            <div className="bg-gray-50 rounded-lg p-6">
              <p className="text-gray-700">
                If you have any questions about this Privacy Policy, please contact your organization's administrator or system administrator.
              </p>
            </div>
          </section>

          {/* Compliance */}
          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">9. Compliance</h2>
            <p className="text-gray-700 mb-4">
              This Privacy Policy complies with:
            </p>
            <ul className="list-disc list-inside space-y-2 text-gray-700">
              <li><strong>GDPR:</strong> General Data Protection Regulation (EU)</li>
              <li><strong>CCPA:</strong> California Consumer Privacy Act (US)</li>
              <li><strong>PIPEDA:</strong> Personal Information Protection and Electronic Documents Act (Canada)</li>
            </ul>
          </section>

          {/* Footer */}
          <div className="border-t border-gray-200 pt-6 mt-8">
            <p className="text-sm text-gray-500">
              <strong>Effective Date:</strong> September 2025 | <strong>Version:</strong> 1.0
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
