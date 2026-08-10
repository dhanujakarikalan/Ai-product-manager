export const initialMockData = {
  workspaces: [
    { id: 'ws-1', name: 'NovaPhone Core' },
    { id: 'ws-2', name: 'Nova OS Beta' }
  ],
  activeWorkspaceId: 'ws-1',
  analyticsMetrics: {
    csatScore: '4.8/5.0',
    dau: '42.8K',
    dauGrowth: '+14.2%',
    checkoutConversion: '3.42%',
    checkoutDropoff: '-4.1% at 3D-Secure',
    retention30d: '68.4%',
    featureAdoptionRate: '74.2%'
  },
  analyticsConnectors: [
    { id: 'conn-1', name: 'Zendesk Support Webhooks', status: 'Connected', health: 99, lastSync: '2 mins ago', eventsToday: '1,420 Tickets' },
    { id: 'conn-2', name: 'Mixpanel Behavioral Events', status: 'Connected', health: 96, lastSync: 'Just now', eventsToday: '2.4M Events' },
    { id: 'conn-3', name: 'Gong Sales Call Transcripts', status: 'Connected', health: 98, lastSync: '15 mins ago', eventsToday: '840 Transcripts' },
    { id: 'conn-4', name: 'Google Play & App Store Reviews', status: 'Connected', health: 94, lastSync: '1 hour ago', eventsToday: '580 Reviews' },
    { id: 'conn-5', name: 'Intercom Live Chat Stream', status: 'Connected', health: 97, lastSync: '5 mins ago', eventsToday: '390 Chats' },
    { id: 'conn-6', name: 'Segment Customer Data Platform', status: 'Connected', health: 100, lastSync: 'Just now', eventsToday: '3.8M Events' }
  ],
  userProfile: {
    name: 'Alex Rivera',
    role: 'Lead Product Manager',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    email: 'alex.rivera@novaphone.io'
  },
  feedbackItems: [
    {
      id: 'RID1001',
      source: 'Customer Review',
      author: 'NovaPhone X User',
      content: 'Battery drains quickly after latest update.',
      sentiment: 'Negative',
      urgencyScore: 85,
      date: '2 hours ago',
      themeId: 'theme-battery',
      status: 'Clustered'
    },
    {
      id: 'RID1002',
      source: 'Support Ticket',
      author: 'NovaPhone Pro User',
      content: 'Poor low-light camera quality.',
      sentiment: 'Neutral',
      urgencyScore: 60,
      date: '5 hours ago',
      themeId: 'theme-camera',
      status: 'Clustered'
    },
    {
      id: 'RID1003',
      source: 'Meeting Transcript',
      author: 'NovaPhone Lite Focus Group',
      content: 'Charging is very slow.',
      sentiment: 'Positive',
      urgencyScore: 40,
      date: '1 day ago',
      themeId: 'theme-charging',
      status: 'Promoted to Feature'
    },
    {
      id: 'RID1004',
      source: 'Product Analytics',
      author: 'NovaPhone Max Telemetry',
      content: 'Phone lags during multitasking.',
      sentiment: 'Negative',
      urgencyScore: 92,
      date: '1 day ago',
      themeId: 'theme-performance',
      status: 'New'
    },
    {
      id: 'RID1005',
      source: 'Customer Review',
      author: 'NovaPhone Ultra User',
      content: 'Screen flickers at low brightness.',
      sentiment: 'Neutral',
      urgencyScore: 65,
      date: '2 days ago',
      themeId: 'theme-display',
      status: 'Clustered'
    },
    {
      id: 'RID1006',
      source: 'Support Ticket',
      author: 'NovaPhone X User',
      content: 'Wi-Fi disconnects frequently.',
      sentiment: 'Positive',
      urgencyScore: 30,
      date: '3 days ago',
      themeId: 'theme-network',
      status: 'Clustered'
    },
    {
      id: 'RID1007',
      source: 'Meeting Transcript',
      author: 'NovaPhone Pro Focus Group',
      content: 'Fingerprint unlock fails randomly.',
      sentiment: 'Negative',
      urgencyScore: 88,
      date: '3 days ago',
      themeId: 'theme-security',
      status: 'Action Required'
    },
    {
      id: 'RID1008',
      source: 'Product Analytics',
      author: 'NovaPhone Lite Telemetry',
      content: 'Notifications arrive late.',
      sentiment: 'Neutral',
      urgencyScore: 50,
      date: '4 days ago',
      themeId: 'theme-notifications',
      status: 'Clustered'
    },
    {
      id: 'RID1009',
      source: 'Customer Review',
      author: 'NovaPhone Max User',
      content: 'Need dark mode support.',
      sentiment: 'Positive',
      urgencyScore: 45,
      date: '4 days ago',
      themeId: 'theme-customization',
      status: 'In Backlog'
    },
    {
      id: 'RID1010',
      source: 'Support Ticket',
      author: 'NovaPhone Ultra User',
      content: 'Storage fills quickly with cache.',
      sentiment: 'Negative',
      urgencyScore: 80,
      date: '5 days ago',
      themeId: 'theme-storage',
      status: 'Action Required'
    }
  ],
  themes: [
    {
      id: 'theme-battery',
      title: 'Battery Optimization',
      category: 'Battery',
      ticketCount: 140,
      affectedArr: 'High Business Impact',
      aiSummary: 'Users are experiencing rapid battery drain on the NovaPhone X immediately after installing the latest firmware update.',
      severity: 'High',
      status: 'Action Required',
      featureId: 'feat-battery'
    },
    {
      id: 'theme-camera',
      title: 'Camera Enhancement',
      category: 'Camera',
      ticketCount: 143,
      affectedArr: 'High Business Impact',
      aiSummary: 'NovaPhone Pro users are consistently complaining about poor image quality and noise when shooting in low-light environments.',
      severity: 'High',
      status: 'In Backlog',
      featureId: 'feat-camera'
    },
    {
      id: 'theme-charging',
      title: 'Charging',
      category: 'Charging',
      ticketCount: 146,
      affectedArr: 'High Business Impact',
      aiSummary: 'Focus groups for the NovaPhone Lite indicate dissatisfaction with charging speeds compared to competitor models.',
      severity: 'Medium',
      status: 'Promoted',
      featureId: 'feat-charging'
    },
    {
      id: 'theme-performance',
      title: 'Performance',
      category: 'Performance',
      ticketCount: 149,
      affectedArr: 'High Business Impact',
      aiSummary: 'Telemetry from NovaPhone Max devices shows memory exhaustion causing UI lag during heavy multitasking.',
      severity: 'High',
      status: 'New Opportunity',
      featureId: 'feat-performance'
    },
    {
      id: 'theme-display',
      title: 'Display Driver Fix',
      category: 'Display',
      ticketCount: 152,
      affectedArr: 'Medium Business Impact',
      aiSummary: 'NovaPhone Ultra displays are flickering visibly when brightness is set below 20%.',
      severity: 'Medium',
      status: 'In Backlog',
      featureId: 'feat-display'
    },
    {
      id: 'theme-network',
      title: 'Wi-Fi Stability',
      category: 'Network',
      ticketCount: 155,
      affectedArr: 'High Business Impact',
      aiSummary: ' NovaPhone X connectivity telemetry shows frequent intermittent drops from 5GHz Wi-Fi networks.',
      severity: 'High',
      status: 'Action Required',
      featureId: 'feat-network'
    },
    {
      id: 'theme-security',
      title: 'Fingerprint Accuracy',
      category: 'Authentication',
      ticketCount: 158,
      affectedArr: 'Medium Business Impact',
      aiSummary: 'NovaPhone Pro under-display fingerprint sensors are failing to recognize registered prints ~15% of the time.',
      severity: 'Medium',
      status: 'In Backlog',
      featureId: 'feat-security'
    },
    {
      id: 'theme-notifications',
      title: 'Push Delivery',
      category: 'Notifications',
      ticketCount: 161,
      affectedArr: 'Medium Business Impact',
      aiSummary: 'Aggressive background process killing on NovaPhone Lite is causing push notifications to be delayed by up to 5 minutes.',
      severity: 'Medium',
      status: 'Promoted',
      featureId: 'feat-notifications'
    },
    {
      id: 'theme-customization',
      title: 'Dark Mode Support',
      category: 'Customization',
      ticketCount: 164,
      affectedArr: 'Medium Business Impact',
      aiSummary: 'High volume of feature requests from NovaPhone Max users asking for a system-wide pure black dark mode.',
      severity: 'Low',
      status: 'In Backlog',
      featureId: 'feat-customization'
    },
    {
      id: 'theme-storage',
      title: 'Cache Management',
      category: 'Storage',
      ticketCount: 167,
      affectedArr: 'Low Business Impact',
      aiSummary: 'NovaPhone Ultra system cache is expanding uncontrollably, eating up to 15GB of user storage within weeks.',
      severity: 'Low',
      status: 'New Opportunity',
      featureId: 'feat-storage'
    }
  ],
  features: [
    {
      id: 'feat-battery',
      title: 'Optimize battery consumption',
      themeId: 'theme-battery',
      description: 'Prioritize optimize battery consumption in the upcoming sprint by throttling background syncs.',
      upvotes: 140,
      reach: 50000,
      impact: 4,
      confidence: 90,
      effort: 3,
      riceScore: 600,
      kanoCategory: 'Performance',
      valueScore: 95,
      arrImpact: 'Critical',
      status: 'Prioritized',
      assignee: 'Hardware Ops'
    },
    {
      id: 'feat-camera',
      title: 'Improve Night Mode',
      themeId: 'theme-camera',
      description: 'Prioritize improve night mode in the upcoming sprint by adjusting ISO curves and multi-frame noise reduction.',
      upvotes: 143,
      reach: 35000,
      impact: 3,
      confidence: 85,
      effort: 4,
      riceScore: 223,
      kanoCategory: 'Enhancement',
      valueScore: 88,
      arrImpact: 'High',
      status: 'In Development',
      assignee: 'Camera Team'
    },
    {
      id: 'feat-charging',
      title: 'Improve fast charging',
      themeId: 'theme-charging',
      description: 'Prioritize improve fast charging in the upcoming sprint by updating thermal management algorithms.',
      upvotes: 146,
      reach: 25000,
      impact: 4,
      confidence: 80,
      title: 'Instant Slack/Webhook Fraud Alert System',
      themeId: 'theme-4',
      description: 'Customizable webhook endpoint builder allowing product managers and fraud analysts to configure real-time alert triggers.',
      upvotes: 18,
      reach: 2100,
      impact: 2,
      confidence: 85,
      effort: 2,
      riceScore: 178.5,
      kanoCategory: 'Delighter',
      valueScore: 74,
      arrImpact: '$85,000',
      status: 'Backlog',
      assignee: 'Unassigned'
    }
  ],
  prds: [
    {
      id: 'prd-1',
      featureId: 'feat-1',
      title: 'PRD: Automated Report Export Engine',
      version: 'v1.2',
      author: 'Alex Rivera',
      lastUpdated: 'Today at 11:30 AM',
      overview: 'This document defines the engineering requirements for implementing an automated background report export engine to prevent browser freezes when downloading large datasets.',
      problemStatement: 'Over the last 30 days, 28 customer complaints reported browser crashes when attempting to export monthly reports over 50,000 rows on mobile devices and desktop.',
      targetAudience: 'Product Managers, Data Analysts, and Executive Stakeholders who export monthly data.',
      goals: [
        'Reduce report generation time below 2 seconds.',
        'Achieve 100% export reliability across mobile and desktop devices.',
        'Eliminate synchronous browser memory bottlenecks during large CSV/PDF downloads.'
      ],
      userStories: [
        { id: 'us-1', role: 'Product Manager', action: 'click export on a 50,000 row dataset', benefit: 'my PDF download starts instantly without freezing the browser', status: 'Done' },
        { id: 'us-2', role: 'Executive Stakeholder', action: 'open quarterly summary reports on mobile', benefit: 'I can view clear, formatted charts immediately without errors', status: 'In Review' },
        { id: 'us-3', role: 'Data Analyst', action: 'download raw CSV logs in the background', benefit: 'I can continue navigating the dashboard while the file prepares', status: 'To Do' }
      ],
      acceptanceCriteria: [
        'Gherkin Scenario 1: Given user clicks Export on >50k rows, When background worker queues job, Then progress bar displays instantly without blocking UI.',
        'Gherkin Scenario 2: Given job completes, When file is ready, Then system generates secure download link and notifies user.',
        'Gherkin Scenario 3: Given export fails due to network drop, When auto-retry triggers, Then system resumes export from last processed chunk.'
      ]
    }
  ],
  roadmapItems: [
    { id: 'rm-1', featureId: 'feat-3', title: 'Enterprise SSO & Granular Audit Log', quarter: 'Q1 2026', status: 'In Dev', progress: 75, category: 'Security', startMonth: 'Jan', endMonth: 'Feb', dependencies: [] },
    { id: 'rm-2', featureId: 'feat-1', title: 'Automated Report Export Engine', quarter: 'Q1 2026', status: 'Discovery', progress: 30, category: 'Core API', startMonth: 'Feb', endMonth: 'Mar', dependencies: ['rm-1'] },
    { id: 'rm-3', featureId: 'feat-2', title: 'Async Worker Queue for Exports', quarter: 'Q2 2026', status: 'Backlog', progress: 0, category: 'Dashboard', startMonth: 'Apr', endMonth: 'May', dependencies: [] },
    { id: 'rm-4', featureId: 'feat-4', title: 'Instant Slack Fraud Alert Webhooks', quarter: 'Q2 2026', status: 'Backlog', progress: 0, category: 'Integrations', startMonth: 'May', endMonth: 'Jun', dependencies: ['rm-2'] },
    { id: 'rm-5', featureId: 'feat-custom-1', title: 'AI-Powered Anomaly Detection Engine', quarter: 'Q3 2026', status: 'Backlog', progress: 0, category: 'AI Intelligence', startMonth: 'Jul', endMonth: 'Aug', dependencies: [] },
    { id: 'rm-6', featureId: 'feat-custom-2', title: 'Autonomous Multi-Currency Tax Engine', quarter: 'Q4 2026', status: 'Backlog', progress: 0, category: 'Fintech Core', startMonth: 'Oct', endMonth: 'Nov', dependencies: [] }
  ],
  chatHistory: [
    {
      sender: 'ai',
      time: '10:00 AM',
      text: "👋 Hello Alex! I'm your **AI Product Manager Copilot**. I've analyzed **5 active feedback channels**, synced **3.8M analytics events today**, and identified **4 high-impact themes**. How can I assist with your product decisions today?",
      options: [
        'Why did checkout conversion drop this week?',
        'Summarize our top Enterprise feature blockers',
        'Draft a PRD for the Slack Fraud Webhook request',
        'Show me the highest RICE priority item right now'
      ]
    }
  ]
};

export const chartData = {
  themeDistribution: [
    { name: 'Performance', tickets: 45 },
    { name: 'UX/UI', tickets: 32 },
    { name: 'Security', tickets: 28 },
    { name: 'Integrations', tickets: 19 },
    { name: 'Billing', tickets: 14 },
    { name: 'Bugs', tickets: 9 }
  ],
  sentiment: [
    { name: 'Positive', value: 35, color: '#10b981' },
    { name: 'Neutral', value: 45, color: '#3b82f6' },
    { name: 'Negative', value: 20, color: '#f43f5e' }
  ],
  trends: [
    { name: 'Mon', tickets: 12 },
    { name: 'Tue', tickets: 19 },
    { name: 'Wed', tickets: 25 },
    { name: 'Thu', tickets: 18 },
    { name: 'Fri', tickets: 35 },
    { name: 'Sat', tickets: 22 },
    { name: 'Sun', tickets: 11 }
  ]
};
