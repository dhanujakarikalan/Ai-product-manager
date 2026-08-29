import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Sidebar } from './components/common/Sidebar';
import { Header } from './components/common/Header';
import { LoginPage } from './components/auth/LoginPage';
import { LandingPage } from './components/auth/LandingPage';

// Import clean simplified views & essential modules:
import { DashboardView } from './modules/Simple/DashboardView';
import { DataUploadView } from './modules/Simple/DataUploadView';
import { AnalyticsIntegrationModule } from './modules/Module3_Analytics/AnalyticsIntegrationModule';
import { ThemeExtractionModule } from './modules/Module4_ThemeExtraction/ThemeExtractionModule';
import { UserStoriesView } from './modules/Simple/UserStoriesView';
import { PRDGeneratorModule } from './modules/Module7_PRDGenerator/PRDGeneratorModule';
import { FeaturePrioritizationView } from './modules/Simple/FeaturePrioritizationView';
import { RoadmapView } from './modules/Simple/RoadmapView';
import { ChatInterfaceView } from './modules/Simple/ChatInterfaceView';
import { SettingsView } from './modules/Simple/SettingsView';

const ModuleRouter = () => {
  const { activeModule } = useApp();

  switch (activeModule) {
    case 'upload':
    case 'feedback':
      return <DataUploadView />;
    case 'analytics':
      return <AnalyticsIntegrationModule />;
    case 'theme':
    case 'themes':
    case 'insights':
      return <ThemeExtractionModule />;
    case 'stories':
    case 'user-stories':
      return <UserStoriesView />;
    case 'prd':
    case 'reports':
      return <PRDGeneratorModule />;
    case 'prioritization':
      return <FeaturePrioritizationView />;
    case 'roadmap':
      return <RoadmapView />;
    case 'chat':
    case 'assistant':
      return <ChatInterfaceView />;
    case 'settings':
      return <SettingsView />;
    case 'dashboard':
    default:
      return <DashboardView />;
  }
};

function AppContent() {
  const { isLoggedIn } = useApp();
  const [showLogin, setShowLogin] = React.useState(false);

  if (!isLoggedIn) {
    if (showLogin) {
      return <LoginPage onBackToLanding={() => setShowLogin(false)} />;
    }
    return (
      <LandingPage 
        onGetStarted={() => setShowLogin(true)} 
        onLogin={() => setShowLogin(true)} 
      />
    );
  }

  return (
    <div className="app-container">
      <Sidebar />
      <div className="main-content">
        <Header />
        <main style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
          <ModuleRouter />
        </main>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
