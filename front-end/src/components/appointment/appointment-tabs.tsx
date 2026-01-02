// src/components/appointment/AppointmentTabs.tsx
import React from "react";
import { Tabs, TabsList, TabsTrigger } from "~/components/ui/tabs";
import { Text } from "react-native";

const TABS = [
  "UPCOMING",
  "ONGOING",
  "COMPLETED",
  "CANCELLED",
] as const;
export type TabType = (typeof TABS)[number];

type AppointmentTabsProps = {
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
};

const AppointmentTabs: React.FC<AppointmentTabsProps> = ({
  activeTab,
  onTabChange,
}) => {
  return (
    <Tabs value={activeTab} onValueChange={(v) => onTabChange(v as TabType)}>
      <TabsList variant="noPills" className="mx-4 mt-4">
        {TABS.map((tab) => (
          <TabsTrigger key={tab} value={tab}>
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
