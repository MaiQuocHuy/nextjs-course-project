# Contact Form Implementation Guide

## 📧 Contact Form Features

The contact form on `/contact` page has been fully implemented with the following features:

### ✅ Completed Features

1. **Advanced Form Validation**

   - React Hook Form with Zod validation
   - Real-time field validation
   - Proper error messages
   - Input sanitization

2. **Email Integration**

   - Admin notification emails
   - Auto-reply to users
   - Beautiful HTML email templates
   - Resend email service integration

3. **Spam Protection**

   - Rate limiting (5 requests per minute per IP)
   - reCAPTCHA v2 integration (optional)
   - Honeypot field protection
   - Input validation and sanitization

4. **Enhanced UX**
   - Toast notifications (success/error)
   - Loading states
   - Success confirmation screen
   - Responsive design

## 🚀 Setup Instructions

### 1. Email Service Setup (Required)

1. Sign up for a free account at [Resend](https://resend.com)
2. Generate an API key from your Resend dashboard
3. Add to your `.env.local`:

```bash
RESEND_API_KEY=re_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

### 2. reCAPTCHA Setup (Optional but Recommended)

1. Go to [Google reCAPTCHA](https://www.google.com/recaptcha/admin)
2. Register a new site
3. Choose reCAPTCHA v2 "I'm not a robot" checkbox
4. Add your domain(s)
5. Get your site key and secret key
6. Add to your `.env.local`:

```bash
NEXT_PUBLIC_RECAPTCHA_SITE_KEY=6LeXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
RECAPTCHA_SECRET_KEY=6LeXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
```

### 3. Customize Email Settings (Optional)

Add custom email addresses to your `.env.local`:

```bash
ADMIN_EMAIL=your-admin@yourdomain.com
FROM_EMAIL=noreply@yourdomain.com
```

## 📁 File Structure

```
src/
├── app/
│   ├── api/
│   │   └── contact/
│   │       └── route.ts           # API endpoint for form submission
│   └── (nondashboard)/
│       └── contact/
│           └── page.tsx           # Contact page
├── components/
│   ├── forms/
│   │   └── ContactForm.tsx        # Main contact form component
│   └── sections/
│       └── ContactInfoSection.tsx # Contact information section
└── lib/
    └── email.ts                   # Email service functions
```

## 🛠 API Endpoints

### POST /api/contact

Handles contact form submissions.

**Request Body:**

```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "category": "general",
  "subject": "Test message",
  "message": "This is a test message",
  "recaptchaToken": "optional_recaptcha_token"
}
```

**Response (Success):**

```json
{
  "success": true,
  "message": "Your message has been sent successfully!",
  "data": {
    "id": "msg_1234567890_abc123",
    "timestamp": "2024-01-01T00:00:00.000Z"
  }
}
```

## 🔧 Development

### Testing the Contact Form

1. Navigate to `/contact` page
2. Fill out the form with valid data
3. Submit the form
4. Check the console for email logs (if RESEND_API_KEY is not set)
5. Check your email for notifications (if RESEND_API_KEY is set)

### Form Validation Rules

- **Name**: 2-50 characters, letters and spaces only
- **Email**: Valid email format
- **Category**: Must select from predefined options
- **Subject**: 5-100 characters
- **Message**: 10-1000 characters

### Rate Limiting

- 5 requests per minute per IP address
- Automatically resets after 1 minute
- Returns 429 status code when exceeded

## 🎨 Customization

### Email Templates

Edit the email templates in `src/lib/email.ts`:

- `AdminNotificationTemplate`: Email sent to admin
- `UserAutoReplyTemplate`: Auto-reply sent to user

### Form Fields

Add or modify form fields in:

1. Update the Zod schema in `ContactForm.tsx`
2. Add the field to the form UI
3. Update the API validation in `route.ts`

### Styling

The form uses Tailwind CSS with shadcn/ui components. Customize the styling by modifying the classes in `ContactForm.tsx`.

## 🚨 Security Features

1. **Input Validation**: All inputs are validated both client-side and server-side
2. **Rate Limiting**: Prevents spam submissions
3. **reCAPTCHA**: Prevents bot submissions
4. **CORS Protection**: API routes are protected
5. **XSS Prevention**: Input sanitization

## 📱 Mobile Responsive

The contact form is fully responsive and works on all device sizes:

- Mobile: Single column layout
- Tablet: Responsive grid
- Desktop: Full featured layout

## 🐛 Troubleshooting

### Emails not sending

- Check that `RESEND_API_KEY` is set correctly
- Verify your Resend account is active
- Check the console for error messages

### reCAPTCHA not showing

- Verify `NEXT_PUBLIC_RECAPTCHA_SITE_KEY` is set
- Make sure the domain is registered in Google reCAPTCHA
- Check browser console for errors

### Form submission failing

- Check network requests in browser dev tools
- Verify API endpoint is accessible
- Check server logs for errors

## 🔄 Future Enhancements

Potential improvements you could add:

1. **Database Storage**: Store form submissions in a database
2. **Admin Dashboard**: View and manage form submissions
3. **File Attachments**: Allow users to attach files
4. **Multi-language**: Support multiple languages
5. **Advanced Analytics**: Track form conversion rates
6. **Auto-categorization**: AI-powered message categorization

## 📞 Support

If you need help with the contact form implementation, you can:

1. Check the console logs for error messages
2. Review the API response in browser dev tools
3. Test the email service separately
4. Verify all environment variables are set correctly

The contact form is now fully functional and production-ready! 🎉
