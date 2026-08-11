import { buildPlayerIdentityPrompt, MEDIA_PROMPT_CHARACTER_LIMIT } from '../src/story/engine/imageIdentity'
import { beforeWeGetHome } from '../src/story/cartridges/beforeWeGetHome'

const prompt = buildPlayerIdentityPrompt(beforeWeGetHome.opening.imagePrompt.repeat(4), beforeWeGetHome)
if (prompt.length > MEDIA_PROMPT_CHARACTER_LIMIT) throw new Error(`identity prompt exceeds service contract: ${prompt.length}`)
for (const required of ['PERSON A', 'reference face belongs ONLY', 'Ahe', 'Lin Lan', 'identity only']) {
  if (!prompt.includes(required)) throw new Error(`identity prompt lost required contract: ${required}`)
}
if (!prompt.startsWith(beforeWeGetHome.opening.imagePrompt.slice(0, 80))) throw new Error('identity prompt lost the current scene')

console.log(`image identity contract passed (${prompt.length}/${MEDIA_PROMPT_CHARACTER_LIMIT} characters)`)
