// src/index.ts
import 'dotenv/config';
import { IMessageSDK } from '@photon-ai/imessage-kit';
import { handleIncomingMessage } from './butler.js';

async function main() {
  try {
    const sdk = new IMessageSDK({
      watcher: {
        excludeOwnMessages: true, 
      },
    });

    // Start the watcher
    await sdk.startWatching({
      onMessage: async (message) => {
        if (!message.text) return;

        try {
          await handleIncomingMessage(sdk, message);
        } catch (error) {
          console.error('Error handling message:', error);
        }
      },
      onError: (err) => {
        console.error('Watcher error:', err);
      },
    });

    console.log('Text Butler is watching your messages...');
  } catch (error) {
    console.error('Failed to start Text Butler:', error);
    process.exit(1);
  }
}

main().catch((error) => {
  console.error('Fatal error:', error);
  process.exit(1);
});
