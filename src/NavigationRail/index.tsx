'use client'
import { forwardRef, useState, ComponentRef, useEffect, useRef } from 'react';
import { View, StyleSheet, StyleProp, ViewStyle, TextStyle } from 'react-native';
import Animated, { useSharedValue, useAnimatedStyle, withTiming, interpolate } from 'react-native-reanimated';
import { IconSource } from 'react-native-paper/lib/typescript/components/Icon';
import { TouchableRipple, Text, Icon, Badge, useTheme, MD3Theme, Modal, Portal } from 'react-native-paper';
import { FAB, IconButton } from 'react-native-paper'; // Use FAB and IconButton from react-native-paper

type Variant = 'standard' | 'modal'

export type NavigationRailItem = {
  key: string
  icon: IconSource
  label: string
  onPress: () => void
  badge?: {
    label: string
    size?: 'small' | "large"
  }
  ariaLabel?: string
  testID?: string
}

type Props = {
  variant?: Variant
  items: NavigationRailItem[]
  selectedItemKey: string
  onMenuPress?: () => void // Called when internal menu button is pressed
  fabIcon?: IconSource
  fabLabel?: string
  onFabPress?: () => void
  initialStatus?: Status
  initialModalOpen?: boolean; // For modal variant: initial open state
  onDismiss?: () => void; // For modal variant: when modal is dismissed
}

type Status = 'collapsed' | 'expanded'

