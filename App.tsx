import React, {
  useCallback,
  useEffect,
  useMemo,
  useReducer,
  useRef,
  useState,
} from 'react';
import {
  AppState,
  Pressable,
  StatusBar,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
} from 'react-native';
import {
  Camera,
  type Recorder,
  useCameraDevice,
  useCameraPermission,
  useMicrophonePermission,
  useVideoOutput,
} from 'react-native-vision-camera';
import {
  SafeAreaProvider,
  useSafeAreaInsets,
} from 'react-native-safe-area-context';
import { FilterPreviewOverlay } from './src/components/FilterPreviewOverlay';
import { ParameterPanel } from './src/components/ParameterPanel';
import { PermissionGate } from './src/components/PermissionGate';
import { type FilterParameterKey } from './src/filter/preset';
import {
  cameraReducer,
  initialCameraModel,
} from './src/state/cameraModel';
import { colors } from './src/theme/colors';
import {
  fitInside,
  previewRatio,
  recordingTarget,
} from './src/utils/cameraSizing';

function useRecordingClock(phase: string, startedAt?: number) {
  const [elapsed, setElapsed] = useState(0);
  useEffect(() => {
    if (phase !== 'recording' || !startedAt) {
      setElapsed(0);
      return;
    }
    const tick = () => setElapsed(Math.floor((Date.now() - startedAt) / 1000));
    tick();
    const timer = setInterval(tick, 500);
    return () => clearInterval(timer);
  }, [phase, startedAt]);
  const minutes = Math.floor(elapsed / 60)
    .toString()
    .padStart(2, '0');
  const seconds = (elapsed % 60).toString().padStart(2, '0');
  return `${minutes}:${seconds}`;
}

