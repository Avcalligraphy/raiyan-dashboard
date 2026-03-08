import React from "react";
import Layout from "../components/layout/Layout";
import BlankLayout from "../@layouts/BlankLayout";
import Providers from "../components/Providers";
import ProtectedRoute from "../components/ProtectedRoute";
import PublicOnlyRoute from "../components/PublicOnlyRoute";

/** Dashboard layout behind auth guard; redirects to /login when not authenticated. */
export const LayoutWithProviders = () => (
  <Providers direction="ltr">
    <ProtectedRoute>
      <Layout />
    </ProtectedRoute>
  </Providers>
);

/** Public layout (e.g. login); redirects to / (or from) when already authenticated. */
export const BlankLayoutWithProviders = ({
  children,
}: {
  children: React.ReactNode;
}) => (
  <Providers direction="ltr">
    <BlankLayout systemMode="light">
      <PublicOnlyRoute>{children}</PublicOnlyRoute>
    </BlankLayout>
  </Providers>
);
