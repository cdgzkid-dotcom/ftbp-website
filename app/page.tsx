import ThemeProvider from "@/components/ThemeProvider";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import StatsBar from "@/components/StatsBar";
import Episodes from "@/components/Episodes";
import About from "@/components/About";
import Newsletter from "@/components/Newsletter";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <ThemeProvider>
      <Navbar />
      <Hero />
      <StatsBar />
      <Episodes />
      <About />
      <Newsletter />
      <Footer />
    </ThemeProvider>
  );
}
