export async function onRequestPost(context) {
  try {
    const data = await context.request.json();

    // Honeypot / simple bot trap
    if (data.company_website_extra) {
      return Response.json({ ok: true });
    }

    const required = ["name","company","email","phone","industry","software","book_status",
                      "biggest_problem","revenue","transactions","accounts","team_size","consent"];
    for (const field of required) {
      if (!data[field]) return Response.json({ error: `Missing ${field}` }, { status: 400 });
    }

    const esc = (v="") => String(v).replace(/[&<>"']/g, c => ({
      "&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"
    }[c]));
    const list = v => Array.isArray(v) ? v.map(esc).join(", ") : esc(v || "—");

    const html = `
      <div style="font-family:Arial,sans-serif;color:#081a2c;line-height:1.55">
        <h2 style="margin-bottom:4px">New Summer Peaks Bookkeeping Assessment</h2>
        <p style="color:#59636d;margin-top:0">${esc(data.name)} · ${esc(data.company)}</p>
        <hr style="border:0;border-top:1px solid #ddd">
        <h3>Contact & Business</h3>
        <p><b>Name:</b> ${esc(data.name)}<br>
        <b>Company:</b> ${esc(data.company)}<br>
        <b>Email:</b> ${esc(data.email)}<br>
        <b>Phone:</b> ${esc(data.phone)}<br>
        <b>Website:</b> ${esc(data.website || "—")}<br>
        <b>Industry:</b> ${esc(data.industry)}</p>
        <h3>Needs</h3><p>${list(data.help)}</p>
        <h3>Current Bookkeeping</h3>
        <p><b>Software:</b> ${esc(data.software)}<br>
        <b>Status:</b> ${esc(data.book_status)}<br>
        <b>Biggest problem:</b> ${esc(data.biggest_problem)}</p>
        <h3>Business Activity</h3>
        <p><b>Monthly revenue:</b> ${esc(data.revenue)}<br>
        <b>Monthly transactions:</b> ${esc(data.transactions)}<br>
        <b>Bank/card accounts:</b> ${esc(data.accounts)}<br>
        <b>Team size:</b> ${esc(data.team_size)}</p>
        <h3>Desired Outcome</h3><p>${list(data.win)}</p>
        <p><b>Anything else:</b> ${esc(data.anything_else || "—")}</p>
        <h3>Timing</h3>
        <p><b>Ideal start:</b> ${esc(data.ideal_start || "—")}<br>
        <b>Best contact time:</b> ${esc(data.contact_time || "—")}</p>
      </div>`;

    const apiKey = context.env.RESEND_API_KEY;
    const to = context.env.TO_EMAIL || "jay@summerpeaks.com";
    const from = context.env.FROM_EMAIL;

    if (!apiKey || !from) {
      return Response.json({
        error: "Email service is not configured. Add RESEND_API_KEY and FROM_EMAIL in Cloudflare Pages settings."
      }, { status: 500 });
    }

    const r = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        from,
        to: [to],
        reply_to: data.email,
        subject: `New Assessment — ${data.company}`,
        html
      })
    });

    if (!r.ok) {
      const detail = await r.text();
      console.error("Resend error:", detail);
      return Response.json({ error: "Email delivery failed." }, { status: 502 });
    }

    return Response.json({ ok: true });
  } catch (err) {
    console.error(err);
    return Response.json({ error: "Unexpected server error." }, { status: 500 });
  }
}
