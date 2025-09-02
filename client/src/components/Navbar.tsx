import { LogOut, User, Menu, X } from "lucide-react"
import { useNavigate } from "react-router-dom"
import { supabase } from "../lib/supabaseClient"
import { useAuth } from "../hooks/useAuth"
import { useEffect, useMemo, useState } from "react"

interface NavbarProps {
  onMenuToggle?: () => void
  isMobileMenuOpen?: boolean
}

export default function Navbar({ onMenuToggle, isMobileMenuOpen }: NavbarProps) {
  const { setSession, session } = useAuth()
  const navigate = useNavigate()

  const user = session?.user
  const displayName = user?.user_metadata?.full_name || user?.email?.split("@")[0] || "User"
  const initialAvatar = useMemo(() => {
    const meta = user?.user_metadata || {}
    return (
      meta.avatar_url ||
      meta.picture ||
      null
    ) as string | null
  }, [user])

  const [avatarSrc, setAvatarSrc] = useState<string | null>(initialAvatar)

  useEffect(() => {
    setAvatarSrc(initialAvatar)
  }, [initialAvatar])

  const handleLogout = async () => {
    await supabase.auth.signOut()
    setSession(null)
    navigate("/", { replace: true })
  }

  return (
    <nav className="bg-white border-b border-gray-200 px-4 sm:px-6 h-20 flex items-center">
      <div className="flex items-center justify-between w-full">
        {/* Mobile menu button */}
        <button
          onClick={onMenuToggle}
          className="md:hidden inline-flex items-center justify-center p-3 rounded-md text-gray-500 hover:text-gray-700 hover:bg-gray-100 transition-colors"
          type="button"
          style={{ minHeight: '44px', minWidth: '44px' }}
        >
          {isMobileMenuOpen ? (
            <X className="h-6 w-6" />
          ) : (
            <Menu className="h-6 w-6" />
          )}
        </button>

        {/* Spacer */}
        <div className="flex-1 md:flex-none" />

        {/* Right side - User */}
        <div className="flex items-center space-x-4 sm:space-x-4">
          {/* User Menu */}
          <div className="flex items-center space-x-4 sm:space-x-3">
            <div className="text-right hidden sm:block">
              <p className="text-sm font-medium text-gray-900">{displayName}</p>
              <p className="text-xs text-gray-500">{user?.email}</p>
            </div>
            
            {/* Avatar */}
            <div className="relative">
              {avatarSrc ? (
                <img
                  src={avatarSrc}
                  alt="User avatar"
                  referrerPolicy="no-referrer"
                  crossOrigin="anonymous"
                  onError={() => setAvatarSrc(null)}
                  className="h-8 w-8 sm:h-10 sm:w-10 rounded-full border border-gray-200"
                />
              ) : (
                <div className="h-8 w-8 sm:h-10 sm:w-10 rounded-full bg-gray-200 flex items-center justify-center border border-gray-200">
                  <User className="h-4 w-4 sm:h-5 sm:w-5 text-gray-500" />
                </div>
              )}
              <div className="absolute -bottom-0.5 -right-0.5 h-2 w-2 sm:h-3 sm:w-3 bg-green-400 rounded-full border-2 border-white"></div>
            </div>

            {/* Logout Button */}
            <button
              onClick={handleLogout}
              className="inline-flex items-center justify-center px-3 py-2 sm:px-3 sm:py-2 text-sm sm:text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors group"
            >
              <LogOut className="h-4 w-4 sm:h-4 sm:w-4 text-gray-500 group-hover:text-gray-700" />
              <span className="hidden sm:inline ml-2">Logout</span>
            </button>
          </div>
        </div>
      </div>
    </nav>
  )
}