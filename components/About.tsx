export default function About() {
  return (
    <section id="about" data-particle-mode="about" className="px-4 py-10 md:py-16">
      <div className="section-shell grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
        <div className="glass-card rounded-[2rem] p-6 md:p-8">
          <p className="section-kicker">About</p>
          <h2 className="section-title mt-4">Background, interests, direction, and skills.</h2>
        </div>
        <div className="glass-card rounded-[2rem] p-6 md:p-8">
          <h3 className="text-2xl font-semibold">Background</h3>
          <h3 className="mt-6 text-2xl font-semibold">Interests</h3>
          <h3 className="mt-6 text-2xl font-semibold">Direction</h3>
          <h3 className="mt-6 text-2xl font-semibold">Skills</h3>
        </div>
      </div>
    </section>
  );
}
