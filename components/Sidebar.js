"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems = [
  {
    href: "/",
    label: "Overview",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="3" width="7" height="7" /><rect x="14" y="3" width="7" height="7" />
        <rect x="14" y="14" width="7" height="7" /><rect x="3" y="14" width="7" height="7" />
      </svg>
    ),
  },
  {
    href: "/facebook",
    label: "Facebook",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
        <path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z" />
      </svg>
    ),
    color: "var(--facebook)",
  },
  {
    href: "/instagram",
    label: "Instagram",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
        <path d="M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37z" />
        <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
      </svg>
    ),
    color: "var(--instagram)",
  },
  {
    href: "/twitter",
    label: "Twitter / X",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
      </svg>
    ),
    color: "var(--twitter)",
  },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <>
      <aside className="sidebar">
        <div className="sidebar-brand">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="var(--accent-blue)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
          </svg>
          <span>SocialHub</span>
        </div>

        <nav className="sidebar-nav">
          <p className="nav-section-label">PLATFORMS</p>
          {navItems.map((item) => {
            const active = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`nav-item${active ? " active" : ""}`}
                style={active && item.color ? { color: item.color, borderColor: item.color } : {}}
              >
                <span className="nav-icon" style={item.color ? { color: item.color } : {}}>
                  {item.icon}
                </span>
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="sidebar-footer">
          <span>Social Dashboard v1.0</span>
        </div>
      </aside>

      <style>{`
        .sidebar {
          position: fixed;
          top: 0;
          left: 0;
          width: var(--sidebar-width);
          height: 100vh;
          background: var(--bg-secondary);
          border-right: 1px solid var(--border);
          display: flex;
          flex-direction: column;
          padding: 20px 0;
          z-index: 100;
          overflow-y: auto;
        }
        .sidebar-brand {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 0 20px 24px;
          border-bottom: 1px solid var(--border);
          font-size: 18px;
          font-weight: 700;
          color: var(--text-primary);
        }
        .sidebar-nav {
          flex: 1;
          padding: 16px 12px;
          display: flex;
          flex-direction: column;
          gap: 4px;
        }
        .nav-section-label {
          font-size: 10px;
          font-weight: 600;
          letter-spacing: 1.2px;
          color: var(--text-secondary);
          padding: 0 8px 10px;
        }
        .nav-item {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 10px 12px;
          border-radius: 8px;
          color: var(--text-secondary);
          font-size: 14px;
          font-weight: 500;
          transition: all 0.15s ease;
          border-left: 2px solid transparent;
          text-decoration: none;
        }
        .nav-item:hover {
          background: var(--bg-card);
          color: var(--text-primary);
        }
        .nav-item.active {
          background: var(--bg-card);
          color: var(--text-primary);
          border-left-color: var(--accent-blue);
        }
        .nav-icon {
          display: flex;
          align-items: center;
          flex-shrink: 0;
        }
        .sidebar-footer {
          padding: 16px 20px 0;
          border-top: 1px solid var(--border);
          font-size: 11px;
          color: var(--text-secondary);
        }
        @media (max-width: 768px) {
          .sidebar {
            width: 100%;
            height: 60px;
            flex-direction: row;
            align-items: center;
            padding: 0;
            border-right: none;
            border-bottom: 1px solid var(--border);
          }
          .sidebar-brand {
            padding: 0 16px;
            border-bottom: none;
            border-right: 1px solid var(--border);
            font-size: 15px;
          }
          .sidebar-nav {
            flex-direction: row;
            padding: 0 8px;
            gap: 2px;
          }
          .nav-section-label { display: none; }
          .nav-item {
            padding: 8px 10px;
            gap: 6px;
            font-size: 13px;
            border-left: none;
            border-bottom: 2px solid transparent;
          }
          .nav-item.active { border-left-color: transparent; }
          .sidebar-footer { display: none; }
        }
      `}</style>
    </>
  );
}
