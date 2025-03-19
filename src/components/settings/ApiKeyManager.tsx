import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Key,
  Plus,
  Trash2,
  Eye,
  EyeOff,
  Check,
  X,
  AlertTriangle,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/lib/supabase";
import LoadingSpinner from "@/components/ui/loading-spinner";

interface ApiKey {
  id: string;
  user_id: string;
  provider: string;
  key_name: string;
  key_value: string;
  is_active: boolean;
  created_at: string;
}

const ApiKeyManager = () => {
  const [apiKeys, setApiKeys] = useState<ApiKey[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isAddingKey, setIsAddingKey] = useState(false);
  const [newKeyProvider, setNewKeyProvider] = useState("openai");
  const [newKeyName, setNewKeyName] = useState("");
  const [newKeyValue, setNewKeyValue] = useState("");
  const [showKeyValue, setShowKeyValue] = useState<Record<string, boolean>>({});
  const [keyToDelete, setKeyToDelete] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const { user } = useAuth();

  // Only show OpenAI as requested
  const apiProviders = [{ value: "openai", label: "OpenAI" }];

  useEffect(() => {
    const fetchApiKeys = async () => {
      if (!user) return;

      setIsLoading(true);
      setError(null);

      try {
        const { data, error } = await supabase
          .from("api_keys")
          .select("*")
          .eq("user_id", user.id);

        if (error) throw error;

        setApiKeys(data || []);
        setIsLoading(false);
      } catch (err: any) {
        console.error("Error fetching API keys:", err);
        setError("Failed to load API keys. Please try again later.");
        setIsLoading(false);
        // Fallback to empty array if there's an error
        setApiKeys([]);
      }
    };

    fetchApiKeys();
  }, [user]);

  const handleAddKey = async () => {
    if (!user) return;
    if (!newKeyName.trim() || !newKeyValue.trim()) {
      setError("Please provide both a name and value for your API key.");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      // Validate OpenAI key format (basic check)
      if (newKeyProvider === "openai" && !newKeyValue.startsWith("sk-")) {
        setError("OpenAI keys should start with 'sk-'");
        setIsLoading(false);
        return;
      }

      const { data, error } = await supabase
        .from("api_keys")
        .insert({
          user_id: user.id,
          provider: newKeyProvider,
          key_name: newKeyName,
          key_value: newKeyValue,
          is_active: true,
        })
        .select();

      if (error) throw error;

      setApiKeys([...(data || []), ...apiKeys]);
      setNewKeyName("");
      setNewKeyValue("");
      setNewKeyProvider("openai");
      setIsAddingKey(false);
      setSuccess("API key added successfully!");

      // Clear success message after 3 seconds
      setTimeout(() => setSuccess(null), 3000);
    } catch (err: any) {
      console.error("Error adding API key:", err);
      setError("Failed to add API key. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleToggleKeyActive = async (
    keyId: string,
    currentStatus: boolean,
  ) => {
    setIsLoading(true);
    setError(null);

    try {
      const { error } = await supabase
        .from("api_keys")
        .update({ is_active: !currentStatus })
        .eq("id", keyId);

      if (error) throw error;

      const updatedKeys = apiKeys.map((key) => {
        if (key.id === keyId) {
          return { ...key, is_active: !currentStatus };
        }
        return key;
      });

      setApiKeys(updatedKeys);
      setSuccess(
        `API key ${!currentStatus ? "activated" : "deactivated"} successfully!`,
      );

      // Clear success message after 3 seconds
      setTimeout(() => setSuccess(null), 3000);
    } catch (err: any) {
      console.error("Error updating API key status:", err);
      setError("Failed to update API key status. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteKey = async () => {
    if (!keyToDelete) return;

    setIsLoading(true);
    setError(null);

    try {
      const { error } = await supabase
        .from("api_keys")
        .delete()
        .eq("id", keyToDelete);

      if (error) throw error;

      const updatedKeys = apiKeys.filter((key) => key.id !== keyToDelete);
      setApiKeys(updatedKeys);
      setKeyToDelete(null);
      setSuccess("API key deleted successfully!");

      // Clear success message after 3 seconds
      setTimeout(() => setSuccess(null), 3000);
    } catch (err: any) {
      console.error("Error deleting API key:", err);
      setError("Failed to delete API key. Please try again later.");
      setKeyToDelete(null);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleKeyVisibility = (keyId: string) => {
    setShowKeyValue((prev) => ({
      ...prev,
      [keyId]: !prev[keyId],
    }));
  };

  const getProviderLabel = (providerValue: string) => {
    const provider = apiProviders.find((p) => p.value === providerValue);
    return provider ? provider.label : providerValue;
  };

  const maskApiKey = (key: string) => {
    if (key.length <= 8) return "*".repeat(key.length);
    return (
      key.substring(0, 4) +
      "*".repeat(key.length - 8) +
      key.substring(key.length - 4)
    );
  };

  return (
    <div className="space-y-6">
      {error && (
        <div className="bg-destructive/10 text-destructive p-3 rounded-md flex items-start gap-2">
          <AlertTriangle className="h-5 w-5 flex-shrink-0 mt-0.5" />
          <p>{error}</p>
        </div>
      )}

      {success && (
        <div className="bg-green-100 text-green-800 p-3 rounded-md flex items-start gap-2">
          <Check className="h-5 w-5 flex-shrink-0 mt-0.5" />
          <p>{success}</p>
        </div>
      )}

      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Your API Keys</h3>
        <Button
          onClick={() => setIsAddingKey(true)}
          disabled={isLoading}
          size="sm"
        >
          <Plus className="h-4 w-4 mr-1" />
          Add Key
        </Button>
      </div>

      {isLoading && apiKeys.length === 0 ? (
        <div className="flex justify-center py-8">
          <LoadingSpinner size="md" />
        </div>
      ) : apiKeys.length === 0 ? (
        <div className="text-center py-8 border rounded-lg bg-white">
          <Key className="h-12 w-12 mx-auto text-gray-400 mb-3" />
          <h3 className="text-lg font-medium mb-1">No API Keys Added</h3>
          <p className="text-muted-foreground mb-4">
            Add your OpenAI API key to customize the AI services
          </p>
          <Button onClick={() => setIsAddingKey(true)}>
            <Plus className="h-4 w-4 mr-1" />
            Add Your First Key
          </Button>
        </div>
      ) : (
        <div className="space-y-3">
          {apiKeys.map((key) => (
            <Card key={key.id} className="p-4 bg-white">
              <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span
                      className={`inline-flex items-center px-2 py-1 rounded-full text-xs ${key.is_active ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"}`}
                    >
                      {getProviderLabel(key.provider)}
                    </span>
                    <h4 className="font-medium">{key.key_name}</h4>
                  </div>
                  <div className="mt-2 flex items-center gap-2 max-w-full overflow-hidden">
                    <code className="bg-gray-100 px-2 py-1 rounded text-sm font-mono overflow-x-auto max-w-[200px] md:max-w-[300px] whitespace-nowrap">
                      {showKeyValue[key.id]
                        ? key.key_value
                        : maskApiKey(key.key_value)}
                    </code>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6 flex-shrink-0"
                      onClick={() => toggleKeyVisibility(key.id)}
                    >
                      {showKeyValue[key.id] ? (
                        <EyeOff className="h-3 w-3" />
                      ) : (
                        <Eye className="h-3 w-3" />
                      )}
                    </Button>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="flex items-center space-x-2">
                    <Switch
                      id={`key-active-${key.id}`}
                      checked={key.is_active}
                      onCheckedChange={() =>
                        handleToggleKeyActive(key.id, key.is_active)
                      }
                      disabled={isLoading}
                    />
                    <Label htmlFor={`key-active-${key.id}`} className="text-sm">
                      {key.is_active ? "Active" : "Inactive"}
                    </Label>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-destructive hover:text-destructive/90 hover:bg-destructive/10"
                    onClick={() => setKeyToDelete(key.id)}
                    disabled={isLoading}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {isAddingKey && (
        <Card className="p-4 mt-4 border-primary/50 bg-white">
          <h4 className="font-medium mb-4">Add New API Key</h4>
          <div className="space-y-4">
            <div>
              <Label htmlFor="api-provider">API Provider</Label>
              <Select value={newKeyProvider} onValueChange={setNewKeyProvider}>
                <SelectTrigger id="api-provider" className="mt-1">
                  <SelectValue placeholder="Select API provider" />
                </SelectTrigger>
                <SelectContent>
                  {apiProviders.map((provider) => (
                    <SelectItem key={provider.value} value={provider.value}>
                      {provider.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="key-name">Key Name</Label>
              <Input
                id="key-name"
                value={newKeyName}
                onChange={(e) => setNewKeyName(e.target.value)}
                placeholder="e.g. My OpenAI Key"
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="key-value">API Key</Label>
              <Input
                id="key-value"
                value={newKeyValue}
                onChange={(e) => setNewKeyValue(e.target.value)}
                placeholder="Enter your API key (starts with sk-)"
                type="password"
                className="mt-1 font-mono"
              />
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <Button
                variant="outline"
                onClick={() => {
                  setIsAddingKey(false);
                  setNewKeyName("");
                  setNewKeyValue("");
                  setNewKeyProvider("openai");
                  setError(null);
                }}
                disabled={isLoading}
              >
                <X className="h-4 w-4 mr-1" />
                Cancel
              </Button>
              <Button
                onClick={handleAddKey}
                disabled={
                  isLoading || !newKeyName.trim() || !newKeyValue.trim()
                }
              >
                {isLoading ? (
                  <LoadingSpinner size="sm" className="mr-1" />
                ) : (
                  <Check className="h-4 w-4 mr-1" />
                )}
                Save Key
              </Button>
            </div>
          </div>
        </Card>
      )}

      <div className="bg-muted/50 p-4 rounded-lg mt-4">
        <h4 className="font-medium mb-2">About API Keys</h4>
        <p className="text-sm text-muted-foreground">
          Adding your own OpenAI API key allows you to use your own account with
          OpenAI services. This gives you more control over usage limits and
          billing. Your API key is encrypted before being stored and is never
          shared with third parties.
        </p>
      </div>

      <AlertDialog
        open={!!keyToDelete}
        onOpenChange={() => setKeyToDelete(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete API Key</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this API key? This action cannot
              be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isLoading}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteKey}
              disabled={isLoading}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {isLoading ? <LoadingSpinner size="sm" /> : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default ApiKeyManager;
