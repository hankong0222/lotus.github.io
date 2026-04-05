import About from "@/components/About";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import Home from "@/components/Home";

export default function Page() {
  return (
    <>
      <Header />
      <main>
        <Home />
        <About />
      </main>
      <Footer />
    </>
  );
}
