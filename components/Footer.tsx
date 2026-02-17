export default function Footer() {
  return (
    <footer className="bg-[var(--bg-secondary)] border-t border-[var(--border)] py-6 md:py-8 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 flex flex-col md:flex-row justify-between items-center gap-4 text-[var(--text-muted)] text-sm sm:text-base">
        
        {/* Branding / Copyright */}
        <span>© {new Date().getFullYear()} COBRA TRADERS</span>
        
        {/* Optional future links / social icons */}
        <div className="flex gap-4">
          {/* Example: <a href="#" className="hover:text-[var(--gold)] transition">Privacy</a> */}
        </div>
      </div>
    </footer>
  );
}