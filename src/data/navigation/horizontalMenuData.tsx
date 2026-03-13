// Type Imports
import type { HorizontalMenuDataType } from "@/types/menuTypes";

const horizontalMenuData = (): HorizontalMenuDataType[] => [
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
        icon: "ri-list-check",
        href: "/package/list",
      },
      {
        label: "Hotels",
        icon: "ri-hotel-line",
        href: "/package/hotels",
      },
      {
        label: "Facility",
        icon: "ri-building-2-line",
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
        icon: "ri-folder-line",
        href: "/blog/categories",
      },
      {
        label: "Post",
        icon: "ri-file-edit-line",
        href: "/blog/post",
      },
      {
        label: "Tags",
        icon: "ri-price-tag-3-line",
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

export default horizontalMenuData;
