<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://ai.google.dev/static/site-assets/images/share-ais-513315318.png" />
</div>

# ConsulAI - Run and deploy your AI Studio app

This contains everything you need to run your app locally.

View your app in AI Studio: https://ai.studio/apps/61f4c758-071f-42e5-993c-fc304925640f

## Run Locally

**Prerequisites:**  Node.js

1. Install dependencies:
   `npm install`
2. Set `GEMINI_API_KEY` in `.env` to your Gemini API key
3. Set `OPENAI_API_KEY` in the root `.env` file to enable automatic fallback when Gemini quota is exhausted:
   `OPENAI_API_KEY="sk-..."`
4. Optional: override `GEMINI_MODEL` and `OPENAI_MODEL` in `.env` if needed
5. Optional: tune AI timeout guards (`AI_SEARCH_TIMEOUT_MS`, `AI_OPINION_TIMEOUT_MS`, `AI_OCR_TIMEOUT_MS`) if your host allows longer requests
6. Run the app:
   `npm run dev`
