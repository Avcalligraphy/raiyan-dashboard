import { createBrowserRouter } from "react-router-dom";
import DashboardPage from "../pages/dashboard/DashboardPage";
import LoginPage from "../views/Login";
import NotFoundPage from "../views/NotFound";
import { LayoutWithProviders, BlankLayoutWithProviders } from "./routeWrappers";
import ListPackagesPage from "../pages/package/list/ListPackage";
import HotelsPackagesPage from "@/pages/package/hotels/HotelsPackage";
import FacilityPackagesPage from "@/pages/package/Facility/FacilityPackage";
import UserManagementPage from "@/pages/user/UserManagement";
import TestimonialsPage from "@/pages/Testimonials";
import CategoryBlogPage from "@/pages/blog/categories/CategoryBlog";
import TagsBlogPage from "@/pages/blog/tags/TagsBlog";

import PackageAdd from "@/pages/package/Add";
import PackageEdit from "@/pages/package/Edit";
import LegalDocument from "@/pages/legalDocument";
import SiteGalleriesPage from "@/pages/SiteGalleries/SiteGalleries";

export const router = createBrowserRouter([
  {
    path: "/login",
    element: (
      <BlankLayoutWithProviders>
        <LoginPage mode="light" />
      </BlankLayoutWithProviders>
    ),
  },
  {
    path: "/",
    element: <LayoutWithProviders />,
    children: [
      {
        index: true,
        element: <DashboardPage />,
      },
      {
        path: "package/list",
        element: <ListPackagesPage />,
      },
      {
        path: "package/hotels",
        element: <HotelsPackagesPage />,
      },
      {
        path: "package/facility",
        element: <FacilityPackagesPage />,
      },
      {
        path: "user-management",
        element: <UserManagementPage />,
      },
      {
        path: "testimonials",
        element: <TestimonialsPage />,
      },
      {
        path: "blog/categories",
        element: <CategoryBlogPage />,
      },
      {
        path: "blog/tags",
        element: <TagsBlogPage />,
      },
      {
        path: "site-galleries",
        element: <SiteGalleriesPage />,
      },
      {
        path: "legal-document",
        element: <LegalDocument />,
      },
      {
        path: "package/add",
        element: <PackageAdd />,
      },
      {
        path: "package/edit/:id",
        element: <PackageEdit />,
      },
    ],
  },
  {
    path: "*",
    element: (
      <BlankLayoutWithProviders>
        <NotFoundPage mode="light" />
      </BlankLayoutWithProviders>
    ),
  },
]);
