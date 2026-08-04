import React from 'react';
import { Linking, Pressable, StyleSheet, Text, View } from 'react-native';
import { colors } from '../theme/colors';

type Props = {
  canRequest: boolean;
  onRequest: () => void;
};

export function PermissionGate({ canRequest, onRequest }: Props) {
  return (
    <View style={styles.screen}>
      <View style={styles.orb} />
      <Text style={styles.eyebrow}>ANIME // SCI-FI CAMERA</Text>
      <Text style={styles.title}>让本人藏进角色里</Text>
      <Text style={styles.copy}>
        相机会保留你的辨识度，再叠加偏动漫的角色质感、自然柔光与立体数字光效。
      </Text>
      <Pressable
        style={styles.button}
        onPress={canRequest ? onRequest : () => Linking.openSettings()}>
        <Text style={styles.buttonText}>
          {canRequest ? '开启相机与麦克风' : '前往系统设置授权'}
        </Text>
      </Pressable>
      <Text style={styles.note}>原始画面默认在设备本地处理</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    paddingHorizontal: 34,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.ink,
  },
  orb: {
    width: 112,
    height: 112,
    marginBottom: 32,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: colors.cyan,
    backgroundColor: colors.violetSoft,
    shadowColor: colors.cyan,
    shadowOpacity: 0.7,
    shadowRadius: 28,
  },
  eyebrow: {
    color: colors.cyan,
    fontSize: 11,
    letterSpacing: 2,
    fontWeight: '700',
  },
  title: {
    marginTop: 13,
    color: colors.text,
    fontSize: 28,
    fontWeight: '800',
  },
  copy: {
    marginTop: 14,
    color: colors.textMuted,
    fontSize: 15,
    lineHeight: 24,
    textAlign: 'center',
  },
  button: {
    marginTop: 30,
    minWidth: 220,
    paddingHorizontal: 22,
    paddingVertical: 14,
    borderRadius: 999,
    alignItems: 'center',
    backgroundColor: colors.cyan,
  },
  buttonText: { color: colors.ink, fontSize: 14, fontWeight: '800' },
  note: { marginTop: 14, color: colors.textMuted, fontSize: 11 },
});
