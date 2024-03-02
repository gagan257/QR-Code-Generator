import { useState } from "react";
import QRCode from "react-qr-code";

function App() {
  const [value, setValue] = useState();
  const [back, setBack] = useState("#FFFFFF");
  const [fore, setFore] = useState("#000000");
  const [size, setSize] = useState(256);

  return (
    <div className="container">
      <div className="row text-center mt-3">
        <div className="col-md-12">
          <h4>
            This App was build by{" "}
            <a href="https://gagan-redirect.netlify.app">Gagan Arora</a>
          </h4>
        </div>
      </div>
      <div className="row">
        <div className="col-md-6 mt-5">
          <input
            className="w-100 form-control"
            type="text"
            onChange={(e) => setBack(e.target.value || "#FFFFFF")}
            placeholder="Background color (optional)"
          />
        </div>
        <div className="col-md-6 mt-5">
          <input
            className="w-100 form-control"
            type="text"
            onChange={(e) => setFore(e.target.value)}
            placeholder="Foreground color (optional)"
          />
        </div>
      </div>
      <div className="row mt-3">
        <input
          className="w-100 form-control"
          type="text"
          onChange={(e) => setValue(e.target.value)}
          placeholder="Value of QR code"
        />
      </div>
      <div className="row mt-5 qr-container">
        {value && (
          <QRCode
            title="Your QR code is ready!"
            value={value}
            bgColor={back}
            fgColor={fore}
            size={size === "" ? 300 : size}
          />
        )}
      </div>
    </div>
  );
}

export default App;
