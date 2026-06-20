import { Navigate, Route, Routes } from "react-router-dom";
import { AppShell } from "../components/layout/AppShell";
import { CardsPage } from "../pages/CardsPage";
import { ChatPage } from "../pages/ChatPage";
import { GroupMatchPage } from "../pages/GroupMatchPage";
import { HomePage } from "../pages/HomePage";
import { OnboardingPage } from "../pages/OnboardingPage";
import { OneOnOneMatchPage } from "../pages/OneOnOneMatchPage";
import { PersonaPage } from "../pages/PersonaPage";
import { ProfilePage } from "../pages/ProfilePage";

export default function App() {
  return (
    <AppShell>
      <Routes>
        <Route path="/" element={<Navigate to="/home" replace />} />
        <Route path="/onboarding" element={<OnboardingPage />} />
        <Route path="/home" element={<HomePage />} />
        <Route path="/persona" element={<PersonaPage />} />
        <Route path="/match/one-on-one" element={<OneOnOneMatchPage />} />
        <Route path="/match/group" element={<GroupMatchPage />} />
        <Route path="/cards" element={<CardsPage />} />
        <Route path="/chat" element={<ChatPage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="*" element={<Navigate to="/home" replace />} />
      </Routes>
    </AppShell>
  );
}
