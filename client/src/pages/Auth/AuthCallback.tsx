import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../../lib/supabaseClient";

export default function AuthCallback() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [debugInfo, setDebugInfo] = useState<string[]>([]);

  const addDebug = (message: string) => {
    console.log(message);
    setDebugInfo(prev => [...prev, message]);
  };

  useEffect(() => {
    const handleAuth = async () => {
      try {
        // Get current URL and log all parameters
        const url = new URL(window.location.href);
        addDebug(`🌐 Full URL: ${window.location.href}`);
        
        const hasCode = url.searchParams.get("code");
        const hasState = url.searchParams.get("state");
        const error = url.searchParams.get("error");
        const errorDescription = url.searchParams.get("error_description");
        
        // Log all URL parameters for debugging
        addDebug(`🔍 URL Parameters:`);
        url.searchParams.forEach((value, key) => {
          addDebug(`  ${key}: ${value}`);
        });

        addDebug(`📋 AuthCallback Analysis:`);
        addDebug(`  hasCode: ${hasCode ? 'YES' : 'NO'}`);
        addDebug(`  hasState: ${hasState ? 'YES' : 'NO'}`);
        addDebug(`  error: ${error || 'none'}`);
        addDebug(`  errorDescription: ${errorDescription || 'none'}`);

        // Check for OAuth errors first
        if (error) {
          addDebug(`❌ OAuth Error: ${error} - ${errorDescription}`);
          setTimeout(() => navigate("/login"), 2000);
          return;
        }

        if (hasCode && hasState) {
          addDebug(`🔄 Found OAuth parameters, exchanging code for session...`);
          
          // Exchange code for session
          const { data, error: exchangeError } = await supabase.auth.exchangeCodeForSession(window.location.href);

          if (exchangeError) {
            addDebug(`❌ Exchange error: ${exchangeError.message}`);
            setTimeout(() => navigate("/login"), 2000);
            return;
          }

          addDebug(`✅ Session exchange successful!`);
          addDebug(`👤 User: ${data.session?.user?.email}`);
          addDebug(`🔑 Session ID: ${data.session?.access_token?.substring(0, 20)}...`);

          if (data?.session) {
            addDebug(`🎯 Navigating to dashboard in 1 second...`);
            setTimeout(() => {
              navigate("/dashboard");
            }, 1000);
            return;
          }
        } else {
          // No OAuth parameters - this might be a direct visit or refresh
          addDebug(`🔍 No OAuth parameters found, checking existing session...`);
          
          const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
          
          if (sessionError) {
            addDebug(`❌ Session check error: ${sessionError.message}`);
          }
          
          addDebug(`📊 Existing session: ${sessionData.session ? 'FOUND' : 'NONE'}`);
          
          if (sessionData.session) {
            addDebug(`✅ Found existing session, going to dashboard`);
            navigate("/dashboard");
            return;
          } else {
            addDebug(`❌ No session found, redirecting to login in 2 seconds...`);
            setTimeout(() => navigate("/login"), 2000);
          }
        }
      } catch (error) {
        addDebug(`💥 Unexpected error: ${error}`);
        setTimeout(() => navigate("/login"), 2000);
      } finally {
        setLoading(false);
      }
    };

    handleAuth();
  }, [navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-slate-800 to-gray-900">
      <div className="text-center max-w-2xl mx-auto p-8">
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-3xl p-8 border border-gray-700/50">
          {loading ? (
            <>
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
              <p className="text-lg text-white mb-6">Processing authentication...</p>
            </>
          ) : (
            <p className="text-lg text-green-400 mb-6">✅ Authentication processed</p>
          )}
          
          {/* Debug Information */}
          <div className="bg-gray-900/50 rounded-lg p-4 text-left">
            <h3 className="text-sm font-semibold text-gray-300 mb-2">Debug Information:</h3>
            <div className="text-xs text-gray-400 space-y-1 max-h-60 overflow-y-auto">
              {debugInfo.map((info, index) => (
                <div key={index} className="font-mono">{info}</div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}