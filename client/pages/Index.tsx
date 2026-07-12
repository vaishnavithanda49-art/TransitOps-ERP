import { Link } from "react-router-dom";
import { ArrowRight, Truck, BarChart3, Shield, Zap, Globe, Users } from "lucide-react";
import BrandLogo from "../components/BrandLogo";

export default function Index() {
  return (
    <div className="min-h-screen bg-white text-foreground">
      {/* Navigation */}
      <nav className="border-b border-border">
        <div className="container flex items-center justify-between h-16">
          <BrandLogo className="gap-3" textClassName="text-xl font-bold" />
          <div className="flex items-center gap-6">
            <a href="#features" className="text-muted-foreground hover:text-foreground transition">
              Features
            </a>
            <a href="#benefits" className="text-muted-foreground hover:text-foreground transition">
              Benefits
            </a>
            <Link
              to="/login"
              className="px-4 py-2 text-primary font-medium hover:bg-secondary/10 rounded-lg transition"
            >
              Login
            </Link>
            <Link
              to="/register"
              className="px-4 py-2 bg-primary text-primary-foreground font-medium rounded-lg hover:bg-primary/90 transition"
            >
              Register
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="container py-24 lg:py-32">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-8 animate-fade-up">
            <div className="space-y-4">
              <h1 className="text-5xl lg:text-6xl font-bold text-foreground leading-tight">
                Smart Transport Operations Platform
              </h1>
              <p className="text-xl text-muted-foreground leading-relaxed">
                Digitize your entire fleet operations. Replace spreadsheets with real-time analytics, automate dispatch workflows, and maximize operational efficiency.
              </p>
            </div>
            <div className="flex gap-4 pt-4">
              <Link
                to="/register"
                className="px-8 py-3 bg-primary text-primary-foreground font-semibold rounded-lg hover:bg-primary/90 transition flex items-center gap-2 group"
              >
                Get Started
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <a
                href="#features"
                className="px-8 py-3 border border-border text-foreground font-semibold rounded-lg hover:bg-secondary/5 transition"
              >
                Learn More
              </a>
            </div>
          </div>
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-accent/10 rounded-2xl blur-3xl" />
            <div className="relative bg-gradient-to-br from-secondary/20 to-primary/20 rounded-2xl p-8 border border-border/50 backdrop-blur-sm">
              <div className="space-y-4">
                <div className="h-32 bg-gradient-to-r from-primary/20 to-secondary/20 rounded-lg" />
                <div className="grid grid-cols-2 gap-3">
                  <div className="h-20 bg-accent/10 rounded-lg" />
                  <div className="h-20 bg-accent/10 rounded-lg" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="bg-secondary/5 border-y border-border py-16">
        <div className="container">
          <div className="grid md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-3xl font-bold text-primary">500+</div>
              <p className="text-muted-foreground mt-2">Active Fleets</p>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-accent">50K+</div>
              <p className="text-muted-foreground mt-2">Vehicles Managed</p>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-primary">1M+</div>
              <p className="text-muted-foreground mt-2">Monthly Trips</p>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-accent">24/7</div>
              <p className="text-muted-foreground mt-2">Real-time Monitoring</p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="container py-24">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-foreground mb-4">Comprehensive Management Suite</h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Everything you need to manage your transport operations efficiently
          </p>
        </div>
        <div className="grid md:grid-cols-3 gap-8">
          {[
            {
              icon: Truck,
              title: "Vehicle Management",
              description: "Complete lifecycle management with maintenance tracking, documents, and status monitoring",
            },
            {
              icon: Users,
              title: "Driver Management",
              description: "Manage driver profiles, certifications, performance ratings, and safety records",
            },
            {
              icon: BarChart3,
              title: "Trip Dispatch",
              description: "Intelligent trip scheduling with route optimization and real-time tracking",
            },
            {
              icon: Shield,
              title: "Security & Compliance",
              description: "Role-based access control, audit logs, and comprehensive security measures",
            },
            {
              icon: Zap,
              title: "Real-time Analytics",
              description: "Interactive dashboards with KPIs, trends, and actionable insights",
            },
            {
              icon: Globe,
              title: "Multi-user Roles",
              description: "Support for Super Admin, Fleet Manager, Dispatcher, Driver, and more",
            },
          ].map((feature, i) => (
            <div
              key={i}
              className="p-8 rounded-lg border border-border hover:border-primary/30 hover:shadow-lg transition-all group bg-card"
            >
              <feature.icon className="w-12 h-12 text-primary mb-4 group-hover:scale-110 transition-transform" />
              <h3 className="text-lg font-bold text-foreground mb-2">{feature.title}</h3>
              <p className="text-muted-foreground">{feature.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Benefits Section */}
      <section id="benefits" className="bg-primary/5 border-y border-border py-24">
        <div className="container">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-foreground mb-4">Why Choose TransitOps?</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Maximize efficiency and reduce operational costs
            </p>
          </div>
          <div className="grid md:grid-cols-2 gap-12">
            {[
              {
                number: "01",
                title: "Reduce Operating Costs",
                description: "Real-time fuel tracking, route optimization, and automated expense management reduce costs by up to 30%",
              },
              {
                number: "02",
                title: "Improve Efficiency",
                description: "Automate dispatch workflows and eliminate manual spreadsheet processes with intelligent automation",
              },
              {
                number: "03",
                title: "Enhance Safety",
                description: "Monitor driver performance, track compliance, and prevent risks with comprehensive audit trails",
              },
              {
                number: "04",
                title: "Real-time Visibility",
                description: "Track vehicles, drivers, and trips in real-time with live monitoring and instant alerts",
              },
            ].map((benefit, i) => (
              <div key={i} className="flex gap-6">
                <div className="text-4xl font-bold text-primary/20">{benefit.number}</div>
                <div>
                  <h3 className="text-xl font-bold text-foreground mb-2">{benefit.title}</h3>
                  <p className="text-muted-foreground">{benefit.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container py-24 text-center">
        <div className="max-w-2xl mx-auto space-y-8">
          <h2 className="text-4xl font-bold text-foreground">Ready to Transform Your Fleet Operations?</h2>
          <p className="text-xl text-muted-foreground">
            Join hundreds of logistics and fleet management companies using TransitOps
          </p>
          <div className="flex gap-4 justify-center pt-4">
            <Link
              to="/dashboard"
              className="px-8 py-3 bg-primary text-primary-foreground font-semibold rounded-lg hover:bg-primary/90 transition inline-flex items-center gap-2 group"
            >
              Access Platform
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              to="/login"
              className="px-8 py-3 border border-border text-foreground font-semibold rounded-lg hover:bg-secondary/5 transition"
            >
              Sign In
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border bg-secondary/5 py-12">
        <div className="container">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                  <Truck className="w-5 h-5 text-primary-foreground" />
                </div>
                <span className="font-bold text-foreground">TransitOps</span>
              </div>
              <p className="text-sm text-muted-foreground">Smart Transport Operations Platform</p>
            </div>
            <div>
              <h4 className="font-semibold text-foreground mb-4">Product</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="#features" className="hover:text-foreground transition">Features</a></li>
                <li><a href="#benefits" className="hover:text-foreground transition">Benefits</a></li>
                <li><a href="#" className="hover:text-foreground transition">Pricing</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-foreground mb-4">Company</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="#" className="hover:text-foreground transition">About</a></li>
                <li><a href="#" className="hover:text-foreground transition">Blog</a></li>
                <li><a href="#" className="hover:text-foreground transition">Contact</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-foreground mb-4">Legal</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="#" className="hover:text-foreground transition">Privacy</a></li>
                <li><a href="#" className="hover:text-foreground transition">Terms</a></li>
                <li><a href="#" className="hover:text-foreground transition">Security</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-border pt-8 flex justify-between items-center text-sm text-muted-foreground">
            <p>&copy; 2024 TransitOps. All rights reserved.</p>
            <div className="flex gap-4">
              <a href="#" className="hover:text-foreground transition">Twitter</a>
              <a href="#" className="hover:text-foreground transition">LinkedIn</a>
              <a href="#" className="hover:text-foreground transition">GitHub</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
