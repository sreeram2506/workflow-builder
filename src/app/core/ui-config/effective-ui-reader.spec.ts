import { describe, expect, it } from 'vitest';
import { signal } from '@angular/core';
import { createDefaultUiFeatures, mergeUiFeatures } from './merge-ui-features';
import { createEffectiveUiReader } from './effective-ui-reader';

describe('createEffectiveUiReader', () => {
  it('reads known paths from features signal updates', () => {
    const features = signal(createDefaultUiFeatures());
    const reader = createEffectiveUiReader(() => features());
    expect(reader.is('agentsLibrary.enabled')).toBe(true);

    features.set(
      mergeUiFeatures(createDefaultUiFeatures(), { agentsLibrary: { enabled: false } }),
    );
    expect(reader.is('agentsLibrary.enabled')).toBe(false);
    expect(reader.features().agentsLibrary.enabled).toBe(false);
  });

  it('fail-opens unknown paths', () => {
    const reader = createEffectiveUiReader(() => createDefaultUiFeatures());
    expect(reader.is('not.a.real.path')).toBe(true);
  });
});
