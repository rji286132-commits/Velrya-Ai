export async function chatPollinations(prompt: string) {
  const r = await fetch(`https://text.pollinations.ai/${encodeURIComponent(prompt)}?model=openai`);
  if (!r.ok) throw new Error('pollinations failed');
  return await r.text();
}
