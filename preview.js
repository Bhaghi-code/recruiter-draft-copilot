console.log("Recruiter Draft Copilot preview loaded.");


// ==================================================
// LOAD AI RESULT INTO PREVIEW
// ==================================================

chrome.storage.local.get(
  ["recruiterDraftResult"],
  (result) => {

    const output = result.recruiterDraftResult || "";

    if (!output) {
      document.getElementById("matchScore").textContent =
        "No AI result found.";
      return;
    }

    const getField = (label) => {

      const regex = new RegExp(
        `${label}:\\s*(.*)`,
        "i"
      );

      const match = output.match(regex);

      return match
        ? match[1].trim()
        : "—";
    };


    const emailBodyMatch = output.match(
      /6\.\s*Email body:\s*([\s\S]*)/i
    );

    const emailBody = emailBodyMatch
      ? emailBodyMatch[1].trim()
      : "Email body not found.";


    document.getElementById("matchScore").textContent =
      getField("Match score");

    document.getElementById("recruiterEmail").textContent =
      getField("Recruiter email");

    document.getElementById("jobTitle").textContent =
      getField("Job title");

    document.getElementById("location").textContent =
      getField("Location");

    document.getElementById("subject").textContent =
      getField("Subject");

    document.getElementById("emailBody").textContent =
      emailBody;
  }
);


// ==================================================
// CONNECT GMAIL
// ==================================================

document
  .getElementById("connectGmailButton")
  .addEventListener("click", () => {

    chrome.identity.getAuthToken(
      {
        interactive: true
      },

      async (token) => {

        if (chrome.runtime.lastError) {

          alert(
            "Gmail connection failed:\n\n" +
            chrome.runtime.lastError.message
          );

          return;
        }

        if (!token) {

          alert(
            "No Gmail authorization token was returned."
          );

          return;
        }


        // Verify which Gmail account the token belongs to

        try {

          const response = await fetch(
            "https://gmail.googleapis.com/gmail/v1/users/me/profile",
            {
              headers: {
                Authorization: `Bearer ${token}`
              }
            }
          );

          const profile = await response.json();

          if (!response.ok) {
            throw new Error(
              profile.error?.message ||
              "Unable to verify Gmail account."
            );
          }


          if (
            profile.emailAddress.toLowerCase() !==
            "bhaghirathi53@gmail.com"
          ) {

            alert(
              "Wrong Gmail account connected.\n\n" +
              "Connected account: " +
              profile.emailAddress +
              "\n\nExpected: bhaghirathi53@gmail.com"
            );

            return;
          }


          alert(
            "Gmail connected successfully!\n\n" +
            profile.emailAddress
          );

        }

        catch (error) {

          alert(
            "Gmail verification failed:\n\n" +
            error.message
          );

        }

      }
    );

  });


// ==================================================
// COPY EMAIL
// ==================================================

document
  .getElementById("copyButton")
  .addEventListener("click", async () => {

    const emailBody =
      document
        .getElementById("emailBody")
        .textContent;

    await navigator.clipboard.writeText(
      emailBody
    );

    alert(
      "Email copied to clipboard."
    );

  });


// ==================================================
// HTML HELPERS
// ==================================================

function escapeHtml(text) {

  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");

}


function convertBodyToHtml(body) {

  const lines = body.split("\n");

  let html = `
    <div style="
      font-family: Arial, Helvetica, sans-serif;
      font-size: 14px;
      line-height: 1.55;
      color: #202124;
    ">
  `;


  let insideList = false;


  for (let rawLine of lines) {

    const line = rawLine.trim();


    // Empty line

    if (!line) {

      if (insideList) {

        html += "</ul>";
        insideList = false;

      }

      html += `<div style="height:10px;"></div>`;
      continue;
    }


    // Section heading

    if (
      line ===
      "Highlights Relevant to the Role"
    ) {

      if (insideList) {

        html += "</ul>";
        insideList = false;

      }

      html += `
        <div style="
          font-weight:700;
          margin-top:14px;
          margin-bottom:8px;
        ">
          Highlights Relevant to the Role
        </div>
      `;

      continue;
    }


    // Bullet

    if (
      line.startsWith("- ") ||
      line.startsWith("• ")
    ) {

      if (!insideList) {

        html += `
          <ul style="
            margin-top:4px;
            margin-bottom:12px;
            padding-left:22px;
          ">
        `;

        insideList = true;
      }


      let bulletText =
        line.replace(/^[-•]\s*/, "");

      bulletText =
        escapeHtml(bulletText);


      // Bold text before first colon

      bulletText =
        bulletText.replace(
          /^([^:]{1,80}):/,
          "<strong>$1:</strong>"
        );


      html += `
        <li style="
          margin-bottom:5px;
        ">
          ${bulletText}
        </li>
      `;

      continue;
    }


    if (insideList) {

      html += "</ul>";
      insideList = false;

    }


    let formatted =
      escapeHtml(line);


    // Bold logistics labels

    formatted =
      formatted.replace(
        /^(Current Location:|Relocation:|Visa Status:|Availability:)/,
        "<strong>$1</strong>"
      );


    // Bold GitHub heading

    if (
      line.startsWith(
        "GitHub – AI & Technical Product Portfolio:"
      )
    ) {

      formatted =
        "<strong>GitHub – AI & Technical Product Portfolio:</strong>";

    }


    // Make GitHub URL clickable

    if (
      line ===
      "https://github.com/Bhaghi-code"
    ) {

      formatted = `
        <a
          href="https://github.com/Bhaghi-code"
          target="_blank"
        >
          https://github.com/Bhaghi-code
        </a>
      `;

    }


    // Bold name in signature

    if (
      line ===
      "Bhaghirathi Kundu"
    ) {

      formatted =
        "<strong>Bhaghirathi Kundu</strong>";

    }


    // Clickable email

    if (
      line ===
      "bhaghirathi53@gmail.com"
    ) {

      formatted = `
        <a href="mailto:bhaghirathi53@gmail.com">
          bhaghirathi53@gmail.com
        </a>
      `;

    }


    html += `
      <div style="
        margin-bottom:4px;
      ">
        ${formatted}
      </div>
    `;

  }


  if (insideList) {
    html += "</ul>";
  }


  html += "</div>";

  return html;
}


