import nodemailer from 'nodemailer';

export async function POST(request) {
  try {
    const { itemName, customerName, customerEmail, customerAddress, itemCost, itemsList, isCustomerEmail } = await request.json();
    
    console.log('Received email request with data:', {
      itemName,
      customerName,
      customerEmail,
      customerAddress,
      itemCost,
      itemsList,
      isCustomerEmail
    });

    // Log SMTP configuration (without sensitive data)
    console.log('SMTP Configuration:', {
      host: process.env.SMTP_HOST,
      port: process.env.SMTP_PORT,
      secure: process.env.SMTP_SECURE,
      user: process.env.EMAIL_USER ? '***' : 'undefined',
    });

    // Create a transporter using IONOS SMTP
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: parseInt(process.env.SMTP_PORT),
      secure: process.env.SMTP_SECURE === 'true',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_APP_PASSWORD,
      },
      debug: true, // Enable debug logging
      logger: true, // Enable logger
    });

    // Verify the transporter configuration
    try {
      console.log('Attempting to verify SMTP connection...');
      await transporter.verify();
      console.log('SMTP connection verified successfully');
    } catch (error) {
      console.error('SMTP verification failed:', {
        error: error.message,
        code: error.code,
        response: error.response,
        stack: error.stack
      });
      throw error;
    }

    let mailOptions;
    if (isCustomerEmail) {
      // Customer confirmation email
      mailOptions = {
        from: process.env.EMAIL_USER,
        to: customerEmail,
        subject: `Your Marmalade Purchase Confirmation`,
        text: `Dear ${customerName},

Thank you for your purchase from Marmalade! We're delighted to confirm your order.

Order Details:
${itemsList}

Total Amount: £${itemCost}

Delivery Address:
${customerAddress}

We'll be in touch soon with delivery updates. If you have any questions about your order, please don't hesitate to contact us at madeleine.spencer.marmalade@gmail.com.

Thank you for supporting Marmalade!

Best wishes,
The Marmalade Team`,
      };
    } else {
      // Seller notification email
      mailOptions = {
        from: process.env.EMAIL_USER,
        to: 'madeleine.spencer.marmalade@gmail.com',
        subject: `${itemName} has just been sold!`,
        text: `${customerName} has just bought ${itemName} for £${itemCost}
Their email is: ${customerEmail}
Their address is: ${customerAddress}

Items purchased:
${itemsList}`,
      };
    }

    console.log('Attempting to send email with options:', {
      from: mailOptions.from,
      to: mailOptions.to,
      subject: mailOptions.subject
    });

    // Send the email
    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent successfully:', info);

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error sending email:', error);
    return new Response(JSON.stringify({ 
      error: 'Failed to send email',
      details: error.message 
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
} 