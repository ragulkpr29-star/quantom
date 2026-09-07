import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ShieldAlert, LockKeyhole } from "lucide-react";
import { Button } from "../components/ui/Button";

function Field({
  label,
  ...props
}: { label: string } & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <div className="field" style={{ marginBottom: "18px" }}>
      <label className="field-label">{label}</label>
      <input {...props} />
    </div>
  );
}

export default function RootLoginPage() {
  const nav = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (email && password) {
      setLoading(true);
      setError("");

      try {
        const res = await fetch("/api/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password })
        });
        
        const data = await res.json();
        
        if (res.ok && data.success) {
          nav("/root-os/dashboard");
        } else {
          setError(data.error || "Invalid email or password.");
        }
      } catch (err) {
        setError("An unexpected error occurred. Please try again.");
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <main className="admin-login">
      <div className="login-card">
        <div className="login-mark" style={{ background: "var(--red)", color: "#fff" }}>
          <ShieldAlert size={28} />
        </div>
        <span
          className="eyebrow"
          style={{ color: "var(--red)", marginBottom: "6px", display: "block" }}
        >
          Quantum'27
        </span>
        <h1>ROOT ACCESS</h1>
        <p>Marks Entry Portal</p>
        <form
          onSubmit={handleLogin}
          style={{ textAlign: "left", marginTop: "28px" }}
        >
          {error && (
            <div style={{ backgroundColor: "#B91C1C", color: "white", padding: "10px", borderRadius: "8px", marginBottom: "16px", fontSize: "0.9rem", fontWeight: 600 }}>
              {error}
            </div>
          )}
          <Field
            label="Email Address"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="ragulkpr29@gmail.com"
          />
          <Field
            label="Password"
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter your password"
          />
          <Button type="submit" loading={loading} className="btn-primary btn-full">
            LOGIN{" "}
            <LockKeyhole size={15} />
          </Button>
        </form>
      </div>
    </main>
  );
}
