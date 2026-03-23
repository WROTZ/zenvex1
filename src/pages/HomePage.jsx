import { ArrowRight, BadgeIndianRupee, Shield, WalletCards } from "lucide-react";
import { Link } from "react-router-dom";
import ChallengeCard from "../components/ui/ChallengeCard";
import useDocumentTitle from "../hooks/useDocumentTitle";
import { challengeCatalog } from "../lib/challenges";

const advantages = [
  {
    title: "Fast payouts",
    description: "Designed for quick challenge activation and smooth funded account onboarding.",
  },
  {
    title: "Low fees",
    description: "Simple pricing for traders who want more room to scale without excess friction.",
  },
  {
    title: "Simple rules",
    description: "Clear evaluation targets, sensible risk limits, and a dashboard built for focus.",
  },
];

function HomePage() {
  useDocumentTitle("Trade Smart. Get Funded.");

  return (
    <div className="space-y-24 pb-10">
      <section className="grid gap-10 pt-6 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
        <div>
          <span className="zen-chip">Premium funded trading challenges</span>
          <h1 className="mt-6 max-w-3xl font-display text-5xl leading-tight text-white sm:text-6xl">
            Trade Smart. Get Funded.
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-300">
            Pass the challenge and manage funded accounts with a clean, premium
            evaluation flow built for disciplined traders.
          </p>

          <div className="mt-8 flex flex-col gap-4 sm:flex-row">
            <Link className="primary-button gap-2" to="/challenges">
              Start Challenge
              <ArrowRight size={16} />
            </Link>
            <Link className="secondary-button" to="/auth">
              Sign in to your dashboard
            </Link>
          </div>

          <div className="mt-10 grid gap-4 sm:grid-cols-3">
            <div className="glass-card p-5">
              <WalletCards className="text-primary" size={22} />
              <p className="mt-4 text-3xl font-bold text-white">3</p>
              <p className="mt-1 text-sm text-slate-400">Challenge plans</p>
            </div>
            <div className="glass-card p-5">
              <Shield className="text-primary" size={22} />
              <p className="mt-4 text-3xl font-bold text-white">10%</p>
              <p className="mt-1 text-sm text-slate-400">Max drawdown</p>
            </div>
            <div className="glass-card p-5">
              <BadgeIndianRupee className="text-primary" size={22} />
              <p className="mt-4 text-3xl font-bold text-white">24h</p>
              <p className="mt-1 text-sm text-slate-400">Challenge activation</p>
            </div>
          </div>
        </div>

        <div className="glass-card relative overflow-hidden p-8">
          <div className="absolute right-0 top-0 h-28 w-28 rounded-full bg-primary/20 blur-3xl" />
          <p className="text-sm uppercase tracking-[0.24em] text-primary">
            Trader snapshot
          </p>
          <h2 className="mt-4 font-display text-3xl text-white">
            Scale from evaluation to funded capital.
          </h2>
          <p className="mt-4 text-sm leading-7 text-slate-300">
            Zenvex Capital keeps the experience tight: transparent fees, simple
            risk thresholds, and an account dashboard that stays readable on
            every device.
          </p>

          <div className="mt-8 space-y-4">
            {challengeCatalog.map((challenge) => (
              <div
                key={challenge.id}
                className="rounded-2xl border border-white/10 bg-white/5 px-4 py-4"
              >
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="font-semibold text-white">{challenge.label}</p>
                    <p className="text-sm text-slate-400">
                      {challenge.profitTarget}% target | {challenge.maxDrawdown}% max drawdown
                    </p>
                  </div>
                  <span className="rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-sm font-semibold text-primary">
                    ${challenge.accountSize.toLocaleString()}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="space-y-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <span className="zen-chip">Challenges</span>
            <h2 className="mt-4 font-display text-4xl text-white">
              Pick your funded path
            </h2>
          </div>
          <p className="max-w-xl text-sm leading-7 text-slate-400">
            Every Zenvex Capital challenge uses the same simple ruleset. Choose
            the account size that matches your trading rhythm and start from a
            clean evaluation dashboard.
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {challengeCatalog.map((challenge) => (
            <ChallengeCard key={challenge.id} challenge={challenge} />
          ))}
        </div>
      </section>

      <section className="space-y-8" id="terms">
        <div>
          <span className="zen-chip">Why choose us</span>
          <h2 className="mt-4 font-display text-4xl text-white">
            Built to feel clear, focused, and premium
          </h2>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {advantages.map((advantage) => (
            <article key={advantage.title} className="glass-card p-6">
              <h3 className="font-display text-2xl text-white">{advantage.title}</h3>
              <p className="mt-4 text-sm leading-7 text-slate-300">
                {advantage.description}
              </p>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}

export default HomePage;
