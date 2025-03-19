import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  MessageSquare,
  Activity,
  Image,
  Database,
  FlaskConical,
  ArrowRight,
} from "lucide-react";
import { Link } from "react-router-dom";

interface FeatureCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  href: string;
  color: string;
}

const FeatureCard = ({
  title = "Feature",
  description = "Feature description",
  icon = <MessageSquare className="h-6 w-6" />,
  href = "/",
  color = "bg-blue-500/10 text-blue-500",
}: FeatureCardProps) => {
  return (
    <Card className="apple-card border-0 shadow-sm hover:shadow-md transition-all duration-200">
      <CardHeader>
        <div className={cn("p-2 w-fit rounded-full", color)}>{icon}</div>
        <CardTitle className="mt-4">{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardFooter>
        <Button
          asChild
          variant="outline"
          className="w-full apple-button bg-black text-white hover:bg-black/90 justify-between"
        >
          <Link to={href}>
            Access Feature
            <ArrowRight className="h-4 w-4" />
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
};

interface FeatureCardsProps {
  features?: FeatureCardProps[];
}

const FeatureCards = ({ features }: FeatureCardsProps) => {
  const defaultFeatures: FeatureCardProps[] = [
    {
      title: "AI Chatbot",
      description: "Ask medical questions and get AI-powered responses",
      icon: <MessageSquare className="h-6 w-6" />,
      href: "/chatbot",
      color: "bg-blue-100 text-blue-700",
    },
    {
      title: "Disease Diagnosis",
      description: "Get AI-assisted diagnosis based on your symptoms",
      icon: <Activity className="h-6 w-6" />,
      href: "/diagnosis",
      color: "bg-[#f5f5f7] text-black",
    },
    {
      title: "Image Analysis",
      description: "Analyze medical images like X-rays and MRIs",
      icon: <Image className="h-6 w-6" />,
      href: "/image-analysis",
      color: "bg-[#f5f5f7] text-black",
    },
    {
      title: "Dataset Generation",
      description: "Generate synthetic medical datasets for AI training",
      icon: <Database className="h-6 w-6" />,
      href: "/dataset-generation",
      color: "bg-[#f5f5f7] text-black",
    },
    {
      title: "Drug Discovery",
      description: "Explore AI-powered drug discovery and generation",
      icon: <FlaskConical className="h-6 w-6" />,
      href: "/drug-discovery",
      color: "bg-[#f5f5f7] text-black",
    },
  ];

  const displayFeatures = features || defaultFeatures;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
      {displayFeatures.map((feature, index) => (
        <FeatureCard key={index} {...feature} />
      ))}
    </div>
  );
};

export default FeatureCards;
