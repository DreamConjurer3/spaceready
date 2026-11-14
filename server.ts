import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = parseInt(process.env.PORT || '3000', 10);

// Allow JSON body up to 25MB for base64 photo transfers
app.use(express.json({ limit: '25mb' }));

// Shared server-side Gemini client
const getGeminiClient = () => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error('GEMINI_API_KEY is not configured in the environment.');
  }
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
};

/**
 * POST /api/generate-astronaut-image
 * Takes user photo base64, rank details, score, and health parameters.
 * Produces a consistent, clean, HD 1:1 astronaut portrait reflecting their readiness status.
 */
app.post('/api/generate-astronaut-image', async (req, res) => {
  try {
    const { imageBase64, mimeType = 'image/jpeg', rankName, score, healthStatus, suitTheme } = req.body;

    const ai = getGeminiClient();

    // Construct prompt that guarantees consistent, photorealistic cinematic sci-fi style
    // Reflects their healthiness through posture, suit vitality, visor HUD glow, and orbital environment
    const healthDescription = `
Space Readiness Score: ${score}/100.
Assigned Rank: ${rankName}.
Health Condition: ${healthStatus || 'Peak readiness'}.
Suit Theme: ${suitTheme || 'Sleek aerospace exploration suit with telemetry LED indicators'}.
    `.trim();

    const promptText = `
Transform the person in the provided portrait into a clean, photorealistic, HD 1:1 astronaut portrait in a cinematic spaceflight setting with a sleek black, purple, and white color palette.

STRICT STYLE & COMPOSITION RULES:
- Color Palette: Strictly black, obsidian, royal purple, violet, and crisp white. Deep space black background with subtle purple starlight.
- Style: Consistent, high-fidelity 1:1 square portrait, sharp photorealistic cinematic sci-fi photography, 8k resolution, crisp studio rim lighting with minimal soft glow.
- Face preservation: Keep the exact facial features, likeness, eye contact, gender, and identity of the individual clearly recognizable looking straight at the camera through the clear visor of an advanced spacesuit.
- No distortion: Do not distort, disfigure, age, or make the person look ill. Healthiness must be conveyed through their proud posture, clear gaze, vibrant lighting, and the pristine state of their astronaut gear.
- Suit & Health reflection:
  * If score is 75-100 (Commander / Flight Engineer): The spacesuit is pristine, state-of-the-art obsidian black and pure white aerospace carbon-weave with royal purple and crisp white trim, all telemetry indicators glowing violet/white, clear polished visor, cosmic deep space and nebula horizon background with subtle purple starlight, symbol of peak human space endurance.
  * If score is 40-74 (Mission Specialist / Trainee): Professional advanced EVA exploration suit in matte black and purple with clean white accents, steady purple telemetry indicators, orbital station airlock setting, alert and focused expression.
  * If score is below 40 (Cadet): High-tech pressurized flight training suit in dark obsidian and deep purple, minimal subtle lighting, warmup status systems.
- Visor & Helmet: The helmet collar and visor frame the face cleanly in a centered 1:1 bust portrait, with subtle purple and white reflections on the visor edges.
- Consistency: Clean lighting, reduced glow and minimal shadows, neutral depth of field with the cosmic background softly blurred behind the astronaut.

Context details: ${healthDescription}
    `.trim();

    let parts: any[] = [];

    if (imageBase64) {
      // Clean base64 string if it contains data URI header
      const cleanBase64 = imageBase64.replace(/^data:image\/[a-z]+;base64,/, '');
      parts.push({
        inlineData: {
          data: cleanBase64,
          mimeType: mimeType || 'image/jpeg',
        },
      });
      parts.push({
        text: promptText,
      });
    } else {
      parts.push({
        text: `Generate a clean, photorealistic, HD 1:1 astronaut portrait in cinematic spaceflight setting. ${promptText}`,
      });
    }

    // Call gemini-3.1-flash-lite-image model
    const response = await ai.models.generateContent({
      model: 'gemini-3.1-flash-lite-image',
      contents: {
        parts,
      },
      config: {
        imageConfig: {
          aspectRatio: '1:1',
        },
      },
    });

    let generatedImageUrl = '';
    const candidates = response.candidates;
    if (candidates && candidates.length > 0 && candidates[0].content?.parts) {
      for (const part of candidates[0].content.parts) {
        if (part.inlineData && part.inlineData.data) {
          const mType = part.inlineData.mimeType || 'image/png';
          generatedImageUrl = `data:${mType};base64,${part.inlineData.data}`;
          break;
        }
      }
    }

    if (!generatedImageUrl) {
      return res.status(502).json({
        error: 'No image was returned by the AI model. Please retry or use the classic visor compositor.',
      });
    }

    return res.json({
      success: true,
      imageUrl: generatedImageUrl,
      rank: rankName,
      score,
    });
  } catch (error: any) {
    console.error('Error generating astronaut image:', error);
    const message = error?.message || 'Failed to generate astronaut image';
    const isQuota = message.includes('RESOURCE_EXHAUSTED') || message.includes('quota') || message.includes('429');

    return res.status(isQuota ? 429 : 500).json({
      error: message,
      isQuotaError: isQuota,
      fallbackMessage: 'Quota limit reached or API key needs billing. You can still use the custom interactive Visor Compositor!',
    });
  }
});

/**
 * Health check endpoint
 */
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', time: new Date().toISOString() });
});

// Vite Middleware for development
async function startServer() {
  const isProd = process.env.NODE_ENV === 'production';

  if (!isProd) {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Space Dream Server listening on http://0.0.0.0:${PORT}`);
  });
}

startServer();
