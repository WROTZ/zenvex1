import { ArrowRight, ShieldCheck, Target, Wallet } from "lucide-react";
import { Link } from "react-router-dom";
import { formatCurrency } from "../../lib/formatters";

function ChallengeCard({ challenge, ctaLabel = "Buy Challenge" }) {
  return (
    <article className="glass-card flex h-full flex-col p-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm uppercase tracking-[0.24em] text-primary">
            Zenvex Capital
          </p>
          <h3 className="mt-3 font-display text-3xl text-white">
            {challenge.label}
          </h3>
        </div>

        <div className="rounded-2xl border border-primary/20 bg-primary/10 px-4 py-2 text-right">
          <p className="text-xs uppercase tracking-[0.2em] text-slate-300">Fee</p>
          <p className="mt-1 text-lg font-semibold text-white">
            {formatCurrency(challenge.price, challenge.currency)}
          </p>
        </div>
      </div>

      <p className="mt-4 text-sm leading-6 text-slate-300">{challenge.tagline}</p>

      <div className="mt-6 grid gap-3">
        <div className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
          <span className="flex items-center gap-2 text-sm text-slate-300">
            <Wallet size={16} className="text-primary" />
            Account Size
          </span>
          <span className="font-semibold text-white">${challenge.accountSize.toLocaleString()}</span>
        </div>

        <div className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
          <span className="flex items-center gap-2 text-sm text-slate-300">
            <Target size={16} className="text-primary" />
            Profit Target
          </span>
          <span className="font-semibold text-white">{challenge.profitTarget}%</span>
        </div>

        <div className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
          <span className="flex items-center gap-2 text-sm text-slate-300">
            <ShieldCheck size={16} className="text-primary" />
            Max Drawdown
          </span>
          <span className="font-semibold text-white">{challenge.maxDrawdown}%</span>
        </div>
      </div>

      <Link
        className="primary-button mt-6 w-full gap-2"
        to={`/checkout/${challenge.id}`}
      >
        {ctaLabel}
        <ArrowRight size={16} />
      </Link>
    </article>
  );
}

export default ChallengeCard;
