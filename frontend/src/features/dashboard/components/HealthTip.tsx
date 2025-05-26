import healthcareIcon from '../../../assets/healthcare.png';

export default function HealthTip({ title, paragraph, iconBg }) {
  return (
    <div style={{
      border: "1px solid #f3f4f6",
      borderRadius: "0.75rem",
      padding: "1rem",
      transition: "box-shadow 0.2s",
      background: "#fff"
    }}>
      <div style={{
        background: iconBg,
        padding: "0.75rem",
        borderRadius: "0.75rem",
        marginBottom: "0.75rem",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        width: "3rem",
        height: "3rem",
      }}>
        <img src={healthcareIcon} alt="healthcare" style={{ width: "3rem", height: "3rem" }} />
      </div>
      <h4 style={{ fontWeight: 500, marginBottom: "0.5rem" }}>{title}</h4>
      <p style={{ fontSize: "0.95rem", color: "#6b7280", marginBottom: "0.75rem" }}>
        {paragraph}
      </p>
    </div>
  );
}