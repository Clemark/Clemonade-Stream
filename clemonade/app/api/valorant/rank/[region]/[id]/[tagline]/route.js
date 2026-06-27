async function getRank(region, id, tagline) {
  //FETCHING ACCOUNT CURRENT RANK
  const url = `https://api.henrikdev.xyz/valorant/v3/mmr/${region}/pc/${id}/${tagline}`;

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
      throw new Error("No rank data");
    }

    // GET CURRENT RANK + RR
    const currentRank = data.data.current.tier.name;
    const rr = data.data.current.rr;
    const shields = data.data.current.rank_protection_shields;

    // PARSE SHIELDS
    let shield;

    switch (shields) {
      case 2:
        shield = "⛊⛊";
        break;
      case 1:
        shield = "⛊⛉";
        break;
      default:
        shield = "⛉⛉";
    }

    return `${currentRank} - ${rr}RR [${shield}]`;
  } catch (error) {
    return "Failed to fetch rank details";
  }
}

export async function GET(req, { params }) {
  const { region, id, tagline } = await params;

  // GET MATCH SUMMARY
  const summary = await getRank(region, id, tagline);

  return new Response(summary, {
    headers: {
      "Content-Type": "text/plain",
    },
  });
}
