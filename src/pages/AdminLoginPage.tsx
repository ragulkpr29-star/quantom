import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { LockKeyhole, ShieldCheck } from "lucide-react";
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

export default function AdminLoginPage() {
  const nav = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const formData = new FormData(e.currentTarget);
    const email = formData.get("email");
    const password = formData.get("password");

    try {
      const res = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password })
      });
      
      const data = await res.json();
      
      if (res.ok && data.success) {
        nav("/admin");
      } else {
        setError(data.error || "Invalid email or password.");
      }
    } catch (err) {
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="admin-login">
      <div className="login-card">
        <div className="login-mark">
          <ShieldCheck size={28} />
        </div>
        <span
          className="eyebrow"
          style={{ color: "var(--green-dark)", marginBottom: "6px", display: "block" }}
        >
          Quantum'27
        </span>
        <h1>Administration</h1>
        <p>Secure organizer access portal</p>
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
            name="email"
            placeholder="ragulkpr29@gmail.com"
            required
          />
          <Field
            label="Password"
            type="password"
            name="password"
            placeholder="Enter your password"
            required
          />
          <Button type="submit" loading={loading} className="btn-navy btn-full">
            Sign In{" "}
            <LockKeyhole size={15} />
          </Button>
        </form>
        <small>UI demo only — authentication will be connected later.</small>
      </div>
    </main>
  );
}
