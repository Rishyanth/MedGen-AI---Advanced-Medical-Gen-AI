import React, { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Edit, User, Loader2 } from "lucide-react";
import { fetchUserProfile, fetchMedicalHistory } from "@/lib/api";
import { useAuth } from "@/context/AuthContext";

interface UserProfileCardProps {
  onEdit?: () => void;
}

const UserProfileCard = ({
  onEdit = () => console.log("Edit profile clicked"),
}: UserProfileCardProps) => {
  const { user } = useAuth();
  const [profile, setProfile] = useState<any>(null);
  const [medicalHistory, setMedicalHistory] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadUserData = async () => {
      try {
        setLoading(true);
        const profileData = await fetchUserProfile();
        const medicalHistoryData = await fetchMedicalHistory();

        setProfile(
          profileData || {
            name:
              user?.user_metadata?.name || user?.email?.split("@")[0] || "User",
            age: user?.user_metadata?.age || 30,
            avatar_url:
              user?.user_metadata?.avatar_url ||
              `https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.email}`,
          },
        );

        setMedicalHistory(medicalHistoryData || []);
        setError(null);
      } catch (err: any) {
        console.error("Error loading user data:", err);
        setError("Failed to load user data");
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      loadUserData();
    }
  }, [user]);

  if (loading) {
    return (
      <Card className="w-[350px] h-[200px] apple-card bg-white flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-black" />
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="w-[350px] h-[200px] apple-card bg-white">
        <CardContent className="flex items-center justify-center h-full">
          <p className="text-destructive">{error}</p>
        </CardContent>
      </Card>
    );
  }

  // Format medical history items
  const formattedMedicalHistory =
    medicalHistory.length > 0
      ? medicalHistory.map(
          (item: any) =>
            `${item.condition}${item.diagnosis_date ? ` (diagnosed ${new Date(item.diagnosis_date).getFullYear()})` : ""}`,
        )
      : ["No medical history recorded"];

  return (
    <Card className="w-[350px] h-[200px] apple-card bg-white">
      <CardHeader className="flex flex-row items-center gap-4 pb-2">
        <Avatar className="h-12 w-12">
          <AvatarImage src={profile?.avatar_url} alt={profile?.name} />
          <AvatarFallback className="bg-black text-white">
            <User className="h-6 w-6" />
          </AvatarFallback>
        </Avatar>
        <div className="flex flex-col">
          <CardTitle className="text-xl font-semibold">
            {profile?.name}
          </CardTitle>
          <p className="text-sm text-muted-foreground">Age: {profile?.age}</p>
        </div>
      </CardHeader>
      <CardContent className="pb-2">
        <div>
          <h3 className="text-sm font-medium mb-1">Medical History Summary</h3>
          <ul className="text-xs text-muted-foreground space-y-1 max-h-[70px] overflow-y-auto">
            {formattedMedicalHistory.map((item, index) => (
              <li key={index} className="list-disc list-inside">
                {item}
              </li>
            ))}
          </ul>
        </div>
      </CardContent>
      <CardFooter className="pt-0 flex justify-end">
        <Button
          variant="outline"
          size="sm"
          className="flex items-center gap-1 rounded-full"
          onClick={onEdit}
        >
          <Edit className="h-3.5 w-3.5" />
          Edit Profile
        </Button>
      </CardFooter>
    </Card>
  );
};

export default UserProfileCard;
