import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import ventureLogoImage from "@/assets/venture-logo-new.png";
import { Phone, Mail, Settings } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";

interface HeaderProps {
  repId?: string;
}

export const Header = ({ repId }: HeaderProps) => {
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userSettings, setUserSettings] = useState<{
    phone_number: string | null;
    email: string | null;
  } | null>(null);

  useEffect(() => {
    checkAuth();
    loadUserSettings();
  }, [repId]);

  const checkAuth = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    setIsAuthenticated(!!session);
  };

  const loadUserSettings = async () => {
    try {
      if (repId) {
        // Load settings for the specific rep using secure edge function
        const { data, error } = await supabase.functions.invoke("get-rep-contact-info", {
          body: { repId },
        });

        if (!error && data?.success) {
          setUserSettings({
            phone_number: data.phoneNumber,
            email: data.email,
          });
          return;
        }
      }

      // Load authenticated user's own settings (RLS allows this)
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from("user_settings")
        .select("phone_number, email")
        .eq("user_id", user.id)
        .single();

      if (error && error.code !== "PGRST116") {
        console.error("Error loading settings:", error.message);
        return;
      }

      setUserSettings(data);
    } catch (error) {
      console.error("Error loading user settings");
    }
  };

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
            {userSettings?.phone_number && (
              <a 
                href={`tel:${userSettings.phone_number}`}
                className="hidden sm:flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors"
              >
                <Phone className="w-4 h-4" />
                <span className="hidden lg:inline">{userSettings.phone_number}</span>
              </a>
            )}
            {userSettings?.email && (
              <a 
                href={`mailto:${userSettings.email}`}
                className="hidden sm:flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors"
              >
                <Mail className="w-4 h-4" />
                <span className="hidden lg:inline">Contact Us</span>
              </a>
            )}
            {isAuthenticated && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigate("/settings")}
                className="flex items-center gap-2"
              >
                <Settings className="w-4 h-4" />
                <span className="hidden lg:inline">Settings</span>
              </Button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
