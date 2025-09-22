import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { sendEmailNotification, sendAutoReply } from "@/lib/email";

// Validation schema matching the frontend
const contactFormSchema = z.object({
  name: z
    .string()
    .min(2, "Name must be at least 2 characters")
    .max(50, "Name must be less than 50 characters")
    .regex(/^[a-zA-ZÀ-ỹ\s]+$/, "Name can only contain letters and spaces"),
  email: z
    .string()
    .min(1, "Email is required")
    .email("Please enter a valid email address"),
  category: z
    .string()
    .min(1, "Please select a category"),
  subject: z
    .string()
    .min(5, "Subject must be at least 5 characters")
    .max(100, "Subject must be less than 100 characters"),
  message: z
    .string()
    .min(10, "Message must be at least 10 characters")
    .max(1000, "Message must be less than 1000 characters"),
  recaptchaToken: z.string().optional(),
  // Honeypot field - should always be empty
  website: z.string().max(0, "Bot detected").optional(),
});

// Simple rate limiting (in production, use Redis or proper rate limiting service)
const rateLimitMap = new Map<string, { count: number; lastReset: number }>();
const RATE_LIMIT_WINDOW = 60 * 1000; // 1 minute
const RATE_LIMIT_MAX_REQUESTS = 5; // Max 5 requests per minute

// Verify reCAPTCHA token
async function verifyRecaptcha(token: string): Promise<boolean> {
  if (!process.env.RECAPTCHA_SECRET_KEY) {
    console.warn("⚠️ RECAPTCHA_SECRET_KEY not configured. Skipping verification.");
    return true; // Skip verification if not configured
  }

  try {
    const response = await fetch("https://www.google.com/recaptcha/api/siteverify", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: `secret=${process.env.RECAPTCHA_SECRET_KEY}&response=${token}`,
    });

    const data = await response.json();
    return data.success === true;
  } catch (error) {
    console.error("reCAPTCHA verification error:", error);
    return false;
  }
}

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const userLimit = rateLimitMap.get(ip);

  if (!userLimit) {
    rateLimitMap.set(ip, { count: 1, lastReset: now });
    return true;
  }

  // Reset count if window has passed
  if (now - userLimit.lastReset > RATE_LIMIT_WINDOW) {
    rateLimitMap.set(ip, { count: 1, lastReset: now });
    return true;
  }

  // Check if under limit
  if (userLimit.count < RATE_LIMIT_MAX_REQUESTS) {
    userLimit.count++;
    return true;
  }

  return false;
}

export async function POST(request: NextRequest) {
  try {
    // Get client IP for rate limiting
    const forwarded = request.headers.get("x-forwarded-for");
    const ip = forwarded ? forwarded.split(",")[0] : "unknown";

    // Check rate limit
    if (!checkRateLimit(ip)) {
      return NextResponse.json(
        { 
          error: "Too many requests", 
          message: "Please wait before sending another message" 
        },
        { status: 429 }
      );
    }

    // Parse and validate request body
    const body = await request.json();
    const validatedData = contactFormSchema.parse(body);

    // Check honeypot field - if filled, it's likely a bot
    if (validatedData.website && validatedData.website.length > 0) {
      console.log("🤖 Bot detected via honeypot field:", { ip, website: validatedData.website });
      return NextResponse.json(
        {
          error: "Spam detected",
          message: "Your submission appears to be spam. Please try again.",
        },
        { status: 400 }
      );
    }

    // Verify reCAPTCHA if token is provided
    if (validatedData.recaptchaToken) {
      const isValidRecaptcha = await verifyRecaptcha(validatedData.recaptchaToken);
      if (!isValidRecaptcha) {
        return NextResponse.json(
          {
            error: "reCAPTCHA verification failed",
            message: "Please complete the CAPTCHA verification",
          },
          { status: 400 }
        );
      }
    } else if (process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY) {
      // If reCAPTCHA is configured but no token provided
      return NextResponse.json(
        {
          error: "reCAPTCHA token missing",
          message: "Please complete the CAPTCHA verification",
        },
        { status: 400 }
      );
    }

    // Remove recaptchaToken and honeypot from data before processing
    const { recaptchaToken, website, ...contactData } = validatedData;

    // Log the contact form submission (in production, you might want to store in database)
    console.log("Contact form submission:", {
      ...contactData,
      ip,
      timestamp: new Date().toISOString(),
    });

    // Here you would typically:
    // 1. Save to database
    // 2. Send email notification  
    // 3. Send auto-reply to user
    
    // Send email notifications
    const [emailSent, autoReplySent] = await Promise.all([
      sendEmailNotification(contactData),
      sendAutoReply(contactData)
    ]);

    if (!emailSent || !autoReplySent) {
      console.warn("Some emails failed to send, but form submission was successful");
    }

    return NextResponse.json(
      {
        success: true,
        message: "Your message has been sent successfully!",
        data: {
          id: generateMessageId(),
          timestamp: new Date().toISOString(),
        },
      },
      { status: 200 }
    );

  } catch (error) {
    console.error("Contact form error:", error);

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          error: "Validation failed",
          message: "Please check your input and try again",
          details: error.issues,
        },
        { status: 400 }
      );
    }

    return NextResponse.json(
      {
        error: "Internal server error",
        message: "Something went wrong. Please try again later.",
      },
      { status: 500 }
    );
  }
}

// Mock email sending functions (replace with actual email service)
function generateMessageId(): string {
  return `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

// Handle other HTTP methods
export async function GET() {
  return NextResponse.json(
    { message: "Contact API endpoint is working" },
    { status: 200 }
  );
}

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}