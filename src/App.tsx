import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Layout } from "@/layout/Layout";
import Campaigns from "@/pages/Campaigns";
import Overview from "@/pages/Overview";
import { Toaster } from "sonner";

export default function App() {
  return (
    <BrowserRouter>
      <Toaster richColors position="top-right" expand />
      <Routes>
        <Route path="/" element={<Navigate to="/overview" />} />
        <Route
          path="/overview"
          element={
            <Layout>
              <Overview />
            </Layout>
          }
        />
        <Route
          path="/campaigns"
          element={
            <Layout>
              <Campaigns />
            </Layout>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}
