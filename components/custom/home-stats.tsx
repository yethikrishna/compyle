interface Stats8Props {
  stats?: Array<{
    id: string;
    value: string;
    label: string;
  }>;
}

const HomeStats = ({
  stats = [
    {
      id: "stat-1",
      value: "15+",
      label: "APPS BUILT",
    },
    {
      id: "stat-2",
      value: "150+",
      label: "USERS",
    },
    {
      id: "stat-3",
      value: "3+",
      label: "HACKATHONS",
    },
    {
      id: "stat-4",
      value: "99.9%",
      label: "UPTIME",
    },
  ],
}: Stats8Props) => {
  return (
    <section className="py-20">
      <div className="container mx-auto">
        <div className="mt-14 grid gap-x-5 gap-y-8 justify-items-center md:justify-items-stretch md:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat) => (
            <div key={stat.id} className="flex flex-col gap-5">
              <div className="text-6xl font-bold">{stat.value}</div>
              <p>{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export { HomeStats };
