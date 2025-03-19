import React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  ArrowRight,
  MessageSquare,
  Activity,
  Image,
  Database,
  FlaskConical,
} from "lucide-react";

const Landing = () => {
  const navigate = useNavigate();

  return (
    <div className="overflow-y-auto h-full">
      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden bg-gradient-to-b from-black to-gray-900 text-white">
        <div
          className="absolute inset-0 z-0"
          style={{
            backgroundImage:
              "url(https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=1920&q=80)",
            backgroundSize: "cover",
            backgroundPosition: "center",
            opacity: 0.4,
          }}
        />

        <div className="absolute top-0 left-0 w-full z-10">
          <nav className="apple-nav backdrop-blur-xl bg-black/30 px-6 py-4">
            <div className="max-w-7xl mx-auto flex justify-between items-center">
              <div className="text-2xl font-semibold">Medgen AI</div>
              <div className="hidden md:flex space-x-8">
                <button
                  onClick={() => navigate("/home")}
                  className="text-sm font-medium hover:opacity-70 transition-opacity"
                >
                  Home
                </button>
                <button
                  onClick={() => navigate("/chatbot")}
                  className="text-sm font-medium hover:opacity-70 transition-opacity"
                >
                  Chatbot
                </button>
                <button
                  onClick={() => navigate("/diagnosis")}
                  className="text-sm font-medium hover:opacity-70 transition-opacity"
                >
                  Diagnosis
                </button>
                <button
                  onClick={() => navigate("/dashboard")}
                  className="text-sm font-medium hover:opacity-70 transition-opacity"
                >
                  Dashboard
                </button>
              </div>
              <div className="flex space-x-4">
                <Button
                  variant="ghost"
                  className="text-white hover:text-white/80 transition-opacity"
                  onClick={() => navigate("/login")}
                >
                  Log in
                </Button>
                <Button
                  className="apple-button bg-white text-black hover:bg-white/90 text-sm"
                  onClick={() => navigate("/register")}
                >
                  Sign up
                </Button>
              </div>
            </div>
          </nav>
        </div>

        <div className="relative z-10 max-w-5xl mx-auto px-4 text-center space-y-8">
          <h1 className="text-6xl md:text-8xl font-bold tracking-tight leading-tight">
            The future of{" "}
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-600">
              healthcare
            </span>{" "}
            is here.
          </h1>
          <p className="text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto">
            AI-powered medical assistant for diagnosis, analysis, and discovery
          </p>
          <div className="flex flex-wrap gap-4 justify-center pt-8">
            <Button
              size="lg"
              className="apple-button bg-white text-black hover:bg-white/90 text-base px-8 py-6"
              onClick={() => navigate("/register")}
            >
              Get Started
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="apple-button border-2 border-white text-white hover:bg-white/10 text-base px-8 py-6"
              onClick={() => navigate("/home")}
            >
              Learn More
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-32 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-5xl md:text-6xl font-bold tracking-tight mb-6">
              Revolutionary Features
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Discover how Medgen AI is transforming healthcare with advanced AI
              technology.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
            <FeatureCard
              icon={<MessageSquare className="h-10 w-10" />}
              title="AI-Powered Chatbot"
              description="Get medical answers and advice through our advanced AI chatbot that understands symptoms and suggests possible conditions."
              color="from-blue-500 to-cyan-400"
              onClick={() => navigate("/chatbot")}
            />

            <FeatureCard
              icon={<Activity className="h-10 w-10" />}
              title="Disease Diagnosis"
              description="Receive AI-assisted diagnosis based on your symptoms with relevant follow-up questions and detailed medical reports."
              color="from-purple-500 to-pink-400"
              onClick={() => navigate("/diagnosis")}
            />

            <FeatureCard
              icon={<Image className="h-10 w-10" />}
              title="Medical Image Analysis"
              description="Analyze X-rays, MRIs, and other medical images with AI to detect anomalies and extract data from reports."
              color="from-amber-500 to-orange-400"
              onClick={() => navigate("/image-analysis")}
            />

            <FeatureCard
              icon={<Database className="h-10 w-10" />}
              title="Dataset Generation"
              description="Generate synthetic medical datasets for AI training while preserving privacy using advanced GANs and VAEs."
              color="from-emerald-500 to-green-400"
              onClick={() => navigate("/dataset-generation")}
            />

            <FeatureCard
              icon={<FlaskConical className="h-10 w-10" />}
              title="Drug Discovery"
              description="Explore AI-powered drug discovery and generation with disease-to-drug AI models for pharmaceutical research."
              color="from-rose-500 to-red-400"
              onClick={() => navigate("/drug-discovery")}
            />

            <FeatureCard
              icon={
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="40"
                  height="40"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10" />
                </svg>
              }
              title="Privacy & Security"
              description="Your medical data is protected with enterprise-grade security and encryption, ensuring complete privacy and compliance."
              color="from-indigo-500 to-blue-400"
              onClick={() => navigate("/settings")}
            />
          </div>
        </div>
      </section>

      {/* Product Showcase */}
      <section
        id="product"
        className="py-32 px-4 bg-gradient-to-b from-gray-50 to-white"
      >
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-5xl md:text-6xl font-bold tracking-tight mb-6">
              Designed for Everyone
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Whether you're a patient, doctor, or researcher, Medgen AI
              provides powerful tools to enhance healthcare.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="order-2 lg:order-1 space-y-8">
              <h3 className="text-3xl font-bold">Intuitive Dashboard</h3>
              <p className="text-lg text-gray-600">
                Access all your medical information, recent diagnoses, and AI
                tools from a single, beautifully designed dashboard.
              </p>
              <ul className="space-y-4">
                {[
                  "View your medical history at a glance",
                  "Track recent diagnoses and chatbot interactions",
                  "Quick access to all AI-powered medical tools",
                  "Personalized health insights and recommendations",
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <div className="rounded-full bg-green-500 p-1 mt-1">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="12"
                        height="12"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="white"
                        strokeWidth="4"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                    </div>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
              <Button
                className="apple-button bg-black text-white hover:bg-black/90 mt-4"
                onClick={() => navigate("/dashboard")}
              >
                Try the Dashboard
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
            <div className="order-1 lg:order-2 rounded-2xl overflow-hidden shadow-2xl">
              <img
                src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&q=80"
                alt="Medgen AI Dashboard"
                className="w-full h-auto"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center mt-32">
            <div className="rounded-2xl overflow-hidden shadow-2xl">
              <img
                src="https://images.unsplash.com/photo-1551076805-e1869033e561?w=800&q=80"
                alt="Medgen AI Chatbot"
                className="w-full h-auto"
              />
            </div>
            <div className="space-y-8">
              <h3 className="text-3xl font-bold">Advanced AI Chatbot</h3>
              <p className="text-lg text-gray-600">
                Our medical chatbot understands your symptoms and provides
                accurate information using the latest AI technology.
              </p>
              <ul className="space-y-4">
                {[
                  "Natural conversation about medical concerns",
                  "Symptom analysis and condition suggestions",
                  "Medical report generation from conversations",
                  "Voice input support for accessibility",
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <div className="rounded-full bg-blue-500 p-1 mt-1">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="12"
                        height="12"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="white"
                        strokeWidth="4"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                    </div>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
              <Button
                className="apple-button bg-black text-white hover:bg-black/90 mt-4"
                onClick={() => navigate("/chatbot")}
              >
                Try the Chatbot
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section id="testimonials" className="py-32 px-4 bg-black text-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-5xl md:text-6xl font-bold tracking-tight mb-6">
              Trusted by Professionals
            </h2>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto">
              See what healthcare professionals and patients are saying about
              Medgen AI.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <TestimonialCard
              quote="Medgen AI has revolutionized how we approach preliminary diagnosis. The accuracy and speed of the AI analysis has helped us improve patient care significantly."
              name="Dr. Sarah Johnson"
              title="Chief Medical Officer"
              image="https://api.dicebear.com/7.x/avataaars/svg?seed=doctor1"
            />

            <TestimonialCard
              quote="As a researcher, the synthetic dataset generation tool has been invaluable for our AI model training. It's saving us months of data collection while maintaining privacy."
              name="Prof. Michael Chen"
              title="Medical Research Director"
              image="https://api.dicebear.com/7.x/avataaars/svg?seed=doctor2"
            />

            <TestimonialCard
              quote="The medical chatbot helped me understand my symptoms before seeing my doctor. It asked relevant questions and gave me information that made my doctor's visit much more productive."
              name="Emily Rodriguez"
              title="Patient"
              image="https://api.dicebear.com/7.x/avataaars/svg?seed=patient1"
            />
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-32 px-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="max-w-5xl mx-auto text-center">
          <h2 className="text-5xl md:text-6xl font-bold tracking-tight mb-8">
            Ready to transform healthcare?
          </h2>
          <p className="text-xl text-white/80 max-w-3xl mx-auto mb-12">
            Join thousands of healthcare professionals and patients who are
            already benefiting from Medgen AI.
          </p>
          <div className="flex flex-wrap gap-6 justify-center">
            <Button
              size="lg"
              className="apple-button bg-white text-black hover:bg-white/90 text-lg px-10 py-7"
              onClick={() => navigate("/register")}
            >
              Get Started Today
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="apple-button border-2 border-white text-white hover:bg-white/10 text-lg px-10 py-7"
              onClick={() => navigate("/login")}
            >
              Log In
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
            <div>
              <h3 className="text-lg font-semibold mb-4">Medgen AI</h3>
              <p className="text-gray-400">
                AI-powered medical assistant for the future of healthcare.
              </p>
            </div>
            <div>
              <h4 className="text-sm font-semibold mb-4">Features</h4>
              <ul className="space-y-2">
                <li>
                  <button
                    onClick={() => navigate("/chatbot")}
                    className="text-sm text-gray-400 hover:text-white"
                  >
                    AI Chatbot
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => navigate("/diagnosis")}
                    className="text-sm text-gray-400 hover:text-white"
                  >
                    Disease Diagnosis
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => navigate("/image-analysis")}
                    className="text-sm text-gray-400 hover:text-white"
                  >
                    Image Analysis
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => navigate("/dataset-generation")}
                    className="text-sm text-gray-400 hover:text-white"
                  >
                    Dataset Generation
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => navigate("/drug-discovery")}
                    className="text-sm text-gray-400 hover:text-white"
                  >
                    Drug Discovery
                  </button>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="text-sm font-semibold mb-4">Company</h4>
              <ul className="space-y-2">
                <li>
                  <button
                    onClick={() => navigate("/home")}
                    className="text-sm text-gray-400 hover:text-white"
                  >
                    About Us
                  </button>
                </li>
                <li>
                  <button className="text-sm text-gray-400 hover:text-white">
                    Careers
                  </button>
                </li>
                <li>
                  <button className="text-sm text-gray-400 hover:text-white">
                    Press
                  </button>
                </li>
                <li>
                  <button className="text-sm text-gray-400 hover:text-white">
                    Contact
                  </button>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="text-sm font-semibold mb-4">Legal</h4>
              <ul className="space-y-2">
                <li>
                  <button className="text-sm text-gray-400 hover:text-white">
                    Privacy Policy
                  </button>
                </li>
                <li>
                  <button className="text-sm text-gray-400 hover:text-white">
                    Terms of Service
                  </button>
                </li>
                <li>
                  <button className="text-sm text-gray-400 hover:text-white">
                    Cookie Policy
                  </button>
                </li>
              </ul>
            </div>
          </div>
          <div className="pt-8 border-t border-gray-800 flex flex-col md:flex-row justify-between items-center">
            <p className="text-sm text-gray-400 mb-4 md:mb-0">
              &copy; {new Date().getFullYear()} Medgen AI. All rights reserved.
            </p>
            <div className="flex space-x-6">
              {["M", "T", "I", "F"].map((letter, i) => (
                <button
                  key={i}
                  className="text-gray-400 hover:text-white h-8 w-8 rounded-full bg-gray-800 flex items-center justify-center"
                >
                  {letter}
                </button>
              ))}
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

const FeatureCard = ({
  icon,
  title,
  description,
  color,
  onClick,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
  color: string;
  onClick?: () => void;
}) => {
  return (
    <div
      className="feature-card bg-white rounded-3xl p-8 shadow-xl hover:shadow-2xl transition-all duration-500 cursor-pointer"
      onClick={onClick}
    >
      <div
        className={`p-4 rounded-2xl bg-gradient-to-br ${color} text-white w-fit mb-6`}
      >
        {icon}
      </div>
      <h3 className="text-2xl font-bold mb-4">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </div>
  );
};

const TestimonialCard = ({
  quote,
  name,
  title,
  image,
}: {
  quote: string;
  name: string;
  title: string;
  image: string;
}) => {
  return (
    <div className="bg-gray-900 rounded-3xl p-8 border border-gray-800 hover:border-gray-700 transition-all duration-300">
      <div className="mb-6">
        {[1, 2, 3, 4, 5].map((star) => (
          <span key={star} className="text-yellow-500 inline-block mr-1">
            ★
          </span>
        ))}
      </div>
      <p className="text-gray-300 mb-8 italic">"{quote}"</p>
      <div className="flex items-center">
        <img src={image} alt={name} className="w-12 h-12 rounded-full mr-4" />
        <div>
          <p className="font-semibold">{name}</p>
          <p className="text-sm text-gray-400">{title}</p>
        </div>
      </div>
    </div>
  );
};

export default Landing;
