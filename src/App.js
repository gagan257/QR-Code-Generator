import { useState, useRef, useEffect } from "react";
import QRCode from "react-qr-code";

function App() {
  const [inputValue, setInputValue] = useState(""); // for input field
  const [back, setBack] = useState("#FFFFFF");
  const [fore, setFore] = useState("#000000");
  const [size, setSize] = useState(256);
  const [design, setDesign] = useState("square");
  const [showDetails, setShowDetails] = useState(false);
  const [history, setHistory] = useState([]);
  const [value, setValue] = useState(); // value to generate QR
  const [showHistoryInfo, setShowHistoryInfo] = useState(false);
  const [showHowToInfo, setShowHowToInfo] = useState(false);
  const qrRef = useRef();

  // Load history from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem("qr_history");
    if (stored) setHistory(JSON.parse(stored));
  }, []);

  // Save to history when value changes and is not empty/duplicate
  useEffect(() => {
    if (value && value.trim() !== "") {
      setHistory((prev) => {
        if (prev[0] === value) return prev; // Don't add duplicate at top
        const filtered = prev.filter((v) => v !== value);
        const updated = [value, ...filtered].slice(0, 10); // Keep max 10
        localStorage.setItem("qr_history", JSON.stringify(updated));
        return updated;
      });
    }
  }, [value]);

  // Helper to get QR props based on design
  const getQRProps = () => {
    switch (design) {
      case "rounded":
        return {
          style: { borderRadius: 16, overflow: "hidden" },
          level: "H",
        };
      case "dots":
        // Simulate "dots" by using a high border radius (not perfect)
        return {
          style: { borderRadius: 50, overflow: "hidden" },
          level: "Q",
        };
      default:
        return {
          style: {},
          level: "M",
        };
    }
  };

  const handleDownload = () => {
    const svg = qrRef.current.querySelector("svg");
    if (!svg) return;

    const serializer = new XMLSerializer();
    const svgString = serializer.serializeToString(svg);
    const canvas = document.createElement("canvas");
    const img = new window.Image();
    const sizeVal = size === "" ? 300 : size;
    const padding = Math.round(sizeVal * 0.15); // 15% padding
    const totalSize = sizeVal + padding * 2;
    canvas.width = totalSize;
    canvas.height = totalSize;
    img.onload = function () {
      const ctx = canvas.getContext("2d");
      ctx.fillStyle = "#fff"; // Always white padding
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, padding, padding, sizeVal, sizeVal);
      const pngUrl = canvas.toDataURL("image/png");
      const downloadLink = document.createElement("a");
      downloadLink.href = pngUrl;
      downloadLink.download = "qr-code.png";
      document.body.appendChild(downloadLink);
      downloadLink.click();
      document.body.removeChild(downloadLink);
    };
    img.src =
      "data:image/svg+xml;base64," +
      window.btoa(unescape(encodeURIComponent(svgString)));
  };

  return (
    <div
      className="min-vh-100 d-flex align-items-center justify-content-center"
      style={{
        background: "#f4f6fb",
        minHeight: "100vh",
        padding: 0,
      }}
    >
      <div
        className="container-fluid"
        style={{
          width: "100vw",
          height: "100vh",
          background: "#fff",
          borderRadius: 0,
          boxShadow: "none",
          padding: 0,
          maxWidth: "100vw",
        }}
      >
        {!showDetails ? (
          // Layout with history tab on the left and main content on the right
          <div className="row g-0" style={{ height: "100vh" }}>
            {/* History Tab */}
            <div
              className="col-12 col-md-3 d-none d-md-flex flex-column align-items-start justify-content-start"
              style={{
                background: "#f8fafc",
                minHeight: "100vh",
                borderRight: "1px solid #e2e8f0",
                padding: "2.5rem 1rem 2.5rem 2rem",
                maxWidth: 260,
              }}
            >
              <div style={{ width: "100%" }}>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    marginBottom: 12,
                  }}
                >
                  <span
                    style={{
                      fontWeight: 600,
                      color: "#495057",
                      fontSize: "1.1rem",
                      display: "flex",
                      alignItems: "center",
                    }}
                  >
                    History
                    <span
                      style={{
                        marginLeft: 8,
                        cursor: "pointer",
                        color: "#007bff",
                        fontSize: "1.1rem",
                        display: "inline-flex",
                        alignItems: "center",
                      }}
                      title="About History"
                      onClick={() => setShowHistoryInfo(true)}
                    >
                      <svg
                        width="18"
                        height="18"
                        fill="currentColor"
                        viewBox="0 0 16 16"
                      >
                        <circle cx="8" cy="8" r="8" fill="#e9ecef" />
                        <text
                          x="8"
                          y="12"
                          textAnchor="middle"
                          fontSize="10"
                          fill="#007bff"
                          fontWeight="bold"
                        >
                          i
                        </text>
                      </svg>
                    </span>
                  </span>
                  {history.length > 0 && (
                    <button
                      className="btn btn-sm btn-outline-danger"
                      style={{
                        borderRadius: 6,
                        padding: "2px 10px",
                        fontSize: "0.95rem",
                      }}
                      onClick={() => {
                        setHistory([]);
                        localStorage.removeItem("qr_history");
                      }}
                    >
                      Delete
                    </button>
                  )}
                </div>
                {/* Info Popup */}
                {showHistoryInfo && (
                  <div
                    style={{
                      position: "fixed",
                      top: 0,
                      left: 0,
                      width: "100vw",
                      height: "100vh",
                      background: "rgba(0,0,0,0.25)",
                      zIndex: 9999,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                    onClick={() => setShowHistoryInfo(false)}
                  >
                    <div
                      style={{
                        background: "#fff",
                        borderRadius: 10,
                        boxShadow: "0 4px 24px rgba(0,0,0,0.12)",
                        padding: "2rem 2.5rem",
                        maxWidth: 340,
                        textAlign: "center",
                        position: "relative",
                      }}
                      onClick={(e) => e.stopPropagation()}
                    >
                      <div
                        style={{
                          fontSize: 28,
                          color: "#007bff",
                          marginBottom: 10,
                        }}
                      >
                        <svg
                          width="32"
                          height="32"
                          fill="currentColor"
                          viewBox="0 0 16 16"
                        >
                          <circle cx="8" cy="8" r="8" fill="#e9ecef" />
                          <text
                            x="8"
                            y="12"
                            textAnchor="middle"
                            fontSize="14"
                            fill="#007bff"
                            fontWeight="bold"
                          >
                            i
                          </text>
                        </svg>
                      </div>
                      <div
                        style={{
                          fontWeight: 600,
                          fontSize: "1.1rem",
                          marginBottom: 8,
                        }}
                      >
                        About QR History
                      </div>
                      <div
                        style={{
                          color: "#495057",
                          fontSize: "1rem",
                          marginBottom: 16,
                        }}
                      >
                        Your QR code history is saved only in your browser and
                        never leaves your device. Clearing browser data or
                        clicking "Delete" will remove this history.
                      </div>
                      <button
                        className="btn btn-sm btn-primary"
                        style={{ borderRadius: 6, padding: "4px 18px" }}
                        onClick={() => setShowHistoryInfo(false)}
                      >
                        OK
                      </button>
                    </div>
                  </div>
                )}
                {history.length > 0 ? (
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: 6,
                      maxHeight: "75vh",
                      overflowY: "auto",
                    }}
                  >
                    {history.map((item, idx) => (
                      <button
                        key={item + idx}
                        className="btn btn-sm btn-light text-start"
                        style={{
                          border: "1px solid #e2e8f0",
                          borderRadius: 6,
                          marginBottom: 2,
                          maxWidth: "100%",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                        }}
                        title={item}
                        onClick={() => {
                          setInputValue(item);
                          setValue(item);
                        }}
                      >
                        {item}
                      </button>
                    ))}
                  </div>
                ) : (
                  <div style={{ color: "#adb5bd", fontSize: "0.98rem" }}>
                    No history yet.
                  </div>
                )}
              </div>
            </div>
            {/* Main Content */}
            <div
              className="col-12 col-md-9 d-flex flex-column align-items-center justify-content-center"
              style={{ minHeight: "100vh" }}
            >
              <div
                style={{
                  width: 500,
                  maxWidth: "95vw",
                  background: "#F8FAFC",
                  borderRadius: 18,
                  boxShadow: "0 4px 24px rgba(0,0,0,0.08)",
                  padding: "2.5rem 2rem",
                }}
              >
                <div className="row text-center mt-3 mb-4">
                  <div className="col-md-12">
                    <h4
                      style={{
                        fontWeight: 700,
                        color: "#2d3748",
                        display: "inline-flex",
                        alignItems: "center",
                        gap: 8,
                      }}
                    >
                      QR Code Generator
                      <span
                        style={{
                          marginLeft: 4,
                          cursor: "pointer",
                          color: "#007bff",
                          fontSize: "1.1rem",
                          display: "inline-flex",
                          alignItems: "center",
                        }}
                        title="How to use"
                        onClick={() => setShowHowToInfo(true)}
                      >
                        <svg
                          width="18"
                          height="18"
                          fill="currentColor"
                          viewBox="0 0 16 16"
                        >
                          <circle cx="8" cy="8" r="8" fill="#e9ecef" />
                          <text
                            x="8"
                            y="12"
                            textAnchor="middle"
                            fontSize="10"
                            fill="#007bff"
                            fontWeight="bold"
                          >
                            i
                          </text>
                        </svg>
                      </span>
                    </h4>
                    <div style={{ fontSize: "0.95rem", color: "#6c757d" }}>
                      by{" "}
                      <a
                        href="https://gagan-redirect.netlify.app"
                        style={{
                          color: "#007bff",
                          textDecoration: "underline",
                        }}
                      >
                        Gagan Arora
                      </a>
                    </div>
                  </div>
                </div>
                {/* How To Use Popup */}
                {showHowToInfo && (
                  <div
                    style={{
                      position: "fixed",
                      top: 0,
                      left: 0,
                      width: "100vw",
                      height: "100vh",
                      background: "rgba(0,0,0,0.25)",
                      zIndex: 9999,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                    onClick={() => setShowHowToInfo(false)}
                  >
                    <div
                      style={{
                        background: "#fff",
                        borderRadius: 10,
                        boxShadow: "0 4px 24px rgba(0,0,0,0.12)",
                        padding: "2rem 2.5rem",
                        maxWidth: 340,
                        textAlign: "center",
                        position: "relative",
                      }}
                      onClick={(e) => e.stopPropagation()}
                    >
                      <div
                        style={{
                          fontSize: 28,
                          color: "#007bff",
                          marginBottom: 10,
                        }}
                      >
                        <svg
                          width="32"
                          height="32"
                          fill="currentColor"
                          viewBox="0 0 16 16"
                        >
                          <circle cx="8" cy="8" r="8" fill="#e9ecef" />
                          <text
                            x="8"
                            y="12"
                            textAnchor="middle"
                            fontSize="14"
                            fill="#007bff"
                            fontWeight="bold"
                          >
                            i
                          </text>
                        </svg>
                      </div>
                      <div
                        style={{
                          fontWeight: 600,
                          fontSize: "1.1rem",
                          marginBottom: 8,
                        }}
                      >
                        How to use
                      </div>
                      <div
                        style={{
                          color: "#495057",
                          fontSize: "1rem",
                          marginBottom: 16,
                        }}
                      >
                        1. Paste a link or text in the input box.
                        <br />
                        2. Click "Generate QR Code" to create your QR.
                        <br />
                        3. Download the QR as PNG.
                        <br />
                        4. Use "Additional Details" for more options.
                        <br />
                        5. Your recent QR codes appear in the History tab.
                      </div>
                      <button
                        className="btn btn-sm btn-primary"
                        style={{ borderRadius: 6, padding: "4px 18px" }}
                        onClick={() => setShowHowToInfo(false)}
                      >
                        OK
                      </button>
                    </div>
                  </div>
                )}
                <div className="row mt-3 mb-2">
                  <div className="col-md-12">
                    <input
                      className="w-100 form-control"
                      type="text"
                      value={inputValue}
                      onChange={(e) => setInputValue(e.target.value)}
                      placeholder="Paste Link to Generate QR code"
                      style={{
                        background: "#f8fafc",
                        border: "1px solid #e2e8f0",
                        borderRadius: 8,
                        padding: "0.75rem",
                        fontSize: "1rem",
                      }}
                    />
                  </div>
                </div>
                <div className="row mt-2 mb-2">
                  <div className="col-md-6">
                    <button
                      className="btn btn-primary w-100"
                      style={{
                        borderRadius: 8,
                        fontWeight: 600,
                        letterSpacing: "0.01em",
                      }}
                      onClick={() => {
                        if (inputValue && inputValue.trim() !== "") {
                          setValue(inputValue);
                        }
                      }}
                    >
                      Generate QR Code
                    </button>
                  </div>
                  <div className="col-md-6 text-end">
                    <button
                      className="btn btn-outline-primary"
                      style={{
                        borderRadius: 8,
                        fontWeight: 500,
                        letterSpacing: "0.02em",
                      }}
                      onClick={() => setShowDetails(true)}
                    >
                      Additional Details
                    </button>
                  </div>
                </div>
                <div
                  className="row mt-5 qr-container justify-content-center align-items-center"
                  style={{ minHeight: "300px" }}
                >
                  <div
                    ref={qrRef}
                    className="d-flex justify-content-center align-items-center"
                    style={{
                      width: size,
                      height: size,
                      background: "#f8fafc",
                      borderRadius: 16,
                      boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
                      margin: "0 auto",
                    }}
                  >
                    {value && (
                      <QRCode
                        title="Your QR code is ready!"
                        value={value}
                        bgColor={back}
                        fgColor={fore}
                        size={size === "" ? 300 : size}
                        {...getQRProps()}
                      />
                    )}
                  </div>
                  {value && (
                    <div className="mt-4 text-center w-100">
                      <button
                        className="btn btn-primary"
                        style={{
                          borderRadius: 8,
                          fontWeight: 600,
                          fontSize: "1.05rem",
                          letterSpacing: "0.01em",
                          padding: "0.6rem 2.2rem",
                          boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
                        }}
                        onClick={handleDownload}
                      >
                        Download as PNG
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        ) : (
          // Two columns when showing details (hide history tab)
          <div className="row g-0" style={{ height: "100vh" }}>
            {/* Left half: QR code and value input */}
            <div
              className="col-12 col-md-6 d-flex flex-column align-items-center justify-content-center"
              style={{
                background: "#fff",
                minHeight: "100vh",
                padding: "2.5rem 2rem",
                borderRight: "1px solid #e2e8f0",
              }}
            >
              <div className="w-100" style={{ maxWidth: 400 }}>
                <div className="text-center mb-4">
                  <h4
                    style={{
                      fontWeight: 700,
                      color: "#2d3748",
                      display: "inline-flex",
                      alignItems: "center",
                      gap: 8,
                    }}
                  >
                    QR Code Generator
                    <span
                      style={{
                        marginLeft: 4,
                        cursor: "pointer",
                        color: "#007bff",
                        fontSize: "1.1rem",
                        display: "inline-flex",
                        alignItems: "center",
                      }}
                      title="How to use"
                      onClick={() => setShowHowToInfo(true)}
                    >
                      <svg
                        width="18"
                        height="18"
                        fill="currentColor"
                        viewBox="0 0 16 16"
                      >
                        <circle cx="8" cy="8" r="8" fill="#e9ecef" />
                        <text
                          x="8"
                          y="12"
                          textAnchor="middle"
                          fontSize="10"
                          fill="#007bff"
                          fontWeight="bold"
                        >
                          i
                        </text>
                      </svg>
                    </span>
                  </h4>
                  <div style={{ fontSize: "0.95rem", color: "#6c757d" }}>
                    by{" "}
                    <a
                      href="https://gagan-redirect.netlify.app"
                      style={{ color: "#007bff", textDecoration: "underline" }}
                    >
                      Gagan Arora
                    </a>
                  </div>
                </div>
                {/* How To Use Popup */}
                {showHowToInfo && (
                  <div
                    style={{
                      position: "fixed",
                      top: 0,
                      left: 0,
                      width: "100vw",
                      height: "100vh",
                      background: "rgba(0,0,0,0.25)",
                      zIndex: 9999,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                    onClick={() => setShowHowToInfo(false)}
                  >
                    <div
                      style={{
                        background: "#fff",
                        borderRadius: 10,
                        boxShadow: "0 4px 24px rgba(0,0,0,0.12)",
                        padding: "2rem 2.5rem",
                        maxWidth: 340,
                        textAlign: "center",
                        position: "relative",
                      }}
                      onClick={(e) => e.stopPropagation()}
                    >
                      <div
                        style={{
                          fontSize: 28,
                          color: "#007bff",
                          marginBottom: 10,
                        }}
                      >
                        <svg
                          width="32"
                          height="32"
                          fill="currentColor"
                          viewBox="0 0 16 16"
                        >
                          <circle cx="8" cy="8" r="8" fill="#e9ecef" />
                          <text
                            x="8"
                            y="12"
                            textAnchor="middle"
                            fontSize="14"
                            fill="#007bff"
                            fontWeight="bold"
                          >
                            i
                          </text>
                        </svg>
                      </div>
                      <div
                        style={{
                          fontWeight: 600,
                          fontSize: "1.1rem",
                          marginBottom: 8,
                        }}
                      >
                        How to use
                      </div>
                      <div
                        style={{
                          color: "#495057",
                          fontSize: "1rem",
                          marginBottom: 16,
                        }}
                      >
                        1. Paste a link or text in the input box.
                        <br />
                        2. Click "Generate QR Code" to create your QR.
                        <br />
                        3. Download the QR as PNG.
                        <br />
                        4. Use "Additional Details" for more options.
                        <br />
                        5. Your recent QR codes appear in the History tab.
                      </div>
                      <button
                        className="btn btn-sm btn-primary"
                        style={{ borderRadius: 6, padding: "4px 18px" }}
                        onClick={() => setShowHowToInfo(false)}
                      >
                        OK
                      </button>
                    </div>
                  </div>
                )}
                <input
                  className="w-100 form-control mb-3"
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  placeholder="Paste Link to Generate QR code"
                  style={{
                    background: "#f8fafc",
                    border: "1px solid #e2e8f0",
                    borderRadius: 8,
                    padding: "0.75rem",
                    fontSize: "1rem",
                  }}
                />
                <div className="mb-3 d-flex">
                  <button
                    className="btn btn-primary flex-grow-1 me-2"
                    style={{
                      borderRadius: 8,
                      fontWeight: 600,
                      letterSpacing: "0.01em",
                    }}
                    onClick={() => {
                      if (inputValue && inputValue.trim() !== "") {
                        setValue(inputValue);
                      }
                    }}
                  >
                    Generate QR Code
                  </button>
                </div>
                <div
                  ref={qrRef}
                  className="d-flex justify-content-center align-items-center mb-4"
                  style={{
                    width: size,
                    height: size,
                    background: "#f8fafc",
                    borderRadius: 16,
                    boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
                    margin: "0 auto",
                  }}
                >
                  {value && (
                    <QRCode
                      title="Your QR code is ready!"
                      value={value}
                      bgColor={back}
                      fgColor={fore}
                      size={size === "" ? 300 : size}
                      {...getQRProps()}
                    />
                  )}
                </div>
                {value && (
                  <div className="mb-4 text-center w-100">
                    <button
                      className="btn btn-primary"
                      style={{
                        borderRadius: 8,
                        fontWeight: 600,
                        fontSize: "1.05rem",
                        letterSpacing: "0.01em",
                        padding: "0.6rem 2.2rem",
                        boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
                      }}
                      onClick={handleDownload}
                    >
                      Download as PNG
                    </button>
                  </div>
                )}
                {/* Removed Hide Additional Details button from here */}
              </div>
            </div>
            {/* Right half: Additional options */}
            <div
              className="col-12 col-md-6 d-flex flex-column align-items-center justify-content-center"
              style={{
                background: "#f8fafc",
                minHeight: "100vh",
                padding: "2.5rem 2rem",
              }}
            >
              <div className="w-100" style={{ maxWidth: 400 }}>
                <div className="text-center mb-4">
                  <button
                    className="btn btn-outline-danger"
                    style={{
                      borderRadius: 8,
                      fontWeight: 500,
                      letterSpacing: "0.02em",
                    }}
                    onClick={() => setShowDetails(false)}
                  >
                    Hide Additional Details
                  </button>
                </div>
                <h5
                  style={{ fontWeight: 600, color: "#2d3748" }}
                  className="mb-4"
                >
                  Additional QR Code Settings
                </h5>
                {/* <div className="mb-3">
                  <label style={{ fontWeight: 500, color: "#495057" }}>
                    Background Color
                  </label>
                  <input
                    className="w-100 form-control"
                    type="text"
                    onChange={(e) => setBack(e.target.value || "#FFFFFF")}
                    placeholder="Background Color Of QR Code"
                    style={{
                      background: "#fff",
                      border: "1px solid #e2e8f0",
                      borderRadius: 8,
                      padding: "0.75rem",
                      fontSize: "1rem",
                    }}
                  />
                </div>
                <div className="mb-3">
                  <label style={{ fontWeight: 500, color: "#495057" }}>
                    QR Code Colour
                  </label>
                  <input
                    className="w-100 form-control"
                    type="text"
                    onChange={(e) => setFore(e.target.value)}
                    placeholder="QR Code Colour"
                    style={{
                      background: "#fff",
                      border: "1px solid #e2e8f0",
                      borderRadius: 8,
                      padding: "0.75rem",
                      fontSize: "1rem",
                    }}
                  />
                </div> */}
                <div className="mb-3">
                  <label style={{ fontWeight: 500, color: "#495057" }}>
                    QR Code Style
                  </label>
                  <select
                    className="form-control"
                    value={design}
                    onChange={(e) => setDesign(e.target.value)}
                    style={{
                      background: "#fff",
                      border: "1px solid #e2e8f0",
                      borderRadius: 8,
                      padding: "0.6rem",
                      fontSize: "1rem",
                    }}
                  >
                    <option value="square">Square</option>
                    <option value="rounded">Rounded</option>
                    {/* <option value="dots">Dots</option> */}
                  </select>
                </div>
                <div className="container-fluid">
                  <div className="row">
                    <div className="col-md-12 text-center">
                      For Feedback/Suggestions email at{" "}
                      <a
                        href="mailto:arorag2577@gmail.com"
                        style={{
                          color: "#007bff",
                          textDecoration: "underline",
                        }}
                      >
                        arorag2577@gmail.com
                      </a>
                    </div>
                  </div>
                </div>
                {/* You can add more advanced options here if needed */}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
