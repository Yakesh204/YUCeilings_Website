const express = require('express');
const nodemailer = require('nodemailer');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

app.post('/send-email', async (req, res) => {
    const { name, email, phone, address, sqft, message } = req.body;
  
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    });
  
    try {
      // Email to yourself
      const adminMailOptions = {
        from: `"Quote Request" <${process.env.EMAIL_USER}>`,
        to: process.env.TO_EMAIL,
        subject: 'New Quote Request',
        text: `
  Name: ${name}
  Email: ${email}
  Phone: ${phone}
  Address: ${address}
  Square Footage: ${sqft}
  Message: ${message}
        `
      };
  
      await transporter.sendMail(adminMailOptions);
  
      // Email to customer
      const userMailOptions = {
        from: `<${process.env.EMAIL_USER}>`,
        to: email,
        subject: 'Quote Request Confirmation',
        text: `Hi ${name},
  
  Thank you for reaching out to YU Ceilings! We’ve received your quote request and are currently reviewing the details you provided.
  
  One of our team members will get in touch with you within 1–2 business days to discuss your project and provide an estimate.
  
  Here’s a quick summary of your submission:
  - Name: ${name}
  - Email: ${email}
  - Phone: ${phone}
  - Address: ${address}
  - Square Footage: ${sqft}
  - Message: ${message}
  
  If you have any additional information to share in the meantime, feel free to reply to this email.
  
  We look forward to helping you transform your space!
  
  Best regards,  
  The YU Ceilings Team`
      };
  
      await transporter.sendMail(userMailOptions);

      res.status(200).json({ message: 'Emails sent successfully!' });
  
    } catch (error) {
      console.error('Email error:', error);
      res.status(500).json({ message: 'Failed to send email.', error });
    }
  });
  

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
