import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { Search, ArrowUpDown } from "lucide-react";
import { isAuthenticated } from "~/data/auth";
import { getLeads, type LeadStatus, type LeadSource } from "~/data/leads";
import { Header } from "~/components/layout/header";
import { Input } from "~/components/ui/input/input";
import { Button } from "~/components/ui/button/button";
import { Badge } from "~/components/ui/badge/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "~/components/ui/select/select";
import styles from "./leads.module.css";


export default function Leads() {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<LeadStatus | "all">("all");
  const [source, setSource] = useState<LeadSource | "all">("all");
  const [sortBy, setSortBy] = useState<"createdAt" | "value" | "lastName">("createdAt");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [page, setPage] = useState(1);
  const [data, setData] = useState<any>({ data: [], total: 0, page: 1, totalPages: 1 });
  const [isLoading, setIsLoading] = useState(true);
  const limit = 20;

  useEffect(() => {
    if (!isAuthenticated()) {
      navigate("/login");
    }
  }, [navigate]);

  useEffect(() => {
    const fetchLeads = async () => {
      setIsLoading(true);
      try {
        const result = await getLeads({
          search,
          status: status === "all" ? undefined : status,
          source: source === "all" ? undefined : source,
          sortBy,
          sortOrder,
          page,
          limit,
        });
        setData(result);
      } catch (err) {
        console.error('Failed to fetch leads:', err);
        setData({ data: [], total: 0, page: 1, totalPages: 1 });
      } finally {
        setIsLoading(false);
      }
    };
    fetchLeads();
  }, [search, status, source, sortBy, sortOrder, page]);

  const result = data;

  const handleSort = (field: typeof sortBy) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortBy(field);
      setSortOrder("desc");
    }
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
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
          <h1 className={styles.title}>Leads</h1>
          <p className={styles.subtitle}>
            Showing {result.data?.length || 0} of {result.total?.toLocaleString() || 0} leads
          </p>
        </div>

        <div className={styles.controls}>
          <div className={styles.controlsRow}>
            <div className={styles.searchWrapper}>
              <Search className={styles.searchIcon} />
              <Input
                type="search"
                placeholder="Search by name, email, or company..."
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setPage(1);
                }}
                className={styles.searchInput}
              />
            </div>

            <div className={styles.filterGroup}>
              <Select
                value={status}
                onValueChange={(value) => {
                  setStatus(value as LeadStatus | "all");
                  setPage(1);
                }}
              >
                <SelectTrigger className={styles.select}>
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="new">New</SelectItem>
                  <SelectItem value="contacted">Contacted</SelectItem>
                  <SelectItem value="qualified">Qualified</SelectItem>
                  <SelectItem value="proposal">Proposal</SelectItem>
                  <SelectItem value="negotiation">Negotiation</SelectItem>
                  <SelectItem value="won">Won</SelectItem>
                  <SelectItem value="lost">Lost</SelectItem>
                </SelectContent>
              </Select>

              <Select
                value={source}
                onValueChange={(value) => {
                  setSource(value as LeadSource | "all");
                  setPage(1);
                }}
              >
                <SelectTrigger className={styles.select}>
                  <SelectValue placeholder="Source" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Sources</SelectItem>
                  <SelectItem value="website">Website</SelectItem>
                  <SelectItem value="referral">Referral</SelectItem>
                  <SelectItem value="social">Social</SelectItem>
                  <SelectItem value="email">Email</SelectItem>
                  <SelectItem value="phone">Phone</SelectItem>
                  <SelectItem value="event">Event</SelectItem>
                  <SelectItem value="partner">Partner</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        <div className={styles.tableCard}>
          <div className={styles.tableWrapper}>
            <table className={styles.table}>
              <thead className={styles.tableHeader}>
                <tr>
                  <th className={styles.tableHeaderCell}>
                    <button className={styles.sortButton} onClick={() => handleSort("lastName")}>
                      Name
                      <ArrowUpDown className={styles.sortIcon} />
                    </button>
                  </th>
                  <th className={styles.tableHeaderCell}>Company</th>
                  <th className={styles.tableHeaderCell}>Status</th>
                  <th className={styles.tableHeaderCell}>Source</th>
                  <th className={styles.tableHeaderCell}>
                    <button className={styles.sortButton} onClick={() => handleSort("value")}>
                      Value
                      <ArrowUpDown className={styles.sortIcon} />
                    </button>
                  </th>
                  <th className={styles.tableHeaderCell}>
                    <button className={styles.sortButton} onClick={() => handleSort("createdAt")}>
                      Created
                      <ArrowUpDown className={styles.sortIcon} />
                    </button>
                  </th>
                </tr>
              </thead>
              <tbody>
                {result.data?.map((lead: any) => (
                  <tr key={lead.id} className={styles.tableRow} onClick={() => navigate(`/leads/${lead.id}`)}>
                    <td className={styles.tableCell}>
                      <div className={styles.leadName}>
                        {lead.firstName} {lead.lastName}
                      </div>
                      <div className={styles.leadEmail}>{lead.email}</div>
                    </td>
                    <td className={styles.tableCell}>{lead.company}</td>
                    <td className={styles.tableCell}>
                      <Badge variant={getStatusColor(lead.status)}>{lead.status}</Badge>
                    </td>
                    <td className={styles.tableCell} style={{ textTransform: "capitalize" }}>
                      {lead.source}
                    </td>
                    <td className={styles.tableCell}>{formatCurrency(lead.value)}</td>
                    <td className={styles.tableCell}>{formatDate(lead.createdAt)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {!isLoading && result.data?.length === 0 && (
            <div className={styles.emptyState}>
              <Search className={styles.emptyIcon} />
              <h3 className={styles.emptyTitle}>No leads found</h3>
              <p className={styles.emptyText}>Try adjusting your search or filters</p>
            </div>
          )}

          {!isLoading && result.data?.length > 0 && (
            <div className={styles.pagination}>
              <div className={styles.paginationInfo}>
                Page {result.page} of {result.totalPages}
              </div>
              <div className={styles.paginationControls}>
                <Button variant="outline" size="sm" onClick={() => setPage(page - 1)} disabled={page === 1}>
                  Previous
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPage(page + 1)}
                  disabled={page === result.totalPages}
                >
                  Next
                </Button>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
