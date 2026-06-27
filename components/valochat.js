"use client";

import { useState } from "react";
import "../styles/valochat.css";

export default function ValoChatModule() {
  const [riotId, setRiotId] = useState("");
  const [tagline, setTagline] = useState("");
  const [region, setRegion] = useState("ap");
  const [twitch, setTwitch] = useState("");

  const [activeTab, setActiveTab] = useState("streamelements");
  const [toast, setToast] = useState(false);

  const baseUrl = "https://clemonade.vercel.app/api/valorant";

  // FIXED: removed extra ")"
  const rankCommand = `${baseUrl}/rank/${region}/${riotId}/${tagline}`;
  const recordCommand = `${baseUrl}/record/${region}/${riotId}/${tagline}/${twitch}`;

  // StreamElements
  const streamelementsRank = `!cmd add !rank $(customapi.${rankCommand})`;
  const streamelementsRecord = `!cmd add !record $(customapi.${recordCommand})`;

  // Nightbot
  const nightbotRank = `!commands add !rank $(urlfetch ${rankCommand})`;
  const nightbotRecord = `!commands add !record $(urlfetch ${recordCommand})`;

  const copyToClipboard = async (text) => {
    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(text);
      } else {
        const textArea = document.createElement("textarea");
        textArea.value = text;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand("copy");
        document.body.removeChild(textArea);
      }

      setToast(true);
      setTimeout(() => setToast(false), 1500);
    } catch (err) {
      console.log("Copy failed", err);
    }
  };

  return (
    <main>
      <h1>ValoChat</h1>

      <p className="subtitle">
        A simple integration tool for Valorant streamers to display live rank
        and session records directly on stream, utilizing data from the
        unofficial HenrikDev API.
      </p>

      {/* API SECTION */}
      <section>
        <h2>API Endpoints</h2>

        <div className="card">
          <h3>RANK</h3>
          <p className="header">
            <span>GET</span>
            /rank/[region]/[riotID]/[tagline]
          </p>
          <p className="card-info">
            Get player current rank details - current rank title, RR rating and
            shield.
          </p>
          <p className="response">Diamond 2 - 69RR [⛊⛊]</p>
        </div>

        <div className="card">
          <h3>RECORD</h3>
          <p className="header">
            <span>GET</span>
            /record/[region]/[riotID]/[tagline]/[twitch]
          </p>
          <p className="card-info">
            Get match session history including wins, losses, draws, RR changes,
            and streaks during stream.
          </p>
          <p className="response">5W - 2L - 0D | ↑20RR | WWLWLWW</p>
        </div>

        <p className="footer">DATA FROM HENRIKDEV UNOFFICIAL VALORANT API</p>
      </section>

      {/* CHATBOT SECTION */}
      <section>
        <h2>Chatbot Integrations</h2>
        <p>Fill in the details below, then click a command to copy.</p>

        {/* INPUTS */}
        <div className="form">
          <input
            className="valoinput"
            placeholder="Riot ID"
            value={riotId}
            onChange={(e) => setRiotId(e.target.value)}
          />

          <input
            className="valoinput"
            placeholder="Tagline (without #)"
            value={tagline}
            onChange={(e) => setTagline(e.target.value)}
          />

          <select
            className="valoinput"
            value={region}
            onChange={(e) => setRegion(e.target.value)}
          >
            <option value="eu">Europe</option>
            <option value="ap">Asia Pacific</option>
            <option value="na">North America</option>
            <option value="latam">Latin America</option>
            <option value="br">Brazil</option>
            <option value="kr">Korea</option>
          </select>

          <input
            className="valoinput"
            placeholder="Twitch Channel"
            value={twitch}
            onChange={(e) => setTwitch(e.target.value)}
          />
        </div>

        {/* TABS */}
        <div className="tabs">
          <button
            className={`tab ${activeTab === "streamelements" ? "active" : ""}`}
            onClick={() => setActiveTab("streamelements")}
          >
            StreamElements
          </button>

          <button
            className={`tab ${activeTab === "nightbot" ? "active" : ""}`}
            onClick={() => setActiveTab("nightbot")}
          >
            Nightbot
          </button>
        </div>

        {/* COMMANDS */}
        <div className="commands">
          {/* STREAM ELEMENTS */}
          {activeTab === "streamelements" && (
            <>
              <div
                className="command-box"
                onClick={() => copyToClipboard(streamelementsRank)}
              >
                <h4>Rank Command</h4>
                <code>{streamelementsRank}</code>
              </div>

              <div
                className="command-box"
                onClick={() => copyToClipboard(streamelementsRecord)}
              >
                <h4>Record Command</h4>
                <code>{streamelementsRecord}</code>
              </div>
            </>
          )}

          {/* NIGHTBOT */}
          {activeTab === "nightbot" && (
            <>
              <div
                className="command-box"
                onClick={() => copyToClipboard(nightbotRank)}
              >
                <h4>Rank Command</h4>
                <code>{nightbotRank}</code>
              </div>

              <div
                className="command-box"
                onClick={() => copyToClipboard(nightbotRecord)}
              >
                <h4>Record Command</h4>
                <code>{nightbotRecord}</code>
              </div>
            </>
          )}
        </div>
      </section>

      {/* TOAST */}
      {toast && <div className="toast">Copied to clipboard</div>}
    </main>
  );
}
