import SpaApp from "../../spa-app";

// The storefront is a client-side router mounted inside Next. This explicit
// route keeps direct visits and refreshes on /admin/login from becoming a
// Next 404 before React Router can render the login screen.
export default function AdminLoginPage() {
  return <SpaApp />;
}
