// Type Imports
import type { VerticalMenuDataType } from "@/types/menuTypes";

const verticalMenuData = (): VerticalMenuDataType[] => [
  {
    label: "Overview",
    href: "/",
    icon: "ri-dashboard-line",
  },
  {
    label: "Package",
    icon: "ri-box-3-line",
    children: [
      {
        label: "List",
        href: "/package/list",
      },
      {
        label: "Hotels",
        href: "/package/hotels",
      },
      {
        label: "Facility",
        href: "/package/facility",
      },
    ],
  },
  {
    label: "Blog",
    icon: "ri-article-line",
    children: [
      {
        label: "Categories",
        href: "/blog/categories",
      },
      {
        label: "Post",
        href: "/blog/post",
      },
      {
        label: "Tags",
        href: "/blog/tags",
      },
    ],
  },
  {
    label: "Testimonials",
    href: "/testimonials",
    icon: "ri-star-line",
  },
  {
    label: "Site Galleries",
    href: "/site-galleries",
    icon: "ri-image-line",
  },
  {
    label: "Legal Document",
    href: "/legal-document",
    icon: "ri-file-text-line",
  },
  {
    label: "Lead CRM",
    href: "/lead-crm",
    icon: "ri-customer-service-line",
  },
  {
    label: "User Management",
    href: "/user-management",
    icon: "ri-user-settings-line",
  },
];

export default verticalMenuData;
