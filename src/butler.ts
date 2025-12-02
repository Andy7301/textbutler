// src/butler.ts
import { IMessageSDK, type Message } from '@photon-ai/imessage-kit';
import { analyzeMessageWithLLM } from './llm.js';
import { MY_NUMBER, MIN_CHAR_LENGTH } from './config.js';
import type { MessageAnalysis } from './types.js';

// Function to handle incoming messages
export async function handleIncomingMessage(
  sdk: InstanceType<typeof IMessageSDK>,
  message: Message
) {
  const text = message.text ?? '';

  // Filter: only consider messages longer than MIN_CHAR_LENGTH characters
  if (text.length < MIN_CHAR_LENGTH) {
    return;
  }

  console.log('Butler analyzing message from', message.sender);

  // Analyze message with Gemini
  const analysis = await analyzeMessageWithLLM(text, message.sender);

  if (!analysis.should_notify) {
    console.log('Butler decided not to notify (low priority).');
    return;
  }

  // Send Butler message to the user
  await sdk.send(MY_NUMBER, formatButlerMessage(message, analysis));
}

// Format message to be sent back to the user
function formatButlerMessage(message: Message, analysis: MessageAnalysis): string {
  return [
    `🧸 *Text Butler*`,
    ``,
    `From: ${message.senderName || message.sender}`,
    `Vibe: ${analysis.vibe}`,
    `Priority: ${analysis.priority.toUpperCase()}`,
    ``,
    `TL;DR: ${analysis.tldr}`,
    ``,
    `Reply idea: "${analysis.suggested_reply}"`,
  ].join('\n');
}
