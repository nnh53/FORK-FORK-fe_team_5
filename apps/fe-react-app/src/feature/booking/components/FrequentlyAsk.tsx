import Folder from "../../../../Reactbits/Folder/Folder";

const FrequentlyAsk = () => {
  const faq1 = [
    <div key="faq1" style={{ padding: "4px", fontSize: "7px", color: "#333", lineHeight: "1.2", wordWrap: "break-word" }}>
      <strong>Cancel booking?</strong>
      <br />
      <span style={{ fontSize: "6px" }}>My Bookings → Cancel</span>
    </div>,
  ];

  const faq2 = [
    <div key="faq2" style={{ padding: "4px", fontSize: "7px", color: "#333", lineHeight: "1.2", wordWrap: "break-word" }}>
      <strong>Refund policy?</strong>
      <br />
      <span style={{ fontSize: "6px" }}>24hrs processing</span>
    </div>,
  ];

  const faq3 = [
    <div key="faq3" style={{ padding: "4px", fontSize: "7px", color: "#333", lineHeight: "1.2", wordWrap: "break-word" }}>
      <strong>Seat selection?</strong>
      <br />
      <span style={{ fontSize: "6px" }}>During booking</span>
    </div>,
  ];

  return (
    <div style={{ height: "600px", position: "relative", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div style={{ textAlign: "center" }}>
        <h3 style={{ marginBottom: "30px", color: "#5227FF" }}>Frequently Asked Questions</h3>
        <p style={{ marginBottom: "30px", color: "#666" }}>Click each folder to explore different questions</p>

        <div style={{ display: "flex", gap: "40px", alignItems: "center", justifyContent: "center", flexWrap: "wrap" }}>
          <div style={{ textAlign: "center" }}>
            <Folder size={1.5} color="#5227FF" className="custom-folder-1" items={faq1} />
            <p style={{ marginTop: "10px", fontSize: "12px", color: "#666" }}>Booking</p>
          </div>

          <div style={{ textAlign: "center" }}>
            <Folder size={1.5} color="#FF6B35" className="custom-folder-2" items={faq2} />
            <p style={{ marginTop: "10px", fontSize: "12px", color: "#666" }}>Refunds</p>
          </div>

          <div style={{ textAlign: "center" }}>
            <Folder size={1.5} color="#00C9A7" className="custom-folder-3" items={faq3} />
            <p style={{ marginTop: "10px", fontSize: "12px", color: "#666" }}>Seats</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FrequentlyAsk;
