import {
  Activity,
  BadgeDollarSign,
  Gauge,
  ShieldAlert,
  Target,
} from "lucide-react";
import { collection, getDocs, limit, orderBy, query, where } from "firebase/firestore";
import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import StatCard from "../components/ui/StatCard";
import LoadingSpinner from "../components/ui/LoadingSpinner";
import { useAuth } from "../contexts/AuthContext";
import useDocumentTitle from "../hooks/useDocumentTitle";
import { getChallengeByAccountSize } from "../lib/challenges";
import { loadDemoDashboard } from "../lib/demo";
import { getErrorMessage } from "../lib/errors";
import { db } from "../lib/firebase";
import { formatCompactCurrency, formatPercent } from "../lib/formatters";

function DashboardPage() {
  const { user, profile } = useAuth();
  const [dashboardState, setDashboardState] = useState({
    data: null,
    loading: true,
    error: "",
  });

  useDocumentTitle("Dashboard");

  useEffect(() => {
    let isMounted = true;

    async function loadDashboard() {
      if (!user) {
        return;
      }

      if (!db) {
        if (isMounted) {
          setDashboardState({
            data: loadDemoDashboard(),
            loading: false,
            error: "",
          });
        }

        return;
      }

      try {
        const snapshot = await getDocs(
          query(
            collection(db, "dashboard"),
            where("userId", "==", user.uid),
            orderBy("createdAt", "desc"),
            limit(1),
          ),
        );

        const dashboardDoc = snapshot.empty
          ? null
          : { id: snapshot.docs[0].id, ...snapshot.docs[0].data() };

        if (isMounted) {
          setDashboardState({
            data: dashboardDoc,
            loading: false,
            error: "",
          });
        }
      } catch (loadError) {
        if (isMounted) {
          setDashboardState({
            data: null,
            loading: false,
            error: getErrorMessage(loadError),
          });
        }
      }
    }

    loadDashboard();

    return () => {
      isMounted = false;
    };
  }, [user]);

  const challenge = useMemo(
    () => getChallengeByAccountSize(dashboardState.data?.accountSize),
    [dashboardState.data?.accountSize],
  );

  const targetCompletion = useMemo(() => {
    if (!dashboardState.data || !challenge) {
      return 0;
    }

    return Math.max(
      0,
      Math.min(
        (Number(dashboardState.data.profitPercent || 0) /
          Number(challenge.profitTarget || 1)) *
          100,
        100,
      ),
    );
  }, [challenge, dashboardState.data]);

  if (dashboardState.loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <LoadingSpinner label="Loading your funded dashboard" />
      </div>
    );
  }

  if (dashboardState.error) {
    return (
      <div className="glass-card p-8">
        <h1 className="font-display text-3xl text-white">Dashboard unavailable</h1>
        <p className="mt-4 text-slate-400">{dashboardState.error}</p>
      </div>
    );
  }

  if (!dashboardState.data) {
    return (
      <div className="glass-card p-8 sm:p-10">
        <p className="text-sm uppercase tracking-[0.24em] text-primary">
          No active challenge yet
        </p>
        <h1 className="mt-4 font-display text-4xl text-white">
          Purchase a challenge to unlock your dashboard.
        </h1>
        <p className="mt-4 max-w-2xl text-base leading-8 text-slate-300">
          {db
            ? "Once your Zenvex Capital payment is verified, a dashboard record is created automatically and this page will show your latest account metrics."
            : "Start a demo purchase from the challenges page and this dashboard will populate with local sample metrics for your client presentation."}
        </p>
        <Link className="primary-button mt-8" to="/challenges">
          Browse challenges
        </Link>
      </div>
    );
  }

  const dashboard = dashboardState.data;

  return (
    <div className="space-y-8">
      <section className="glass-card p-8 sm:p-10">
        <div className="grid gap-6 lg:grid-cols-[1fr_0.85fr] lg:items-start">
          <div>
            <span className="zen-chip">Trader dashboard</span>
            <h1 className="mt-5 font-display text-4xl text-white sm:text-5xl">
              {profile?.name || "Trader"}, your funded overview is live.
            </h1>
            <p className="mt-5 max-w-2xl text-base leading-8 text-slate-300">
              Zenvex Capital keeps the essentials visible: phase, current status,
              profit pace, and drawdown room at a glance.
            </p>
            {!db ? (
              <p className="mt-4 inline-flex rounded-full border border-primary/20 bg-primary/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-primary">
                Demo data stored locally for presentation
              </p>
            ) : null}
          </div>

          <div className="rounded-[28px] border border-white/10 bg-white/5 p-6">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-sm text-slate-400">Account size</p>
                <p className="mt-3 font-display text-3xl text-white">
                  ${Number(dashboard.accountSize || 0).toLocaleString()}
                </p>
              </div>
              <div className="rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-sm font-semibold text-primary">
                {dashboard.phase}
              </div>
            </div>
            <div className="mt-6 flex items-center justify-between rounded-2xl border border-white/10 bg-background/60 px-4 py-4">
              <span className="text-sm text-slate-400">Status</span>
              <span className="font-semibold text-white">{dashboard.status}</span>
            </div>
          </div>
        </div>
      </section>

      <section className="grid gap-6 lg:grid-cols-3">
        <StatCard
          icon={BadgeDollarSign}
          subtitle="Current account balance"
          title="Balance"
          value={formatCompactCurrency(dashboard.balance, "USD")}
        />
        <StatCard
          icon={Activity}
          subtitle="Live progress toward the target"
          title="Profit %"
          value={formatPercent(dashboard.profitPercent)}
        />
        <StatCard
          icon={ShieldAlert}
          subtitle="Maximum allowed challenge drawdown"
          title="Drawdown"
          value={formatPercent(dashboard.maxDrawdown)}
        />
      </section>

      <section className="grid gap-6 lg:grid-cols-[1fr_0.75fr]">
        <div className="glass-card p-6 sm:p-8">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-sm uppercase tracking-[0.24em] text-primary">
                Target completion
              </p>
              <h2 className="mt-3 font-display text-3xl text-white">
                {targetCompletion.toFixed(0)}%
              </h2>
            </div>
            <Target className="text-primary" size={24} />
          </div>

          <div className="mt-6 h-3 overflow-hidden rounded-full bg-white/10">
            <div
              className="h-full rounded-full bg-primary transition-all duration-500"
              style={{ width: `${targetCompletion}%` }}
            />
          </div>

          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
              <p className="text-sm text-slate-400">Phase target</p>
              <p className="mt-2 text-2xl font-semibold text-white">
                {challenge ? `${challenge.profitTarget}%` : "N/A"}
              </p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
              <p className="text-sm text-slate-400">Daily loss limit</p>
              <p className="mt-2 text-2xl font-semibold text-white">
                {formatPercent(dashboard.dailyLoss)}
              </p>
            </div>
          </div>
        </div>

        <div className="glass-card p-6 sm:p-8">
          <div className="flex items-center gap-3">
            <Gauge className="text-primary" size={22} />
            <div>
              <p className="font-semibold text-white">Account snapshot</p>
              <p className="text-sm text-slate-400">Latest synced Firestore values</p>
            </div>
          </div>

          <div className="mt-6 space-y-4">
            <div className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/5 px-4 py-4">
              <span className="text-sm text-slate-300">Phase</span>
              <span className="font-semibold text-white">{dashboard.phase}</span>
            </div>
            <div className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/5 px-4 py-4">
              <span className="text-sm text-slate-300">Status</span>
              <span className="font-semibold text-white">{dashboard.status}</span>
            </div>
            <div className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/5 px-4 py-4">
              <span className="text-sm text-slate-300">Account size</span>
              <span className="font-semibold text-white">
                ${Number(dashboard.accountSize || 0).toLocaleString()}
              </span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default DashboardPage;
