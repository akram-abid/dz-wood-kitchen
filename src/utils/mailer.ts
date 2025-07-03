import nodemailer from "nodemailer";
import type { Transporter } from "nodemailer";
import type { FastifyInstance, FastifyPluginOptions } from "fastify";
import fp from "fastify-plugin";

export interface MailerConfig {
  host: string;
  port: number;
  secure: boolean;
  auth: {
    user: string;
    pass: string;
  };
  from?: string;
}

export interface EmailOptions {
  to: string | string[];
  subject: string;
  text?: string;
  html?: string;
  cc?: string | string[];
  bcc?: string | string[];
  attachments?: Array<{
    filename: string;
    path?: string;
    content?: Buffer | string;
    contentType?: string;
  }>;
}

export interface MailerPlugin {
  sendMail: (options: EmailOptions) => Promise<any>;
  verifyConnection: () => Promise<boolean>;
}

const defaultZohoConfig: Partial<MailerConfig> = {
  host: "smtp.zoho.com",
  port: 587,
  secure: false,
};

class MailerService {
  private transporter: Transporter;
  private config: MailerConfig;

  constructor(config: MailerConfig) {
    this.config = { ...defaultZohoConfig, ...config };
    this.transporter = nodemailer.createTransport({
      host: this.config.host,
      port: this.config.port,
      secure: this.config.secure,
      auth: {
        user: this.config.auth.user,
        pass: this.config.auth.pass,
      },
      tls: {
        rejectUnauthorized: false,
      },
    });
  }

  async sendMail(options: EmailOptions): Promise<any> {
    try {
      const mailOptions = {
        from: this.config.from || this.config.auth.user,
        to: Array.isArray(options.to) ? options.to.join(", ") : options.to,
        subject: options.subject,
        text: options.text,
        html: options.html,
        cc: Array.isArray(options.cc) ? options.cc.join(", ") : options.cc,
        bcc: Array.isArray(options.bcc) ? options.bcc.join(", ") : options.bcc,
        attachments: options.attachments,
      };

      const info = await this.transporter.sendMail(mailOptions);

      return {
        success: true,
        messageId: info.messageId,
        response: info.response,
        accepted: info.accepted,
        rejected: info.rejected,
      };
    } catch (error) {
      throw new Error(
        `Failed to send email: ${error instanceof Error ? error.message : "Unknown error"}`,
      );
    }
  }

  async verifyConnection(): Promise<boolean> {
    try {
      await this.transporter.verify();
      return true;
    } catch (error) {
      console.error("Mail server connection failed:", error);
      return false;
    }
  }

  async sendTemplate(
    templateName: string,
    to: string | string[],
    variables: Record<string, any>,
    subject: string,
  ): Promise<any> {
    const templates = {
      welcome: `
        <h2>Welcome {{name}}!</h2>
  	<p>Thank you for joining us. Your account has been created successfully.</p>
  	<p>Verify your email please!</p>
  	<a href="{{verifyLink}}">click_here_to_verify</a>
  	<p>Best regards,<br>{{company}}</p>
	`,
      reset: `
        <h2>Password Reset</h2>
        <p>Hi {{name}},</p>
        <p>Click the link below to reset your password:</p>
        <a href="{{resetLink}}">Reset Password</a>
        <p>This link will expire in 1 hour.</p>
      `,
      notification: `
        <h2>{{title}}</h2>
        <p>{{message}}</p>
        <p>{{footer}}</p>
      `,
    };

    const template = templates[templateName as keyof typeof templates];
    if (!template) {
      throw new Error(`Template '${templateName}' not found`);
    }

    let html = template;
    Object.keys(variables).forEach((key) => {
      html = html.replace(new RegExp(`{{${key}}}`, "g"), variables[key]);
    });

    return this.sendMail({
      to,
      subject,
      html,
    });
  }
}

// Fastify plugin
const mailerPlugin = fp<MailerConfig>(
  async (fastify: FastifyInstance, options: MailerConfig) => {
    const mailerService = new MailerService(options);

    // Verify connection on startup
    const isConnected = await mailerService.verifyConnection();
    if (!isConnected) {
      fastify.log.warn("Mail server connection failed during startup");
    } else {
      fastify.log.info("Mail server connection verified");
    }

    fastify.decorate("mailer", {
      sendMail: mailerService.sendMail.bind(mailerService),
      verifyConnection: mailerService.verifyConnection.bind(mailerService),
      sendTemplate: mailerService.sendTemplate.bind(mailerService),
    });
  },
);

// Utility functions for common email operations
export const emailUtils = {
  validateEmail: (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  },

  sanitizeEmail: (email: string): string => {
    return email.toLowerCase().trim();
  },

  generateUnsubscribeLink: (email: string, token: string): string => {
    return `${process.env.DOMAIN}/unsubscribe?email=${encodeURIComponent(email)}&token=${token}`;
  },

  createEmailQueue: () => {
    const queue: EmailOptions[] = [];
    let processing = false;

    const addToQueue = (emailOptions: EmailOptions) => {
      queue.push(emailOptions);
    };

    const processQueue = async (mailer: MailerPlugin) => {
      if (processing || queue.length === 0) return;

      processing = true;
      while (queue.length > 0) {
        const emailOptions = queue.shift();
        if (emailOptions) {
          try {
            await mailer.sendMail(emailOptions);
            console.log(`Email sent to ${emailOptions.to}`);
          } catch (error) {
            console.error(`Failed to send email to ${emailOptions.to}:`, error);
          }
        }
      }
      processing = false;
    };

    return { addToQueue, processQueue };
  },
};

// Type declarations for Fastify
declare module "fastify" {
  interface FastifyInstance {
    mailer: {
      sendMail: (options: EmailOptions) => Promise<any>;
      verifyConnection: () => Promise<boolean>;
      sendTemplate: (
        templateName: string,
        to: string | string[],
        variables: Record<string, any>,
        subject: string,
      ) => Promise<any>;
    };
  }
}

export default mailerPlugin;
export { MailerService };
