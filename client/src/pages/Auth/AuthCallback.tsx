import { useEffect } from "react"
import { useNavigate, useLocation } from "react-router-dom"
import { supabase } from "../../lib/supabaseClient"

export default function AuthCallback() {
  const navigate = useNavigate()
  const location = useLocation()

  useEffect(() => {
    const handleAuth = async () => {
      try {
        const url = new URL(window.location.href)
        const hasCode = url.searchParams.get("code")
        const hasState = url.searchParams.get("state")
        const error = url.searchParams.get("error")

        if (error) {
          setTimeout(() => navigate("/login"), 1000)
          return
        }

        if (hasCode && hasState) {
          const { data, error: exchangeError } =
            await supabase.auth.exchangeCodeForSession(window.location.href)

          if (exchangeError) {
            setTimeout(() => navigate("/login"), 1000)
            return
          }

          if (data?.session) {
            // 👇 preserve "from" or go to home ("/"), NOT dashboard
            const from = (location.state as any)?.from?.pathname || "/dashboard"
            navigate(from, { replace: true })
            return
          }
        } else {
          const { data: sessionData } = await supabase.auth.getSession()

          if (sessionData.session) {
            const from = (location.state as any)?.from?.pathname || "/dashboard"
            navigate(from, { replace: true })
            return
          } else {
            setTimeout(() => navigate("/login"), 1000)
          }
        }
      } catch {
        setTimeout(() => navigate("/login"), 1000)
      }
    }

    handleAuth()
  }, [navigate, location.state])

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-lg font-medium">🔑 Logging in, please wait...</div>
    </div>
  )
}
