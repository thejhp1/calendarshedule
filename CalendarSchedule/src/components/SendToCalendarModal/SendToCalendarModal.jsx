import React, { useState } from "react";
import { useModal } from "../Modal/Modal";
import "../../styles/components/SendToCalendarModal.css";

function SendToCalendarModal({ estNames = "", pstNames = "" }) {
  const { closeModal } = useModal();

  // Convert comma-separated strings to arrays
  const estList = estNames.split(",").map((name) => name.trim()).filter(Boolean);
  const pstList = pstNames.split(",").map((name) => name.trim()).filter(Boolean);


  // Initialize each name as default value
  const [estEmails, setEstEmails] = useState(
    Object.fromEntries(estList.map((name, index) => [index, name]))
  );

  const [pstEmails, setPstEmails] = useState(
    Object.fromEntries(pstList.map((name, index) => [index, name]))
  );

  const handleEstChange = (index, value) => {
    setEstEmails((prev) => ({
      ...prev,
      [index]: value,
    }));
  };

  const handlePstChange = (index, value) => {
    setPstEmails((prev) => ({
      ...prev,
      [index]: value,
    }));
  };

const handleSubmit = (e) => {
  e.preventDefault();

  // Check if any EST input is empty
  const estHasEmpty = estEmails.some(email => !email.trim());
  const pstHasEmpty = pstEmails.some(email => !email.trim());

  if (estHasEmpty || pstHasEmpty) {
    alert("Please fill in all email fields before sending.");
    return; // Stop here
  }

  const estFullEmails = estList.map(
    (_, index) => `${estEmails[index]}@qawolf.com`
  );
  const pstFullEmails = pstList.map(
    (_, index) => `${pstEmails[index]}@qawolf.com`
  );

  const estDetails = estList.map(
    (name, index) => `${name}: ${estFullEmails[index]}`
  ).join("\n");

  const pstDetails = pstList.map(
    (name, index) => `${name}: ${pstFullEmails[index]}`
  ).join("\n");

  const confirm = window.confirm(
    `Are you sure the info is correct?\n\nEST Engineers:\n${estDetails}\n\nPST Engineers:\n${pstDetails}`
  );

  if (!confirm) {
    return; // Cancelled
  }

  console.log("EST emails:", estFullEmails);
  console.log("PST emails:", pstFullEmails);

  // Proceed with sending
  closeModal();
};


  return (
    <section className="send-to-calendar-container">
      <h1 style={{ fontSize: `30px` }}>Enter Information Here</h1>
      <section className="send-to-calendar-form">
        <form onSubmit={handleSubmit}>
          <h3>EST Engineers</h3>
          {estList.map((name, index) => (
            <div key={`est-${index}`} className="send-to-calendar-entry">
              <label>{name}:</label>
              <input
                type="text"
                value={estEmails[index] || ""}
                onChange={(e) => handleEstChange(index, e.target.value)}
              />
              <p>@qawolf.com</p>
            </div>
          ))}

          <h3>PST Engineers</h3>
          {pstList.map((name, index) => (
            <div key={`pst-${index}`} className="send-to-calendar-entry">
              <label>{name}:</label>
              <input
                type="text"
                value={pstEmails[index] || ""}
                onChange={(e) => handlePstChange(index, e.target.value)}
              />
              <p>@qawolf.com</p>
            </div>
          ))}

          <section className="send-to-calendar-buttons">
            <button type="submit">Send</button>
            <button type="button" onClick={closeModal}>
              Close
            </button>
          </section>
        </form>
      </section>
    </section>
  );
}

export default SendToCalendarModal;
