import { Link } from "react-router-dom";
import Logo from "./Logo";

const Footer = () => {
  return (
    <footer className="border-t border-border bg-card">
      <div className="container py-12 md:py-16">
        <div className="grid gap-8 md:grid-cols-4">
          {/* Brand */}
          <div className="md:col-span-2">
            <Logo size="md" />
            <p className="mt-4 max-w-md text-sm text-muted-foreground">
              A movement-backed freelancing platform. No commissions, no platform fees. 
              Just pure connection between talent and opportunity.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="mb-4 font-semibold text-foreground">Platform</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/auth?mode=signup&role=freelancer" className="text-muted-foreground transition-colors hover:text-primary">
                  Join as Freelancer
                </Link>
              </li>
              <li>
                <Link to="/auth?mode=signup&role=client" className="text-muted-foreground transition-colors hover:text-primary">
                  Join as Client
                </Link>
              </li>
              <li>
                <Link to="/auth" className="text-muted-foreground transition-colors hover:text-primary">
                  Sign In
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="mb-4 font-semibold text-foreground">Legal</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/terms" className="text-muted-foreground transition-colors hover:text-primary">
                  Terms & Conditions
                </Link>
              </li>
              <li>
                <Link to="/privacy" className="text-muted-foreground transition-colors hover:text-primary">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <a href="mailto:hello@cntrlout.com" className="text-muted-foreground transition-colors hover:text-primary">
                  Contact Us
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 border-t border-border pt-8">
          <p className="text-center text-sm text-muted-foreground">
            © {new Date().getFullYear()} cntrlout. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
