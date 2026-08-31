import { Navbar } from "../components/sections/Navbar";
import { Hero } from "../components/sections/Hero";
import { Countdown } from "../components/sections/Countdown";
import { RegistrationDeadline } from "../components/sections/RegistrationDeadline";
import { About } from "../components/sections/About";
import { EventsPreview } from "../components/sections/EventsPreview";
import { Footer } from "../components/sections/Footer";
export default function HomePage() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <Countdown />
        <RegistrationDeadline />
        <About />
        <EventsPreview />
      </main>
      <Footer />
    </>
  );
}
