import React, { useState } from "react";
import * as XLSX from "xlsx";
import { ClipLoader } from "react-spinners";
import backgroundImage from "./4685.jpg";

function App() {
  const [jsonData, setJsonData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [mode, setMode] = useState("jsonToExcel"); // Mode to toggle between JSON to Excel and Excel to JSON
  const [excelData, setExcelData] = useState(null);

  // Function to handle file input change for JSON to Excel
  const handleFileChangeJson = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();

    reader.onload = (event) => {
      try {
        const json = JSON.parse(event.target.result);
        setJsonData(json);
        alert("JSON file loaded successfully!");
      } catch (error) {
        alert("Invalid JSON file");
      }
    };

    reader.onerror = (error) => {
      alert("Error reading file");
    };

    reader.readAsText(file);
  };

  // Function to handle file input change for Excel to JSON
  const handleFileChangeExcel = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();

    reader.onload = (event) => {
      const data = new Uint8Array(event.target.result);
      const workbook = XLSX.read(data, { type: "array" });
      const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
      const json = XLSX.utils.sheet_to_json(firstSheet);
      setExcelData(json);
      alert("Excel file converted to JSON!");
    };

    reader.readAsArrayBuffer(file);
  };

  // Function to convert JSON to Excel
  const convertJsonToExcel = () => {
    if (!jsonData) {
      alert("Please upload a JSON file first!");
      return;
    }

    setLoading(true); // Show loader

    setTimeout(() => {
      const worksheet = XLSX.utils.json_to_sheet(jsonData);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");

      XLSX.writeFile(workbook, "converted_data.xlsx");
      setLoading(false); // Hide loader
      alert("Excel file created successfully!");
    }, 2000); // Simulate processing delay
  };

  // Function to download the converted JSON file
  const downloadJson = () => {
    if (!excelData) {
      alert("No JSON data to download!");
      return;
    }

    const jsonString = `data:text/json;charset=utf-8,${encodeURIComponent(
      JSON.stringify(excelData, null, 2)
    )}`;
    const link = document.createElement("a");
    link.href = jsonString;
    link.download = "converted_data.json";

    link.click();
  };

  return (
    <div className="App" style={styles.container}>
      {/* Header */}
      <header style={styles.header}>
        <h1>File Converter</h1>
      </header>

      {/* Mode selector */}
      <div style={styles.modeSelector}>
        <button
          style={{
            ...styles.modeButton,
            backgroundColor: mode === "jsonToExcel" ? "#4CAF50" : "#ccc",
          }}
          onClick={() => setMode("jsonToExcel")}
        >
          JSON to Excel
        </button>
        <button
          style={{
            ...styles.modeButton,
            backgroundColor: mode === "excelToJson" ? "#4CAF50" : "#ccc",
          }}
          onClick={() => setMode("excelToJson")}
        >
          Excel to JSON
        </button>
      </div>

      {mode === "jsonToExcel" ? (
        <div style={styles.content}>
          <h2 style={styles.title}>Convert JSON to Excel</h2>
          <input
            type="file"
            accept=".json"
            onChange={handleFileChangeJson}
            style={styles.input}
          />
          <button
            style={styles.button}
            onClick={convertJsonToExcel}
            disabled={loading}
          >
            {loading ? "Converting..." : "Convert to Excel"}
          </button>
        </div>
      ) : (
        <div style={styles.content}>
          <h2 style={styles.title}>Convert Excel to JSON</h2>
          <input
            type="file"
            accept=".xlsx, .xls"
            onChange={handleFileChangeExcel}
            style={styles.input}
          />
          {excelData && (
            <>
              <textarea
                readOnly
                value={JSON.stringify(excelData, null, 2)}
                style={styles.textarea}
              />
              <button style={styles.button} onClick={downloadJson}>
                Download JSON
              </button>
            </>
          )}
        </div>
      )}

      {/* Loader */}
      {loading && (
        <div style={styles.loaderContainer}>
          <ClipLoader color="#4CAF50" loading={loading} size={50} />
        </div>
      )}

      {/* Footer */}
      <footer style={styles.footer}>
        <p>© 2024 Made with ❤️ by Swastik</p>
      </footer>
    </div>
  );
}

const styles = {
  container: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    height: "100vh",
    backgroundColor: "#f0f0f0",
    backgroundImage: `url(${backgroundImage})`,
    backgroundSize: "cover",
    backgroundPosition: "center", // Centers the image
    backgroundRepeat: "no-repeat", // Prevents repeating of the image
    padding: "20px",
    textAlign: "center",
  },
  header: {
    fontSize: "2rem",
    fontWeight: "bold",
    color: "#333",
    marginBottom: "20px",
  },
  modeSelector: {
    display: "flex",
    marginBottom: "20px",
  },
  modeButton: {
    padding: "10px 20px",
    fontSize: "16px",
    border: "none",
    cursor: "pointer",
    borderRadius: "5px",
    marginRight: "10px",
  },
  content: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  title: {
    fontSize: "1.5rem",
    fontWeight: "bold",
    color: "#333",
    marginBottom: "20px",
  },
  input: {
    marginBottom: "20px",
  },
  button: {
    padding: "10px 20px",
    backgroundColor: "#4CAF50",
    color: "white",
    fontSize: "16px",
    border: "none",
    cursor: "pointer",
    borderRadius: "5px",
    width: "200px",
    marginTop: "10px",
  },
  textarea: {
    width: "400px",
    height: "300px",
    padding: "10px",
    borderRadius: "5px",
    border: "1px solid #ccc",
    marginTop: "20px",
  },
  loaderContainer: {
    marginTop: "20px",
  },
  footer: {
    position: "absolute",
    bottom: "1px",
    textAlign: "center",
    fontSize: "1rem",
    color: "#666",
  },
};

export default App;
