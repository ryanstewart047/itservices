import { NextRequest, NextResponse } from 'next/server';

interface ChatMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

const SYSTEM_KNOWLEDGE = `
You are the EARPI AI Assistant (Earth Regenerative Projects International).
You represent EARPI warmly, intelligently, and inspiringly.

Core Information:
- Organization Name: Earth Regenerative Projects International (EARPI) / EaRP Sierra Leone.
- Mission: Catalyzing ecological regeneration, climate resilience, community agroforestry, renewable energy solutions, and youth-led environmental initiatives in Sierra Leone and globally.
- Legal & Registration: Registered USA Non-profit Corporation MA 001751059; EIN: 99-0979318.
- Address: 32 Wallace Johnson St, Freetown, Sierra Leone.
- Contact Details: Phone: +1 (202) 438-6441 or +232 78 046996. Email: official@earpi.org / earthregenerativeprojectsl@gmail.com.
- Website: https://earpi.org
- Leadership: Alimamy Sesay (Executive Director / Founder). Website Developer & Technical Lead: Ryan Stewart. Supported by dedicated community directors and leads: Habibu, Abu, Hassan, Isatu, John, Samuella, Usman.
- Five Priority Areas:
  1. Priority 1: Ecosystem Restoration & Tree Planting (Reforestation, Mangrove conservation)
  2. Priority 2: Renewable Energy & Clean Tech (Clean cookstoves, solar power access)
  3. Priority 3: Regenerative Agriculture & Food Security (Permaculture, soil restoration)
  4. Priority 4: Climate Education & Youth Green Clubs (Empowering the next generation)
  5. Priority 5: Community Water Security & Climate Adaptation
- How to Support:
  - Donate: Visit /donation to contribute online.
  - Volunteer/Partner: Reach out via /contact or email official@earpi.org.
  - Subscribe: Sign up for our newsletter to get impact updates.

Tone: Knowledgeable, compassionate, encouraging, and focused on ecological hope and community action. Keep answers concise, helpful, and invite further questions or collaboration.
`;

function getContextualFallbackResponse(userText: string): string {
  const text = userText.toLowerCase();

  if (text.includes('hello') || text.includes('hi') || text.includes('hey')) {
    return "Hello! 🌱 Welcome to EARPI (Earth Regenerative Projects International). I'm your AI climate assistant. How can I help you today? You can ask about our reforestation projects, donation channels, team, or how to get involved!";
  }

  if (text.includes('donate') || text.includes('donation') || text.includes('support') || text.includes('give')) {
    return "Thank you for wanting to make a difference! 💚 You can support EARPI's grassroots climate action directly by visiting our [Donation Page](/donation). We are a registered USA 501(c)(3) compliant non-profit (EIN: 99-0979318, MA Reg 001751059). Every dollar goes directly to local community projects in Sierra Leone!";
  }

  if (text.includes('project') || text.includes('initiative') || text.includes('work') || text.includes('priority')) {
    return "EARPI focuses on five core regenerative priorities in Sierra Leone and beyond:\n1. 🌳 **Ecosystem & Mangrove Restoration**\n2. ☀️ **Renewable Clean Energy Access**\n3. 🌾 **Regenerative Agriculture & Agroforestry**\n4. 📚 **Youth Climate Education & School Green Clubs**\n5. 💧 **Community Water Security & Climate Resilience**\n\nYou can explore our full portfolio on our [Projects Page](/project-one)!";
  }

  if (text.includes('team') || text.includes('founder') || text.includes('ryan') || text.includes('who are you')) {
    return "EARPI is founded and led by Ryan Josiah Stewart alongside our passionate team: Habibu, Abu, Alimamy, Hassan, Isatu, John, Samuella, and Usman. We are grassroots environmental champions working on the frontlines of climate change in West Africa. Learn more on our [Team Page](/team)!";
  }

  if (text.includes('contact') || text.includes('email') || text.includes('phone') || text.includes('address') || text.includes('reach')) {
    return "You can reach EARPI anytime!\n📍 **Address:** 32 Wallace Johnson St, Freetown, Sierra Leone\n📞 **Phone:** +1 (202) 438-6441 / +232 78 046996\n✉️ **Email:** official@earpi.org\nOr send a message through our [Contact Page](/contact)!";
  }

  if (text.includes('volunteer') || text.includes('join') || text.includes('partner') || text.includes('ambassador')) {
    return "We would love to have you join our movement! 🤝 You can become an EARPI Ambassador or volunteer for community tree planting, education campaigns, or fundraising. Please visit our [Ambassadors Page](/ambassadors) or send us a message via [Contact Us](/contact).";
  }

  if (text.includes('sierra leone') || text.includes('location') || text.includes('where')) {
    return "EARPI's field operations and grassroots projects are centered in Freetown and rural communities across Sierra Leone, West Africa, addressing coastal vulnerability, deforestation, and youth eco-entrepreneurship. We are also registered as a non-profit corporation in the United States (EIN: 99-0979318).";
  }

  return "Thank you for reaching out to EARPI! 🌍 We are committed to regenerating ecosystems and empowering communities against the climate crisis. Whether you want to know about our tree planting initiatives, make a tax-deductible donation, or partner with us, feel free to ask or visit our [About Us](/about) and [Projects](/project-one) pages!";
}

export async function POST(req: NextRequest) {
  try {
    const { messages } = await req.json();

    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return NextResponse.json({ error: 'Messages are required' }, { status: 400 });
    }

    const lastUserMessage = messages.filter((m: ChatMessage) => m.role === 'user').pop();
    const userPrompt = lastUserMessage ? lastUserMessage.content : '';

    // Check if external Gemini API key is configured
    const geminiApiKey = process.env.GEMINI_API_KEY;
    if (geminiApiKey) {
      try {
        const response = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${geminiApiKey}`,
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              contents: [
                {
                  role: 'user',
                  parts: [
                    {
                      text: `${SYSTEM_KNOWLEDGE}\n\nUser Question: ${userPrompt}`,
                    },
                  ],
                },
              ],
            }),
          }
        );

        if (response.ok) {
          const data = await response.json();
          const aiReply =
            data.candidates?.[0]?.content?.parts?.[0]?.text ||
            getContextualFallbackResponse(userPrompt);

          return NextResponse.json({ reply: aiReply });
        }
      } catch (err) {
        console.warn('Gemini API call failed, using built-in knowledge response:', err);
      }
    }

    // Check if OpenAI API key is configured
    const openaiApiKey = process.env.OPENAI_API_KEY;
    if (openaiApiKey) {
      try {
        const response = await fetch('https://api.openai.com/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${openaiApiKey}`,
          },
          body: JSON.stringify({
            model: 'gpt-4o-mini',
            messages: [
              { role: 'system', content: SYSTEM_KNOWLEDGE },
              ...messages.slice(-6),
            ],
            temperature: 0.7,
            max_tokens: 500,
          }),
        });

        if (response.ok) {
          const data = await response.json();
          const reply = data.choices?.[0]?.message?.content;
          if (reply) {
            return NextResponse.json({ reply });
          }
        }
      } catch (err) {
        console.warn('OpenAI API call failed, using built-in knowledge response:', err);
      }
    }

    // Built-in contextual AI knowledge response
    const fallbackReply = getContextualFallbackResponse(userPrompt);
    return NextResponse.json({ reply: fallbackReply });
  } catch (error: any) {
    console.error('Chat API Error:', error);
    return NextResponse.json(
      { error: 'An unexpected error occurred while processing your message.' },
      { status: 500 }
    );
  }
}
