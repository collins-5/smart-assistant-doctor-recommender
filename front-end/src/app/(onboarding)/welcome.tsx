import { Image } from "expo-image";
import { Link, useRouter } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import {
  Dimensions,
  NativeScrollEvent,
  NativeSyntheticEvent,
  PixelRatio,
  Pressable,
  ScrollView,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { Text } from "~/components/ui/text";
import View from "~/components/ui/view";
import { slideData } from "~/lib/constants/slideData";
import { useOnboardingStore } from "~/lib/store/onboarding";

export const EXTRA_BOTTOM_SPACING = 30;


const { width: screenWidth } = Dimensions.get("window");
const scaleFont = (size: number) =>
  PixelRatio.roundToNearestPixel(size * (screenWidth / 375));

interface SlideProps {
  title: string;
  description: string;
  imageUrl?: string;
}

const Slide: React.FC<SlideProps> = ({ title, description, imageUrl }) => {
  const insets = useSafeAreaInsets();

  return (
    <View
      className="flex-1 items-center justify-center"
      style={{
        paddingHorizontal: screenWidth * 0.08,
        paddingTop: insets.top - 80,
        width: screenWidth,
      }}
    >
      <Text
        className="text-3xl font-bold text-primary-foreground text-center mb-4"
        style={{ fontSize: scaleFont(28) }}
        allowFontScaling={false}
      >
        {title}
      </Text>
      <View className="mb-8">
        <Image
          source={typeof imageUrl === "string" ? { uri: imageUrl } : imageUrl}
          style={{
            width: screenWidth * 1.0,
            height: screenWidth * 1.1,
            borderRadius: 20,
          }}
          className="rounded-xl"
          contentFit="contain"
        />
      </View>
      <Text
        className="text-base font-medium text-primary-foreground text-left px-4 leading-relaxed"
        style={{ fontSize: scaleFont(16), lineHeight: scaleFont(24) }}
        allowFontScaling={false}
      >
        {description}
      </Text>
    </View>
  );
};
const PaginationDots: React.FC<{
  total: number;
  current: number;
  onNext: () => void;
}> = ({ total, current, onNext }) => {
  const isLastSlide = current >= total - 1;
  const { setIsOnboarded } = useOnboardingStore();
  const insets = useSafeAreaInsets();
  const router = useRouter(); 

  const handleGetStarted = () => {
    setIsOnboarded(); 
    router.replace("/(auth)/sign-in"); 
  };

  const handleSkip = () => {
    setIsOnboarded(); 
    router.replace("/(auth)/sign-in"); 
  };

  return (
    <View
      className="flex-row items-center justify-between w-full"
      style={{
        paddingHorizontal: screenWidth * 0.03,
        paddingVertical: 16,
        paddingBottom: insets.bottom + EXTRA_BOTTOM_SPACING,
      }}
    >
      {/* Skip */}
      <View className="flex-1 max-w-[150px] min-w-[100px] items-start">
        <Pressable onPress={handleSkip} className="px-4 py-2">
          <Text
            className="text-base font-medium text-primary-foreground text-center"
            style={{ fontSize: scaleFont(12) }}
          >
            Skip
          </Text>
        </Pressable>
      </View>

      {/* Dots */}
      <View className="flex-row justify-center">
        {Array.from({ length: total }, (_, index) => (
          <View
            key={index}
            className={`mx-1 w-2 h-2 rounded-full ${
              index === current ? "bg-primary-foreground" : "bg-muted/50"
            }`}
          />
        ))}
      </View>

      {/* Next / Get Started */}
      <View className="flex-1 max-w-[150px] min-w-[100px] items-end">
        {isLastSlide ? (
          <Pressable onPress={handleGetStarted} className="px-4 py-2">
            <Text
              className="text-base font-medium text-primary-foreground text-center"
              style={{ fontSize: scaleFont(12) }}
            >
              Get Started
            </Text>
          </Pressable>
        ) : (
          <Pressable className="px-4 py-2" onPress={onNext}>
            <Text
              className="font-medium text-primary-foreground text-center"
              style={{ fontSize: scaleFont(12) }}
            >
              Next
            </Text>
          </Pressable>
        )}
      </View>
    </View>
  );
};

const OnboardingScreen: React.FC = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const scrollViewRef = useRef<ScrollView>(null);

  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const slideIndex = Math.round(
      event.nativeEvent.contentOffset.x / screenWidth
    );
    if (slideIndex !== currentSlide) {
      setCurrentSlide(slideIndex);
    }
  };

  const handleNext = () => {
    if (currentSlide >= 4) {
      return;
    }

    const nextSlide = currentSlide + 1;
    setCurrentSlide(nextSlide);

    scrollViewRef.current?.scrollTo({
      x: nextSlide * screenWidth,
      animated: true,
    });
  };

  return (
    <View className="flex-1 bg-primary">
      <ScrollView
        ref={scrollViewRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onMomentumScrollEnd={handleScroll}
      >
        {slideData.map((slide) => (
          <Slide
            key={slide.id}
            title={slide.title}
            description={slide.description}
            imageUrl={slide.imageUrl}
          />
        ))}
      </ScrollView>
      <View className="absolute bottom-0 left-0 right-0">
        <PaginationDots
          total={slideData.length}
          current={currentSlide}
          onNext={handleNext}
        />
      </View>
    </View>
  );
};

export default OnboardingScreen;
