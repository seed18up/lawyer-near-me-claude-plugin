/**
 * Cloudflare Worker — Legal Chatbot for ทนายใกล้ฉัน (Lawyer Near Me)
 * Endpoint: POST /
 * Streams responses from Anthropic Claude API to the browser.
 */

const ALLOWED_ORIGINS = [
  "https://lawyernearme.in.th",
  "http://localhost",
];

const CORS_HEADERS = (origin) => ({
  "Access-Control-Allow-Origin": origin,
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
  "Access-Control-Max-Age": "86400",
});

const SYSTEM_PROMPTS = {
  "legal-advisor": `คุณคือ ดร.วรรณา สิทธิชัย หัวหน้าที่ปรึกษากฎหมายของ ทนายใกล้ฉัน (Lawyer Near Me)
มีความเชี่ยวชาญด้านกฎหมายไทยทั่วไป PDPA กฎหมายผู้บริโภค กฎหมายเทคโนโลยี และสภาทนายความ

กฎการตอบ:
- ตอบเป็นภาษาไทยเสมอ เป็นมิตร ชัดเจน ไม่ใช้ศัพท์กฎหมายซับซ้อนโดยไม่อธิบาย
- ให้ข้อมูลกฎหมายเบื้องต้นที่เป็นประโยชน์และถูกต้อง
- ใช้ bullet points เมื่อมีขั้นตอนหรือตัวเลือก
- ตอบกระชับ 150-250 คำ
- อ้างอิง พ.ร.บ. หรือมาตราที่เกี่ยวข้องเมื่อเหมาะสม
- ปิดท้ายทุกคำตอบด้วย: "⚠️ ข้อมูลนี้เพื่อการศึกษาเบื้องต้น ไม่ใช่คำปรึกษาทางกฎหมายสำหรับกรณีของคุณโดยเฉพาะ หากต้องการคำแนะนำที่แม่นยำ แนะนำให้นัดปรึกษาทนายจริงผ่าน ทนายใกล้ฉัน ครับ/ค่ะ"
- ห้ามการันตีผลลัพธ์ของคดีใดๆ`,

  "compliance": `คุณคือ คุณสิทธิศักดิ์ พงษ์ไพบูลย์ Compliance Officer ของ ทนายใกล้ฉัน
เชี่ยวชาญด้าน PDPA พ.ร.บ.คุ้มครองข้อมูลส่วนบุคคล ข้อบังคับราชการ ใบอนุญาตประกอบธุรกิจ และการปฏิบัติตามกฎหมาย

กฎการตอบ:
- ตอบเป็นภาษาไทยเสมอ เป็นมิตร ชัดเจน ไม่ใช้ศัพท์กฎหมายซับซ้อนโดยไม่อธิบาย
- ให้ข้อมูลด้าน compliance และ regulatory matters ที่เป็นประโยชน์และถูกต้อง
- ใช้ bullet points เมื่อมีขั้นตอนหรือตัวเลือก
- ตอบกระชับ 150-250 คำ
- อ้างอิง พ.ร.บ. ประกาศ หรือข้อบังคับที่เกี่ยวข้องเมื่อเหมาะสม
- ปิดท้ายทุกคำตอบด้วย: "⚠️ ข้อมูลนี้เพื่อการศึกษาเบื้องต้น ไม่ใช่คำปรึกษาทางกฎหมายสำหรับกรณีของคุณโดยเฉพาะ หากต้องการคำแนะนำที่แม่นยำ แนะนำให้นัดปรึกษาทนายจริงผ่าน ทนายใกล้ฉัน ครับ/ค่ะ"
- ห้ามการันตีผลลัพธ์ของการปฏิบัติตามกฎหมายใดๆ`,

  "contract": `คุณคือ คุณภัทรพงษ์ อารีย์วงศ์ Contract Specialist ของ ทนายใกล้ฉัน
เชี่ยวชาญด้านสัญญาทุกประเภท สัญญาซื้อขาย สัญญาจ้าง NDA สัญญาเช่า และข้อตกลงทางธุรกิจ

กฎการตอบ:
- ตอบเป็นภาษาไทยเสมอ เป็นมิตร ชัดเจน ไม่ใช้ศัพท์กฎหมายซับซ้อนโดยไม่อธิบาย
- ให้ข้อมูลด้าน contract review และ drafting advice ที่เป็นประโยชน์และถูกต้อง
- ใช้ bullet points เมื่อมีขั้นตอนหรือตัวเลือก
- ตอบกระชับ 150-250 คำ
- ชี้ประเด็นสำคัญในสัญญาและข้อควรระวัง
- ปิดท้ายทุกคำตอบด้วย: "⚠️ ข้อมูลนี้เพื่อการศึกษาเบื้องต้น ไม่ใช่คำปรึกษาทางกฎหมายสำหรับกรณีของคุณโดยเฉพาะ หากต้องการคำแนะนำที่แม่นยำ แนะนำให้นัดปรึกษาทนายจริงผ่าน ทนายใกล้ฉัน ครับ/ค่ะ"
- ห้ามการันตีว่าสัญญาใดๆ จะสมบูรณ์หรือบังคับได้ทางกฎหมาย`,
};

