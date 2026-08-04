import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import {
  asPercent,
  type FilterParameterKey,
  type FilterParameters,
} from '../filter/preset';
import { colors } from '../theme/colors';

type Props = {
  parameters: FilterParameters;
  onAdjust: (key: FilterParameterKey, delta: number) => void;
  onReset: () => void;
};

const LABELS: Array<{ key: FilterParameterKey; label: string }> = [
  { key: 'identity', label: '本人相似' },
  { key: 'anime', label: '动漫化' },
  { key: 'softLight', label: '柔光' },
  { key: 'digital', label: '数字感' },
];

export function ParameterPanel({ parameters, onAdjust, onReset }: Props) {
  return (
    <View style={styles.panel}>
      <View style={styles.titleRow}>
        <Text style={styles.title}>角色风格</Text>
        <Pressable hitSlop={8} onPress={onReset}>
          <Text style={styles.reset}>恢复建议值</Text>
        </Pressable>
      </View>
      <View style={styles.parameterRow}>
        {LABELS.map(({ key, label }) => (
          <View key={key} style={styles.parameter}>
            <Text numberOfLines={1} style={styles.label}>
              {label}
            </Text>
            <View style={styles.stepper}>
              <Pressable
                accessibilityLabel={`降低${label}`}
                hitSlop={8}
                onPress={() => onAdjust(key, -0.05)}>
                <Text style={styles.step}>−</Text>
              </Pressable>
              <Text style={styles.value}>{asPercent(parameters[key])}</Text>
              <Pressable
                accessibilityLabel={`提高${label}`}
                hitSlop={8}
                onPress={() => onAdjust(key, 0.05)}>
                <Text style={styles.step}>＋</Text>
              </Pressable>
            </View>
            <View style={styles.track}>
              <View
                style={[styles.fill, { width: `${parameters[key] * 100}%` }]}
              />
            </View>
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  panel: {
    marginHorizontal: 12,
    marginTop: 10,
    paddingHorizontal: 14,
    paddingTop: 10,
    paddingBottom: 11,
    borderRadius: 18,
    backgroundColor: colors.panel,
    borderWidth: 1,
    borderColor: colors.hairline,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 9,
  },
  title: { color: colors.text, fontSize: 13, fontWeight: '700' },
  reset: { color: colors.cyan, fontSize: 11, fontWeight: '600' },
  parameterRow: { flexDirection: 'row', gap: 12 },
  parameter: { flex: 1, minWidth: 0 },
  label: {
    color: colors.textMuted,
    fontSize: 10,
    textAlign: 'center',
    marginBottom: 3,
  },
  stepper: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  step: { color: colors.cyan, fontSize: 16, fontWeight: '500' },
  value: { color: colors.text, fontSize: 12, fontVariant: ['tabular-nums'] },
  track: {
    height: 2,
    marginTop: 4,
    borderRadius: 2,
    overflow: 'hidden',
    backgroundColor: colors.panelRaised,
  },
  fill: { height: 2, backgroundColor: colors.violet },
});
