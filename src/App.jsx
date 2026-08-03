import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Sidebar } from './components/common/Sidebar';
import { Header } from './components/common/Header';
import { LoginPage } from './components/auth/LoginPage';

// Import our 5 neat, simple views directly matching the System Architecture diagram:
import { DashboardView } from './modules/Simple/DashboardView';
import { DataUploadView } from './modules/Simple/DataUploadView';
import { ChatInterfaceView } from './modules/Simple/ChatInterfaceView';
import { ReportsView } from './modules/Simple/ReportsView';
import { SettingsView } from './modules/Simple/SettingsView';

const ModuleRouter = () => {
  const { activeModule } = useApp();

  switch (activeModule) {
    case 'upload':
      return <DataUploadView />;
    case 'chat':
      return <ChatInterfaceView />;
    case 'reports':
      return <ReportsView />;
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
