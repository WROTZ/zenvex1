import { CheckCircle2 } from "lucide-react";
import ChallengeCard from "../components/ui/ChallengeCard";
import useDocumentTitle from "../hooks/useDocumentTitle";
import { challengeCatalog } from "../lib/challenges";

const rules = [
  "Dynamic cards rendered from shared challenge data",
  "Consistent 8% target across all challenge sizes",
  "10% max drawdown and 5% daily loss limits",
];

function ChallengesPage() {
  useDocumentTitle("Challenges");

  return (
    <div className="space-y-10">
      <section className="glass-card p-8 sm:p-10">
        <span className="zen-chip">Challenge plans</span>
        <div className="mt-6 grid gap-8 lg:grid-cols-[1fr_0.9fr] lg:items-end">
          <div>
            <h1 className="font-display text-4xl text-white sm:text-5xl">
              Choose your Zenvex Capital account size.
            </h1>
            <p className="mt-5 max-w-2xl text-base leading-8 text-slate-300">
              Start with the capital tier that matches your trading strategy, then
              move through the funded evaluation flow with a simple, professional UI.
            </p>
          </div>

          <div className="space-y-4">
            {rules.map((rule) => (
              <div
                key={rule}
                className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-4 py-4 text-sm text-slate-200"
              >
                <CheckCircle2 className="text-primary" size={18} />
                {rule}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="grid gap-6 lg:grid-cols-3">
        {challengeCatalog.map((challenge) => (
          <ChallengeCard key={challenge.id} challenge={challenge} />
        ))}
      </section>
    </div>
  );
}

export default ChallengesPage;
