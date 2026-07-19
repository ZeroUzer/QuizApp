import Header from "./Header";
import Footer from "./Footer";

function Layout({ children }) {
    return (
        <>
            <Header />
            <main style={{
                minHeight: "80vh",
                background: "#0a0a1a",
                color: "#fff",
            }}>
                {children}
            </main>
            <Footer />
        </>
    );
}

export default Layout;