import { useState } from "react";
import { useNavigate } from "react-router-dom";

const NODE_API = "http://128.105.145.100:5001";   // 写死你的后端地址

export default function UrlInputPage() {
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setResult(null);
    setError(null);

    try {
      const res = await fetch(`${NODE_API}/api/fetch-ips`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url }),
      });
      const data = await res.json();

      if (!res.ok) throw new Error(data.error || "Server error");

      // 后端同步返回：{ url, vpn_node, ip_count, ips: [...] }
      console.log(data)
      localStorage.setItem("ipData", JSON.stringify(data));
      setResult(
        `Captured ${data.ip_count} public IPs via node ${
          data.vpn_node.location
        } (${data.vpn_node.node_ip})`
      );

      // 给用户 2 s 提示后跳转地图
      setTimeout(() => navigate("/map"), 2000);
    } catch (err) {
      setError("Failed: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        height: "100vh",
        width: "100vw",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "#f0f2f5",
      }}
    >
      <div
        style={{
          width: "90%",
          maxWidth: "600px",
          padding: "2rem",
          borderRadius: "12px",
          backgroundColor: "#fff",
          boxShadow: "0 4px 16px rgba(0, 0, 0, 0.1)",
          textAlign: "center",
        }}
      >
        <h1 style={{ marginBottom: "1.5rem", fontSize: "2rem", color: "#333" }}>
          See what IPs you contacted
        </h1>

        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="eg. https://netflix.com"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            required
            style={{
              width: "80%",
              padding: "1rem",
              fontSize: "1.1rem",
              borderRadius: "8px",
              border: "1px solid #ccc",
              marginBottom: "1rem",
            }}
          />
          <br />
          <button
            type="submit"
            disabled={loading}
            style={{
              padding: "0.8rem 1.5rem",
              fontSize: "1.1rem",
              backgroundColor: "#007bff",
              color: "white",
              border: "none",
              borderRadius: "8px",
              cursor: "pointer",
            }}
          >
            {loading ? "Fetching..." : "Submit"}
          </button>
        </form>

        {result && (
          <p style={{ marginTop: "1rem", fontSize: "1rem", color: "#444" }}>
            {result}
          </p>
        )}

        {error && (
          <p style={{ marginTop: "1rem", fontSize: "1rem", color: "red" }}>
            {error}
          </p>
        )}
      </div>
    </div>
  );
}
