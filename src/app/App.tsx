import { Navigate, Route, Routes } from "react-router-dom";
import { AppShell } from "../components/layout/AppShell";
import { CardsPage } from "../pages/CardsPage";
import { FriendsPage } from "../pages/FriendsPage";
import { GroupMatchPage } from "../pages/GroupMatchPage";
import { HomePage } from "../pages/HomePage";
import { LandingPage } from "../pages/LandingPage";
import { OnboardingPage } from "../pages/OnboardingPage";
import { OneOnOneMatchPage } from "../pages/OneOnOneMatchPage";
import { ProfilePage } from "../pages/ProfilePage";

export default function App() {
  return (
    <AppShell>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/onboarding" element={<OnboardingPage />} />
        <Route path="/home" element={<HomePage />} />
        <Route path="/match/one-on-one" element={<OneOnOneMatchPage />} />
        <Route path="/match/group" element={<GroupMatchPage />} />
        <Route path="/cards" element={<CardsPage />} />
        <Route path="/friends" element={<FriendsPage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AppShell>
  );
}
