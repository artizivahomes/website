/**
 * Artiziva Homes - Branded Email Templates
 */

const COLORS = {
  bg: "#050505",
  gold: "#c9a84c",
  goldLight: "#e4cc7a",
  cream: "#f5f0e8",
  textSecondary: "#a39e93",
  border: "#2a2a2a",
};

const BASE_STYLES = `
  body {
    background-color: ${COLORS.bg};
    color: ${COLORS.cream};
    font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    line-height: 1.6;
    margin: 0;
    padding: 0;
  }
  .container {
    max-width: 600px;
    margin: 0 auto;
    padding: 40px 20px;
  }
  .header {
    text-align: center;
    padding-bottom: 40px;
    border-bottom: 1px solid ${COLORS.border};
  }
  .logo {
    font-family: 'Playfair Display', serif;
    font-size: 24px;
    letter-spacing: 4px;
    color: ${COLORS.gold};
    text-transform: uppercase;
    text-decoration: none;
  }
  .content {
    padding: 40px 0;
  }
  .footer {
    text-align: center;
    padding-top: 40px;
    border-top: 1px solid ${COLORS.border};
    font-size: 12px;
    color: ${COLORS.textSecondary};
  }
  h1 {
    font-family: 'Playfair Display', serif;
    color: ${COLORS.gold};
    font-size: 28px;
    margin-bottom: 24px;
    font-weight: normal;
  }
  .detail-row {
    margin-bottom: 12px;
    border-bottom: 1px solid ${COLORS.border};
    padding-bottom: 12px;
  }
  .label {
    color: ${COLORS.gold};
    font-size: 11px;
    text-transform: uppercase;
    letter-spacing: 1px;
    display: block;
    margin-bottom: 4px;
  }
  .value {
    color: ${COLORS.cream};
    font-size: 15px;
  }
  .button {
    display: inline-block;
    padding: 14px 32px;
    background-color: ${COLORS.gold};
    color: ${COLORS.bg};
    text-decoration: none;
    text-transform: uppercase;
    font-weight: bold;
    font-size: 13px;
    letter-spacing: 2px;
    margin-top: 30px;
  }
`;

export const getEnquiryAdminEmail = (data: any) => {
  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <style>${BASE_STYLES}</style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <div class="logo">ARTIZIVA</div>
            <p style="color: ${COLORS.textSecondary}; font-size: 12px; letter-spacing: 2px; margin-top: 10px;">LUXURY BESPOKE HOMES</p>
          </div>
          
          <div class="content">
            <h1>New Bespoke Enquiry</h1>
            <p>A new enquiry has been received for a custom Artiziva masterpiece.</p>
            
            <div style="margin-top: 30px; background: #0c0c0c; padding: 30px; border: 1px solid ${COLORS.border};">
              <div class="detail-row">
                <span class="label">Client Name</span>
                <span class="value">${data.name}</span>
              </div>
              <div class="detail-row">
                <span class="label">Email Address</span>
                <span class="value">${data.email}</span>
              </div>
              <div class="detail-row">
                <span class="label">Phone Number</span>
                <span class="value">${data.phone}</span>
              </div>
              <div class="detail-row">
                <span class="label">Location</span>
                <span class="value">${data.city_state || "Not specified"}</span>
              </div>
              <div class="detail-row">
                <span class="label">Categories Interested</span>
                <span class="value">${data.categories?.join(", ") || "Not specified"}</span>
              </div>
              <div class="detail-row">
                <span class="label">Dimensions</span>
                <span class="value">${data.dimensions || "Not specified"}</span>
              </div>
              <div class="detail-row">
                <span class="label">Table Base</span>
                <span class="value">${data.table_base || "Not specified"}</span>
              </div>
              <div class="detail-row">
                <span class="label">Materials</span>
                <span class="value">${data.materials?.join(", ") || "Not specified"}</span>
              </div>
              <div class="detail-row">
                <span class="label">Timeline</span>
                <span class="value">${data.timeline || "Not specified"}</span>
              </div>
              ${data.style_description ? `
              <div class="detail-row">
                <span class="label">Requirements/Notes</span>
                <p class="value" style="margin-top: 8px;">${data.style_description}</p>
              </div>
              ` : ""}
              
              ${data.inspiration_images && data.inspiration_images.length > 0 ? `
              <div class="detail-row" style="border: none;">
                <span class="label">Inspiration Images</span>
                <div style="margin-top: 10px; display: flex; flex-wrap: wrap; gap: 10px;">
                  ${data.inspiration_images.map((img: string) => `
                    <img src="${img}" style="width: 100px; height: 100px; object-cover: cover; border: 1px solid ${COLORS.border};" />
                  `).join("")}
                </div>
              </div>
              ` : ""}
            </div>
            
            <a href="${process.env.NEXT_PUBLIC_SITE_URL}/admin" class="button">View in Dashboard</a>
          </div>
          
          <div class="footer">
            <p>&copy; ${new Date().getFullYear()} Artiziva Homes. All rights reserved.</p>
            <p>Sent from Artiziva Enquiry System</p>
          </div>
        </div>
      </body>
    </html>
  `;
};

export const getOrderConfirmationEmail = (order: any, customerName: string) => {
  const itemsHtml = order.items.map((item: any) => `
    <div style="display: flex; justify-content: space-between; padding: 10px 0; border-bottom: 1px solid ${COLORS.border};">
      <span style="color: ${COLORS.cream};">${item.product.title} x ${item.quantity}</span>
      <span style="color: ${COLORS.gold};">₹${(item.product.price * item.quantity).toLocaleString("en-IN")}</span>
    </div>
  `).join("");

  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <style>${BASE_STYLES}</style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <div class="logo">ARTIZIVA</div>
            <p style="color: ${COLORS.textSecondary}; font-size: 12px; letter-spacing: 2px; margin-top: 10px;">LUXURY BESPOKE HOMES</p>
          </div>
          
          <div class="content">
            <h1>Thank you for your order, ${customerName}</h1>
            <p>Your request for an Artiziva masterpiece has been received. Our concierge will contact you shortly to finalize details and arrange delivery.</p>
            
            <div style="margin: 30px 0; padding: 20px; border: 1px solid ${COLORS.gold}; text-align: center;">
              <span style="display: block; font-size: 11px; text-transform: uppercase; color: ${COLORS.gold}; letter-spacing: 2px; margin-bottom: 5px;">Order Reference</span>
              <span style="font-size: 20px; letter-spacing: 4px; color: ${COLORS.cream};">#${order.id.slice(0, 8).toUpperCase()}</span>
            </div>

            <div style="background: #0c0c0c; padding: 30px; border: 1px solid ${COLORS.border};">
              <h3 style="color: ${COLORS.gold}; font-family: 'Playfair Display', serif; font-weight: normal; margin-top: 0;">Order Summary</h3>
              ${itemsHtml}
              <div style="display: flex; justify-content: space-between; padding-top: 20px; font-weight: bold;">
                <span style="color: ${COLORS.gold}; text-transform: uppercase; letter-spacing: 1px;">Total</span>
                <span style="color: ${COLORS.cream};">₹${order.subtotal.toLocaleString("en-IN")}</span>
              </div>
            </div>

            <p style="margin-top: 30px; color: ${COLORS.textSecondary}; font-size: 14px;">
              Please note: As our furniture is bespoke and handcrafted, delivery timelines vary by piece.
            </p>
          </div>
          
          <div class="footer">
            <p>&copy; ${new Date().getFullYear()} Artiziva Homes. All rights reserved.</p>
            <p>Luxurious Living, Handcrafted for You.</p>
          </div>
        </div>
      </body>
    </html>
  `;
};
