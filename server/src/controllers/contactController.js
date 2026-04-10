const nodemailer = require('nodemailer');

function createTransporter() {
  return nodemailer.createTransport({
    host:   process.env.SMTP_HOST,
    port:   parseInt(process.env.SMTP_PORT) || 587,
    secure: false,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });
}

async function sendMessage(req, res) {
  try {
    const { name, email, subject, message } = req.body;
    if (!name || !email || !subject || !message) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    const transporter = createTransporter();

    await transporter.sendMail({
      from:    `"${name}" <${process.env.SMTP_USER}>`,
      to:      process.env.SMTP_USER,
      replyTo: email,
      subject: `[Contact] ${subject}`,
      html: `
        <h2>New Contact Message</h2>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Subject:</strong> ${subject}</p>
        <p><strong>Message:</strong><br>${message.replace(/\n/g, '<br>')}</p>
      `,
    });

    // Auto-reply to sender
    await transporter.sendMail({
      from:    `"PageTurner Books" <${process.env.EMAIL_FROM}>`,
      to:      email,
      subject: 'We received your message – PageTurner Books',
      html: `
        <p>Hi ${name},</p>
        <p>Thank you for reaching out! We've received your message and will get back to you within 1–2 business days.</p>
        <p>Best regards,<br>The PageTurner Books Team</p>
      `,
    });

    res.json({ message: 'Message sent successfully' });
  } catch (err) {
    console.error('Email error:', err);
    res.status(500).json({ message: 'Failed to send message. Please try again.' });
  }
}

async function subscribeNewsletter(req, res) {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ message: 'Email is required' });

    const transporter = createTransporter();

    await transporter.sendMail({
      from:    `"PageTurner Books" <${process.env.EMAIL_FROM}>`,
      to:      email,
      subject: 'Welcome to the PageTurner Books newsletter!',
      html: `
        <p>Thanks for subscribing! You'll be the first to hear about new arrivals, author events, and exclusive offers.</p>
        <p>Happy reading,<br>The PageTurner Books Team</p>
      `,
    });

    res.json({ message: 'Subscribed successfully' });
  } catch (err) {
    console.error('Newsletter error:', err);
    res.status(500).json({ message: 'Subscription failed' });
  }
}

module.exports = { sendMessage, subscribeNewsletter };
