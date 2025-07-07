// src/components/dashboard/TabContent/TabContent.tsx
import React, { useState } from 'react';
import TabButton from './TabButton';
//import { TabButton } from './TabButton';

interface Tab {
  id: string;
  label: string;
  content: React.ReactNode;
}

interface TabContentProps {
  tabs: Tab[];
  defaultTab?: string;
}

export const TabContent: React.FC<TabContentProps> = ({ tabs, defaultTab }) => {
  const [activeTab, setActiveTab] = useState(defaultTab || tabs[0]?.id);

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm">
      {/* Tab Headers */}
      <div className="border-b border-gray-200 dark:border-gray-700">
        <nav className="flex space-x-8 px-6" aria-label="Tabs">
          {tabs.map((tab) => (
            <TabButton
              key={tab.id}
              tab={tab}
              isActive={activeTab === tab.id}
              onClick={() => setActiveTab(tab.id)}
            />
          ))}
        </nav>
      </div>

      {/* Tab Content */}
      <div className="p-6">
        {tabs.find((tab) => tab.id === activeTab)?.content}
      </div>
    </div>
  );
};

export default TabContent;