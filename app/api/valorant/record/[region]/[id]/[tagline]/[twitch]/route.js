function parseTime(uptimeText) {
  // EXTRACTING TIME COMPONENTS SAFELY
  const parseValue = (regex) => {
    const match = uptimeText.match(regex);
    return match ? parseInt(match[1], 10) : 0;
  };

  const hours = parseValue(/(\d+)\s*hour/);
  const minutes = parseValue(/(\d+)\s*minute/);
  const seconds = parseValue(/(\d+)\s*second/);

  // CONVERTING TO MILLISECONDS
  const uptimeMs = ((hours * 60 + minutes) * 60 + seconds) * 1000;

  // RETURN STREAM START TIMESTAMP IN UNIX SECONDS
  return Math.floor((Date.now() - uptimeMs) / 1000);
}

async function getMatchSummary(region, id, tagline, cutoffUnix) {
  const url = `https://api.henrikdev.xyz/valorant/v1/mmr-history/${region}/${id}/${tagline}`;

  const headers = {
    Authorization: process.env.HENRIKDEV_API_KEY,
  };

  try {
    const response = await fetch(url, {
      headers,
      next: {
        revalidate: 60,
      },
    });

    const data = await response.json();

    if (!response.ok || !data.data) {
      throw new Error("No match data");
    }

    // FILTER MATCHES AFTER STREAM START
    const filteredMatches = data.data.filter(
      (match) => match.date_raw >= cutoffUnix,
    );

    // NO MATCHES FOUND
    if (filteredMatches.length === 0) {
      return "No matches yet.";
    }

    let wins = 0;
    let losses = 0;
    let draws = 0;
    let rrChange = 0;

    const games = filteredMatches
      .map((match) => {
        const rr = match.mmr_change_to_last_game;

        rrChange += rr;

        if (rr > 0) {
          wins++;
          return "W";
        }

        if (rr < 0) {
          losses++;
          return "L";
        }

        draws++;
        return "D";
      })
      .join(" ");

    const rrIcon = rrChange > 0 ? "↑" : rrChange < 0 ? "↓" : "~";
    const rrFormatted = `${rrIcon}${Math.abs(rrChange)}`;

    return `${wins}W - ${losses}L - ${draws}D | ${rrFormatted} RR | ${games}`;
  } catch (error) {
    return "Failed to fetch match summary";
  }
}

export async function GET(req, { params }) {
  const { region, id, tagline, twitch } = await params;

  const deprecationNotice = [
    "DEPRECATED API: This endpoint is no longer maintained.",
    "Please use the latest version at https://clemxnade.com/",
    "",
  ].join("\n");

  // FETCH TWITCH UPTIME
  const uptimeRes = await fetch(`https://decapi.me/twitch/uptime/${twitch}`);

  const uptimeText = (await uptimeRes.text()).trim().toLowerCase();

  // HANDLING OFFLINE STREAM
  if (uptimeText.includes("offline")) {
    return new Response(`${deprecationNotice}${twitch} is currently offline.`, {
      headers: {
        "Content-Type": "text/plain",
      },
    });
  }

  // PARSE TO CUT OFF TIMESTAMP
  const cutoffUnix = parseTime(uptimeText);

  // GET MATCH SUMMARY
  const summary = await getMatchSummary(region, id, tagline, cutoffUnix);

  return new Response(`${summary}${deprecationNotice}`, {
    headers: {
      "Content-Type": "text/plain",
    },
  });
}
