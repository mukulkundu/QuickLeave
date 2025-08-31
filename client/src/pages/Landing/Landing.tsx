import React from 'react';
import { Calendar, Users, Shield, ArrowRight, Menu, X } from 'lucide-react';
import { Link } from 'react-router-dom'; // ✅ Import Link

const QuickLeave = () => {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-slate-800 to-gray-900">
      {/* Navigation */}
      <nav className="relative z-50 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          {/* Logo */}
          <div className="text-2xl font-bold text-white">QuickLeave</div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <a href="#features" className="text-gray-300 hover:text-white transition-colors">
              Features
            </a>
            <a href="#workflow" className="text-gray-300 hover:text-white transition-colors">
              Workflow
            </a>
            <a href="#about" className="text-gray-300 hover:text-white transition-colors">
              About
            </a>
          </div>

          {/* Desktop Auth Button */}
          <div className="hidden md:flex items-center">
            <Link
              to="/login"
              className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-4 lg:px-6 py-2 rounded-full hover:from-purple-700 hover:to-pink-700 transition-all transform hover:scale-105 text-sm lg:text-base whitespace-nowrap cursor-pointer"
            >
              Sign In
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button onClick={toggleMenu} className="md:hidden text-white">
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Menu Overlay */}
        <div
          className={`md:hidden fixed inset-0 z-40 transition-opacity duration-300 ${
            isMenuOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
          }`}
        >
          <div className="absolute inset-0 bg-black/50" onClick={toggleMenu}></div>
        </div>

        {/* Mobile Menu */}
        <div
          className={`md:hidden fixed top-0 right-0 h-full w-80 max-w-[85vw] bg-gray-900/95 backdrop-blur-md border-l border-gray-700 z-50 transform transition-transform duration-300 ease-in-out ${
            isMenuOpen ? 'translate-x-0' : 'translate-x-full'
          }`}
        >
          <div className="p-6">
            {/* Close Button */}
            <div className="flex justify-end mb-8">
              <button onClick={toggleMenu} className="text-white hover:text-gray-300 transition-colors">
                <X size={24} />
              </button>
            </div>

            {/* Menu Items */}
            <div className="space-y-6">
              <a
                href="#features"
                className="block text-gray-300 hover:text-white transition-colors text-lg"
                onClick={toggleMenu}
              >
                Features
              </a>
              <a
                href="#workflow"
                className="block text-gray-300 hover:text-white transition-colors text-lg"
                onClick={toggleMenu}
              >
                Workflow
              </a>
              <a
                href="#about"
                className="block text-gray-300 hover:text-white transition-colors text-lg"
                onClick={toggleMenu}
              >
                About
              </a>

              {/* Auth Button */}
              <div className="pt-8 border-t border-gray-700">
                <Link
                  to="/login"
                  className="w-full block text-center bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-3 rounded-full hover:from-purple-700 hover:to-pink-700 transition-all text-lg font-medium"
                  onClick={toggleMenu}
                >
                  Sign In with Google
                </Link>
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative px-4 sm:px-6 py-16 sm:py-20 lg:py-28">
        <div className="max-w-4xl mx-auto text-center">
          {/* Hero Content */}
          <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold text-white mb-6 sm:mb-8 leading-tight">
            Manage Leaves
            <br />
            <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              with Ease
            </span>
            <span className="ml-2 sm:ml-4 text-3xl sm:text-4xl lg:text-5xl xl:text-6xl">🚀</span>
          </h1>

          <p className="text-lg sm:text-xl lg:text-2xl text-gray-300 mb-8 sm:mb-12 max-w-2xl mx-auto leading-relaxed px-4">
            Apply, approve, and sync leaves seamlessly. Integrated with Google Calendar and built for teams of all sizes.
          </p>

          <Link
            to="/login"
            className="group inline-flex items-center justify-center bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 sm:px-8 py-3 sm:py-4 rounded-full text-base sm:text-lg font-semibold hover:from-purple-700 hover:to-pink-700 cursor-pointer transition-all transform hover:scale-105 shadow-2xl"
          >
            Get Started
            <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" size={18} />
          </Link>
        </div>

        {/* Decorative Elements */}
        <div className="absolute top-20 left-4 sm:left-10 w-48 sm:w-72 h-48 sm:h-72 bg-purple-500/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-4 sm:right-10 w-64 sm:w-96 h-64 sm:h-96 bg-pink-500/10 rounded-full blur-3xl"></div>
      </section>

      {/* Features Section */}
      <section id="features" className="relative px-4 sm:px-6 py-16 sm:py-20 lg:py-28">
        <div className="mx-auto">
          {/* Section Header */}
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-6">
              Core Features
            </h2>
          </div>

          {/* Features Grid */}
          <div className="grid sm:grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 lg:gap-12">
            {/* Feature 1 */}
            <div className="group bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 sm:p-8 border border-gray-700/50 hover:border-purple-500/50 transition-all hover:transform hover:scale-105">
              <div className="mb-6">
                <div className="w-14 h-14 sm:w-16 sm:h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Calendar className="text-white" size={24} />
                </div>
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-white mb-4">Google Calendar Sync</h3>
              <p className="text-gray-400 leading-relaxed text-sm sm:text-base">
                Auto-create leave events on approval with the right format and easy removal support.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="group bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 sm:p-8 border border-gray-700/50 hover:border-purple-500/50 transition-all hover:transform hover:scale-105">
              <div className="mb-6">
                <div className="w-14 h-14 sm:w-16 sm:h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Users className="text-white" size={24} />
                </div>
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-white mb-4">Approval Workflow</h3>
              <p className="text-gray-400 leading-relaxed text-sm sm:text-base">
                Team members apply, managers approve/reject, and notifications are instantly sent.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="group bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 sm:p-8 border border-gray-700/50 hover:border-purple-500/50 transition-all hover:transform hover:scale-105">
              <div className="mb-6">
                <div className="w-14 h-14 sm:w-16 sm:h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Shield className="text-white" size={24} />
                </div>
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-white mb-4">Secure Google SSO</h3>
              <p className="text-gray-400 leading-relaxed text-sm sm:text-base">
                Sign in easily and securely with Google OAuth for seamless team onboarding.
              </p>
            </div>
          </div>
        </div>

        {/* Background Elements */}
        <div className="absolute top-0 left-1/4 w-48 sm:w-64 h-48 sm:h-64 bg-purple-500/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-1/4 w-56 sm:w-80 h-56 sm:h-80 bg-pink-500/5 rounded-full blur-3xl"></div>
      </section>
    </div>
  );
};

export default QuickLeave;