// ==================================================
// BASE64 URL ENCODING
// ==================================================

function base64UrlEncode(text) {

  const utf8Bytes =
    new TextEncoder().encode(text);

  let binary = "";

  utf8Bytes.forEach(
    (byte) => {
      binary += String.fromCharCode(byte);
    }
  );

  return btoa(binary)
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");

}


// ==================================================
// CREATE GMAIL API DRAFT
// ==================================================

document
  .getElementById("gmailButton")
  .addEventListener("click", () => {

    const recruiterEmail =
      document
        .getElementById("recruiterEmail")
        .textContent
        .trim();


    const subject =
      document
        .getElementById("subject")
        .textContent
        .trim();


    const emailBody =
      document
        .getElementById("emailBody")
        .textContent
        .trim();


    // Validate recruiter email

    if (
      !recruiterEmail ||
      recruiterEmail === "—" ||
      recruiterEmail.toUpperCase() === "N/A"
    ) {

      alert(
        "No recruiter email was found in the LinkedIn post."
      );

      return;
    }


    chrome.identity.getAuthToken(
      {
        interactive: true
      },

      async (token) => {

        if (chrome.runtime.lastError) {

          alert(
            "Gmail authorization failed:\n\n" +
            chrome.runtime.lastError.message
          );

          return;
        }


        if (!token) {

          alert(
            "No Gmail authorization token was returned."
          );

          return;
        }


        try {

          // ------------------------------------------
          // Verify sender account
          // ------------------------------------------

          const profileResponse =
            await fetch(
              "https://gmail.googleapis.com/gmail/v1/users/me/profile",
              {
                headers: {
                  Authorization:
                    `Bearer ${token}`
                }
              }
            );


          const gmailProfile =
            await profileResponse.json();


          if (!profileResponse.ok) {

            throw new Error(
              gmailProfile.error?.message ||
              "Unable to verify Gmail account."
            );

          }


          if (
            gmailProfile.emailAddress.toLowerCase() !==
            "bhaghirathi53@gmail.com"
          ) {

            throw new Error(
              "Wrong Gmail account connected: " +
              gmailProfile.emailAddress
            );

          }


          // ------------------------------------------
          // Convert email body to HTML
          // ------------------------------------------

          const htmlBody =
            convertBodyToHtml(emailBody);


          // ------------------------------------------
          // Build MIME email
          // ------------------------------------------

          const mimeMessage =
`To: ${recruiterEmail}
From: Bhaghirathi Kundu <bhaghirathi53@gmail.com>
Subject: ${subject}
MIME-Version: 1.0
Content-Type: text/html; charset="UTF-8"

${htmlBody}`;


          const encodedMessage =
            base64UrlEncode(
              mimeMessage
            );


          // ------------------------------------------
          // Create Gmail draft
          // ------------------------------------------

          const draftResponse =
            await fetch(
              "https://gmail.googleapis.com/gmail/v1/users/me/drafts",
              {
                method: "POST",

                headers: {
                  Authorization:
                    `Bearer ${token}`,

                  "Content-Type":
                    "application/json"
                },

                body: JSON.stringify({
                  message: {
                    raw: encodedMessage
                  }
                })
              }
            );


          const draftData =
            await draftResponse.json();


          if (!draftResponse.ok) {

            throw new Error(
              draftData.error?.message ||
              "Gmail draft creation failed."
            );

          }


          alert(
            "Gmail draft created successfully!\n\n" +
            "Sender: " +
            gmailProfile.emailAddress +
            "\n\n" +
            "Recipient: " +
            recruiterEmail +
            "\n\n" +
            "Open Gmail → Drafts to review it and attach your resume."
          );


          console.log(
            "Created Gmail Draft:",
            draftData
          );

        }

        catch (error) {

          alert(
            "Unable to create Gmail draft:\n\n" +
            error.message
          );

        }

      }
    );

  });