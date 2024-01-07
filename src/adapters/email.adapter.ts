import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

const ADDRESS = process.env.EMAIL_ADDRESS;
const PASSWORD = process.env.EMAIL_PASSWORD;

export class EmailAdapter {
  static async sendEmail(email: string, subject: string, message: string): Promise<boolean> {
    try {
      if (!ADDRESS || !PASSWORD) {
        throw new Error('The username or password is not available');
      }

      const transport = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: ADDRESS,
          pass: PASSWORD,
        },
      });

      const info = await transport.sendMail({
        from: `Konstantin <${ADDRESS}>`,
        to: email,
        subject,
        html: message,
      });

      const isAccepted = info.accepted.includes(email);

      return isAccepted;
    } catch (error) {
      console.error(error);

      return false;
    }
  }
}
