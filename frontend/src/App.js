import { useEffect, useState } from "react";
import API from "./api";

function App() {
  const [url, setUrl] = useState("");
  const [logs, setLogs] = useState([]);

  // 📊 fetch logs
  const fetchLogs = async () => {
    const res = await API.get("/logs");
    setLogs(res.data);
  };

  // ➕ add API (NO POSTMAN)
  const addApi = async () => {
    if (!url) return alert("Enter API URL");

    await API.post("/add-api", { url });
    setUrl("");
    fetchLogs();
  };

  useEffect(() => {
    fetchLogs();
    const interval = setInterval(fetchLogs, 4000);
    return () => clearInterval(interval);
  }, []);

  // const deleteApi=async(id)=>{
  //  try {
  //   await API.delete("/delete-api",{

  //   })
    
  //  } catch (error) {
  //   console.log(error.message)
  //   alert(error.message)
  //  }
  // }

  const getScore = (status, time) => {
    if (status !== "UP") return 0;
    if (time < 300) return 100;
    if (time < 800) return 70;
    return 40;
  };

  return (
    <div style={styles.bg}>
      <h1 style={styles.title}>🚀 API CONTROL DASHBOARD</h1>

      {/* INPUT */}
      <div style={styles.form}>
        <input
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="Enter API URL..."
          style={styles.input}
        />
        <button onClick={addApi} style={styles.btn}>
          Add API
        </button>
      </div>

      {/* CARDS */}
      <div style={styles.grid}>
        {logs.map((log, i) => {
          const score = getScore(log.status, log.responseTime);

          return (
            <div key={i} style={{
              ...styles.card,
              borderColor: log.status === "UP" ? "#00ff88" : "#ff004c",
              boxShadow: log.status === "UP"
                ? "0 0 15px #00ff88"
                : "0 0 15px #ff004c"
            }}>
              <h3>🌐 API</h3>
              <p style={styles.url}>{log.url}</p>

              <div style={{
                ...styles.badge,
                background: log.status === "UP" ? "#00ff88" : "#ff004c"
              }}>
                {log.status}
              </div>

              <p>⚡ {log.responseTime} ms</p>
              <p>🧠 Score: {score}/100</p>

              <div style={styles.barBg}>
                <div style={{
                  width: `${score}%`,
                  height: "8px",
                  background:
                    score > 70 ? "#00ff88" :
                    score > 40 ? "#ffaa00" : "#ff004c",
                  borderRadius: "5px"
                }} />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// 🎨 STYLES
const styles = {
  bg: {
    background: "#0f172a",
    minHeight: "100vh",
    color: "white",
    padding: "20px",
    fontFamily: "Arial"
  },
  title: {
    textAlign: "center",
    color: "#00ff88"
  },
  form: {
    display: "flex",
    justifyContent: "center",
    gap: "10px",
    marginBottom: "20px"
  },
  input: {
    padding: "10px",
    width: "300px",
    borderRadius: "5px",
    border: "none"
  },
  btn: {
    background: "#00ff88",
    border: "none",
    padding: "10px",
    cursor: "pointer",
    fontWeight: "bold"
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
    gap: "15px"
  },
  card: {
    padding: "15px",
    border: "2px solid",
    borderRadius: "10px",
    background: "#111827"
  },
  url: {
    fontSize: "12px",
    wordBreak: "break-word"
  },
  badge: {
    display: "inline-block",
    padding: "5px 10px",
    borderRadius: "20px",
    color: "black",
    fontWeight: "bold"
  },
  barBg: {
    background: "#333",
    height: "8px",
    borderRadius: "5px",
    marginTop: "10px"
  }
};

export default App;