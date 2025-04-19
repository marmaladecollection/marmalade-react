import { sendEmail } from '../../app/server/mailer';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const { to, subject, text } = req.body;
    
    if (!to || !subject || !text) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    sendEmail(to, subject, text);
    return res.status(200).json({ message: 'Email queued for sending' });
  } catch (error) {
    console.error('Error in send-email API:', error);
    return res.status(500).json({ message: 'Error queuing email' });
  }
} 