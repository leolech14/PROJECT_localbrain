// Header Component - Exact copy of Swift OrchestraMVPView headerComponent
// spacing: 16px between sections, padding: 20px horizontal, 12px vertical

type HeaderProps = {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  isSearchFocused: boolean;
  setIsSearchFocused: (focused: boolean) => void;
  onUpload: () => void;
  onThemeToggle: () => void;
  themeMode: 'auto' | 'light' | 'dark';
  isCIActive: boolean;
  onLogoClick: () => void;
};

export default function Header({
  searchQuery,
  setSearchQuery,
  isSearchFocused,
  setIsSearchFocused,
  onUpload,
  onThemeToggle,
  themeMode,
  isCIActive,
  onLogoClick,
}: HeaderProps) {
  const themeIcons = {
    auto: "circle.lefthalf.filled",
    light: "sun.max.fill",
    dark: "moon.fill",
  };

  return (
    <header
      className="flex items-center border-b"
      style={{
        gap: "16px",
        paddingLeft: "20px",
        paddingRight: "20px",
        paddingTop: "12px",
        paddingBottom: "12px",
        backgroundColor: "var(--bg2)",
        borderColor: "var(--hair)",
        borderWidth: "1px",
      }}
    >
      {/* Brand Section - CLICKABLE to go home */}
      <button
        onClick={onLogoClick}
        style={{
          backgroundColor: "transparent",
          border: "none",
          cursor: "pointer",
          padding: 0,
          fontSize: "1rem",
          fontWeight: 600,
          color: "var(--tx1)",
        }}
      >
        LocalBrain
      </button>

      {/* Spacer to push search to the right */}
      <div style={{ flex: 1 }} />

      {/* Search Section - padding: 12px/6px, spacing: 6px */}
      <div
        className="flex items-center rounded"
        style={{
          gap: "6px",
          paddingLeft: "12px",
          paddingRight: "12px",
          paddingTop: "6px",
          paddingBottom: "6px",
          backgroundColor: "var(--bg3)",
          border: `1px solid ${isSearchFocused ? "var(--acc)" : "var(--hair)"}`,
          borderRadius: "6px",
        }}
      >
        <svg
          width="12"
          height="12"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          style={{ color: "var(--tx2)" }}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>
        <input
          type="text"
          placeholder="Search... (⌘K)"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onFocus={() => setIsSearchFocused(true)}
          onBlur={() => setIsSearchFocused(false)}
          style={{
            fontSize: "13px",
            color: "var(--tx1)",
            backgroundColor: "transparent",
            border: "none",
            outline: "none",
            width: "200px",
          }}
        />
      </div>
    </header>
  );
}
