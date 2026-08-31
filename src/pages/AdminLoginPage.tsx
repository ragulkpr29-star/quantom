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
          onSubmit={(e) => {
            e.preventDefault();
            setLoading(true);
            setTimeout(() => nav("/admin"), 600);
          }}
          style={{ textAlign: "left", marginTop: "28px" }}
        >
          <Field
            label="Email Address"
            type="email"
            placeholder="admin@kec.edu"
            required
          />
          <Field
            label="Password"
            type="password"
            placeholder="••••••••"
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