/**
 * Resolve the allowed origin from the request, or null if not permitted.
 */
function resolveOrigin(request) {
  const origin = request.headers.get("Origin") || "";
  // Allow exact match or any localhost port (e.g. http://localhost:3000)
  if (
    ALLOWED_ORIGINS.includes(origin) ||
    /^http:\/\/localhost(:\d+)?$/.test(origin)
  ) {
    return origin;
  }
  return null;
}

/**
 * Handle CORS preflight.
 */
function handleOptions(request) {
  const origin = resolveOrigin(request);
  if (!origin) {
    return new Response("Forbidden", { status: 403 });
  }
  return new Response(null, {
    status: 204,
    headers: CORS_HEADERS(origin),
  });
}

/**
 * Main fetch handler.
 */
export default {
  async fetch(request, env, ctx) {
    // ── CORS preflight ──────────────────────────────────────────────────────
    if (request.method === "OPTIONS") {
      return handleOptions(request);
    }

    const origin = resolveOrigin(request);
    const corsHeaders = origin ? CORS_HEADERS(origin) : {};

    // ── Method guard ────────────────────────────────────────────────────────
    if (request.method !== "POST") {
      return new Response(
        JSON.stringify({ error: "Method not allowed. Use POST." }),
        {
          status: 405,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        }
      );
    }

    // ── API key guard ───────────────────────────────────────────────────────
    if (!env.ANTHROPIC_API_KEY) {
      return new Response(
        JSON.stringify({ error: "Server misconfiguration: missing API key." }),
        {
          status: 500,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        }
      );
    }

    // ── Parse request body ──────────────────────────────────────────────────
    let body;
    try {
      body = await request.json();
    } catch {
      return new Response(
        JSON.stringify({ error: "Invalid JSON body." }),
        {
          status: 400,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        }
      );
    }

    const { messages, agent = "legal-advisor" } = body;

    if (!Array.isArray(messages) || messages.length === 0) {
      return new Response(
        JSON.stringify({ error: "messages array is required and must not be empty." }),
        {
          status: 400,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        }
      );
    }

    const systemPrompt =
      SYSTEM_PROMPTS[agent] ?? SYSTEM_PROMPTS["legal-advisor"];

    // ── Call Anthropic API (streaming) ──────────────────────────────────────
    const anthropicResponse = await fetch(
      "https://api.anthropic.com/v1/messages",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": env.ANTHROPIC_API_KEY,
          "anthropic-version": "2023-06-01",
        },
        body: JSON.stringify({
          model: "claude-haiku-4-5-20251001",
          max_tokens: 600,
          stream: true,
          system: systemPrompt,
          messages,
        }),
      }
    );

    // ── Forward Anthropic errors ────────────────────────────────────────────
    if (!anthropicResponse.ok) {
      const errorText = await anthropicResponse.text();
      return new Response(
        JSON.stringify({
          error: "Anthropic API error.",
          detail: errorText,
        }),
        {
          status: anthropicResponse.status,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        }
      );
    }

    // ── Stream SSE response to browser ──────────────────────────────────────
    return new Response(anthropicResponse.body, {
      status: 200,
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        "X-Accel-Buffering": "no",
        ...corsHeaders,
      },
    });
  },
};
