import {
  adjustFilterParameter,
  APPROVED_PRESET,
  type FilterParameterKey,
  type FilterParameters,
} from '../filter/preset';

export type AspectMode = '9:16' | '16:9';
export type LensPosition = 'front' | 'back';
export type RecordingPhase =
  | 'idle'
  | 'preparing'
  | 'recording'
  | 'stopping'
  | 'error';

export type CameraModel = {
  aspect: AspectMode;
  lens: LensPosition;
  parameters: FilterParameters;
  recording: {
    phase: RecordingPhase;
    startedAt?: number;
    lastFilePath?: string;
    error?: string;
  };
};

export type CameraAction =
  | { type: 'SET_ASPECT'; aspect: AspectMode }
  | { type: 'TOGGLE_LENS' }
  | { type: 'ADJUST_FILTER'; key: FilterParameterKey; delta: number }
  | { type: 'RESET_FILTER' }
  | { type: 'RECORD_PREPARE' }
  | { type: 'RECORD_STARTED'; startedAt: number }
  | { type: 'RECORD_STOPPING' }
  | { type: 'RECORD_FINISHED'; filePath: string }
  | { type: 'RECORD_FAILED'; message: string }
  | { type: 'CLEAR_ERROR' };

export const initialCameraModel: CameraModel = {
  aspect: '9:16',
  lens: 'front',
  parameters: APPROVED_PRESET,
  recording: { phase: 'idle' },
};

const canReconfigure = (model: CameraModel) =>
  model.recording.phase === 'idle' || model.recording.phase === 'error';

export function cameraReducer(
  model: CameraModel,
  action: CameraAction,
): CameraModel {
  switch (action.type) {
    case 'SET_ASPECT':
      return canReconfigure(model) ? { ...model, aspect: action.aspect } : model;
    case 'TOGGLE_LENS':
      return canReconfigure(model)
        ? { ...model, lens: model.lens === 'front' ? 'back' : 'front' }
        : model;
    case 'ADJUST_FILTER':
      return {
        ...model,
        parameters: adjustFilterParameter(
          model.parameters,
          action.key,
          action.delta,
        ),
      };
    case 'RESET_FILTER':
      return { ...model, parameters: APPROVED_PRESET };
    case 'RECORD_PREPARE':
      return canReconfigure(model)
        ? { ...model, recording: { phase: 'preparing' } }
        : model;
    case 'RECORD_STARTED':
      return {
        ...model,
        recording: { phase: 'recording', startedAt: action.startedAt },
      };
    case 'RECORD_STOPPING':
      return model.recording.phase === 'recording'
        ? { ...model, recording: { ...model.recording, phase: 'stopping' } }
        : model;
    case 'RECORD_FINISHED':
      return {
        ...model,
        recording: { phase: 'idle', lastFilePath: action.filePath },
      };
    case 'RECORD_FAILED':
      return {
        ...model,
        recording: { phase: 'error', error: action.message },
      };
    case 'CLEAR_ERROR':
      return model.recording.phase === 'error'
        ? { ...model, recording: { phase: 'idle' } }
        : model;
    default:
      return model;
  }
}
