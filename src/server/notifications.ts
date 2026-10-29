export interface InquiryNotificationPayload {
  name: string;
  email: string;
  mobile?: string;
  service?: string;
  budget?: string;
  message?: string;
  submittedAt?: string;
}

/**
 * Dispatch an automated lead notification to DigiWorku administrators.
 * Supports Webhook URLs (Slack, Discord, Telegram, or custom webhook) or fallback logging.
 */
export async function notifyAdminOfNewLead(lead: InquiryNotificationPayload): Promise<boolean> {
  const webhookUrl = process.env.LEAD_WEBHOOK_URL;
  const adminEmail = process.env.ADMIN_ALERT_EMAIL || 'digiworku55@gmail.com';

  console.log(`[LEAD ALERT] 🔔 New inbound lead received from ${lead.name} (${lead.email}, ${lead.mobile || 'No phone'}) for ${lead.service || 'General'}`);

  if (webhookUrl) {
    try {
      const payload = {
        text: `🚀 *New Lead Inbound Alert — DigiWorku Platform*\n• *Name:* ${lead.name}\n• *Email:* ${lead.email}\n• *Phone:* ${lead.mobile || 'N/A'}\n• *Service:* ${lead.service || 'N/A'}\n• *Budget:* ${lead.budget || 'N/A'}\n• *Message:* ${lead.message || 'N/A'}\n• *Time:* ${lead.submittedAt || new Date().toISOString()}`,
      };

      const response = await fetch(webhookUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        console.warn(`[LEAD ALERT] Webhook dispatch returned HTTP status ${response.status}`);
      }
      return true;
    } catch (err) {
      console.error('[LEAD ALERT] Failed to dispatch webhook notification:', err);
      return false;
    }
  }

  return true;
}
