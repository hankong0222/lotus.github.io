import Header from "@/components/Header"
import Home from "@/components/Home"
import About from "@/components/About"
import Footer from "@/components/Footer"

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
