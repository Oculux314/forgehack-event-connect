import sgMail from "@sendgrid/mail";

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

function generateEmailHtml(events) {
  const eventTemplate = (event) => `
    <div class="event">
        <h2>${event.name}</h2>
        <p><strong>Description:</strong> ${event.description}</p>
        <p><strong>Date:</strong> ${event.date}</p>
        <p><strong>Time:</strong> ${event.time}</p>
        <p><strong>Venue:</strong> ${event.venue}</p>
        <p><strong>City:</strong> ${event.city}</p>
        <p><strong>Category:</strong> ${event.category}</p>
        <p><a href="${event.url}">More Information</a></p>
    </div>
  `;

  const eventHtml = events.map((event) => eventTemplate(event)).join("");

  const htmlContent = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Event Notification</title>
        <style>
            body {
                font-family: Arial, sans-serif;
                background-color: #f4f4f4;
                margin: 0;
                padding: 0;
            }
            .container {
                width: 80%;
                margin: 0 auto;
                background-color: #ffffff;
                padding: 60px;
                box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
            }
            .header {
                text-align: center;
                padding: 10px 0;
            }
            .content {
                margin: 20px 0;
            }
            .event {
                border-bottom: 1px solid #dddddd;
                padding: 10px 0;
            }
            .footer {
                text-align: center;
                padding: 10px 0;
                font-size: 12px;
                color: #888888;
            }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <h1>Upcoming Events</h1>
            </div>
            <div class="content" id="events">
                ${eventHtml}
            </div>
            <div class="footer">
                <p>Thank you for your attention.</p>
            </div>
        </div>
    </body>
    </html>
  `;

  return htmlContent;
}

export async function scheduledTrigger(event) {
  console.log("Trigger fired");

  const events = [
    {
      name: "Event 1",
      description: "Description 1",
      date: "Date 1",
      time: "Time 1",
      venue: "Venue 1",
      city: "City 1",
      category: "Category 1",
      url: "URL 1",
    },
    {
      name: "Event 2",
      description: "Description 2",
      date: "Date 2",
      time: "Time 2",
      venue: "Venue 2",
      city: "City 2",
      category: "Category 2",
      url: "URL 2",
    },
    {
      name: "Event 3",
      description: "Description 3",
      date: "Date 3",
      time: "Time 3",
      venue: "Venue 3",
      city: "City 3",
      category: "Category 3",
      url: "URL 3",
    },
  ];

  const htmlContent = generateEmailHtml(events);

  const msg = {
    to: "leongaun17@gmail.com", // Change to your recipient
    from: "zachloh17@gmail.com", // Change to your verified sender
    subject: "Test subject",
    text: "Test body",
    html: htmlContent,
  };

  try {
    await sgMail.send(msg);
    console.log("Email sent");
  } catch (err) {
    console.log(`error: ${err}`);
  }
}
