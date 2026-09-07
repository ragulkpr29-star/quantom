import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "../ui/Button";
import { googleSheetsService } from "../../services";
import type { EventConfig, Participant } from "../../types";
import { AlertCircle } from "lucide-react";

function Field({
  label,
  required,
  error,
  showError,
  children,
}: {
  label: string;
  required?: boolean;
  error?: string;
  showError?: boolean;
  children: React.ReactNode;
}) {
  const displayError = !!(showError && error);
  return (
    <div className="field">
      <label className="field-label">
        {label}
        {required && <span className="field-required"> *</span>}
      </label>
      <div className={`field-input-wrapper ${displayError ? 'has-error' : ''}`}>
        {displayError && (
          <div className="field-error-banner">
            <AlertCircle size={14} />
            <span>{error}</span>
          </div>
        )}
        {children}
      </div>
    </div>
  );
}

const validateEmail = (val: string) => /^[A-Za-z0-9._%+-]+\.(23|24|25|26)(bir|bcr|bsr)@kongu\.edu$/i.test(val);
const validateRollNo = (val: string) => /^(23|24|25|26)(BIR|BCR|BSR)\d{1,3}$/.test(val);
const validatePhone = (val: string) => /^\d{10}$/.test(val);

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
  const [leaderErrors, setLeaderErrors] = useState({ name: "", rollNo: "", email: "", phone: "" });

  const [members, setMembers] = useState<Participant[]>(
    event.participationType === "individual" ? [] : [{ name: "", rollNo: "" }]
  );
  const [memberErrors, setMemberErrors] = useState<{name: string, rollNo: string}[]>([]);

  const [agree, setAgree] = useState(false);
  const [submitAttempted, setSubmitAttempted] = useState(false);

  const handleLeaderChange = (field: keyof typeof leader, value: string) => {
    let newValue = value;
    let error = "";

    if (field === "rollNo") {
      newValue = value.toUpperCase().replace(/\s/g, "");
      if (newValue && !validateRollNo(newValue)) error = "Please enter a valid roll number.";
    } else if (field === "phone") {
      newValue = value.replace(/\D/g, "").slice(0, 10);
      if (newValue && !validatePhone(newValue)) error = "Please enter a valid 10-digit phone number.";
    } else if (field === "email") {
      newValue = value.trim();
      if (newValue && !validateEmail(newValue)) error = "Please enter a valid email.";
    } else if (field === "name") {
      if (!newValue.trim()) error = "Please enter your full name.";
    }

    setLeader(prev => ({ ...prev, [field]: newValue }));
    setLeaderErrors(prev => ({ ...prev, [field]: error }));
  };

  const handleMemberChange = (index: number, field: keyof Participant, value: string) => {
    let newValue = value;
    let error = "";

    if (field === "rollNo") {
      newValue = value.toUpperCase().replace(/\s/g, "");
      if (newValue && !validateRollNo(newValue)) error = "Please enter a valid roll number.";
    } else if (field === "name") {
      if (newValue.length > 0 && !newValue.trim()) error = "Please enter your full name.";
    }

    const newMembers = [...members];
    newMembers[index] = { ...newMembers[index], [field]: newValue };
    setMembers(newMembers);

    const newErrors = [...memberErrors];
    if (!newErrors[index]) newErrors[index] = { name: "", rollNo: "" };
    newErrors[index] = { ...newErrors[index], [field]: error };
    setMemberErrors(newErrors);
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!agree) return;

    if (event.id === "IP" && members.length > 2) {
      alert("IPL Auction registration allows only an individual or a team of up to 2 members.");
      return;
    }

    setSubmitAttempted(true);

    let hasError = false;
    const newLeaderErrors = { name: "", rollNo: "", email: "", phone: "" };
    
    if (!leader.name.trim()) { newLeaderErrors.name = "Please enter your full name."; hasError = true; }
    if (!validateRollNo(leader.rollNo)) { newLeaderErrors.rollNo = "Please enter a valid roll number."; hasError = true; }
    if (!validateEmail(leader.email)) { newLeaderErrors.email = "Please enter a valid email."; hasError = true; }
    if (!validatePhone(leader.phone)) { newLeaderErrors.phone = "Please enter a valid 10-digit phone number."; hasError = true; }
    setLeaderErrors(newLeaderErrors);

    const newMemberErrors = members.map((m, i) => {
      const err = { name: "", rollNo: "" };
      if (i > 0 && (m.name || m.rollNo)) {
        if (!m.name.trim()) { err.name = "Please enter your full name."; hasError = true; }
        if (!validateRollNo(m.rollNo)) { err.rollNo = "Please enter a valid roll number."; hasError = true; }
      }
      return err;
    });
    setMemberErrors(newMemberErrors);

    if (hasError) {
      setTimeout(() => {
        const firstError = document.querySelector('.has-error');
        if (firstError) {
          firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      }, 50);
      return;
    }

    setLoading(true);
    
    try {
      const payload = {
        eventId: event.id,
        eventName: event.name,
        teamName: team,
        participantName: leader.name,
        email: leader.email,
        phone: leader.phone,
        department: "Computer Technology",
        rollNo: leader.rollNo,
        member2: members[1]?.name || "",
        member3: members[2]?.name || "",
        member4: members[3]?.name || "",
      };
      
      const res = await googleSheetsService.registerUser(payload);
      
      if (!res.success) {
        throw new Error(res.error || "Registration failed");
      }
      
      nav("/register/success", {
        state: {
          eventName: event.name,
          teamName: team,
          leaderName: leader.name,
          teamId: res.teamId,
        },
      });
    } catch (err: any) {
      alert(err.message || "Unable to connect to registration server. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const addMember = () => {
    if (event.maxMembers && members.length < event.maxMembers) {
      setMembers([...members, { name: "", rollNo: "" }]);
    }
  };

  const sectionNum = (n: number) => String(n).padStart(2, "0");

  return (
    <form className="registration-form" onSubmit={submit}>
      <style>{`
        .has-error {
          display: flex;
          flex-direction: column;
        }
        .field-error-banner {
          display: flex;
          align-items: center;
          gap: 8px;
          background-color: #B91C1C;
          color: #FFFFFF;
          padding: 8px 12px;
          border-radius: 8px 8px 0 0;
          font-size: 0.85rem;
          font-weight: 600;
        }
        .has-error input {
          border-color: #B91C1C !important;
          border-radius: 0 0 8px 8px !important;
          background-color: rgba(185, 28, 28, 0.05) !important;
        }
        .has-error input:focus {
          border-color: #B91C1C !important;
          box-shadow: 0 0 0 2px rgba(185, 28, 28, 0.2) !important;
        }
      `}</style>
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
              placeholder="e.g. Code Wizards"
              required
            />
          </Field>
        )}

        <div className="form-grid">
          <Field label={event.participationType === "team" ? "Team Leader Name" : "Full Name"} required error={leaderErrors.name} showError={submitAttempted}>
            <input
              value={leader.name}
              onChange={(e) => handleLeaderChange("name", e.target.value)}
              placeholder="Ragul"
              required
            />
          </Field>
          <Field label="Roll Number" required error={leaderErrors.rollNo} showError={submitAttempted}>
            <input
              value={leader.rollNo}
              onChange={(e) => handleLeaderChange("rollNo", e.target.value)}
              placeholder="e.g. 25BIR037"
              required
            />
          </Field>
          <Field label="Email Address" required error={leaderErrors.email} showError={submitAttempted}>
            <input
              type="email"
              value={leader.email}
              onChange={(e) => handleLeaderChange("email", e.target.value)}
              placeholder="college@kongu.edu"
              required
            />
          </Field>
          <Field label="Phone Number" required error={leaderErrors.phone} showError={submitAttempted}>
            <input
              inputMode="numeric"
              value={leader.phone}
              onChange={(e) => handleLeaderChange("phone", e.target.value)}
              placeholder="1234567890"
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
              <div className="member-row-label" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span>Member {i + 2}</span>
                <button 
                  type="button" 
                  onClick={() => {
                    const newMembers = [...members];
                    newMembers.splice(i + 1, 1);
                    setMembers(newMembers);
                    const newErrors = [...memberErrors];
                    newErrors.splice(i + 1, 1);
                    setMemberErrors(newErrors);
                  }}
                  style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer', fontSize: '0.85rem' }}
                >
                  Remove
                </button>
              </div>
              <Field label="Name" error={memberErrors[i + 1]?.name} showError={submitAttempted}>
                <input
                  value={m.name}
                  onChange={(e) => handleMemberChange(i + 1, "name", e.target.value)}
                  placeholder="Ragul"
                />
              </Field>
              <Field label="Roll Number" error={memberErrors[i + 1]?.rollNo} showError={submitAttempted}>
                <input
                  value={m.rollNo}
                  onChange={(e) => handleMemberChange(i + 1, "rollNo", e.target.value)}
                  placeholder="e.g. 25BIR037"
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
