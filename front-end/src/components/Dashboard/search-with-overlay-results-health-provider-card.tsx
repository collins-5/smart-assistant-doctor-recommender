import { useRouter } from 'expo-router';
import React from 'react';
import { Keyboard, TouchableNativeFeedback } from 'react-native';

import { HealthWorkerTitle } from '~/lib/graphql/generated/graphql';
import { useSearchHealthProviders } from '~/lib/hooks';

import IconWithText from '../core/IconWithText';
import { Avatar } from '../ui/avatar';
import { Card } from '../ui/card';
import Icon from '../ui/icon';
import { Text } from '../ui/text';
import View from '../ui/view';

interface SearchWithOverlayResultsHealthProviderCardProps {
  id: number;
  title?: HealthWorkerTitle | null;
  firstName: string;
  middleName: string;
  lastName: string;
  primarySpecialty?: string;
  subSpecialties?: string[] | null;
  primaryClinicPracticeLocation?: string;
  offersClinicVisitCare?: boolean;
  offersHomeCare?: boolean;
  offersTeleconsultCare?: boolean;
  homecarePrice?: number;
  clinicVisitPrice?: number;
  teleconsultPrice?: number;
  profilePictureUrl: string | null;
  qualifications?: string[] | null;
  healthWorkerRole?: string;
}

const SearchWithOverlayResultsHealthProviderCard: React.FC<
  SearchWithOverlayResultsHealthProviderCardProps
> = (props) => {
  const { setQuery } = useSearchHealthProviders();
  const router = useRouter();

  return (
    <TouchableNativeFeedback
      onPress={() => {
        setQuery('');
        Keyboard.dismiss();
        router.push(`/(protected)/(drawer)/(tabs)/health-care-providers/${props.id}`);
      }}>
      <Card className="relative mb-2 flex-row items-center gap-2 pl-2">
        <Avatar
          resourceURL={props.profilePictureUrl ?? ''}
          first_name={props.firstName}
          last_name={props.lastName}
          size={'md'}
        />
        <View>
          <Text className="font-semibold text-gray-800">
            {props.title} {props.firstName} {props.lastName}
          </Text>
          {props.primarySpecialty && (
            <Text numberOfLines={1} className="mb-1 text-sm font-medium text-primary">
              {props.primarySpecialty}
            </Text>
          )}
          <IconWithText
            iconProps={{
              name: 'map-marker-radius-outline',
              size: 14,
              className: 'text-muted-foreground',
            }}
            text={props.primaryClinicPracticeLocation}
            numberOfLines={2}
            textClassName="max-w-[70%] text-xs font-medium text-muted-foreground"
          />
        </View>
        <Icon name={'chevron-right'} className="absolute right-3 text-primary" size={18} />
      </Card>
    </TouchableNativeFeedback>
  );
};

export default SearchWithOverlayResultsHealthProviderCard;
