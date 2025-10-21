import AuthInitializer from "@/components/auth/auth-initializer";
import ProtectedRoute from "@/components/auth/protected-route";
import RoleRedirect from "@/components/auth/role-redirect";
import Main from "@/components/default-layout/Main";
import NotFoundPage from "@/components/Not-found/Notfound";
import AboutPage from "@/pages/about/About";
import Admin from "@/pages/admin/Admin";
import AdminFeePage from "@/pages/admin/admin-fee/AdminFeePage";
import AdminSettingsPage from "@/pages/admin/admin-setting/admin-settings";
import AllTransaction from "@/pages/admin/alltransaction/AllTransaction";
import AdminCMS from "@/pages/admin/content/Content-managment";
import DonationsPage from "@/pages/admin/donaton/admin-donation";
import AdminOverview from "@/pages/admin/overview/Overview";
import Pending from "@/pages/admin/pending/Pending";
import { PendingPayments } from "@/pages/admin/pendingpayments/PendingPayments";
import ReportsPage from "@/pages/admin/reports/admin-report";
import TotalLoan from "@/pages/admin/totalloan/TotalLoan";
import ApplicationForm from "@/pages/application-form/application-form";
import ApplyLoanPage from "@/pages/apply-loan/Applyloan";
import ContactPage from "@/pages/contact/Contact";
import AdminContacts from "@/pages/dashboard/contact/AdminContact";
import Dashboard from "@/pages/dashboard/dashboard";
import MemberReferralPage from "@/pages/dashboard/memberReferal/MemberReferral";
import OverviewPage from "@/pages/dashboard/overview/Overview";
import SavingWithdrawPage from "@/pages/dashboard/savingWithdraw/savingWithdraw";
import DonationPage from "@/pages/donation/Donation";
import FAQPage from "@/pages/faq/Faq";
import Home from "@/pages/home/Home";
import MemberProfilePage from "@/pages/member-profile/member-profile";
import { MembershipForm } from "@/pages/membership/MemberShipForm";
import PaymentForm from "@/pages/payment/PaymentForm";
import ProjectsPage from "@/pages/project/project";
import ReferralPage from "@/pages/referral/referral";
import SavingsPage from "@/pages/savings/Savings";
import SignInPage from "@/pages/sign-in/Signin";
import SignUpPage from "@/pages/sign-up/Signup";
import UsersPage from "@/pages/users/user";
import { createBrowserRouter } from "react-router-dom";

const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <AuthInitializer>
        <Main />
      </AuthInitializer>
    ),
    children: [
      {
        index: true, // default child route for "/"
        element: (
          <RoleRedirect>
            <Home />
          </RoleRedirect>
        ),
      },
      {
        path: "donation",
        element: <DonationPage />,
      },
      {
        path: "faq",
        element: <FAQPage />,
      },
      {
        path: "sign-up",
        element: <SignUpPage />,
      },
      {
        path: "sign-in",
        element: <SignInPage />,
      },
      {
        path: "contact",
        element: <ContactPage />,
      },
      {
        path: "projects",
        element: <ProjectsPage />,
      },
      {
        path: "about",
        element: <AboutPage />,
      },
      {
        path: "*",
        element: <NotFoundPage />,
      },
    ],
  },
  {
    path: "/dashboard",
    element: (
      <ProtectedRoute requiredRole="member">
        <Dashboard />
      </ProtectedRoute>
    ),
    children: [
      {
        index: true, // This means /dashboard will render OverviewPage by default
        element: <OverviewPage />, // your overview component
      },
      {
        path: "apply-loan", // relative => /dashboard/apply-loan
        element: (
          <ProtectedRoute requiredRole="member">
            <ApplyLoanPage />
          </ProtectedRoute>
        ),
      },
      {
        path: "savings", // relative => /dashboard/savings
        element: (
          <ProtectedRoute requiredRole="member">
            <SavingsPage />
          </ProtectedRoute>
        ),
      },
      {
        path: "membership-form", // relative => /dashboard/membership-form
        element: (
          <ProtectedRoute requiredRole="member">
            <MembershipForm />
          </ProtectedRoute>
        ),
      },
      {
        path: "application-form", // relative => /dashboard/application-form
        element: (
          <ProtectedRoute requiredRole="member">
            <ApplicationForm />
          </ProtectedRoute>
        ),
      },
      {
        path: "referral-member", // relative => /dashboard/referral
        element: (
          <ProtectedRoute requiredRole="member">
            <MemberReferralPage />
          </ProtectedRoute>
        ),
      },
      {
        path: "savings-withdraw", // relative => /dashboard/savings-withdraw
        element: (
          <ProtectedRoute requiredRole="member">
            <SavingWithdrawPage />
          </ProtectedRoute>
        ),
      },
      {
        path: "profile", // relative => /dashboard/profile
        element: (
          <ProtectedRoute requiredRole="member">
            <MemberProfilePage />
          </ProtectedRoute>
        ),
      },
      {
        path: "payment", // relative => /dashboard/payment
        element: (
          <ProtectedRoute requiredRole="member">
            <PaymentForm />
          </ProtectedRoute>
        ),
      },
    ],
  },
  {
    path: "/admin",
    element: (
      <ProtectedRoute requiredRole="admin">
        <Admin />
      </ProtectedRoute>
    ),
    children: [
      {
        index: true,
        element: (
          <ProtectedRoute requiredRole="admin">
            <AdminOverview />
          </ProtectedRoute>
        ),
      },
      {
        path: "users",
        element: (
          <ProtectedRoute requiredRole="admin">
            <UsersPage />
          </ProtectedRoute>
        ),
      },
      {
        path: "referals",
        element: (
          <ProtectedRoute requiredRole="admin">
            <ReferralPage />
          </ProtectedRoute>
        ),
      },
      {
        path: "admin-fee",
        element: (
          <ProtectedRoute requiredRole="admin">
            <AdminFeePage />
          </ProtectedRoute>
        ),
      },
      {
        path: "donations",
        element: (
          <ProtectedRoute requiredRole="admin">
            <DonationsPage />
          </ProtectedRoute>
        ),
      },
      {
        path: "all-transactions",
        element: (
          <ProtectedRoute requiredRole="admin">
            <AllTransaction />
          </ProtectedRoute>
        )
      },
      {                                                                                                              
        path: "reports",
        element: (
          <ProtectedRoute requiredRole="admin">
            <ReportsPage />
          </ProtectedRoute>
        ),
      },
      {
        path: "contact-admin",
        element: (
          <ProtectedRoute requiredRole="admin">
            <AdminContacts/>
          </ProtectedRoute>
        )
      },
      {
        path: "pending",
        element: (
          <ProtectedRoute requiredRole="admin">
            <Pending />
          </ProtectedRoute>
        )
      },
      {
        path: "pending-payments",
        element: (
          <ProtectedRoute requiredRole="admin">
            <PendingPayments />
          </ProtectedRoute>
        )
      },
      {
        path: "content-management",
        element: (
          <ProtectedRoute requiredRole="admin">
            <AdminCMS />
          </ProtectedRoute>
        ),
      },
      {
        path: "total-loans",
        element: (
          <ProtectedRoute requiredRole="admin">
            <TotalLoan />
          </ProtectedRoute>
        ),
      },
      {
        path: "settings",
        element: (
          <ProtectedRoute requiredRole="admin">
            <AdminSettingsPage />
          </ProtectedRoute>
        ),
      },
    ],
  },
]);

export default router;

// SOT -> BROKTITA NILO
// PKG -> PACKAGE
// IV -> pRESENTER NEWS
// OOV -> VIDEO SLIDER
// PRODUCER
