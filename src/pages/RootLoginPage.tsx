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
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (username && password) {
      setLoading(true);
      setTimeout(() => nav("/root-os/evaluation"), 600);
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
          <Field
            label="Username"
            type="text"
            required
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="root"
          />
          <Field
            label="Password"
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
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
