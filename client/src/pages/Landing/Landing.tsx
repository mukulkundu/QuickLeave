import React from 'react';
import { Calendar, Users, Shield, ArrowRight, Menu, X, CheckCircle, Clock, Zap } from 'lucide-react';
import { Link } from 'react-router-dom';
import { signInWithGoogle } from '../../lib/auth';

const QuickLeave = () => {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  return (
    <div className="min-h-screen w-full bg-white text-gray-900 antialiased overflow-x-hidden">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex items-center">
              <span className="text-2xl font-bold text-gray-900">QuickLeave</span>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:block">
              <div className="ml-10 flex items-baseline space-x-8">
                <a href="#features" className="text-gray-600 hover:text-gray-900 px-3 py-2 text-sm font-medium transition-colors">Features</a>
                <a href="#workflow" className="text-gray-600 hover:text-gray-900 px-3 py-2 text-sm font-medium transition-colors">Workflow</a>
                <a href="#about" className="text-gray-600 hover:text-gray-900 px-3 py-2 text-sm font-medium transition-colors">About</a>
              </div>
            </div>

            {/* Desktop Auth Button */}
            <div className="hidden md:block">
              <button
                onClick={signInWithGoogle}
                className="inline-flex items-center px-4 py-2 rounded-md text-sm font-medium text-white bg-gray-900 hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-colors cursor-pointer"
              >
                Sign In
              </button>
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden">
              <button
                onClick={toggleMenu}
                className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-gray-500"
              >
                {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>

          {/* Mobile menu */}
          <div className={`md:hidden ${isMenuOpen ? 'block' : 'hidden'}`}>
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 border-t border-gray-200">
              <a href="#features" onClick={toggleMenu} className="block px-3 py-2 text-base font-medium text-gray-600 hover:text-gray-900 transition-colors">Features</a>
              <a href="#workflow" onClick={toggleMenu} className="block px-3 py-2 text-base font-medium text-gray-600 hover:text-gray-900 transition-colors">Workflow</a>
              <a href="#about" onClick={toggleMenu} className="block px-3 py-2 text-base font-medium text-gray-600 hover:text-gray-900 transition-colors">About</a>
              <div className="pt-4 border-t border-gray-200">
                <button
                  onClick={() => { toggleMenu(); signInWithGoogle(); }}
                  className="block w-full text-center px-4 py-2 text-sm font-medium text-white bg-gray-900 hover:bg-gray-800 rounded-md transition-colors cursor-pointer"
                >
                  Sign In
                </button>
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-28">
          <div className="text-center">
            <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl lg:text-6xl">
              Manage team leaves with
              <span className="block text-gray-600">professional ease</span>
            </h1>
            <p className="mt-6 max-w-2xl mx-auto text-xl text-gray-600 leading-8">
              Streamlined leave management with Google Calendar integration. Built for modern teams who value simplicity and efficiency.
            </p>
            <div className="mt-10 flex items-center justify-center gap-x-6">
              <button
                onClick={signInWithGoogle}
                className="inline-flex items-center px-6 py-3 rounded-md text-base font-medium text-white bg-gray-900 hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-colors cursor-pointer"
              >
                Get started
                <ArrowRight className="ml-2 h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-16 lg:py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              Everything you need to manage leaves
            </h2>
            <p className="mt-4 max-w-2xl mx-auto text-lg text-gray-600">
              Built with modern teams in mind, our platform streamlines the entire leave management process.
            </p>
          </div>

          <div className="mt-12 grid grid-cols-1 gap-8 md:grid-cols-3">
            {/* Feature 1 */}
            <div className="p-8 bg-white rounded-2xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-center w-12 h-12 bg-gray-100 rounded-lg mb-6">
                <Calendar className="h-6 w-6 text-gray-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Google Calendar Sync</h3>
              <p className="text-gray-600">Automatically create calendar events for approved leaves. Keep your team's schedule synchronized and transparent.</p>
            </div>

            {/* Feature 2 */}
            <div className="p-8 bg-white rounded-2xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-center w-12 h-12 bg-gray-100 rounded-lg mb-6">
                <Users className="h-6 w-6 text-gray-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Approval Workflow</h3>
              <p className="text-gray-600">Streamlined approval process with instant notifications. Managers can quickly review and approve requests.</p>
            </div>

            {/* Feature 3 */}
            <div className="p-8 bg-white rounded-2xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-center w-12 h-12 bg-gray-100 rounded-lg mb-6">
                <Shield className="h-6 w-6 text-gray-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Secure Authentication</h3>
              <p className="text-gray-600">Enterprise-grade security with Google SSO. No additional passwords to remember or manage.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Workflow Section */}
      <section id="workflow" className="py-16 lg:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              Simple workflow, powerful results
            </h2>
            <p className="mt-4 max-w-2xl mx-auto text-lg text-gray-600">
              Our streamlined process makes leave management effortless for everyone involved.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-12 md:grid-cols-3">
            {/* Step 1 */}
            <div className="relative text-center">
              <div className="flex items-center justify-center w-16 h-16 bg-gray-900 rounded-full mb-6 mx-auto">
                <span className="text-xl font-bold text-white">1</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Apply for Leave</h3>
              <p className="text-gray-600">Submit your leave request with dates, reason, and type. Quick and intuitive form submission.</p>
            </div>

            {/* Step 2 */}
            <div className="relative text-center">
              <div className="flex items-center justify-center w-16 h-16 bg-gray-900 rounded-full mb-6 mx-auto">
                <span className="text-xl font-bold text-white">2</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Manager Review</h3>
              <p className="text-gray-600">Your manager receives instant notification and can approve or reject with optional feedback.</p>
            </div>

            {/* Step 3 */}
            <div className="relative text-center">
              <div className="flex items-center justify-center w-16 h-16 bg-gray-900 rounded-full mb-6 mx-auto">
                <span className="text-xl font-bold text-white">3</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Auto Calendar Sync</h3>
              <p className="text-gray-600">Approved leaves automatically appear in Google Calendar, keeping everyone informed.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Stats/Benefits Section */}
      <section className="py-16 lg:py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
            <div className="text-center">
              <div className="flex items-center justify-center w-12 h-12 bg-green-100 rounded-lg mb-4 mx-auto">
                <CheckCircle className="h-6 w-6 text-green-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Instant Approvals</h3>
              <p className="text-gray-600">Reduce approval time from days to minutes with our streamlined workflow.</p>
            </div>

            <div className="text-center">
              <div className="flex items-center justify-center w-12 h-12 bg-blue-100 rounded-lg mb-4 mx-auto">
                <Clock className="h-6 w-6 text-blue-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Real-time Updates</h3>
              <p className="text-gray-600">Stay informed with instant notifications and status updates for all requests.</p>
            </div>

            <div className="text-center md:col-span-2 lg:col-span-1">
              <div className="flex items-center justify-center w-12 h-12 bg-purple-100 rounded-lg mb-4 mx-auto">
                <Zap className="h-6 w-6 text-purple-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Zero Setup</h3>
              <p className="text-gray-600">Get started immediately with Google SSO. No complex configuration required.</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section id="about" className="py-16 lg:py-20">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            Ready to streamline your leave management?
          </h2>
          <p className="mt-6 text-xl text-gray-600 leading-8">
            Join teams who've simplified their leave process with QuickLeave. Professional, secure, and effortless.
          </p>
          <div className="mt-10">
            <button
              onClick={signInWithGoogle}
              className="inline-flex items-center px-8 py-4 rounded-md text-lg font-medium text-white bg-gray-900 hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-colors cursor-pointer"
            >
              Start managing leaves today
              <ArrowRight className="ml-2 h-5 w-5" />
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {/* Brand */}
            <div className="col-span-1 md:col-span-2">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center">
                  <Calendar className="h-5 w-5 text-gray-900" />
                </div>
                <h3 className="text-xl font-bold">QuickLeave</h3>
              </div>
              <p className="text-gray-300 mb-4 max-w-md">
                Streamline your leave management process with our modern, secure, and user-friendly platform.
              </p>
              <div className="flex space-x-4">
                <button
                  onClick={signInWithGoogle}
                  className="inline-flex items-center px-4 py-2 rounded-md text-sm font-medium text-gray-900 bg-white hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-white transition-colors cursor-pointer"
                >
                  Get Started
                </button>
              </div>
            </div>

            {/* Features */}
            <div>
              <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">Features</h4>
              <ul className="space-y-3">
                <li>
                  <a href="#features" className="text-gray-300 hover:text-white transition-colors">
                    Leave Management
                  </a>
                </li>
                <li>
                  <a href="#features" className="text-gray-300 hover:text-white transition-colors">
                    Calendar Integration
                  </a>
                </li>
                <li>
                  <a href="#features" className="text-gray-300 hover:text-white transition-colors">
                    Role-Based Access
                  </a>
                </li>
                <li>
                  <a href="#features" className="text-gray-300 hover:text-white transition-colors">
                    Email Notifications
                  </a>
                </li>
              </ul>
            </div>

            {/* Legal */}
            <div>
              <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">Legal</h4>
              <ul className="space-y-3">
                <li>
                  <Link 
                    to="/privacy-policy" 
                    className="text-gray-300 hover:text-white transition-colors"
                  >
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link 
                    to="/terms-of-service" 
                    className="text-gray-300 hover:text-white transition-colors"
                  >
                    Terms of Service
                  </Link>
                </li>
                <li>
                  <a href="#about" className="text-gray-300 hover:text-white transition-colors">
                    About Us
                  </a>
                </li>
                <li>
                  <a href="#about" className="text-gray-300 hover:text-white transition-colors">
                    Contact Support
                  </a>
                </li>
              </ul>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="border-t border-gray-800 mt-8 pt-8">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <p className="text-gray-400 text-sm">
                © 2025 QuickLeave. All rights reserved.
              </p>
              <div className="flex space-x-6 mt-4 md:mt-0">
                <span className="text-gray-400 text-sm">
                  Contact your organization's administrator for support
                </span>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default QuickLeave;
