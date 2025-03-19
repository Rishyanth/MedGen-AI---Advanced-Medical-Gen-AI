import React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  ArrowRight,
  MessageSquare,
  Search,
  Image,
  BarChart,
  Pill,
  Key,
} from "lucide-react";

function Home() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col bg-white">
      {/* Navigation */}
      <nav className="apple-nav sticky top-0 z-50 w-full px-6 py-3">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="text-xl font-semibold">Medgen AI</div>
          <div className="hidden md:flex space-x-8">
            <a
              href="#features"
              className="text-sm font-medium hover:opacity-70 transition-opacity"
            >
              Features
            </a>
            <a
              href="#about"
              className="text-sm font-medium hover:opacity-70 transition-opacity"
            >
              About
            </a>
            <a
              href="#support"
              className="text-sm font-medium hover:opacity-70 transition-opacity"
            >
              Support
            </a>
          </div>
          <div className="flex space-x-4">
            <Button
              variant="ghost"
              className="text-sm font-medium hover:opacity-70 transition-opacity"
              onClick={() => navigate("/login")}
            >
              Log in
            </Button>
            <Button
              className="apple-button bg-black text-white hover:bg-black/90 text-sm"
              onClick={() => navigate("/register")}
            >
              Sign up
            </Button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="apple-hero pt-20 pb-32 px-4">
        <div className="apple-stagger max-w-5xl mx-auto text-center">
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-6">
            The future of healthcare
            <br />
            is intelligent.
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto mb-10">
            AI-powered medical assistant for diagnosis, analysis, and discovery
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Button
              size="lg"
              className="apple-button bg-black text-white hover:bg-black/90 text-base"
              onClick={() => navigate("/login")}
            >
              Get Started
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="apple-button border-2 hover:bg-secondary/50 text-base"
              onClick={() => navigate("/register")}
            >
              Learn More
            </Button>
          </div>
        </div>
      </section>

      {/* Intro Video/Image Section */}
      <section className="py-20 px-4 bg-[#f5f5f7]">
        <div className="max-w-6xl mx-auto">
          <div className="rounded-3xl overflow-hidden shadow-xl">
            <img
              src="https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=1200&q=80"
              alt="Medical AI Technology"
              className="w-full h-[500px] object-cover"
            />
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="apple-section bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl md:text-5xl font-bold text-center mb-4">
            Intelligent Features
          </h2>
          <p className="text-xl text-muted-foreground text-center max-w-3xl mx-auto mb-16">
            Discover how Medgen AI is transforming healthcare with advanced
            technology.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            <FeatureCard
              title="AI-Powered Chatbot"
              description="Get medical answers and advice through our advanced AI chatbot."
              icon={<MessageSquare className="h-8 w-8" />}
            />
            <FeatureCard
              title="Disease Diagnosis"
              description="Receive AI-assisted diagnosis based on your symptoms."
              icon={<Search className="h-8 w-8" />}
            />
            <FeatureCard
              title="Medical Image Analysis"
              description="Analyze X-rays, MRIs, and other medical images with AI."
              icon={<Image className="h-8 w-8" />}
            />
            <FeatureCard
              title="Dataset Generation"
              description="Generate synthetic medical datasets for AI training."
              icon={<BarChart className="h-8 w-8" />}
            />
            <FeatureCard
              title="Drug Discovery"
              description="Explore AI-powered drug discovery and generation."
              icon={<Pill className="h-8 w-8" />}
            />
            <FeatureCard
              title="Personalized Experience"
              description="Customize your experience with your own API keys."
              icon={<Key className="h-8 w-8" />}
            />
          </div>
        </div>
      </section>

      {/* Testimonial Section */}
      <section className="py-24 px-4 bg-[#f5f5f7]">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-10">
            Trusted by Healthcare Professionals
          </h2>
          <blockquote className="text-xl md:text-2xl italic mb-8">
            "Medgen AI has revolutionized how we approach preliminary diagnosis.
            The accuracy and speed of the AI analysis has helped us improve
            patient care significantly."
          </blockquote>
          <div className="flex items-center justify-center">
            <img
              src="https://api.dicebear.com/7.x/avataaars/svg?seed=doctor"
              alt="Dr. Sarah Johnson"
              className="w-12 h-12 rounded-full mr-4"
            />
            <div className="text-left">
              <p className="font-semibold">Dr. Sarah Johnson</p>
              <p className="text-sm text-muted-foreground">
                Chief Medical Officer, Memorial Hospital
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-4 bg-black text-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Ready to transform your healthcare experience?
          </h2>
          <p className="text-xl mb-10 text-gray-300 max-w-3xl mx-auto">
            Join thousands of healthcare professionals and patients who are
            already benefiting from Medgen AI.
          </p>
          <Button
            size="lg"
            className="apple-button bg-white text-black hover:bg-white/90 text-base"
            onClick={() => navigate("/register")}
          >
            Get Started Today
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#f5f5f7] py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
            <div>
              <h3 className="text-lg font-semibold mb-4">Medgen AI</h3>
              <p className="text-muted-foreground">
                AI-powered medical assistant for the future of healthcare.
              </p>
            </div>
            <div>
              <h4 className="text-sm font-semibold mb-4">Features</h4>
              <ul className="space-y-2">
                <li>
                  <a
                    href="#"
                    className="text-sm text-muted-foreground hover:text-black"
                  >
                    AI Chatbot
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-sm text-muted-foreground hover:text-black"
                  >
                    Disease Diagnosis
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-sm text-muted-foreground hover:text-black"
                  >
                    Image Analysis
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-sm text-muted-foreground hover:text-black"
                  >
                    Dataset Generation
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-sm text-muted-foreground hover:text-black"
                  >
                    Drug Discovery
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="text-sm font-semibold mb-4">Company</h4>
              <ul className="space-y-2">
                <li>
                  <a
                    href="#"
                    className="text-sm text-muted-foreground hover:text-black"
                  >
                    About Us
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-sm text-muted-foreground hover:text-black"
                  >
                    Careers
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-sm text-muted-foreground hover:text-black"
                  >
                    Press
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-sm text-muted-foreground hover:text-black"
                  >
                    Contact
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="text-sm font-semibold mb-4">Legal</h4>
              <ul className="space-y-2">
                <li>
                  <a
                    href="#"
                    className="text-sm text-muted-foreground hover:text-black"
                  >
                    Privacy Policy
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-sm text-muted-foreground hover:text-black"
                  >
                    Terms of Service
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-sm text-muted-foreground hover:text-black"
                  >
                    Cookie Policy
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <div className="pt-8 border-t border-gray-200 flex flex-col md:flex-row justify-between items-center">
            <p className="text-sm text-muted-foreground mb-4 md:mb-0">
              &copy; {new Date().getFullYear()} Medgen AI. All rights reserved.
            </p>
            <div className="flex space-x-6">
              <a href="#" className="text-muted-foreground hover:text-black">
                <svg
                  className="h-5 w-5"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path
                    fillRule="evenodd"
                    d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z"
                    clipRule="evenodd"
                  />
                </svg>
              </a>
              <a href="#" className="text-muted-foreground hover:text-black">
                <svg
                  className="h-5 w-5"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                </svg>
              </a>
              <a href="#" className="text-muted-foreground hover:text-black">
                <svg
                  className="h-5 w-5"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path
                    fillRule="evenodd"
                    d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z"
                    clipRule="evenodd"
                  />
                </svg>
              </a>
              <a href="#" className="text-muted-foreground hover:text-black">
                <svg
                  className="h-5 w-5"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                </svg>
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

const FeatureCard = ({
  title,
  description,
  icon,
}: {
  title: string;
  description: string;
  icon: React.ReactNode;
}) => {
  return (
    <div className="apple-card bg-white p-8 flex flex-col items-center text-center transition-all">
      <div className="bg-[#f5f5f7] rounded-full p-4 mb-6">{icon}</div>
      <h3 className="text-xl font-semibold mb-3">{title}</h3>
      <p className="text-muted-foreground">{description}</p>
    </div>
  );
};

export default Home;
