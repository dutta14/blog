import '../styles/variables.css';

export default function Footer() {
  return (
    <footer style={{
      borderTop: '1px solid var(--border-color)',
      padding: '2rem 0',
      marginTop: '4rem',
      fontFamily: 'var(--font-ui)',
      fontSize: '13px',
      color: 'var(--text-muted)',
      textAlign: 'center',
    }}>
      <div className="container">
        Anindya Dutta
      </div>
    </footer>
  );
}
