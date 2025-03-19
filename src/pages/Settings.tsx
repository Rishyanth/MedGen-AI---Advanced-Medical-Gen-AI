import React from "react";
import { Helmet } from "react-helmet";
import ApiKeyManager from "@/components/settings/ApiKeyManager";
import AuthGuard from "@/components/auth/AuthGuard";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Settings as SettingsIcon } from "lucide-react";

const Settings = () => {
  return (
    <AuthGuard>
      <div className="min-h-screen bg-gray-50 p-4 md:p-6 overflow-y-auto h-full">
        <Helmet>
          <title>Settings | Medgen AI</title>
        </Helmet>

        <div className="max-w-4xl mx-auto space-y-6">
          <div>
            <h1 className="text-3xl font-bold">Settings</h1>
            <p className="text-muted-foreground mt-1">
              Manage your account settings and API keys
            </p>
          </div>

          <Card className="w-full bg-white shadow-md">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <SettingsIcon className="h-5 w-5 text-primary" />
                Application Settings
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="api-keys">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="api-keys">API Keys</TabsTrigger>
                  <TabsTrigger value="preferences">Preferences</TabsTrigger>
                </TabsList>
                <TabsContent value="api-keys" className="pt-6">
                  <ApiKeyManager />
                </TabsContent>
                <TabsContent value="preferences" className="pt-6">
                  <div className="text-center py-8">
                    <p className="text-muted-foreground">
                      User preferences coming soon
                    </p>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
      </div>
    </AuthGuard>
  );
};

export default Settings;
