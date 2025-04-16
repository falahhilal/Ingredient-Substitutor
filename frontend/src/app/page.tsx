"use client"

import { useRouter } from "next/navigation"

export default function HomePage() {
  const router = useRouter()

  return (
    <div style={{ height: "100vh", width: "100vw", position: "relative", overflow: "hidden" }}>
      <h1
        style={{
          position: "absolute",
          top: "20px",
          left: "20px",
          fontSize: "4rem",
          fontWeight: "bold",
          color: "#4b8a3f",
          margin: 0,
          padding: 0,
        }}
      >
        Product Analyzer      </h1>

      <div
        style={{
          position: "fixed",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          display: "flex",
          flexDirection: "column",
          gap: "20px",
          width: "250px",
        }}
      >
        <button
          onClick={() => router.push("/login")}
          style={{
            padding: "16px 32px",
            fontSize: "20px",
            fontWeight: "600",
            backgroundColor: "#a2a2a2",
            border: "1px solid #ccc",
            borderRadius: "15px",
            cursor: "pointer",
            boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
          }}
        >
          Login
        </button>

        <button
          onClick={() => router.push("/signup")}
          style={{
            padding: "16px 32px",
            fontSize: "20px",
            fontWeight: "600",
            backgroundColor: "#a2a2a2",
            border: "1px solid #ccc",
            borderRadius: "15px",
            cursor: "pointer",
            boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
          }}
        >
          Signup
        </button>

      </div>
    </div>
  )
}