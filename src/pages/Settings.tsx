import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Header } from "@/components/sections/Header";
import { useNavigate } from "react-router-dom";
import { Copy } from "lucide-react";

export default function Settings() {
  const [loading, setLoading] = useState(false);
  const [userId, setUserId] = useState("");
  const [username, setUsername] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [email, setEmail] = useState("");
  const [pipedriveApiToken, setPipedriveApiToken] = useState("");
  const [pipedriveDomain, setPipedriveDomain] = useState("venturesportsusa");
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      navigate("/auth");
      return;
    }
    setUserId(user.id);
    loadSettings(user.id);
  };

  const loadSettings = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from("user_settings")
        .select("*")
        .eq("user_id", userId)
        .single();

      if (error && error.code !== "PGRST116") throw error;

      if (data) {
        setUsername(data.username || "");
        setPhoneNumber(data.phone_number || "");
        setEmail(data.email || "");
        setPipedriveApiToken(data.pipedrive_api_token || "");
        setPipedriveDomain(data.pipedrive_domain || "venturesportsusa");
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      // Validate username format
      if (username && !/^[a-z0-9-]+$/.test(username)) {
        throw new Error("Username can only contain lowercase letters, numbers, and hyphens");
      }

      // Check if username is already taken by another user
      if (username) {
        const { data: existingUser, error: checkError } = await supabase
          .from("user_settings")
          .select("user_id")
          .eq("username", username)
          .maybeSingle();

        if (checkError) {
          console.error("Error checking username:", checkError);
        }

        if (existingUser && existingUser.user_id !== user.id) {
          throw new Error(`Username "${username}" is already taken. Please choose another one.`);
        }
      }

      const { error } = await supabase
        .from("user_settings")
        .upsert({
          user_id: user.id,
          username: username || null,
          phone_number: phoneNumber,
          email: email,
          pipedrive_api_token: pipedriveApiToken,
          pipedrive_domain: pipedriveDomain,
        }, {
          onConflict: "user_id"
        });

      if (error) {
        console.error("Save error:", error);
        // Check for duplicate key error
        if (error.code === "23505") {
          throw new Error(`Username "${username}" is already taken. Please choose another one.`);
        }
        throw error;
      }

      toast({
        title: "Success",
        description: "Settings saved successfully!",
      });
    } catch (error: any) {
      console.error("Settings save error:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to save settings",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate("/auth");
  };

  const copyShareableLink = () => {
    const link = username 
      ? `${window.location.origin}/${username}`
      : `${window.location.origin}?rep=${userId}`;
    navigator.clipboard.writeText(link);
    toast({
      title: "Copied!",
      description: "Your shareable link has been copied to clipboard",
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="container mx-auto px-4 pt-32 pb-16">
        <div className="max-w-2xl mx-auto space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Your Shareable Link</CardTitle>
              <CardDescription>
                Share this link with leads to track submissions to your Pipedrive
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex gap-2">
                <Input
                  value={username 
                    ? `${window.location.origin}/${username}`
                    : `${window.location.origin}?rep=${userId}`}
                  readOnly
                  className="font-mono text-sm"
                />
                <Button onClick={copyShareableLink} variant="outline">
                  <Copy className="w-4 h-4" />
                </Button>
              </div>
              {!username && (
                <p className="text-sm text-muted-foreground mt-2">
                  Set a username below to get a custom link
                </p>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Settings</CardTitle>
              <CardDescription>
                Configure your contact information and Pipedrive integration
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSave} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="username">Your Username</Label>
                  <Input
                    id="username"
                    type="text"
                    placeholder="andrewjayyosi"
                    value={username}
                    onChange={(e) => setUsername(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ''))}
                  />
                  <p className="text-xs text-muted-foreground">
                    Only lowercase letters, numbers, and hyphens. Your link will be: yourdomain.com/{username || "yourname"}
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="(508) 589-1407"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="your@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="pipedrive-token">Pipedrive API Token</Label>
                  <Input
                    id="pipedrive-token"
                    type="password"
                    placeholder="Enter your Pipedrive API token"
                    value={pipedriveApiToken}
                    onChange={(e) => setPipedriveApiToken(e.target.value)}
                  />
                  <p className="text-xs text-muted-foreground">
                    Get your API token from Pipedrive Settings → Personal preferences → API
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="pipedrive-domain">Pipedrive Domain</Label>
                  <Input
                    id="pipedrive-domain"
                    type="text"
                    placeholder="venturesportsusa"
                    value={pipedriveDomain}
                    onChange={(e) => setPipedriveDomain(e.target.value)}
                  />
                  <p className="text-xs text-muted-foreground">
                    Your company name from your Pipedrive URL (e.g., company.pipedrive.com)
                  </p>
                </div>

                <div className="flex gap-4">
                  <Button type="submit" disabled={loading}>
                    {loading ? "Saving..." : "Save Settings"}
                  </Button>
                  <Button type="button" variant="outline" onClick={() => navigate("/")}>
                    Back to Home
                  </Button>
                  <Button type="button" variant="destructive" onClick={handleSignOut}>
                    Sign Out
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
