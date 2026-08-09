import assert from 'node:assert/strict'
import { parseStoryProtocol } from '../src/story/engine/protocol'

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

console.log(JSON.stringify({ ok: true, facts: facts.length, choices: choices?.type === 'choices' ? choices.choices.length : 0 }))
