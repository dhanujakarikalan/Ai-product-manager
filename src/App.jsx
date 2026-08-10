import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Sidebar } from './components/common/Sidebar';
import { Header } from './components/common/Header';
import { LoginPage } from './components/auth/LoginPage';

// Import clean simplified views & essential modules:
import { DashboardView } from './modules/Simple/DashboardView';
import { DataUploadView } from './modules/Simple/DataUploadView';
import { ThemeExtractionModule } from './modules/Module4_ThemeExtraction/ThemeExtractionModule';
import { UserStoriesView } from './modules/Simple/UserStoriesView';
import { PRDGeneratorModule } from './modules/Module7_PRDGenerator/PRDGeneratorModule';
import { FeaturePrioritizationView } from './modules/Simple/FeaturePrioritizationView';
import { ChatInterfaceView } from './modules/Simple/ChatInterfaceView';
import { SettingsView } from './modules/Simple/SettingsView';

const ModuleRouter = () => {
  const { activeModule } = useApp();

  switch (activeModule) {
    case 'upload':
    case 'feedback':
      return <DataUploadView />;
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

  if (!isLoggedIn) {
    return <LoginPage />;
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