function CameraStudio() {
  const insets = useSafeAreaInsets();
  const window = useWindowDimensions();
  const [model, dispatch] = useReducer(cameraReducer, initialCameraModel);
  const [appIsActive, setAppIsActive] = useState(true);
  const cameraPermission = useCameraPermission();
  const microphonePermission = useMicrophonePermission();
  const device = useCameraDevice(model.lens);
  const recorderRef = useRef<Recorder | null>(null);
  const target = recordingTarget(model.aspect);
  const videoOutput = useVideoOutput({
    targetResolution: target,
    targetBitRate: 12_000_000,
    enableAudio: microphonePermission.hasPermission,
    fileType: 'mp4',
  });
  const outputs = useMemo(() => [videoOutput], [videoOutput]);
  const clock = useRecordingClock(
    model.recording.phase,
    model.recording.startedAt,
  );

  const stopRecording = useCallback(async () => {
    const recorder = recorderRef.current;
    if (!recorder?.isRecording) {
      return;
    }
    dispatch({ type: 'RECORD_STOPPING' });
    try {
      await recorder.stopRecording();
    } catch (error) {
      dispatch({
        type: 'RECORD_FAILED',
        message: error instanceof Error ? error.message : '停止录像失败',
      });
    }
  }, []);

  useEffect(() => {
    const subscription = AppState.addEventListener('change', nextState => {
      const active = nextState === 'active';
      setAppIsActive(active);
      if (!active) {
        stopRecording();
      }
    });
    return () => subscription.remove();
  }, [stopRecording]);

  const requestPermissions = useCallback(async () => {
    if (cameraPermission.canRequestPermission) {
      await cameraPermission.requestPermission();
    }
    if (microphonePermission.canRequestPermission) {
      await microphonePermission.requestPermission();
    }
  }, [cameraPermission, microphonePermission]);

  const startRecording = useCallback(async () => {
    dispatch({ type: 'RECORD_PREPARE' });
    try {
      const recorder = await videoOutput.createRecorder({ maxDuration: 1800 });
      recorderRef.current = recorder;
      await recorder.startRecording(
        filePath => {
          recorderRef.current = null;
          dispatch({ type: 'RECORD_FINISHED', filePath });
        },
        error => {
          recorderRef.current = null;
          dispatch({ type: 'RECORD_FAILED', message: error.message });
        },
      );
      dispatch({ type: 'RECORD_STARTED', startedAt: Date.now() });
    } catch (error) {
      recorderRef.current = null;
      dispatch({
        type: 'RECORD_FAILED',
        message: error instanceof Error ? error.message : '启动录像失败',
      });
    }
  }, [videoOutput]);

  const toggleRecording = useCallback(() => {
    if (model.recording.phase === 'recording') {
      stopRecording();
    } else if (
      model.recording.phase === 'idle' ||
      model.recording.phase === 'error'
    ) {
      startRecording();
    }
  }, [model.recording.phase, startRecording, stopRecording]);

  const adjustFilter = useCallback(
    (key: FilterParameterKey, delta: number) =>
      dispatch({ type: 'ADJUST_FILTER', key, delta }),
    [],
  );

  if (!cameraPermission.hasPermission) {
    return (
      <PermissionGate
        canRequest={cameraPermission.canRequestPermission}
        onRequest={requestPermissions}
      />
    );
  }

  const reservedHeight = 236 + insets.top + insets.bottom;
  const previewSize = fitInside(
    previewRatio(model.aspect),
    Math.max(240, window.width - 24),
    Math.max(220, window.height - reservedHeight),
  );
  const isBusy =
    model.recording.phase === 'preparing' ||
    model.recording.phase === 'stopping';
  const isRecording = model.recording.phase === 'recording';

  return (
    <View
      style={[
        styles.screen,
        { paddingTop: insets.top, paddingBottom: insets.bottom },
      ]}>
      <StatusBar barStyle="light-content" backgroundColor={colors.ink} />
      <View style={styles.header}>
        <View>
          <Text style={styles.brand}>NEO CEL // 01</Text>
          <Text style={styles.subhead}>柔光角色 · 数字空间</Text>
        </View>
        <View style={styles.headerActions}>
          <Pressable
            disabled={isBusy || isRecording}
            onPress={() => dispatch({ type: 'TOGGLE_LENS' })}
            style={styles.headerButton}>
            <Text style={styles.headerButtonText}>
              {model.lens === 'front' ? '前置' : '后置'} ↻
            </Text>
          </Pressable>
        </View>
      </View>

      <View style={styles.previewArea}>
        <View
          style={[
            styles.cameraFrame,
            { width: previewSize.width, height: previewSize.height },
          ]}>
          {device ? (
            <Camera
              style={StyleSheet.absoluteFill}
              device={device}
              outputs={outputs}
              isActive={appIsActive}
              mirrorMode="auto"
              resizeMode="cover"
              enableNativeTapToFocusGesture
              enableNativeZoomGesture
              onError={error =>
                dispatch({ type: 'RECORD_FAILED', message: error.message })
              }
            />
          ) : (
            <View style={styles.noCamera}>
              <Text style={styles.noCameraText}>正在连接相机…</Text>
            </View>
          )}
          <FilterPreviewOverlay parameters={model.parameters} />
          <View style={styles.previewMeta}>
            <View style={styles.livePill}>
              <View
                style={[styles.liveDot, isRecording && styles.liveDotRecording]}
              />
              <Text style={styles.liveText}>
                {isRecording ? clock : 'STYLE PREVIEW'}
              </Text>
            </View>
            <Text style={styles.formatText}>
              {target.width}×{target.height}
            </Text>
          </View>
        </View>
      </View>

      <View style={styles.controlRow}>
        <View style={styles.segmented}>
          {(['9:16', '16:9'] as const).map(aspect => (
            <Pressable
              key={aspect}
              disabled={isBusy || isRecording}
              onPress={() => dispatch({ type: 'SET_ASPECT', aspect })}
              style={[
                styles.segment,
                model.aspect === aspect && styles.segmentActive,
              ]}>
              <Text
                style={[
                  styles.segmentText,
                  model.aspect === aspect && styles.segmentTextActive,
                ]}>
                {aspect}
              </Text>
            </Pressable>
          ))}
        </View>

        <Pressable
          accessibilityLabel={isRecording ? '停止录像' : '开始录像'}
          disabled={isBusy || !device}
          onPress={toggleRecording}
          style={[
            styles.recordOuter,
            isBusy && styles.recordDisabled,
            isRecording && styles.recordOuterActive,
          ]}>
          <View
            style={[styles.recordInner, isRecording && styles.recordStop]}
          />
        </Pressable>

        <View style={styles.pipelineBadge}>
          <View style={styles.pipelineDot} />
          <Text style={styles.pipelineText}>GPU 接口</Text>
          <Text style={styles.pipelineSubtext}>已预留</Text>
        </View>
      </View>

      <ParameterPanel
        parameters={model.parameters}
        onAdjust={adjustFilter}
        onReset={() => dispatch({ type: 'RESET_FILTER' })}
      />

      {model.recording.error ? (
        <Pressable
          style={styles.errorBanner}
          onPress={() => dispatch({ type: 'CLEAR_ERROR' })}>
          <Text numberOfLines={2} style={styles.errorText}>
            {model.recording.error} · 点按关闭
          </Text>
        </Pressable>
      ) : null}
      {model.recording.lastFilePath ? (
        <Text numberOfLines={1} style={styles.savedText}>
          已保存本次录像：{model.recording.lastFilePath}
        </Text>
      ) : null}
    </View>
  );
}

