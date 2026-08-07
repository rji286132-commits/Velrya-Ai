export async function chatGithub(prompt: string) {
  const token = process.env.GITHUB_TOKEN;
  if (!token) throw new Error('GITHUB_TOKEN missing, use Pollinations fallback');
  const res = await fetch('https://models.inference.ai.azure.com/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      model: 'gpt-4o',
      messages: [{ role: 'user', content: prompt }]
    })
  });
  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(`GitHub Models failed: ${errorText}`);
  }
  const j = await res.json();
  return j.choices?.[0]?.message?.content || '';
}
