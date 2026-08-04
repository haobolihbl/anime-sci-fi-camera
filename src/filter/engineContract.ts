import type { FilterParameters } from './preset';

export type FaceGeometry = {
  landmarks: Float32Array;
  blendShapes: Float32Array;
  transformMatrix: Float32Array;
  timestampNs: number;
};

export type RenderFrame = {
  textureHandle: number;
  width: number;
  height: number;
  rotation: 0 | 90 | 180 | 270;
  timestampNs: number;
};

export type RenderedFrame = RenderFrame & {
  colorSpace: 'srgb' | 'display-p3';
};

export type FilterEngineStatus =
  | 'prototype-preview'
  | 'native-renderer-ready'
  | 'recording';

/**
 * The contract the native Metal (iOS) and OpenGL/Vulkan (Android) renderers
 * implement. The same rendered texture must feed both preview and encoder so
 * the saved video exactly matches what the user sees.
 */
export interface NativeStyleRenderer {
  status: FilterEngineStatus;
  configure(parameters: FilterParameters): Promise<void>;
  render(input: RenderFrame, face: FaceGeometry | null): RenderedFrame;
  attachEncoder(outputPath: string, width: number, height: number): Promise<void>;
  detachEncoder(): Promise<void>;
  dispose(): void;
}

export const STYLE_PIPELINE = [
  'MediaPipe face mesh + expression tracking',
  'identity-preserving anime geometry and skin shading',
  'soft cinematic key/rim light with temporal smoothing',
  'face-occluded hologram, particles and volumetric digital light',
  'single GPU texture fan-out to preview and video encoder',
] as const;
