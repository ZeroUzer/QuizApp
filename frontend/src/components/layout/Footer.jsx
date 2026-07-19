function Footer() {
    return (
        <footer style={{
            background: "#0a0a1a",
            borderTop: "1px solid rgba(255,255,255,0.06)",
            padding: "30px 0",
            textAlign: "center",
            color: "rgba(255,255,255,0.3)",
            fontSize: "14px",
        }}>
            <div className="container">
                <p>
                    QuizApp — создавай и проходи квизы вместе с друзьями
                </p>
                <p style={{ marginTop: "8px", color: "rgba(255,255,255,0.15)" }}>
                    © 2026 Все права защищены
                </p>
            </div>
        </footer>
    );
}

export default Footer;