import ventureLogoImage from "@/assets/venture-logo-new.png";
import { Phone, Mail } from "lucide-react";

export const Header = () => {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-xl border-b border-border/50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-20">
          {/* Logo and Company Name */}
          <div className="flex items-center gap-4">
            <img 
              src={ventureLogoImage} 
              alt="Venture Sports USA" 
              className="h-12 w-auto"
            />
            <div className="hidden md:block">
              <h1 className="text-xl font-bold text-foreground">Venture Sports USA</h1>
              <p className="text-xs text-muted-foreground">College Soccer Placement</p>
            </div>
          </div>

          {/* Contact Info */}
          <div className="flex items-center gap-4">
            <a 
              href="tel:5085891407"
              className="hidden sm:flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors"
            >
              <Phone className="w-4 h-4" />
              <span className="hidden lg:inline">(508) 589-1407</span>
            </a>
            <a 
              href="mailto:ajayyosi@venturesportsusa.com"
              className="hidden sm:flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors"
            >
              <Mail className="w-4 h-4" />
              <span className="hidden lg:inline">Contact Us</span>
            </a>
          </div>
        </div>
      </div>
    </header>
  );
};
