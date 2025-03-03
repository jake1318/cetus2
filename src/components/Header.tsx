import "../styles/Header.scss";

export const Header = () => {
  return (
    <header className="app-header">
      <div className="logo">
        <div className="logo-glow"></div>
        <h1>
          CETUS<span>LP</span>
        </h1>
      </div>
      <div className="network-badge">Sui Mainnet</div>
    </header>
  );
};
