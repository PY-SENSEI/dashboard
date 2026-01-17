import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router";
import { TrendingUp, Users, DollarSign, Target, BarChart3 } from "lucide-react";
import { isAuthenticated } from "~/data/auth";
import { getAnalytics, getLeads } from "~/data/leads";
import { Header } from "~/components/layout/header";
import { Badge } from "~/components/ui/badge/badge";
import styles from "./dashboard.module.css";


export default function Dashboard() {
  const navigate = useNavigate();
  const [analytics, setAnalytics] = useState<any>(null);
  const [recentLeads, setRecentLeads] = useState<{ data: any[] }>({ data: [] });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!isAuthenticated()) {
      navigate("/login");
    }
  }, [navigate]);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const [analyticsData, leadsData] = await Promise.all([
          getAnalytics(),
          getLeads({ sortBy: "createdAt", sortOrder: "desc", limit: 5 }),
        ]);
        setAnalytics(analyticsData);
        setRecentLeads(leadsData);
      } catch (err) {
        console.error('Failed to fetch dashboard data:', err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  const getStatusColor = (status: string) => {
    const colors: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
      new: "default",
      contacted: "secondary",
      qualified: "secondary",
      proposal: "secondary",
      negotiation: "secondary",
      won: "default",
      lost: "destructive",
    };
    return colors[status] || "default";
  };

  return (
    <div className={styles.container}>
      <Header />
      <main className={styles.content}>
        <div className={styles.pageHeader}>
          <h1 className={styles.title}>Dashboard</h1>
          <p className={styles.subtitle}>Welcome back! Here's your lead overview</p>
        </div>

        <div className={styles.metricsGrid}>
          <div className={styles.metricCard}>
            <div className={styles.metricHeader}>
              <p className={styles.metricLabel}>Total Leads</p>
              <Users className={styles.metricIcon} />
            </div>
            <h2 className={styles.metricValue}>{analytics?.total?.toLocaleString() || 0}</h2>
            <p className={styles.metricChange}>All time</p>
          </div>

          <div className={styles.metricCard}>
            <div className={styles.metricHeader}>
              <p className={styles.metricLabel}>Converted Leads</p>
              <Target className={styles.metricIcon} />
            </div>
            <h2 className={styles.metricValue}>{analytics?.converted?.toLocaleString() || 0}</h2>
            <p className={styles.metricChange}>{analytics?.conversionRate?.toFixed(1) || 0}% conversion rate</p>
          </div>

          <div className={styles.metricCard}>
            <div className={styles.metricHeader}>
              <p className={styles.metricLabel}>Pipeline Value</p>
              <DollarSign className={styles.metricIcon} />
            </div>
            <h2 className={styles.metricValue}>{formatCurrency(analytics?.pipelineValue || 0)}</h2>
            <p className={styles.metricChange}>Active opportunities</p>
          </div>

          <div className={styles.metricCard}>
            <div className={styles.metricHeader}>
              <p className={styles.metricLabel}>Revenue Won</p>
              <TrendingUp className={styles.metricIcon} />
            </div>
            <h2 className={styles.metricValue}>{formatCurrency(analytics?.wonValue || 0)}</h2>
            <p className={styles.metricChange}>Closed deals</p>
          </div>
        </div>

        <div className={styles.chartsGrid}>
          <div className={styles.chartCard}>
            <h3 className={styles.chartTitle}>Leads by Status</h3>
            <div className={styles.chartContainer}>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "var(--space-3)",
                  paddingTop: "var(--space-4)",
                }}
              >
                {analytics?.byStatus && Object.entries(analytics.byStatus).map(([status, count]) => (
                  <div key={status} style={{ display: "flex", alignItems: "center", gap: "var(--space-3)" }}>
                    <div
                      style={{
                        width: "100px",
                        textTransform: "capitalize",
                        fontSize: "var(--font-size-2)",
                        color: "var(--color-neutral-11)",
                      }}
                    >
                      {status}
                    </div>
                    <div
                      style={{
                        flex: 1,
                        height: "32px",
                        background: "var(--color-neutral-3)",
                        borderRadius: "var(--radius-2)",
                        overflow: "hidden",
                        position: "relative",
                      }}
                    >
                      <div
                        style={{
                          width: `${analytics?.total ? ((count as number) / analytics.total) * 100 : 0}%`,
                          height: "100%",
                          background: "var(--color-accent-9)",
                          transition: "width 0.5s var(--ease-out)",
                        }}
                      />
                    </div>
                    <div
                      style={{ width: "60px", textAlign: "right", fontWeight: 600, color: "var(--color-neutral-12)" }}
                    >
                      {count as number}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className={styles.chartCard}>
            <h3 className={styles.chartTitle}>Leads by Source</h3>
            <div className={styles.chartContainer}>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "var(--space-3)",
                  paddingTop: "var(--space-4)",
                }}
              >
                {analytics?.bySource && Object.entries(analytics.bySource).map(([source, count]) => (
                  <div key={source} style={{ display: "flex", alignItems: "center", gap: "var(--space-3)" }}>
                    <div
                      style={{
                        width: "100px",
                        textTransform: "capitalize",
                        fontSize: "var(--font-size-2)",
                        color: "var(--color-neutral-11)",
                      }}
                    >
                      {source}
                    </div>
                    <div
                      style={{
                        flex: 1,
                        height: "32px",
                        background: "var(--color-neutral-3)",
                        borderRadius: "var(--radius-2)",
                        overflow: "hidden",
                        position: "relative",
                      }}
                    >
                      <div
                        style={{
                          width: `${analytics?.total ? ((count as number) / analytics.total) * 100 : 0}%`,
                          height: "100%",
                          background: "var(--color-success-9)",
                          transition: "width 0.5s var(--ease-out)",
                        }}
                      />
                    </div>
                    <div
                      style={{ width: "60px", textAlign: "right", fontWeight: 600, color: "var(--color-neutral-12)" }}
                    >
                      {count as number}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className={styles.recentLeads}>
          <div className={styles.sectionHeader}>
            <h3 className={styles.sectionTitle}>Recent Leads</h3>
            <Link to="/leads" className={styles.viewAllLink}>
              View All →
            </Link>
          </div>
          <div className={styles.leadsList}>
            {recentLeads.data.map((lead: any) => (
              <Link key={lead.id} to={`/leads/${lead.id}`} className={styles.leadItem}>
                <div className={styles.leadInfo}>
                  <div className={styles.leadName}>
                    {lead.firstName} {lead.lastName}
                  </div>
                  <div className={styles.leadCompany}>{lead.company}</div>
                </div>
                <div className={styles.leadMeta}>
                  <Badge variant={getStatusColor(lead.status)}>{lead.status}</Badge>
                  <div className={styles.leadValue}>{formatCurrency(lead.value)}</div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
