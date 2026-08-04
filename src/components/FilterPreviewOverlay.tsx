import React from 'react';
import { StyleSheet, View } from 'react-native';
import type { FilterParameters } from '../filter/preset';
import { colors } from '../theme/colors';

type Props = {
  parameters: FilterParameters;
};

/**
 * A deliberately lightweight preview guide. The production Metal/OpenGL
 * renderer replaces this layer and feeds its result to both preview + encoder.
 */
export function FilterPreviewOverlay({ parameters }: Props) {
  return (
    <View pointerEvents="none" style={StyleSheet.absoluteFill}>
      <View
        style={[
          styles.softKeyLight,
          { opacity: 0.08 + parameters.softLight * 0.12 },
        ]}
      />
      <View
        style={[
          styles.rimLight,
          { opacity: 0.15 + parameters.digital * 0.22 },
        ]}
      />
      <View style={styles.faceGuide}>
        <View style={styles.faceGuideInner} />
      </View>
      <View style={[styles.scanLine, { opacity: parameters.digital * 0.5 }]} />
      <View style={styles.cornerTopLeft} />
      <View style={styles.cornerTopRight} />
      <View style={styles.cornerBottomLeft} />
      <View style={styles.cornerBottomRight} />
      <View
        style={[
          styles.hologramChip,
          { opacity: 0.18 + parameters.digital * 0.34 },
        ]}
      />
      <View
        style={[
          styles.hologramChipSmall,
          { opacity: 0.12 + parameters.digital * 0.28 },
        ]}
      />
    </View>
  );
}

const corner = {
  position: 'absolute' as const,
  width: 30,
  height: 30,
  borderColor: colors.cyan,
  opacity: 0.82,
};

const styles = StyleSheet.create({
  softKeyLight: {
    position: 'absolute',
    top: '-8%',
    right: '-18%',
    width: '72%',
    height: '66%',
    borderRadius: 999,
    backgroundColor: '#FFF2D9',
  },
  rimLight: {
    position: 'absolute',
    left: '-22%',
    bottom: '8%',
    width: '56%',
    height: '54%',
    borderRadius: 999,
    backgroundColor: colors.cyan,
  },
  faceGuide: {
    position: 'absolute',
    width: '45%',
    aspectRatio: 0.76,
    alignSelf: 'center',
    top: '20%',
    borderRadius: 999,
    borderWidth: 1,
    borderColor: 'rgba(100, 233, 255, 0.24)',
  },
  faceGuideInner: {
    flex: 1,
    margin: 7,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: 'rgba(168, 134, 255, 0.18)',
  },
  scanLine: {
    position: 'absolute',
    left: '8%',
    right: '8%',
    top: '57%',
    height: 1,
    backgroundColor: colors.cyan,
    shadowColor: colors.cyan,
    shadowOpacity: 1,
    shadowRadius: 9,
  },
  cornerTopLeft: {
    ...corner,
    top: 18,
    left: 18,
    borderTopWidth: 2,
    borderLeftWidth: 2,
  },
  cornerTopRight: {
    ...corner,
    top: 18,
    right: 18,
    borderTopWidth: 2,
    borderRightWidth: 2,
  },
  cornerBottomLeft: {
    ...corner,
    bottom: 18,
    left: 18,
    borderBottomWidth: 2,
    borderLeftWidth: 2,
  },
  cornerBottomRight: {
    ...corner,
    right: 18,
    bottom: 18,
    borderRightWidth: 2,
    borderBottomWidth: 2,
  },
  hologramChip: {
    position: 'absolute',
    right: '8%',
    top: '31%',
    width: '20%',
    height: 24,
    borderWidth: 1,
    borderColor: colors.cyan,
    backgroundColor: colors.cyanSoft,
    transform: [{ skewX: '-16deg' }],
  },
  hologramChipSmall: {
    position: 'absolute',
    left: '10%',
    bottom: '25%',
    width: '13%',
    height: 10,
    borderWidth: 1,
    borderColor: colors.violet,
    backgroundColor: colors.violetSoft,
    transform: [{ skewX: '18deg' }],
  },
});
