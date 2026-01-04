import { useMemo, useState } from 'react';
import { TextInput, View } from 'react-native';
import ActionSheet, {
  ScrollView,
  SheetDefinition,
  SheetManager,
  useSheetPayload,
} from 'react-native-actions-sheet';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Input } from '@/components/ui/input';
import List from '~/components/ui/list';
import { fullHeightActionSheetProps } from '~/lib/constants';

import { SelectOption } from './SelectOption';
import { Text } from '../../text';

const SelectBottomSheet = () => {
  const { data, setCurrentValue, inputRef, setIsBottomSheetOpen } =
    useSheetPayload('select-bottom-sheet');

  const insets = useSafeAreaInsets();
  const [searchValue, setSearchValue] = useState<string>('');

  const filtered = useMemo(
    () =>
      data?.filter((item) => item?.label?.toLowerCase().includes(searchValue.toLowerCase())) || [],
    [searchValue, data]
  );

  const handleSelect = (value: string, _label: string) => {
    setCurrentValue(value);
    inputRef.current?.blur();
    SheetManager.hide('select-bottom-sheet');
    setIsBottomSheetOpen(false);
  };

  return (
    <ActionSheet
      {...fullHeightActionSheetProps}
      containerStyle={{
        paddingBottom: insets.bottom + 100,
        height: '100%',
      }}
      isModal
      id="select-bottom-sheet"
      headerAlwaysVisible={true}
      onClose={() => setIsBottomSheetOpen(false)}>
      <Input value={searchValue} onChangeText={setSearchValue} placeholder="Search options..." />

      <View style={{ flex: 1 }} className="min-h-full">
        {filtered.length > 0 ? (
          <ScrollView>
            <List
              data={filtered}
              renderItem={({ item }) => <SelectOption {...item} handleSelect={handleSelect} />}
              keyExtractor={(item) => item.value || item.label}
              keyboardShouldPersistTaps="handled"
              nestedScrollEnabled
              showsVerticalScrollIndicator={false}
            />
          </ScrollView>
        ) : (
          <View style={{ padding: 20, alignItems: 'center' }}>
            <Text>No options found</Text>
          </View>
        )}
      </View>
    </ActionSheet>
  );
};

export default SelectBottomSheet;

export type SelectBottomSheetDefinition = SheetDefinition<{
  payload: {
    currentValue: string | null | undefined;
    setCurrentValue: (v: string) => void;
    inputRef: React.RefObject<TextInput | null>;
    data: { value: string; label: string }[];
    isBottomSheetOpen: boolean;
    setIsBottomSheetOpen: (v: boolean) => void;
  };
}>;
