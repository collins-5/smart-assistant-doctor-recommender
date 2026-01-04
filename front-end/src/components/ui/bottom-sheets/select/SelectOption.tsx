import { TouchableOpacity, View } from 'react-native';
import { useSheetPayload } from 'react-native-actions-sheet';

import Icon from '@/components/ui/icon';
import { Separator } from '@/components/ui/separator';
import { Text } from '@/components/ui/text';
import { cn } from '@/lib/utils';
import { SelectedOption } from '~/lib/types';

export const SelectOption: React.FC<
  SelectedOption & {
    handleSelect: (value: string, label: string) => void;
  }
> = ({ value, label, handleSelect }) => {
  const { currentValue } = useSheetPayload('select-bottom-sheet');

  const isSelected = currentValue === value;
  return (
    <TouchableOpacity onPress={(e) => handleSelect(value, label)}>
      <View className={cn('flex-row justify-between px-2 py-3', isSelected && 'bg-muted ')}>
        <Text className={cn(isSelected && 'text-primary')}>{label}</Text>
        {isSelected && <Icon name="check" className="text-primary" />}
      </View>
      <Separator />
    </TouchableOpacity>
  );
};