export const NavigationRail = forwardRef<ComponentRef<typeof View>, Props>((
  {
    items,
    selectedItemKey,
    onMenuPress,
    fabIcon,
    fabLabel,
    onFabPress,
    initialStatus = 'collapsed',
    variant = 'standard',
    initialModalOpen = false,
    onDismiss,
  }: Props, ref) => {
  const theme = useTheme<MD3Theme>();
  const [status, setStatus] = useState<Status>(variant === 'modal' ? 'expanded' : initialStatus);
  // Internal state for modal visibility, controlled by the component itself
  const [isModalOpen, setIsModalOpen] = useState(variant === 'modal' ? initialModalOpen : false);

  // Toggle for the rail's own expanded/collapsed status (for standard variant)
  const toggleRailStatus = () => {
    setStatus(prev => prev === 'collapsed' ? 'expanded' : 'collapsed');
  };

  // Toggle for the modal visibility (triggered by the fixed top-left button)
  const toggleModalVisibility = () => {
    if (variant === 'modal') {
      setIsModalOpen(prev => !prev);
    }
  };

  const styles = StyleSheet.create({
    fixedGlobalMenuButton: {
      position: 'absolute',
      top: 8, // Align with railContent's paddingTop
      left: 16, // Align with railContent's menuButtonContainer's paddingHorizontal when expanded
      zIndex: 1002, // Ensure it's above Modal
      backgroundColor: 'transparent',
      borderRadius: theme.roundness * 4,
    },
    container: {
      backgroundColor: theme.colors.surface,
      paddingTop: 8,
      paddingBottom: 8,
      height: '100%',
      overflow: 'hidden', // Important for width animation
      // borderTopRightRadius: theme.roundness * 4, // Removed: Radius only for modal
      // borderBottomRightRadius: theme.roundness * 4, // Removed: Radius only for modal
    },
    menuButtonContainer: { // For standard variant
      marginBottom: 36,
      width: '100%',
      alignItems: status === 'expanded' ? 'flex-start' : 'center', // Align based on status
      paddingHorizontal: status === 'expanded' ? 16 : 0, // Add padding in expanded mode
    },
    fabContainer: {
      alignItems: status === 'expanded' ? 'flex-start' : 'center', // Align main FAB based on status
      width: '100%',
      paddingHorizontal: status === 'expanded' ? 16 : 0, // Add padding for expanded main FAB
      marginBottom: 24, // Add margin bottom to separate FAB from items
    },
    // Styles for Collapsed items
    itemContainer: {
      width: '100%',
      alignItems: 'center', // Collapsed items are always centered within their container
      paddingVertical: 8,
      borderRadius: theme.roundness * 3,
      marginBottom: 6,
      minHeight: 68, // Adjusted to fit content: paddingTop(8) + iconContainer(32) + label.marginTop(4) + labelLineHeight(approx 16) + paddingBottom(8) = 68
      justifyContent: 'center',
    },
    activeItemBackground: { // Used for collapsed state
      // backgroundColor: theme.colors.secondaryContainer, // Removed: Only icon container should have active background
    },
    itemContent: { // Used for collapsed state
      alignItems: 'center',
      flexDirection: 'column', // Always column for this specific layout part
    },
    iconContainer: { // Used for collapsed state
      width: 56,
      height: 32,
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: theme.roundness * 4,
    },
    activeIconContainer: { // Used for collapsed state
      backgroundColor: theme.colors.secondaryContainer,
    },
    label: { // Used for collapsed state (and expanded if not FAB)
      marginTop: 4,
      textAlign: 'center',
      color: theme.colors.onSurfaceVariant,
      ...theme.fonts.labelMedium,
    },
    activeLabel: { // Used for collapsed state (and expanded if not FAB)
      color: theme.colors.onSurfaceVariant, // Keep label color same as inactive
      // fontWeight: 'bold', // Keep label weight same as inactive
    },
    // Styles for Expanded items (using FAB)
    expandedItemWrapper: {
      width: '100%', // Wrapper takes full width of the rail
      marginBottom: 12,
      alignItems: 'flex-start', // Align the FAB itself to the start of this wrapper
      paddingHorizontal: 16, // Add horizontal padding to the wrapper
    },
    expandedFab: {
      // width: '100%', // REMOVE: Allow FAB to size to its content (icon + label)
      alignSelf: 'flex-start', // Ensure FAB aligns to start if not taking full width of parent
      minHeight: 56,
      justifyContent: 'flex-start',
      backgroundColor: 'transparent',
      elevation: 0,
      shadowColor: 'transparent', // Ensure no shadow on iOS
    },
    activeExpandedFab: {
      backgroundColor: theme.colors.secondaryContainer,
    },
    expandedBadgeOffset: {
      position: 'absolute',
      // Adjust based on FAB's internal icon placement and badge size
      top: 8, // Position from the top edge of the FAB
      // right: 12, // Removed right positioning
      left: 44, // Position from the left edge of the FAB, aiming for icon's top-right. Adjust as needed.
    },
    modalContentContainer: { // Style for the content inside the modal
      backgroundColor: theme.colors.surface,
      // padding: 20, // Example padding, adjust as needed
      // borderRadius: theme.roundness * 2, // Example border radius
      // margin: 20, // Example margin to not touch screen edges
      height: '100%', // Make the rail take full height of the modal
      // width: 'auto', // Let the rail's animated width define its width
      maxWidth: 360, // Consistent with the rail's max width
      borderTopRightRadius: theme.roundness * 4, // Add border radius only to the right side for modal too
      borderBottomRightRadius: theme.roundness * 4, // Add border radius only to the right side for modal too
      overflow: 'hidden', // Ensure content respects the modal's border radius
    },
  });

  // Icon is 24x24, iconContainer is 56x32 (for collapsed). Icon is centered.
  // Icon top-left in iconContainer: x=16, y=4
  // Icon top-right in iconContainer: x=40, y=4

  const getBadgeStyleAndSize = (badge?: NavigationRailItem['badge']): { style: StyleProp<ViewStyle>, RNPBadgeSize: number } => {
    if (!badge) return { style: {}, RNPBadgeSize: 0 };

    const RNPBadgeSizeConfig = {
      small: 6,
      largeSingleDigit: 16,
      largeMultiCharHeight: 16,
      largeMultiCharWidth: 34,
    };

    let RNPBadgeSize: number;
    let calculatedTop: number;
    let calculatedRight: number;
    let badgeWidth: number | undefined = undefined;
    let badgeHeight: number | undefined = undefined;
    let borderRadius: number | undefined = undefined;

    if (badge.size === 'small') {
      RNPBadgeSize = RNPBadgeSizeConfig.small;
      badgeHeight = 6;
      badgeWidth = 6;
      borderRadius = 3;

      // Simplified positioning for visibility
      calculatedTop = 0; // Position at the top of the icon container
      calculatedRight = 8; // Position from the right edge of the icon container
    } else {
      RNPBadgeSize = RNPBadgeSizeConfig.largeSingleDigit;
      badgeHeight = 16;
      borderRadius = 8;

      if (badge.label && badge.label.length > 1) {
        badgeWidth = RNPBadgeSizeConfig.largeMultiCharWidth;
      } else {
        badgeWidth = RNPBadgeSizeConfig.largeSingleDigit;
      }

      // Simplified positioning for visibility
      calculatedTop = 0; // Position at the top of the icon container
      calculatedRight = 8; // Position from the right edge of the icon container
    }

    return {
      style: {
        position: 'absolute',
        top: calculatedTop,
        right: calculatedRight,
        width: badgeWidth, // Explicitly set width
        height: badgeHeight, // Explicitly set height
        // ...(badge.size !== 'small' && badge.label && badge.label.length > 1 && { minWidth: badgeWidth }), // Removed minWidth
      },
      RNPBadgeSize: RNPBadgeSize,
    };
  };

  // Handler for the internal menu button (inside railContent)
  const handleInternalMenuPress = () => {
    if (variant === 'modal') {
      // In modal variant, internal menu button ONLY closes the modal
      setIsModalOpen(false);
      if (onMenuPress) {
        onMenuPress(); // Propagate event if needed
      }
    } else {
      // Standard behavior: toggle rail status
      toggleRailStatus();
      if (onMenuPress) {
        onMenuPress();
      }
    }
  };

  const animatedWidth = useSharedValue(status === 'expanded' ? 220 : 80);
  const animatedAlignment = useSharedValue(status === 'expanded' ? 1 : 0);

  const ANIMATION_DURATION = 280;

  useEffect(() => {
    animatedWidth.value = withTiming(status === 'expanded' ? 220 : 80, { duration: ANIMATION_DURATION });
    animatedAlignment.value = withTiming(status === 'expanded' ? 1 : 0, { duration: ANIMATION_DURATION });
  }, [status, animatedWidth, animatedAlignment]);

  // REMOVED: Effect that managed rail 'status' based on modal's actual visibility.
  // The rail's status is now independent of the modal's open/close state
  // and is only controlled by handleInternalMenuPress (toggleRailStatus).

  const animatedContainerStyle = useAnimatedStyle(() => {
    return {
      width: status === 'expanded' ? 'auto' : animatedWidth.value,
      minWidth: status === 'expanded' ? 220 : 80,
      maxWidth: 360,
      alignItems: animatedAlignment.value === 0 ? 'center' : 'flex-start',
    };
  });

  const railContent = (
    <Animated.View style={[styles.container, animatedContainerStyle]} ref={ref}>
      {/* Internal Menu button */}
      <View style={styles.menuButtonContainer}>
        <IconButton
          icon={status === 'expanded' ? 'menu-open' : 'menu'}
          onPress={handleInternalMenuPress}
          size={24}
          accessibilityLabel={status === 'expanded' ? "Collapse rail" : "Expand rail"}
        />
      </View>
      {onFabPress && fabIcon && (
        <View style={styles.fabContainer}>
          <FAB
            icon={fabIcon}
            label={status === 'expanded' ? fabLabel : undefined} // Revert to direct status check
            onPress={onFabPress}
            variant="primary"
          />
        </View>
      )}
      {items.map((item) => {
        const isActive = item.key === selectedItemKey;
        const badgeStyles = getBadgeStyleAndSize(item.badge);

        const itemAnimatedStyle = useAnimatedStyle(() => {
          return {
            opacity: status === 'expanded' ? animatedAlignment.value : 1 - animatedAlignment.value,
            // pointerEvents: status === 'expanded' && animatedAlignment.value < 0.5 ? 'none' : 'auto', // Prevent interaction during transition
          };
        });

        const collapsedItemAnimatedStyle = useAnimatedStyle(() => {
          return {
            opacity: status === 'collapsed' ? 1 - animatedAlignment.value : animatedAlignment.value,
            // pointerEvents: status === 'collapsed' && animatedAlignment.value > 0.5 ? 'none' : 'auto',
          }
        })


        return (
          <View key={item.key} style={{ width: '100%' }}>
            {/* Expanded Item */}
            <Animated.View style={[styles.expandedItemWrapper, itemAnimatedStyle, { display: status === 'expanded' ? 'flex' : 'none'}]}>
              <FAB
                icon={item.icon}
                label={item.label}
                onPress={item.onPress}
                style={[
                  styles.expandedFab,
                  isActive && styles.activeExpandedFab,
                ]}
                theme={{ roundness: theme.roundness * 3 }}
                color={isActive ? theme.colors.secondary : theme.colors.onSurfaceVariant}
                accessibilityLabel={item.ariaLabel || item.label}
                accessibilityRole="button"
                accessibilityState={{ selected: isActive }}
                testID={item.testID}
              />
              {item.badge && (
                <Badge
                  style={[badgeStyles.style, styles.expandedBadgeOffset]}
                  size={badgeStyles.RNPBadgeSize}
                  visible={status === 'expanded'} // Show badge only when expanded item is visible
                >
                  {item.badge.label}
                </Badge>
              )}
            </Animated.View>

            {/* Collapsed Item */}
            <Animated.View style={[{ display: status === 'collapsed' ? 'flex' : 'none' }, collapsedItemAnimatedStyle]}>
              <TouchableRipple
                onPress={item.onPress}
                style={[
                  styles.itemContainer,
                  isActive && styles.activeItemBackground,
                ]}
                accessibilityLabel={item.ariaLabel || item.label}
                accessibilityRole="button"
                accessibilityState={{ selected: isActive }}
                testID={item.testID}
                borderless
              >
                <View style={styles.itemContent}>
                  <View style={[styles.iconContainer, isActive && styles.activeIconContainer]}>
                    <Icon
                      source={item.icon}
                      size={24}
                      color={isActive ? theme.colors.onSecondaryContainer : theme.colors.onSurfaceVariant}
                    />
                    {item.badge && (
                      <Badge
                        style={badgeStyles.style}
                        size={badgeStyles.RNPBadgeSize}
                        visible={status === 'collapsed'} // Show badge only when collapsed item is visible
                      >
                        {item.badge.label}
                      </Badge>
                    )}
                  </View>
                  <Text
                    variant="labelMedium"
                    style={[
                      styles.label,
                      isActive && styles.activeLabel,
                    ]}
                    numberOfLines={1}
                  >
                    {item.label}
                  </Text>
                </View>
              </TouchableRipple>
            </Animated.View>
          </View>
        );
      })}
    </Animated.View>
  );

  if (variant === 'modal') {
    return (
      <>
        {/* Button to toggle modal visibility, only visible when modal is closed */}
        {variant === 'modal' && !isModalOpen && (
          <Portal>
            <IconButton
              icon={'menu'}
              onPress={toggleModalVisibility}
              style={styles.fixedGlobalMenuButton}
              size={24}
              accessibilityLabel={"Open navigation modal"}
            />
          </Portal>
        )}

        {/* The Modal itself, containing the railContent */}
        {variant === 'modal' && ( // Modal and its content only relevant for modal variant
          <Portal>
          <Modal
            visible={isModalOpen} // Controlled by internal state
            onDismiss={() => {
              setIsModalOpen(false);
              if (onDismiss) { // Call external onDismiss if provided
                onDismiss();
              }
            }}
            contentContainerStyle={styles.modalContentContainer}
            style={{ alignItems: 'flex-start' }}
          >
            {railContent}
          </Modal>
          </Portal>
        )}
      </>
    );
  }

  // Standard variant
  return railContent; // This should only be returned if not modal, or handled above.
                      // The current structure means if variant is not modal, it returns railContent.
                      // If variant is modal, it returns the modal structure (or null if not isModalOpen and no toggle button).
                      // This seems okay. The top-level return railContent is for standard.
});

NavigationRail.displayName = 'NavigationRail';
