import sgMail from "@sendgrid/mail";

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

export async function scheduledTrigger(event) {
  console.log("Trigger fired");

  const msg = {
    to: "leongaun17@gmail.com", // Change to your recipient
    from: "zachloh17@gmail.com", // Change to your verified sender
    subject: "Test subject",
    text: "Test body",
    html: "<strong>Test body</strong>",
  };

  try {
    await sgMail.send(msg);
  } catch (err) {
    console.log(`error: ${err}`);
  }
}
