export default function SkillTag({ skill, variant = "default" }) {
  const styles = {
    default: "bg-[#1e2a3a] text-blue-300 border border-blue-900/40",
    missing: "bg-[#2a1e1e] text-red-300 border border-red-900/40",
    matched: "bg-[#1e2a1e] text-green-300 border border-green-900/40",
  }

  return (
    <span className={`inline-block px-2 py-0.5 rounded text-xs font-mono tracking-wide ${styles[variant]}`}>
      {skill}
    </span>
  )
}