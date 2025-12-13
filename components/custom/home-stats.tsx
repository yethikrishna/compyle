export function HomeStats() {
  const STATS = [
    { id: "1", value: "15+", label: "APPS BUILT" },
    { id: "2", value: "150+", label: "USERS" },
    { id: "3", value: "3+", label: "HACKATHONS" },
    { id: "4", value: "99.9%", label: "UPTIME" },
  ];

  return (
    <section className="md:pt-16">
      <div className="mt-14 grid gap-x-5 gap-y-8 justify-items-center md:justify-items-stretch grid-cols-2 lg:grid-cols-4">
        {STATS.map((stat) => (
          <div key={stat.id} className="flex flex-col items-center gap-5">
            <div className="text-4xl font-bold lg:text-6xl">{stat.value}</div>
            <p>{stat.label}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
