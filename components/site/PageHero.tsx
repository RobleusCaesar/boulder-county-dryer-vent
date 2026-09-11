type PageHeroProps = {
  kicker?: string;
  title: string;
  lede: string;
};

export function PageHero({ kicker, title, lede }: PageHeroProps) {
  return (
    <section className="bg-teal-900 text-white">
      <div className="site-wrap py-12 sm:py-16">
        {kicker && <p className="kicker !text-teal-100">{kicker}</p>}
        <h1 className="display mt-2 max-w-3xl text-4xl leading-tight sm:text-5xl">{title}</h1>
        <p className="mt-4 max-w-2xl text-lg text-white/80">{lede}</p>
      </div>
    </section>
  );
}
