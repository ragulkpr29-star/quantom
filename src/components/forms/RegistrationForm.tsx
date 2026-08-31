import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "../ui/Button";
import type { EventConfig, Participant } from "../../types";

function Field({
  label,
  required,
  children,
}: {
  label: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div className="field">
      <label className="field-label">
        {label}
        {required && <span className="field-required"> *</span>}
      </label>
      {children}
    </div>
  );
}

export function RegistrationForm({ event }: { event: EventConfig }) {
  const nav = useNavigate();
  const [loading, setLoading] = useState(false);
  const [team, setTeam] = useState("");
  const [leader, setLeader] = useState({
    name: "",
    rollNo: "",
    email: "",
    phone: "",
  });
  const [members, setMembers] = useState<Participant[]>(
    event.participationType === "individual" ? [] : [{ name: "", rollNo: "" }]
  );
  const [agree, setAgree] = useState(false);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!agree) return;
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      nav("/register/success", {
        state: {
          eventName: event.name,
          teamName: team,
          leaderName: leader.name,
          registrationId: `Q27-${event.number}-001`,
        },
      });
    }, 900);
  };

  const addMember = () => {
    if (event.maxMembers && members.length < event.maxMembers) {
      setMembers([...members, { name: "", rollNo: "" }]);
    }
  };

  const sectionNum = (n: number) => String(n).padStart(2, "0");

  return (
    <form className="registration-form" onSubmit={submit}>
      {/* Section 01 – Team / Participant Info */}
      <div className="form-section">
        <div className="form-title">
          <span className="form-title-num">{sectionNum(1)}</span>
          <div className="form-title-text">
            <h3>
              {event.participationType === "individual"
                ? "Participant Information"
                : "Team Information"}
            </h3>
            <p>
              {event.participationType === "individual"
                ? "Enter your personal details."
                : "Enter the team name and leader details."}
            </p>
          </div>
        </div>

        {event.participationType === "team" && (
          <Field label="Team Name" required>
            <input
              value={team}
              onChange={(e) => setTeam(e.target.value)}
              placeholder="e.g. TechNova"
              required
            />
          </Field>
        )}

        <div className="form-grid">
          <Field label={event.participationType === "team" ? "Team Leader Name" : "Full Name"} required>
            <input
              value={leader.name}
              onChange={(e) => setLeader({ ...leader, name: e.target.value })}
              placeholder="Enter full name"
              required
            />
          </Field>
          <Field label="Roll Number" required>
            <input
              value={leader.rollNo}
              onChange={(e) => setLeader({ ...leader, rollNo: e.target.value })}
              placeholder="e.g. 24CDR075"
              required
            />
          </Field>
          <Field label="Email Address" required>
            <input
              type="email"
              value={leader.email}
              onChange={(e) => setLeader({ ...leader, email: e.target.value })}
              placeholder="college@example.com"
              required
            />
          </Field>
          <Field label="Phone Number" required>
            <input
              inputMode="numeric"
              value={leader.phone}
              onChange={(e) => setLeader({ ...leader, phone: e.target.value })}
              placeholder="10-digit mobile number"
              required
            />
          </Field>
        </div>
      </div>

      {/* Section 02 – Team Members */}
      {event.participationType === "team" && (
        <div className="form-section">
          <div className="form-title">
            <span className="form-title-num">{sectionNum(2)}</span>
            <div className="form-title-text">
              <h3>Team Members</h3>
              <p>
                {event.maxMembers
                  ? `Add up to ${event.maxMembers} members including the leader.`
                  : "Maximum team size will be updated from the official event document."}
              </p>
            </div>
          </div>

          {members.slice(1).map((m, i) => (
            <div className="member-row" key={i}>
              <div className="member-row-label">Member {i + 2}</div>
              <Field label="Name">
                <input
                  value={m.name}
                  onChange={(e) => {
                    const a = [...members];
                    a[i + 1] = { ...a[i + 1], name: e.target.value };
                    setMembers(a);
                  }}
                  placeholder="Full name"
                />
              </Field>
              <Field label="Roll Number">
                <input
                  value={m.rollNo}
                  onChange={(e) => {
                    const a = [...members];
                    a[i + 1] = { ...a[i + 1], rollNo: e.target.value };
                    setMembers(a);
                  }}
                  placeholder="e.g. 24CDR076"
                />
              </Field>
            </div>
          ))}

          {(!event.maxMembers || members.length < event.maxMembers) && (
            <button type="button" className="add-member" onClick={addMember}>
              + Add Member
            </button>
          )}
        </div>
      )}

      {/* Section 03 / 02 – Confirmation */}
      <div className="form-section confirmation">
        <div className="form-title">
          <span className="form-title-num">
            {sectionNum(event.participationType === "team" ? 3 : 2)}
          </span>
          <div className="form-title-text">
            <h3>Confirmation</h3>
            <p>Please confirm that you have read and agree to the event rules.</p>
          </div>
        </div>
        <label className="check">
          <input
            type="checkbox"
            checked={agree}
            onChange={(e) => setAgree(e.target.checked)}
          />
          <span>
            I have read and agree to the event rules and regulations. All
            information provided is accurate.
          </span>
        </label>
        <Button
          type="submit"
          loading={loading}
          disabled={!agree}
          className="btn-primary btn-full"
          style={{ marginTop: "20px" }}
        >
          Submit Registration
        </Button>
      </div>
    </form>
  );
}
