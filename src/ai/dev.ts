
import { config } from 'dotenv';
config();

// This file is now primarily for ensuring environment variables are loaded.
// The Genkit-specific dev server commands are no longer needed as we've
// migrated to a different AI provider.
// We keep the file to avoid breaking any existing `npm run` scripts that might reference it,
// but its content can be simplified.
