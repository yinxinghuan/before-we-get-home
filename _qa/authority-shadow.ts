import assert from 'node:assert/strict'
import { beforeWeGetHome } from '../src/story/cartridges/beforeWeGetHome'
import { createAuthorityShadowSample } from '../src/story/engine/authorityShadow'
import { createInitialSave } from '../src/story/engine/reducer'
const save = createInitialSave(beforeWeGetHome); const visible = JSON.stringify(save.choices); const sample = createAuthorityShadowSample(save, beforeWeGetHome)
assert.equal(JSON.stringify(save.choices), visible); assert.equal(sample.choices.length, save.choices.length); assert.equal(sample.emptyTray, false); assert.ok(sample.choices.every((choice) => ['accepted', 'rejected', 'open'].includes(choice.status))); assert.equal(createAuthorityShadowSample({ ...save, entered: true, choices: [], sessionEnded: false }, beforeWeGetHome).emptyTray, true)
console.log('before-we-get-home authority shadow is observational: ok')
