import { Link } from "react-router-dom"
import { Home, FileText, History, CheckSquare, Users, Settings, Calendar, X } from "lucide-react"

type Role = "member" | "manager" | "admin"

interface SidebarProps {
  role: Role
  isMobileMenuOpen?: boolean
  onMenuClose?: () => void
}

export default function Sidebar({ role, isMobileMenuOpen = false, onMenuClose }: SidebarProps) {
  const navigationItems = [
    {
      name: "Dashboard",
      href: "/dashboard",
      icon: Home,
      available: true
    },
    {
      name: "Apply Leave",
      href: "/apply",
      icon: FileText,
      available: true
    },
    {
      name: "Leave History",
      href: "/history",
      icon: History,
      available: true
    },
    {
      name: "Manage Requests",
      href: "/requests",
      icon: CheckSquare,
      available: role === "manager" || role === "admin"
    },
    {
      name: "Manage Users",
      href: "/users",
      icon: Users,
      available: role === "admin"
    },
    {
      name: "Leave Types",
      href: "/leave-types",
      icon: Settings,
      available: role === "admin"
    }
  ]

  const handleLinkClick = () => {
    if (onMenuClose) {
      onMenuClose()
    }
  }

  return (
    <>
      {/* Mobile backdrop */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 backdrop-blur-md bg-opacity-50 z-40 md:hidden"
          onClick={onMenuClose}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed md:static inset-y-0 left-0 z-50
        w-64 bg-white border-r border-gray-200 flex flex-col
        transform transition-transform duration-300 ease-in-out
        md:transform-none
        ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
      `}>
        {/* Logo/Brand - Match navbar height */}
        <div className="h-20 px-6 border-b border-gray-200 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gray-900 rounded-lg flex items-center justify-center">
              <Calendar className="h-5 w-5 text-white" />
            </div>
            <div>
              <h1 className="text-lg font-semibold text-gray-900">QuickLeave</h1>
              <p className="text-xs text-gray-500 capitalize">{role} Portal</p>
            </div>
          </div>
          
          {/* Mobile close button */}
          <button
            onClick={onMenuClose}
            className="md:hidden p-2 rounded-md text-gray-500 hover:text-gray-700 hover:bg-gray-100 transition-colors"
            type="button"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          {navigationItems.map((item) => {
            const Icon = item.icon
            const isAvailable = item.available
            
            return (
              <Link
                key={item.name}
                to={isAvailable ? item.href : "#"}
                onClick={isAvailable ? handleLinkClick : undefined}
                className={`
                  flex items-center px-3 py-2.5 text-sm font-medium rounded-lg transition-all duration-200 group
                  ${isAvailable 
                    ? "text-gray-700 hover:text-gray-900 hover:bg-gray-100 cursor-pointer" 
                    : "text-gray-400 cursor-not-allowed"
                  }
                `}
              >
                <Icon 
                  className={`mr-3 h-5 w-5 flex-shrink-0 ${
                    isAvailable 
                      ? "text-gray-500 group-hover:text-gray-700" 
                      : "text-gray-300"
                  }`} 
                />
                <span className={`${isAvailable ? "" : "line-through"} truncate`}>
                  {item.name}
                </span>
                {!isAvailable && (
                  <div className="ml-auto flex-shrink-0">
                    <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-600">
                      {role === "member" ? "Manager+" : "Admin"}
                    </span>
                  </div>
                )}
              </Link>
            )
          })}
        </nav>

        {/* Role Badge */}
        <div className="p-4 border-t border-gray-200 flex-shrink-0">
          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <div className="flex items-center space-x-2 min-w-0">
              <div className={`w-2 h-2 rounded-full flex-shrink-0 ${
                role === "admin" ? "bg-red-500" : 
                role === "manager" ? "bg-blue-500" : "bg-green-500"
              }`} />
              <span className="text-sm font-medium text-gray-900 capitalize truncate">
                {role}
              </span>
            </div>
            <span className="text-xs text-gray-500 flex-shrink-0 ml-2">
              {role === "admin" ? "Full Access" : 
               role === "manager" ? "Team Access" : "Basic Access"}
            </span>
          </div>
        </div>
      </aside>
    </>
  )
}