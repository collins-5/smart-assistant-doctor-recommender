// src/components/ui/select.tsx
import * as React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Platform,
} from "react-native";
import { cn } from "~/lib/utils";
import Icon from "~/components/ui/icon"; // Your custom Icon component

// Context
interface SelectContextType {
  value: string | null;
  onValueChange: (value: string | null) => void;
  placeholder?: string;
  disabled?: boolean;
  open: boolean;
  setOpen: (open: boolean) => void;
}

const SelectContext = React.createContext<SelectContextType>({
  value: null,
  onValueChange: () => {},
  open: false,
  setOpen: () => {},
});

const Select = ({
  value,
  onValueChange,
  placeholder = "Select an option",
  disabled = false,
  children,
}: {
  value: string | null;
  onValueChange: (value: string | null) => void;
  placeholder?: string;
  disabled?: boolean;
  children: React.ReactNode;
}) => {
  const [open, setOpen] = React.useState(false);

  return (
    <SelectContext.Provider
      value={{ value, onValueChange, placeholder, disabled, open, setOpen }}
    >
      <View className="relative">{children}</View>
    </SelectContext.Provider>
  );
};

// SelectTrigger
const SelectTrigger = React.forwardRef<
  React.ElementRef<typeof TouchableOpacity>,
  React.ComponentPropsWithoutRef<typeof TouchableOpacity> & {
    className?: string;
  }
>(({ className, children, ...props }, ref) => {
  const { value, placeholder, disabled, open, setOpen } =
    React.useContext(SelectContext);

  const displayText = value ? (children as string) || placeholder : placeholder;

  return (
    <TouchableOpacity
      ref={ref}
      activeOpacity={0.7}
      onPress={() => !disabled && setOpen(!open)}
      className={cn(
        "flex-row items-center justify-between rounded-xl border border-input bg-background px-4 py-4",
        disabled && "opacity-50",
        className
      )}
      {...props}
    >
      <Text
        className={cn("text-foreground", !value && "text-muted-foreground")}
      >
        {displayText}
      </Text>
      <Icon
        name={open ? "chevron-up" : "chevron-down"}
        size={20}
        className="text-foreground/70"
      />
    </TouchableOpacity>
  );
});
SelectTrigger.displayName = "SelectTrigger";

// SelectValue (optional helper if you want to extract value)
const SelectValue = ({ children }: { children?: React.ReactNode }) => {
  const { value } = React.useContext(SelectContext);
  if (!value) return null;
  return <>{children || value}</>;
};

// SelectContent
const SelectContent = React.forwardRef<
  React.ElementRef<typeof View>,
  React.ComponentPropsWithoutRef<typeof View> & { className?: string }
>(({ className, children, ...props }, ref) => {
  const { open } = React.useContext(SelectContext);
  if (!open) return null;

  return (
    <View
      ref={ref}
      className={cn(
        "absolute top-full left-0 right-0 mt-2 max-h-64 rounded-xl border border-border bg-background shadow-lg z-50",
        Platform.OS === "android" && "elevation-8",
        className
      )}
      {...props}
    >
      <ScrollView nestedScrollEnabled className="py-2">
        {children}
      </ScrollView>
    </View>
  );
});
SelectContent.displayName = "SelectContent";

// SelectItem
const SelectItem = React.forwardRef<
  React.ElementRef<typeof TouchableOpacity>,
  React.ComponentPropsWithoutRef<typeof TouchableOpacity> & {
    label: string;
    value: string;
    className?: string;
  }
>(({ label, value, className, ...props }, ref) => {
  const {
    value: selectedValue,
    onValueChange,
    setOpen,
  } = React.useContext(SelectContext);
  const isSelected = selectedValue === value;

  return (
    <TouchableOpacity
      ref={ref}
      activeOpacity={0.7}
      onPress={() => {
        onValueChange(value);
        setOpen(false);
      }}
      className={cn(
        "flex-row items-center justify-between px-4 py-3",
        isSelected && "bg-primary/10",
        className
      )}
      {...props}
    >
      <Text className={cn("text-foreground", isSelected && "font-medium")}>
        {label}
      </Text>
      {isSelected && <Icon name="check" size={20} className="text-primary" />}
    </TouchableOpacity>
  );
});
SelectItem.displayName = "SelectItem";

export { Select, SelectTrigger, SelectValue, SelectContent, SelectItem };
