import type { VercelRequest, VercelResponse } from '@vercel/node';

export interface InquiryNotificationPayload {
  name: string;
  email: string;
  mobile?: string;
  service?: string;
  budget?: string;
  message?: string;
  submittedAt?: string;
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { name, email, mobile, service, budget, message } = req.body || {};
    if (!name || !email) {
      return res.status(400).json({ error: 'Name and email are required for notifications.' });
    }

    const webhookUrl = process.env.LEAD_WEBHOOK_URL;
    console.log(`[LEAD ALERT] 🔔 New inbound lead received from ${name} (${email})`);

    if (webhookUrl) {
      try {
        const payload = {
          text: `🚀 *New Lead Inbound Alert — DigiWorku Platform*\n• *Name:* ${name}\n• *Email:* ${email}\n• *Phone:* ${mobile || 'N/A'}\n• *Service:* ${service || 'N/A'}\n• *Budget:* ${budget || 'N/A'}\n• *Message:* ${message || 'N/A'}\n• *Time:* ${new Date().toISOString()}`,
        };

        await fetch(webhookUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
      } catch (webhookErr) {
        console.error('[LEAD ALERT] Webhook dispatch error:', webhookErr);
      }
    }

    return res.status(200).json({ success: true, alerted: true });
  } catch (err: any) {
    return res.status(500).json({ error: 'Failed to dispatch lead alert' });
  }
}