export default function App() {
  return (
    <SafeAreaProvider>
      <CameraStudio />
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.ink },
  header: {
    height: 58,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  brand: {
    color: colors.text,
    fontSize: 13,
    fontWeight: '800',
    letterSpacing: 1.4,
  },
  subhead: { marginTop: 3, color: colors.textMuted, fontSize: 10 },
  headerActions: { flexDirection: 'row', gap: 8 },
  headerButton: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 999,
    backgroundColor: colors.panel,
    borderWidth: 1,
    borderColor: colors.hairline,
  },
  headerButtonText: { color: colors.text, fontSize: 11, fontWeight: '700' },
  previewArea: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  cameraFrame: {
    overflow: 'hidden',
    borderRadius: 22,
    backgroundColor: colors.panel,
    borderWidth: 1,
    borderColor: 'rgba(100, 233, 255, 0.34)',
  },
  noCamera: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  noCameraText: { color: colors.textMuted, fontSize: 13 },
  previewMeta: {
    position: 'absolute',
    left: 12,
    right: 12,
    bottom: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  livePill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 9,
    paddingVertical: 5,
    borderRadius: 999,
    backgroundColor: 'rgba(5, 7, 13, 0.64)',
  },
  liveDot: {
    width: 6,
    height: 6,
    borderRadius: 999,
    backgroundColor: colors.cyan,
  },
  liveDotRecording: { backgroundColor: colors.red },
  liveText: {
    color: colors.text,
    fontSize: 9,
    fontWeight: '800',
    letterSpacing: 0.8,
    fontVariant: ['tabular-nums'],
  },
  formatText: {
    color: colors.text,
    fontSize: 9,
    paddingHorizontal: 8,
    paddingVertical: 5,
    borderRadius: 999,
    backgroundColor: 'rgba(5, 7, 13, 0.64)',
  },
  controlRow: {
    height: 76,
    paddingHorizontal: 18,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  segmented: {
    width: 94,
    flexDirection: 'row',
    padding: 3,
    borderRadius: 12,
    backgroundColor: colors.panel,
  },
  segment: {
    flex: 1,
    paddingVertical: 7,
    alignItems: 'center',
    borderRadius: 9,
  },
  segmentActive: { backgroundColor: colors.panelRaised },
  segmentText: { color: colors.textMuted, fontSize: 10, fontWeight: '700' },
  segmentTextActive: { color: colors.cyan },
  recordOuter: {
    width: 66,
    height: 66,
    borderRadius: 999,
    borderWidth: 2,
    borderColor: colors.text,
    alignItems: 'center',
    justifyContent: 'center',
  },
  recordOuterActive: { borderColor: colors.red },
  recordDisabled: { opacity: 0.42 },
  recordInner: {
    width: 52,
    height: 52,
    borderRadius: 999,
    backgroundColor: colors.red,
  },
  recordStop: { width: 25, height: 25, borderRadius: 7 },
  pipelineBadge: { width: 94, alignItems: 'center' },
  pipelineDot: {
    width: 6,
    height: 6,
    marginBottom: 4,
    borderRadius: 999,
    backgroundColor: colors.violet,
  },
  pipelineText: { color: colors.text, fontSize: 10, fontWeight: '700' },
  pipelineSubtext: { marginTop: 2, color: colors.textMuted, fontSize: 9 },
  errorBanner: {
    position: 'absolute',
    left: 20,
    right: 20,
    bottom: 128,
    padding: 12,
    borderRadius: 12,
    backgroundColor: 'rgba(255, 73, 109, 0.92)',
  },
  errorText: { color: colors.text, fontSize: 12, textAlign: 'center' },
  savedText: {
    position: 'absolute',
    left: 20,
    right: 20,
    bottom: 5,
    color: colors.textMuted,
    fontSize: 9,
    textAlign: 'center',
  },
});
