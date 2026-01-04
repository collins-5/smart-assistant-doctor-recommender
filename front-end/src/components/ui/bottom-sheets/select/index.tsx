// src/components/ui/select/index.tsx (or wherever your Select lives)

import { useMemo, useRef, useState } from "react";
import { Pressable, TextInput, TextInputProps, View } from "react-native";
import { SheetManager } from "react-native-actions-sheet";

import { cn } from "~/lib/utils";
import Icon from "../../icon";
import { Label } from "../../label";
import { Text } from "../../text";

export type SelectProps = Omit<TextInputProps, "onChange"> & {
  label?: string;
  description?: string;
  error?: string;
  data: { value: string; label: string }[];
  onChange?: (v: string) => void;
  disabled?: boolean; // ← Added disabled prop
};

const Select: React.FC<SelectProps> = ({
  className,
  label,
  description,
  error,
  data,
  onChange,
  value,
  disabled = false, // ← Default to false
  ...props
}) => {
  const id = props.id ?? label;
  const placeholder =
    typeof props.placeholder === "string" ? props.placeholder : "";

  const inputRef = useRef<TextInput | null>(null);

  const isControlled = value !== undefined;
  const [uncontrolledValue, setUncontrolledValue] = useState<string | null>(
    null
  );

  const [isBottomSheetOpen, setIsBottomSheetOpen] = useState(false);

  const currentValue = isControlled ? value : uncontrolledValue;

  const setCurrentValue = (val: string) => {
    if (!isControlled) {
      setUncontrolledValue(val);
    }
    onChange?.(val);
  };

  const currentLabel = useMemo(() => {
    return data.find((d) => d.value === currentValue)?.label ?? null;
  }, [data, currentValue]);

  const toggleBottomSheet = () => {
    if (disabled) return; // ← Prevent opening when disabled

    if (isBottomSheetOpen) {
      setIsBottomSheetOpen(false);
      SheetManager.hide("select-bottom-sheet");
    } else {
      setIsBottomSheetOpen(true);
      SheetManager.show("select-bottom-sheet", {
        payload: {
          data,
          inputRef,
          currentValue,
          isBottomSheetOpen,
          setCurrentValue,
          setIsBottomSheetOpen,
        },
      });
    }
  };

  return (
    <Pressable onPress={toggleBottomSheet} disabled={disabled}>
      <View>
        {label && <Label accessibilityLabelledBy={id}>{label}</Label>}
        {description && !error && (
          <Text className="text-sm text-muted-foreground">{description}</Text>
        )}
        {error && <Text className="text-sm text-destructive">{error}</Text>}
      </View>

      <View
        className={cn(
          "flex-row items-center justify-between space-x-2 rounded-md border-2 bg-background",
          disabled ? "border-border/50 opacity-60" : "border-border"
        )}
      >
        <TextInput
          nativeID={id}
          className={cn(
            "flex-1 text-base leading-[1.25] py-3 px-3",
            disabled ? "text-muted-foreground" : "text-foreground",
            props.editable === false && "cursor-not-allowed opacity-50",
            className
          )}
          placeholderClassName={cn(
            "text-muted-foreground",
            props.placeholderClassName
          )}
          placeholder={currentLabel ? undefined : placeholder}
          editable={false}
          value={currentLabel ?? ""}
          {...props}
        />
        <View className="pr-3">
          <Icon
            name={isBottomSheetOpen ? "chevron-up" : "chevron-down"}
            size={20}
            className={
              disabled ? "text-muted-foreground" : "text-foreground/60"
            }
          />
        </View>
      </View>
    </Pressable>
  );
};

export { Select };
