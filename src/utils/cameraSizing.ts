import type { AspectMode } from '../state/cameraModel';

export type Size = { width: number; height: number };

export function recordingTarget(aspect: AspectMode): Size {
  return aspect === '9:16'
    ? { width: 1080, height: 1920 }
    : { width: 1920, height: 1080 };
}

export function previewRatio(aspect: AspectMode): number {
  return aspect === '9:16' ? 9 / 16 : 16 / 9;
}

export function fitInside(
  ratio: number,
  availableWidth: number,
  availableHeight: number,
): Size {
  const widthFromHeight = availableHeight * ratio;
  if (widthFromHeight <= availableWidth) {
    return { width: widthFromHeight, height: availableHeight };
  }
  return { width: availableWidth, height: availableWidth / ratio };
}
