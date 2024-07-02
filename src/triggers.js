import { storage } from "@forge/api";
import sgMail from "@sendgrid/mail";

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

function generateEmailHtml(events) {
  try {
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

    const eventHtml = events
      .map((event) => eventTemplate(event.value))
      .join("");

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

    console.log("generating html");
    return htmlContent;
  } catch (err) {
    console.log("Error generating html", err);
  }
}

async function getAllEvents() {
  try {
    const events = [];
    let cursor;

    const { results, nextCursor } = await storage
      .entity("events")
      .query()
      .index("city")
      .getMany();
    events.push(...results);
    cursor = nextCursor;

    while (cursor !== null) {
      const { results, nextCursor } = await storage
        .entity("events")
        .query()
        .index("city")
        .cursor(cursor)
        .getMany();
      events.push(...results);
      cursor = nextCursor;
    }

    return events;
  } catch (err) {
    console.log("Error getting all events", err);
  }
}

function getFilteredEvents(user, events) {
  return events.filter(
    (e) =>
      user.categories.includes(e.value.category) &&
      user.cities.includes(e.value.city)
  );
}

async function sendEmail(recipientEmail, events) {
  console.log(recipientEmail);

  try {
    const htmlContent = generateEmailHtml(events);

    const msg = {
      to: recipientEmail,
      from: "zachloh17@gmail.com",
      subject: "Upcoming Events",
      // text: "Test body",
      html: htmlContent,
    };

    await sgMail.send(msg);
    console.log("Email sent");
  } catch (err) {
    console.log("Error sending email", err);
  }
}

export async function scheduledTrigger(event) {
  console.log("Trigger fired");

  const users = [];
  try {
    const userKeys = await storage.get("subscribedUsers");
    if (!userKeys || userKeys.length === 0) {
      console.log("No subscribed users found.");
      return;
    }

    for (const userKey of userKeys) {
      const userData = await storage.get(userKey);

      if (userData) {
        const chosenCities = userData.cities
          .filter((city) => city.chosen)
          .map((city) => city.city.toLowerCase());

        const chosenCategories = userData.options
          .filter((option) => option.chosen)
          .map((option) => option.category.toLowerCase());

        users.push({
          email: userData.email,
          cities: chosenCities,
          categories: chosenCategories,
        });
      }
    }

    console.log(users);
  } catch (err) {
    console.log(`error: ${err}`);
  }

  const eventsData = await getAllEvents();

  for (const user of users) {
    const filteredEvents = getFilteredEvents(user, eventsData);
    console.log(filteredEvents);
    sendEmail(user.email, filteredEvents);
  }
}
