import { useCallback, useEffect, useState } from "react";
import { Animated, Pressable, StyleSheet, View } from "react-native"; // Animated を react-native から import
import {
  Gesture,
  GestureDetector,
  GestureHandlerRootView,
} from "react-native-gesture-handler";
import { Icon } from "react-native-paper";
import type { IconSource } from "react-native-paper/lib/typescript/components/Icon";
import { useTheme } from "../hooks";

type SwitchProps = {
  selected: boolean;
  onPress: () => void;
  fluid?: boolean;
  switchOnIcon?: IconSource; // IconSource from 'react-native-paper/lib/typescript/components/Icon'
  switchOffIcon?: IconSource; // IconSource from 'react-native-paper/lib/typescript/components/Icon'
  disabled?: boolean;
};

export const Switch = ({
  selected,
  onPress,
  switchOnIcon = "check",
  switchOffIcon,
  disabled,
}: SwitchProps) => {
  const theme = useTheme();
  // useSharedValue を new Animated.Value() に置き換え
  const position = useState(new Animated.Value(selected ? 10 : -10))[0];
  const handleHeight = useState(new Animated.Value(selected ? 24 : 16))[0];
  const handleWidth = useState(new Animated.Value(selected ? 24 : 16))[0];
  const [active, setActive] = useState(selected);
  const [isPressed, setIsPressed] = useState(false);

  const onSwitchPress = useCallback(() => {
    onPress != null ? onPress() : null;
  }, [onPress]);

  // callbackFunction の宣言をここに関数呼び出しより前に移動
  const callbackFunction = useCallback(() => {
    onSwitchPress();
    setIsPressed(false);
  }, [onSwitchPress]);

  //#region
  const pan = Gesture.Pan()
    .activateAfterLongPress(100)
    .onTouchesUp(() => setIsPressed(false))
    .runOnJS(true)
    .hitSlop(disabled ? -30 : 0)
    .onStart(() => {
      setIsPressed(true);
      Animated.timing(handleHeight, {
        toValue: 28,
        duration: 160,
        useNativeDriver: false,
      }).start();
      Animated.timing(handleWidth, {
        toValue: 28,
        duration: 160,
        useNativeDriver: false,
      }).start();
    })
    .onChange(() => {
      // position._value の代わりに、setValue を使うので、ここでは何もしないか、
      // もしジェスチャー中にリアルタイムで追従させたいなら Animated.event を使う必要がある。
      // 今回は onEnd で最終位置を決めるので、onChange での position の直接更新は削除。
      // ただし、ジェスチャーの移動量をどこかで保持する必要があるかもしれない。
      // 一旦、onEnd での処理に任せる。
    })
    .onEnd((event) => {
      // event を受け取るように変更
      setIsPressed(false);
      // position の現在の値を取得するために stopAnimation を使う
      position.stopAnimation((currentPositionValue) => {
        const finalPosition = currentPositionValue + event.translationX / 10; // ジェスチャーの移動量を加味

        if (finalPosition > 0) {
          Animated.timing(position, {
            toValue: 10,
            duration: 250,
            useNativeDriver: false,
          }).start();
          Animated.timing(handleHeight, {
            toValue: 24,
            duration: 160,
            useNativeDriver: false,
          }).start();
          Animated.timing(handleWidth, {
            toValue: 24,
            duration: 160,
            useNativeDriver: false,
          }).start(({ finished }) => {
            // finished の型を明示
            if (finished && !active) {
              callbackFunction();
            }
          });
        } else {
          // 0以下の場合
          Animated.timing(position, {
            toValue: -10,
            duration: 250,
            useNativeDriver: false,
          }).start();
          Animated.timing(handleHeight, {
            toValue: 16,
            duration: 160,
            useNativeDriver: false,
          }).start();
          Animated.timing(handleWidth, {
            toValue: 16,
            duration: 160,
            useNativeDriver: false,
          }).start(({ finished }) => {
            // finished の型を明示
            if (finished && active) {
              callbackFunction();
            }
          });
        }
      });
    });
  //#endregion

  // スタイル定義を StyleSheet.create にまとめる
  const styles = StyleSheet.create({
    handleStyle: {
      // transform: [{ translateX: position }], // StyleSheet内では直接Animated.Valueをtransformに使えないことがある
      // height: handleHeight,
      // width: handleWidth,
      marginVertical: "auto",
      minHeight: switchOffIcon ? 24 : 16,
      minWidth: switchOffIcon ? 24 : 16,
      // backgroundColor: position.interpolate(...) // StyleSheet内では直接interpolateを使えない
      borderRadius: 20,
      justifyContent: "center",
      alignItems: "center",
      // opacity: disabled ? (active ? 1 : 0.36) : 1,
    },
    trackStyle: {
      alignItems: "center",
      // backgroundColor: position.interpolate(...)
      // borderColor: position.interpolate(...)
      borderWidth: 2,
      borderRadius: 16,
      justifyContent: "center",
      height: 32,
      width: 52,
      // opacity: disabled ? 0.12 : 1,
    },
    handleOutlineStyle: {
      height: 40,
      width: 40,
      borderRadius: 20,
      position: "absolute",
      // transform: [{ translateX: position }],
      // backgroundColor: !isPressed ? "transparent" : position.interpolate(...)
      alignItems: "center",
      opacity: 0.18,
      justifyContent: "center",
    },
    iconOnStyle: {
      // opacity: position.interpolate(...)
      overflow: "hidden",
      // transform: [ ... ]
    },
    iconOffStyle: {
      position: "absolute",
      // opacity: position.interpolate(...)
      overflow: "hidden",
      // transform: [ ... ]
    },
    stateOuter: {
      // 元々あったstyles.stateOuterもここに含める
      justifyContent: "center",
      height: 32,
      width: 52,
      alignItems: "center",
      position: "absolute",
    },
  });

  // Animated.View に渡すスタイルは、StyleSheet.createの外で動的に生成する必要があるものを組み合わせる
  const getHandleAnimatedStyle = () => ({
    ...styles.handleStyle,
    transform: [{ translateX: position }],
    height: handleHeight,
    width: handleWidth,
    backgroundColor: position.interpolate({
      inputRange: [-10, 10],
      outputRange: [theme.colors.outline, theme.colors.onPrimary],
    }),
    opacity: disabled ? (active ? 1 : 0.36) : 1,
  });

  const getTrackAnimatedStyle = () => ({
    ...styles.trackStyle,
    backgroundColor: position.interpolate({
      inputRange: [-10, 10],
      outputRange: [theme.colors.surfaceVariant, theme.colors.primary],
    }),
    borderColor: position.interpolate({
      inputRange: [-10, 10],
      outputRange: [theme.colors.outline, theme.colors.primary],
    }),
    opacity: disabled ? 0.12 : 1,
  });

  const getHandleOutlineAnimatedStyle = () => ({
    ...styles.handleOutlineStyle,
    transform: [{ translateX: position }],
    backgroundColor: !isPressed
      ? "transparent"
      : position.interpolate({
          inputRange: [-10, 10],
          outputRange: [theme.colors.onSurface, theme.colors.primary],
        }),
  });

  const getIconOnAnimatedStyle = () => ({
    ...styles.iconOnStyle,
    opacity: position.interpolate({
      inputRange: [0, 10],
      outputRange: [0, 1],
      extrapolate: "clamp",
    }),
    transform: [
      {
        scale: position.interpolate({
          inputRange: [0, 10],
          outputRange: [0, 1],
          extrapolate: "clamp",
        }),
      },
      {
        rotate: position.interpolate({
          inputRange: [0, 10],
          outputRange: ["-90deg", "0deg"],
          extrapolate: "clamp",
        }),
      },
    ],
  });

  const getIconOffAnimatedStyle = () => ({
    ...styles.iconOffStyle,
    opacity: position.interpolate({
      inputRange: [-10, 0],
      outputRange: [1, 0],
      extrapolate: "clamp",
    }),
    transform: [
      {
        scale: position.interpolate({
          inputRange: [-10, 0],
          outputRange: [1, 0],
          extrapolate: "clamp",
        }),
      },
      {
        rotate: position.interpolate({
          inputRange: [-10, 0],
          outputRange: ["-90deg", "0deg"],
          extrapolate: "clamp",
        }),
      },
    ],
  });

  // const callbackFunction = () => { // 上に移動したのでここは削除
  //   onSwitchPress();
  //   setIsPressed(false);
  // };

  const changeSwitch = useCallback(
    (withCallback: boolean) => {
      if (active) {
        Animated.timing(handleHeight, {
          toValue: 16,
          duration: 100,
          useNativeDriver: false,
        }).start();
        Animated.timing(handleWidth, {
          toValue: 16,
          duration: 100,
          useNativeDriver: false,
        }).start();
        Animated.timing(position, {
          toValue: -10,
          duration: 250,
          useNativeDriver: false,
        }).start(
          withCallback
            ? (finished) => {
                if (finished) {
                  callbackFunction(); // runOnJS は不要
                }
              }
            : undefined,
        );
        setActive(false);
      } else {
        Animated.timing(handleHeight, {
          toValue: 24,
          duration: 100,
          useNativeDriver: false,
        }).start();
        Animated.timing(handleWidth, {
          toValue: 24,
          duration: 100,
          useNativeDriver: false,
        }).start();
        Animated.timing(position, {
          toValue: 10,
          duration: 250,
          useNativeDriver: false,
        }).start(
          withCallback
            ? (finished) => {
                if (finished) {
                  callbackFunction(); // runOnJS は不要
                }
              }
            : undefined,
        );
        setActive(true);
      }
    },
    [active, handleHeight, handleWidth, position, callbackFunction],
  );

  const init = useCallback(() => {
    if (active !== selected) {
      changeSwitch(false);
    }
    Animated.timing(handleHeight, {
      toValue: selected ? 24 : 16,
      duration: 100,
      useNativeDriver: false,
    }).start();
    Animated.timing(handleWidth, {
      toValue: selected ? 24 : 16,
      duration: 100,
      useNativeDriver: false,
    }).start();
  }, [selected, handleHeight, handleWidth, active, changeSwitch]);

  useEffect(() => {
    init();
  }, [init]);
  return (
    <View style={{ borderRadius: 20, backgroundColor: theme.colors.surface }}>
      <View pointerEvents="none" style={styles.stateOuter}>
        <Animated.View style={getHandleOutlineAnimatedStyle()} key={3} />
      </View>
      <Animated.View style={getTrackAnimatedStyle()} key={1}>
        <GestureHandlerRootView>
          <GestureDetector gesture={pan}>
            <Pressable
              disabled={disabled}
              style={{
                // Pressable の style は静的なので StyleSheet.create に移しても良い
                justifyContent: "center",
                height: 32,
                width: 52,
                alignItems: "center",
              }}
              onLongPress={() => {
                Animated.timing(handleHeight, {
                  toValue: 28,
                  duration: 100,
                  useNativeDriver: false,
                }).start();
                Animated.timing(handleWidth, {
                  toValue: 28,
                  duration: 100,
                  useNativeDriver: false,
                }).start();
              }}
              onPress={() => {
                setIsPressed(true);
                changeSwitch(true);
              }}
            />
          </GestureDetector>
        </GestureHandlerRootView>
      </Animated.View>
      <View pointerEvents="none" style={styles.stateOuter}>
        <Animated.View style={getHandleAnimatedStyle()} key={2}>
          {switchOnIcon ? (
            <Animated.View key={10} style={getIconOnAnimatedStyle()}>
              <Icon
                source={switchOnIcon}
                size={16}
                color={
                  disabled
                    ? theme.colors.onSurface
                    : theme.colors.onPrimaryContainer
                }
              />
            </Animated.View>
          ) : null}
          {switchOffIcon ? (
            <Animated.View key={9} style={getIconOffAnimatedStyle()}>
              <Icon
                source={switchOffIcon}
                size={16}
                color={theme.colors.surface}
              />
            </Animated.View>
          ) : null}
        </Animated.View>
      </View>
    </View>
  );
};
