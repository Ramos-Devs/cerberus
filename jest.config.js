import { createDefaultPreset } from 'ts-jest';
const tsJestTransformCfg = createDefaultPreset({
  tsconfig: 'tsconfig.json',
}).transform;

/** @type {import('jest').Config} */
export default {
  preset: 'ts-jest/presets/default-esm',
  transform: tsJestTransformCfg,
  testEnvironment: 'node',
  extensionsToTreatAsEsm: ['.ts'],
  moduleNameMapper: {
    '^(\\.{1,2}/.*)\\.js$': '$1',
  },
};
