import { Link } from "react-router-dom"

function Header() {
  return (
    <header className="border-b bg-white fixed top-0 left-0 right-0 z-10">
      <div className="flex h-14 items-center px-4 justify-between">
        <Link to="/" className="flex items-center gap-2 font-semibold">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="h-5 w-5"
          >
            <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path>
            <circle cx="9" cy="7" r="4"></circle>
            <path d="M22 21v-2a4 4 0 0 0-3-3.87"></path>
            <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
          </svg>
          <span>Contador</span>
        </Link>
        <Link to="/admin" className="text-sm font-medium">
          Admin
        </Link>
      </div>
    </header>
  )
}

export default Header
