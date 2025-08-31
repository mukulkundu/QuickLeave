import { signInWithGoogle } from "../../lib/auth";
import { ArrowRight } from "lucide-react";

export default function Signup() {
  return (
    <div className="h-screen w-screen bg-gradient-to-br from-gray-900 via-slate-800 to-gray-900 flex items-center justify-center relative overflow-hidden">
      {/* Signup Card */}
      <div className="relative w-full max-w-md mx-auto p-6">
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-3xl p-8 sm:p-10 border border-gray-700/50 shadow-2xl text-center">
          <h1 className="text-4xl sm:text-5xl font-bold text-white mb-4 leading-tight">
            Join
            <br />
            <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              QuickLeave
            </span>
          </h1>

          <p className="text-gray-400 text-lg mb-8">
            Click on the button to sign up with Google
          </p>

          {/* Signup Button */}
          <button
            onClick={signInWithGoogle}
            className="group w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white px-8 py-4 rounded-full text-lg font-semibold hover:from-purple-700 hover:to-pink-700 transition-all transform hover:scale-105 shadow-2xl flex items-center justify-center"
          >
            Sign up with Google
            <ArrowRight
              className="ml-3 group-hover:translate-x-1 transition-transform"
              size={20}
            />
          </button>
        </div>
      </div>

      {/* Decorative Elements */}
      <div className="absolute -top-20 -left-20 w-40 h-40 bg-purple-500/20 rounded-full blur-3xl"></div>
      <div className="absolute -bottom-20 -right-20 w-48 h-48 bg-pink-500/20 rounded-full blur-3xl"></div>
      <div className="absolute top-1/2 -left-32 w-32 h-32 bg-purple-500/10 rounded-full blur-3xl"></div>
      <div className="absolute top-1/4 -right-32 w-36 h-36 bg-pink-500/10 rounded-full blur-3xl"></div>
    </div>
  );
}
  