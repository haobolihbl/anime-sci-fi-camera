import {
  cameraReducer,
  initialCameraModel,
} from '../src/state/cameraModel';
import { FILTER_LIMITS } from '../src/filter/preset';
import {
  fitInside,
  previewRatio,
  recordingTarget,
} from '../src/utils/cameraSizing';

describe('camera model', () => {
  it('starts with the approved portrait/front-camera preset', () => {
    expect(initialCameraModel.aspect).toBe('9:16');
    expect(initialCameraModel.lens).toBe('front');
    expect(initialCameraModel.parameters.anime).toBeGreaterThan(0.7);
    expect(initialCameraModel.parameters.digital).toBeGreaterThan(0.8);
  });

  it('locks lens and aspect changes during recording', () => {
    const recording = cameraReducer(initialCameraModel, {
      type: 'RECORD_STARTED',
      startedAt: 100,
    });
    expect(
      cameraReducer(recording, { type: 'SET_ASPECT', aspect: '16:9' }),
    ).toBe(recording);
    expect(cameraReducer(recording, { type: 'TOGGLE_LENS' })).toBe(recording);
  });

  it('clamps style parameters to safe visual limits', () => {
    let model = initialCameraModel;
    for (let index = 0; index < 30; index += 1) {
      model = cameraReducer(model, {
        type: 'ADJUST_FILTER',
        key: 'anime',
        delta: 0.05,
      });
    }
    expect(model.parameters.anime).toBe(FILTER_LIMITS.anime.max);
  });

  it('returns to idle with the completed file path', () => {
    const completed = cameraReducer(initialCameraModel, {
      type: 'RECORD_FINISHED',
      filePath: '/tmp/clip.mp4',
    });
    expect(completed.recording).toEqual({
      phase: 'idle',
      lastFilePath: '/tmp/clip.mp4',
    });
  });
});

describe('camera sizing', () => {
  it('uses full-HD portrait and landscape recording targets', () => {
    expect(recordingTarget('9:16')).toEqual({ width: 1080, height: 1920 });
    expect(recordingTarget('16:9')).toEqual({ width: 1920, height: 1080 });
  });

  it('fits the selected ratio without overflowing its viewport', () => {
    const portrait = fitInside(previewRatio('9:16'), 360, 540);
    expect(portrait.width).toBeLessThanOrEqual(360);
    expect(portrait.height).toBeLessThanOrEqual(540);
    expect(portrait.width / portrait.height).toBeCloseTo(9 / 16);
  });
});
