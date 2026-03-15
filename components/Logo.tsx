export default function Logo({ className = "text-[15px]" }: { className?: string }) {
  return (
    <span
      className={`font-display font-black uppercase whitespace-nowrap ${className}`}
    >
      <span className="text-pink">F*CK</span>
      <span className="text-text-pri"> THE BUSINE</span>
      <span className="text-gold">$</span>
      <span className="text-text-pri">S PLAN</span>
    </span>
  );
}
