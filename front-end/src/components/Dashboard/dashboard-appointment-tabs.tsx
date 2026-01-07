// src/components/appointment/AppointmentTabs.tsx

import React from "react";
import { Tabs, TabsList, TabsTrigger } from "~/components/ui/tabs";
import { Text } from "~/components/ui/text";

const TABS = ["UPCOMING", "COMPLETED"] as const;
export type DashboardTabType = (typeof TABS)[number];

type AppointmentTabsProps = {
  activeTab: DashboardTabType;
  onTabChange: (tab: DashboardTabType) => void;
};

const AppointmentTabs: React.FC<AppointmentTabsProps> = ({
  activeTab,
  onTabChange,
}) => {
  return (
    <Tabs
      value={activeTab}
      onValueChange={(v) => onTabChange(v as DashboardTabType)}
    >
      <TabsList variant="noPills" className="bg-transparent">
        {TABS.map((tab) => (
          <TabsTrigger key={tab} value={tab} className="flex-1">
            <Text className="text-lg font-medium">
              {tab.charAt(0) + tab.slice(1).toLowerCase()}
            </Text>
          </TabsTrigger>
        ))}
      </TabsList>
    </Tabs>
  );
};

export default AppointmentTabs;
