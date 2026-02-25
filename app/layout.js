import "./globals.css";
import Sidebar from "@/components/Sidebar";

export const metadata = {
  title: "Social Dashboard",
  description: "Track your Facebook, Instagram, and Twitter metrics in one place.",
};

const shellStyles = `
  .app-shell {
    display: flex;
    min-height: 100vh;
    background: var(--bg-primary);
  }
  .main-content {
    flex: 1;
    margin-left: var(--sidebar-width);
    padding: 32px;
    min-height: 100vh;
    background: var(--bg-primary);
  }
  @media (max-width: 768px) {
    .main-content {
      margin-left: 0;
      padding: 16px;
      padding-top: 72px;
    }
  }
`;

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <div className="app-shell">
          <Sidebar />
          <main className="main-content">{children}</main>
        </div>
        <style dangerouslySetInnerHTML={{ __html: shellStyles }} />
      </body>
    </html>
  );
}
