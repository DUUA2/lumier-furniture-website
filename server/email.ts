import { MailService } from '@sendgrid/mail';
import type { Order } from '@shared/schema';

if (!process.env.SENDGRID_API_KEY) {
  console.warn("SENDGRID_API_KEY environment variable not set - email notifications disabled");
}

const mailService = new MailService();
if (process.env.SENDGRID_API_KEY) {
  mailService.setApiKey(process.env.SENDGRID_API_KEY);
}

interface EmailParams {
  to: string;
  from: string;
  subject: string;
  text?: string;
  html?: string;
}

export async function sendEmail(params: EmailParams): Promise<boolean> {
  if (!process.env.SENDGRID_API_KEY) {
    console.log("Email would be sent:", params.subject, "to", params.to);
    return false;
  }

  try {
    await mailService.send({
      to: params.to,
      from: params.from,
      subject: params.subject,
      text: params.text,
      html: params.html,
    });
    console.log("Email sent successfully to:", params.to);
    return true;
  } catch (error) {
    console.error('SendGrid email error:', error);
    return false;
  }
}

export async function sendOrderConfirmationEmail(order: Order): Promise<boolean> {
  const orderItems = Array.isArray(order.items) ? order.items : [];
  const deliveryAddress = order.deliveryAddress || { street: '', city: '', state: '' };
  
  const itemsHtml = orderItems.map(item => `
    <tr>
      <td style="padding: 10px; border-bottom: 1px solid #eee;">${item.name}</td>
      <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: center;">${item.quantity}</td>
      <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: right;">₦${item.price.toLocaleString()}</td>
      <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: center;">${item.type === 'buy' ? 'Purchase' : 'Rental'}</td>
    </tr>
  `).join('');

  const paymentPlanText = order.paymentPlan === 1 ? 'Full Payment' : `${order.paymentPlan} Month Installment`;
  
  const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>Order Confirmation - Lumier Furniture</title>
    </head>
    <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
      <div style="text-align: center; margin-bottom: 30px;">
        <h1 style="color: #D4AF37; margin: 0;">Lumier Furniture</h1>
        <p style="color: #666; margin: 5px 0;">RC: 3662809</p>
      </div>
      
      <h2 style="color: #333; border-bottom: 2px solid #D4AF37; padding-bottom: 10px;">Order Confirmation</h2>
      
      <p>Dear ${order.customerName},</p>
      <p>Thank you for your order! We've received your purchase and are processing it now.</p>
      
      <div style="background: #f9f9f9; padding: 15px; border-radius: 5px; margin: 20px 0;">
        <h3 style="margin-top: 0; color: #D4AF37;">Order Details</h3>
        <p><strong>Order Number:</strong> LUM-${order.id.toString().padStart(6, '0')}</p>
        <p><strong>Order Date:</strong> ${new Date(order.createdAt || new Date()).toLocaleDateString()}</p>
        <p><strong>Payment Plan:</strong> ${paymentPlanText}</p>
        <p><strong>Total Amount:</strong> ₦${order.total.toLocaleString()}</p>
      </div>

      <h3 style="color: #333;">Items Ordered</h3>
      <table style="width: 100%; border-collapse: collapse; margin: 15px 0;">
        <thead>
          <tr style="background: #D4AF37; color: white;">
            <th style="padding: 10px; text-align: left;">Item</th>
            <th style="padding: 10px; text-align: center;">Qty</th>
            <th style="padding: 10px; text-align: right;">Price</th>
            <th style="padding: 10px; text-align: center;">Type</th>
          </tr>
        </thead>
        <tbody>
          ${itemsHtml}
        </tbody>
      </table>

      <div style="background: #f0f8ff; padding: 15px; border-radius: 5px; margin: 20px 0;">
        <h3 style="margin-top: 0; color: #333;">Delivery Address</h3>
        <p>${deliveryAddress.street || 'N/A'}<br>
        ${deliveryAddress.city || 'N/A'}, ${deliveryAddress.state || 'N/A'}</p>
      </div>

      <div style="background: #fff9e6; padding: 15px; border-radius: 5px; margin: 20px 0;">
        <h3 style="margin-top: 0; color: #D4AF37;">What's Next?</h3>
        <ul style="margin: 0; padding-left: 20px;">
          <li>We'll process your order within 1-2 business days</li>
          <li>You'll receive a delivery confirmation with tracking details</li>
          <li>Our team will contact you to schedule delivery</li>
          <li>For installment plans, payment reminders will be sent monthly</li>
        </ul>
      </div>

      <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee;">
        <p style="color: #666;">Questions about your order? Contact us at support@lumierfurniture.com</p>
        <p style="color: #666; font-size: 12px;">Lumier Furniture - Premium Nigerian Furniture Solutions</p>
      </div>
    </body>
    </html>
  `;

  const textContent = `
Order Confirmation - Lumier Furniture

Dear ${order.customerName},

Thank you for your order! We've received your purchase and are processing it now.

Order Details:
- Order Number: LUM-${order.id.toString().padStart(6, '0')}
- Order Date: ${new Date(order.createdAt || new Date()).toLocaleDateString()}
- Payment Plan: ${paymentPlanText}
- Total Amount: ₦${order.total.toLocaleString()}

Items Ordered:
${orderItems.map(item => `- ${item.name} (Qty: ${item.quantity}) - ₦${item.price.toLocaleString()} - ${item.type === 'buy' ? 'Purchase' : 'Rental'}`).join('\n')}

Delivery Address:
${deliveryAddress.street || 'N/A'}
${deliveryAddress.city || 'N/A'}, ${deliveryAddress.state || 'N/A'}

What's Next?
- We'll process your order within 1-2 business days
- You'll receive a delivery confirmation with tracking details
- Our team will contact you to schedule delivery
- For installment plans, payment reminders will be sent monthly

Questions about your order? Contact us at support@lumierfurniture.com

Lumier Furniture - Premium Nigerian Furniture Solutions
RC: 3662809
  `;

  return await sendEmail({
    to: order.customerEmail,
    from: 'orders@lumierfurniture.com', // You can customize this sender email
    subject: `Order Confirmation - LUM-${order.id.toString().padStart(6, '0')} - Lumier Furniture`,
    text: textContent,
    html: htmlContent
  });
}

export async function sendAdminNotificationEmail(order: Order): Promise<boolean> {
  const orderItems = Array.isArray(order.items) ? order.items : [];
  const deliveryAddress = typeof order.deliveryAddress === 'object' ? order.deliveryAddress : {};
  
  const paymentPlanText = order.paymentPlan === 1 ? 'Full Payment' : `${order.paymentPlan} Month Installment`;
  
  const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>New Order Received - Lumier Furniture Admin</title>
    </head>
    <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
      <div style="background: #dc2626; color: white; padding: 15px; border-radius: 5px; text-align: center; margin-bottom: 20px;">
        <h1 style="margin: 0;">🛒 NEW ORDER RECEIVED</h1>
        <p style="margin: 5px 0;">Lumier Furniture Admin Notification</p>
      </div>
      
      <h2 style="color: #dc2626;">Order #LUM-${order.id.toString().padStart(6, '0')}</h2>
      
      <div style="background: #f9f9f9; padding: 15px; border-radius: 5px; margin: 20px 0;">
        <h3 style="margin-top: 0; color: #dc2626;">Customer Information</h3>
        <p><strong>Name:</strong> ${order.customerName}</p>
        <p><strong>Email:</strong> ${order.customerEmail}</p>
        <p><strong>Phone:</strong> ${order.customerPhone}</p>
        <p><strong>BVN:</strong> ${order.bvn}</p>
        <p><strong>NIN:</strong> ${order.nin}</p>
      </div>

      <div style="background: #f0f8ff; padding: 15px; border-radius: 5px; margin: 20px 0;">
        <h3 style="margin-top: 0; color: #dc2626;">Order Summary</h3>
        <p><strong>Order Date:</strong> ${new Date(order.createdAt || new Date()).toLocaleString()}</p>
        <p><strong>Payment Plan:</strong> ${paymentPlanText}</p>
        <p><strong>Total Amount:</strong> ₦${order.total.toLocaleString()}</p>
        <p><strong>Delivery Fee:</strong> ₦${order.deliveryFee.toLocaleString()}</p>
      </div>

      <h3 style="color: #dc2626;">Items Ordered</h3>
      ${orderItems.map(item => `
        <div style="border: 1px solid #ddd; padding: 10px; margin: 10px 0; border-radius: 5px;">
          <p><strong>${item.name}</strong></p>
          <p>Quantity: ${item.quantity} | Price: ₦${item.price.toLocaleString()} | Type: ${item.type === 'buy' ? 'Purchase' : 'Rental'}</p>
          <p>Color: ${item.color}</p>
        </div>
      `).join('')}

      <div style="background: #fff9e6; padding: 15px; border-radius: 5px; margin: 20px 0;">
        <h3 style="margin-top: 0; color: #dc2626;">Delivery Address</h3>
        <p>${deliveryAddress.street || 'N/A'}<br>
        ${deliveryAddress.city || 'N/A'}, ${deliveryAddress.state || 'N/A'}</p>
      </div>

      <div style="background: #f0fff0; padding: 15px; border-radius: 5px; margin: 20px 0;">
        <h3 style="margin-top: 0; color: #dc2626;">Action Required</h3>
        <ul style="margin: 0; padding-left: 20px;">
          <li>Process order within 1-2 business days</li>
          <li>Verify customer information and payment details</li>
          <li>Schedule delivery and contact customer</li>
          <li>Update inventory for ordered items</li>
        </ul>
      </div>

      <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee;">
        <p style="color: #666;">Login to admin panel to manage this order</p>
      </div>
    </body>
    </html>
  `;

  return await sendEmail({
    to: 'admin@lumierfurniture.com', // Admin email - you can customize this
    from: 'system@lumierfurniture.com',
    subject: `🛒 NEW ORDER: LUM-${order.id.toString().padStart(6, '0')} - ₦${order.totalAmount.toLocaleString()}`,
    html: htmlContent
  });
}