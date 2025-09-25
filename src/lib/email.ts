import { Resend } from 'resend';
import { z } from 'zod';

// Initialize Resend (you'll need to add RESEND_API_KEY to your .env.local)
const resend = new Resend(process.env.RESEND_API_KEY);

const contactFormSchema = z.object({
  name: z.string(),
  email: z.string().email(),
  category: z.string(),
  subject: z.string(),
  message: z.string(),
});

type ContactFormData = z.infer<typeof contactFormSchema>;

interface EmailTemplateProps {
  name: string;
  email: string;
  category: string;
  subject: string;
  message: string;
}

// Email template for admin notification
const AdminNotificationTemplate = ({ name, email, category, subject, message }: EmailTemplateProps) => `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>New Contact Form Submission</title>
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background: linear-gradient(135deg, #3b82f6, #8b5cf6); color: white; padding: 20px; border-radius: 8px 8px 0 0; }
    .content { background: #f8fafc; padding: 20px; border-radius: 0 0 8px 8px; }
    .field { margin-bottom: 15px; }
    .label { font-weight: bold; color: #374151; }
    .value { background: white; padding: 10px; border-radius: 4px; border-left: 4px solid #3b82f6; }
    .message-content { background: white; padding: 15px; border-radius: 4px; border: 1px solid #e5e7eb; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>New Contact Form Submission</h1>
      <p>SybauEducation Contact Form</p>
    </div>
    <div class="content">
      <div class="field">
        <div class="label">Name:</div>
        <div class="value">${name}</div>
      </div>
      <div class="field">
        <div class="label">Email:</div>
        <div class="value">${email}</div>
      </div>
      <div class="field">
        <div class="label">Category:</div>
        <div class="value">${category}</div>
      </div>
      <div class="field">
        <div class="label">Subject:</div>
        <div class="value">${subject}</div>
      </div>
      <div class="field">
        <div class="label">Message:</div>
        <div class="message-content">${message.replace(/\n/g, '<br>')}</div>
      </div>
      <div style="margin-top: 20px; padding: 15px; background: #eff6ff; border-radius: 4px;">
        <p><strong>Reply to:</strong> <a href="mailto:${email}">${email}</a></p>
        <p><strong>Timestamp:</strong> ${new Date().toLocaleString()}</p>
      </div>
    </div>
  </div>
</body>
</html>
`;

// Email template for user auto-reply
const UserAutoReplyTemplate = ({ name }: { name: string }) => `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Thank you for contacting SybauEducation</title>
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background: linear-gradient(135deg, #059669, #3b82f6); color: white; padding: 20px; border-radius: 8px 8px 0 0; text-align: center; }
    .content { background: #f8fafc; padding: 30px 20px; border-radius: 0 0 8px 8px; }
    .logo { font-size: 24px; font-weight: bold; margin-bottom: 10px; }
    .highlight { background: linear-gradient(135deg, #eff6ff, #f0f9ff); padding: 20px; border-radius: 8px; border-left: 4px solid #3b82f6; margin: 20px 0; }
    .footer { margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb; font-size: 14px; color: #6b7280; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <div class="logo">SybauEducation</div>
      <p>Thank you for reaching out to us!</p>
    </div>
    <div class="content">
      <h2>Hi ${name},</h2>
      <p>Thank you for contacting SybauEducation. We've received your message and our team will review it carefully.</p>
      
      <div class="highlight">
        <h3>📧 What happens next?</h3>
        <ul>
          <li><strong>Response Time:</strong> We typically respond within 24 hours</li>
          <li><strong>Business Hours:</strong> Monday - Friday, 9:00 AM - 6:00 PM (GMT+7)</li>
          <li><strong>Priority Support:</strong> Technical issues are prioritized</li>
        </ul>
      </div>
      
      <p>In the meantime, feel free to:</p>
      <ul>
        <li>Browse our <a href="https://sybaueducation.com/courses">course catalog</a></li>
        <li>Check out our <a href="https://sybaueducation.com/faq">frequently asked questions</a></li>
        <li>Follow us on social media for updates</li>
      </ul>
      
      <p>If you have an urgent inquiry, you can also reach us directly at:</p>
      <ul>
        <li>📞 Phone: +84 123 456 789</li>
        <li>📧 Email: support@sybaueducation.com</li>
      </ul>
      
      <div class="footer">
        <p>Best regards,<br>The SybauEducation Team</p>
        <p>This is an automated response. Please do not reply to this email.</p>
      </div>
    </div>
  </div>
</body>
</html>
`;

export async function sendEmailNotification(data: ContactFormData): Promise<boolean> {
  // Skip email sending if API key is not configured
  if (!process.env.RESEND_API_KEY) {
    console.warn('⚠️ RESEND_API_KEY not configured. Email will not be sent.');
    return true; // Return true to not break the flow in development
  }

  try {
    const { data: emailResult, error } = await resend.emails.send({
      from: 'onboarding@resend.dev',
      to: ['phuongnn.21it@vku.udn.vn'], 
      subject: `New Contact Form: ${data.subject}`,
      html: AdminNotificationTemplate(data),
      replyTo: data.email,
    });

    if (error) {
      // console.error('❌ Failed to send admin notification:', error);
      return false;
    }

    console.log('✅ Admin notification sent successfully:', emailResult?.id);
    return true;

  } catch (error) {
    // console.error('❌ Email sending error:', error);
    return false;
  }
}

export async function sendAutoReply(data: ContactFormData): Promise<boolean> {
  // Skip email sending if API key is not configured
  if (!process.env.RESEND_API_KEY) {
    console.warn('⚠️ RESEND_API_KEY not configured. Auto-reply will not be sent.');
    return true; // Return true to not break the flow in development
  }

  try {
    const { data: emailResult, error } = await resend.emails.send({
      from: 'onboarding@resend.dev',
      to: [data.email],
      subject: 'Thank you for contacting SybauEducation',
      html: UserAutoReplyTemplate({ name: data.name }),
    });

    if (error) {
      // console.error('❌ Failed to send auto-reply:', error);
      return false;
    }

    console.log('✅ Auto-reply sent successfully:', emailResult?.id);
    return true;

  } catch (error) {
    // console.error('❌ Auto-reply sending error:', error);
    return false;
  }
}

// Test function for development
export async function testEmailService() {
  const testData: ContactFormData = {
    name: 'Test User',
    email: 'test@example.com',
    category: 'general',
    subject: 'Test Contact Form',
    message: 'This is a test message to verify email functionality.',
  };

  console.log('🧪 Testing email service...');
  
  const adminResult = await sendEmailNotification(testData);
  const userResult = await sendAutoReply(testData);
  
  return {
    adminNotification: adminResult,
    autoReply: userResult,
  };
}