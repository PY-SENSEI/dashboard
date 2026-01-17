import { Link, useLocation, useNavigate } from "react-router";
import { LayoutDashboard, Users, LogOut } from "lucide-react";
import { logout, getCurrentUser } from "~/data/auth";
import styles from "./header.module.css";
import classNames from "classnames";

export function Header() {
  const location = useLocation();
  const navigate = useNavigate();
  const user = getCurrentUser();
  const userName = user?.name;

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <header className={styles.header}>
      <div className={styles.container}>
        <Link to="/dashboard" className={styles.logo}>
          <LayoutDashboard className={styles.logoIcon} />
          <span>LeadCRM</span>
        </Link>

        <nav className={styles.nav}>
          <Link
            to="/dashboard"
            className={classNames(styles.navLink, {
              [styles.active]: location.pathname === "/dashboard",
            })}
          >
            <LayoutDashboard className={styles.navIcon} />
            <span className={styles.navLinkText}>Dashboard</span>
          </Link>
          <Link
            to="/leads"
            className={classNames(styles.navLink, {
              [styles.active]: location.pathname.startsWith("/leads"),
            })}
          >
            <Users className={styles.navIcon} />
            <span className={styles.navLinkText}>Leads</span>
          </Link>
        </nav>

        <div className={styles.userSection}>
          {user && <span className={styles.userName}>{userName}</span>}
          <button onClick={handleLogout} className={styles.logoutButton}>
            <LogOut className={styles.navIcon} />
            <span className={styles.navLinkText}>Logout</span>
          </button>
        </div>
      </div>
    </header>
  );
}
