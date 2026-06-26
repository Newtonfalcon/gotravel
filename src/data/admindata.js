import {
  LayoutDashboard,
  Users,
  BookOpen,
  FileText,
  Tag,
  CalendarCheck,
  CreditCard,
  Ticket,
  Award,
  Star,
  MessageSquare,
  BarChart2,
  Bell,
  HeadphonesIcon,
  Settings,
  UserCircle,
  Newspaper,
} from "lucide-react";

export const adminNavSections = [
  {
    label: "Overview",
    items: [
      { label: "Dashboard", href: "/admin", icon: LayoutDashboard, exact: true },
    ],
  },
  {
    label: "People",
    items: [
      { label: "Users", href: "/admin/users", icon: Users },
    ],
  },
  {
    label: "Content",
    items: [
      { label: "Courses", href: "/admin/courses", icon: BookOpen },
      { label: "Lessons", href: "/admin/lessons", icon: FileText },
      { label: "Categories", href: "/admin/categories", icon: Tag },
      { label: "Blog", href: "/admin/blog", icon: Newspaper },
    ],
  },
  {
    label: "Commerce",
    items: [
      { label: "Bookings", href: "/admin/bookings", icon: CalendarCheck },
      { label: "Payments", href: "/admin/payments", icon: CreditCard },
      { label: "Coupons", href: "/admin/coupons", icon: Ticket },
    ],
  },
  {
    label: "Engagement",
    items: [
      { label: "Certificates", href: "/admin/certificates", icon: Award },
      { label: "Testimonials", href: "/admin/testimonials", icon: Star },
      { label: "Reviews", href: "/admin/reviews", icon: MessageSquare },
    ],
  },
  {
    label: "System",
    items: [
      { label: "Analytics", href: "/admin/analytics", icon: BarChart2 },
      { label: "Notifications", href: "/admin/notifications", icon: Bell },
      { label: "Support", href: "/admin/support", icon: HeadphonesIcon },
      { label: "Settings", href: "/admin/settings", icon: Settings },
      { label: "Profile", href: "/admin/profile", icon: UserCircle },
    ],
  },
];