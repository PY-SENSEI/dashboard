import { useEffect, useState } from "react";
import { useNavigate, useParams, Link } from "react-router";
import {
  ArrowLeft,
  Mail,
  Phone,
  Building2,
  MapPin,
  Calendar,
  DollarSign,
  TrendingUp,
  FileText,
  Globe,
  AlertCircle,
} from "lucide-react";
import { isAuthenticated } from "~/data/auth";
import { getLeadById } from "~/data/leads";
import { Header } from "~/components/layout/header";
import { Badge } from "~/components/ui/badge/badge";
import { Button } from "~/components/ui/button/button";
import styles from "./leads.$id.module.css";


export default function LeadDetail() {
  const navigate = useNavigate();
  const params = useParams();
  const [lead, setLead] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!isAuthenticated()) {
      navigate("/login");
    }
  }, [navigate]);

  useEffect(() => {
    const fetchLead = async () => {
      try {
        const data = await getLeadById(params.id!);
        setLead(data);
      } catch (err) {
        console.error('Failed to fetch lead:', err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchLead();
  }, [params.id]);

  if (isLoading) {
    return (
      <div className={styles.container}>
        <Header />
        <main className={styles.content}>
          <div className={styles.notFound}>
            <p>Loading...</p>
          </div>
        </main>
      </div>
    );
  }

  if (!lead) {
    return (
      <div className={styles.container}>
        <Header />
        <main className={styles.content}>
          <div className={styles.notFound}>
            <AlertCircle className={styles.notFoundIcon} />
            <h1 className={styles.notFoundTitle}>Lead Not Found</h1>
            <p className={styles.notFoundText}>The lead you're looking for doesn't exist or has been removed.</p>
            <Button onClick={() => navigate("/leads")}>Back to Leads</Button>
          </div>
        </main>
      </div>
    );
  }

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
      month: "long",
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
        <Link to="/leads" className={styles.backButton}>
          <ArrowLeft className={styles.backIcon} />
          Back to Leads
        </Link>

        <div className={styles.header}>
          <div className={styles.headerTop}>
            <div className={styles.headerInfo}>
              <h1 className={styles.name}>
                {lead.firstName} {lead.lastName}
              </h1>
              <p className={styles.position}>{lead.position}</p>
              <p className={styles.company}>{lead.company}</p>
            </div>
            <Badge variant={getStatusColor(lead.status)} className={styles.statusBadge}>
              {lead.status}
            </Badge>
          </div>

          <div className={styles.contactGrid}>
            <div className={styles.contactItem}>
              <Mail className={styles.contactIcon} />
              <div className={styles.contactInfo}>
                <span className={styles.contactLabel}>Email</span>
                <a href={`mailto:${lead.email}`} className={styles.contactValue}>
                  {lead.email}
                </a>
              </div>
            </div>

            <div className={styles.contactItem}>
              <Phone className={styles.contactIcon} />
              <div className={styles.contactInfo}>
                <span className={styles.contactLabel}>Phone</span>
                <a href={`tel:${lead.phone}`} className={styles.contactValue}>
                  {lead.phone}
                </a>
              </div>
            </div>

            <div className={styles.contactItem}>
              <MapPin className={styles.contactIcon} />
              <div className={styles.contactInfo}>
                <span className={styles.contactLabel}>Country</span>
                <span className={styles.contactValue}>{lead.country}</span>
              </div>
            </div>

            <div className={styles.contactItem}>
              <Globe className={styles.contactIcon} />
              <div className={styles.contactInfo}>
                <span className={styles.contactLabel}>Industry</span>
                <span className={styles.contactValue}>{lead.industry}</span>
              </div>
            </div>
          </div>
        </div>

        <div className={styles.grid}>
          <div className={styles.card}>
            <h2 className={styles.cardTitle}>
              <DollarSign className={styles.cardIcon} />
              Deal Value
            </h2>
            <div className={styles.valueHighlight}>{formatCurrency(lead.value)}</div>
            <div className={styles.detailsGrid}>
              <div className={styles.detailItem}>
                <span className={styles.detailLabel}>Source</span>
                <span className={styles.detailValue} style={{ textTransform: "capitalize" }}>
                  {lead.source}
                </span>
              </div>
            </div>
          </div>

          <div className={styles.card}>
            <h2 className={styles.cardTitle}>
              <Calendar className={styles.cardIcon} />
              Timeline
            </h2>
            <div className={styles.detailsGrid}>
              <div className={styles.detailItem}>
                <span className={styles.detailLabel}>Created</span>
                <span className={styles.detailValue}>{formatDate(lead.createdAt)}</span>
              </div>
              <div className={styles.detailItem}>
                <span className={styles.detailLabel}>Last Contact</span>
                <span className={styles.detailValue}>{formatDate(lead.lastContact)}</span>
              </div>
            </div>
          </div>
        </div>

        <div className={styles.card}>
          <h2 className={styles.cardTitle}>
            <FileText className={styles.cardIcon} />
            Notes
          </h2>
          <p className={styles.notes}>{lead.notes}</p>
        </div>
      </main>
    </div>
  );
}
