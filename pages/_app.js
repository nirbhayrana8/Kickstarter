import "../styles/globals.css";
import "bootstrap/dist/css/bootstrap.min.css";
import Layout from "../components/Layout";

import { AuthProvider } from "../contexts/AuthContext"
import { TransactionProvider } from "../contexts/TransactionContext"

function MyApp({ Component, pageProps }) {
  return (
    <AuthProvider>
      <TransactionProvider>
        <Layout>
          <Component {...pageProps} />
        </Layout>
      </TransactionProvider>
    </AuthProvider>
  );
}

export default MyApp;
