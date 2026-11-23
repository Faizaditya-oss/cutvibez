import HeroSection from "../components/HeroSection.jsx";
import EditorCatalog from "../components/EditorCatalog.jsx";
import HowItWorks from "../components/HowItWorks.jsx";
import Stats from "../components/Stats.jsx";
import Testimonials from "../components/Testimonials.jsx";
import Categories from "../components/Categories.jsx";
import CTA from "../components/CTA.jsx";

export default function Beranda() {
  return (
    <>
      <HeroSection />
      <EditorCatalog />
      <HowItWorks />
      <Stats />
      <Testimonials />
      <Categories />
      <CTA />
    </>
  );
}
