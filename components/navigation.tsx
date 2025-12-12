import { Link } from "react-router"


export default function Navigation() {

  return (
    <nav className="flex justify-center gap-8">
      <Link to="/" className="hover:underline">
        Home
      </Link>
      <Link to="/about" className="hover:underline">
        About
      </Link>
      <Link to="/contact" className="hover:underline">
        Contact
      </Link>
    </nav>
  )
}
