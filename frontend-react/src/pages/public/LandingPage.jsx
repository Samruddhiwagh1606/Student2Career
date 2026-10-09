import React from "react";
import { LandingNavbar } from "../../components/landing/LandingNavbar";
import { HeroSection } from "../../components/landing/HeroSection";
import { ValueStrip } from "../../components/landing/ValueStrip";
import { InternshipPreview } from "../../components/landing/InternshipPreview";
import { StudentJourney } from "../../components/landing/StudentJourney";
import { UserRoles } from "../../components/landing/UserRoles";
import { HowItWorks } from "../../components/landing/HowItWorks";
import { FeatureGrid } from "../../components/landing/FeatureGrid";
import { CareerSection } from "../../components/landing/CareerSection";
import { FinalCTA } from "../../components/landing/FinalCTA";
import { LandingFooter } from "../../components/landing/LandingFooter";

export function LandingPage() {
  return (
    <div style={{ minHeight: "100vh", background: "var(--warm-white)", width: "100%" }}>
      {/* 1. Navbar */}
      <LandingNavbar />

      <main>
        {/* 2. Hero Section */}
        <HeroSection />

        {/* 3. Value / Trust Strip */}
        <ValueStrip />

        {/* 4. Internship Discovery Section */}
        <InternshipPreview />

        {/* 5. Student Experience Journey */}
        <StudentJourney />

        {/* 6. Three User Roles (Students, Faculty, Administration) */}
        <UserRoles />

        {/* 7. How It Works */}
        <HowItWorks />

        {/* 8. Platform Features Grid */}
        <FeatureGrid />

        {/* 9. Career Section (Burgundy / Cream Visual Milestone) */}
        <CareerSection />

        {/* 10. Final Call to Action */}
        <FinalCTA />
      </main>

      {/* 11. Footer */}
      <LandingFooter />
    </div>
  );
}
