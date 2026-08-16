import assert from 'node:assert/strict'
import { extractSceneImagePrompt, extractSceneImageSubject, parseStoryProtocol } from '../src/story/engine/protocol'

const scene = parseStoryProtocol(`The village road is fading.
[fact: id="road-witnessed" value="true"]
[fact: id="witness-pages" value="4"]
[choices: "Protect the witness"|"Inspect the road"|"Spend the seal"]`, 'en')

const facts = scene.commands.filter((command) => command.type === 'fact')
const choices = scene.commands.find((command) => command.type === 'choices')
assert.equal(scene.blocks.length, 1)
assert.equal(facts.length, 2)
assert.equal(facts[0].type === 'fact' && facts[0].value, true)
assert.equal(facts[1].type === 'fact' && facts[1].value, 4)
assert.deepEqual(choices?.type === 'choices' ? choices.choices : [], ['Protect the witness', 'Inspect the road', 'Spend the seal'])

const malformedImageMetadata = parseStoryProtocol(`雨停在半空，你看见两条仍可前进的路。
image_prompt:"SUBJECT A beneath suspended rain, no text"
image_subject:"player"
[choices: "沿路前进"|"检查悬雨"|"返回屋檐"]`, 'zh')
assert.deepEqual(malformedImageMetadata.blocks.map((block) => block.text), ['雨停在半空，你看见两条仍可前进的路。'])
assert.equal(extractSceneImageSubject(malformedImageMetadata.raw), 'player')
assert.equal(extractSceneImagePrompt(malformedImageMetadata.raw), 'SUBJECT A beneath suspended rain, no text')

const apostropheChoices = parseStoryProtocol(`[choices: "Play Mira's recording"|"Ask Nilo what's wrong"|"Climb to the upper deck"]`, 'en').commands.find((command) => command.type === 'choices')
assert.equal(apostropheChoices?.type, 'choices')
assert.equal(apostropheChoices?.type === 'choices' ? apostropheChoices.choices[0] : '', "Play Mira's recording")
assert.equal(parseStoryProtocol(`请做出选择\n[choices: "继续"|"停下"]`, 'zh').blocks.length, 0)

console.log(JSON.stringify({ ok: true, facts: facts.length, choices: choices?.type === 'choices' ? choices.choices.length : 0 }))
