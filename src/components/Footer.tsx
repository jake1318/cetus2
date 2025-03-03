import "../styles/Footer.scss";

export const Footer = () => {
  return (
    <footer className="app-footer">
      <div className="footer-content">
        <div className="footer-links">
          <a
            href="https://cetus.zone/"
            target="_blank"
            rel="noopener noreferrer"
          >
            Cetus Protocol
          </a>
          <a
            href="https://docs.cetus.zone/"
            target="_blank"
            rel="noopener noreferrer"
          >
            Documentation
          </a>
          <a
            href="https://twitter.com/CetusProtocol"
            target="_blank"
            rel="noopener noreferrer"
          >
            Twitter
          </a>
          <a
            href="https://discord.com/invite/cetusprotocol"
            target="_blank"
            rel="noopener noreferrer"
          >
            Discord
          </a>
        </div>
        <div className="footer-disclaimer">
          Using this app involves risks. Ensure you understand the risks
          associated with DeFi protocols before providing liquidity.
        </div>
        <div className="copyright">
          © {new Date().getFullYear()} Cetus LP Pool Interface
        </div>
      </div>
    </footer>
  );
};
