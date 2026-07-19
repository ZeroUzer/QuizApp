import Header from "./Header";
import Footer from "./Footer";

function Layout({ children }) {
    return (
        <>
            <Header />

            <main
                style={{
                    minHeight: "80vh",
                    padding: "30px",
                    maxWidth: "1200px",
                    margin: "0 auto",
                }}
            >
                {children}
            </main>

            <Footer />
        </>
    );
}

export default Layout;