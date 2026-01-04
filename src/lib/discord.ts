const BOT_TOKEN = import.meta.env.DISCORD_BOT_TOKEN

const ANNOUNCEMENT_CHANNEL_ID = "1457306038658400278"

export async function sendDiscordMessage(content: string) {
  const response = await fetch(
    `https://discord.com/api/v9/channels/${ANNOUNCEMENT_CHANNEL_ID}/messages`,
    {
      method: "post",
      body: JSON.stringify({ content }),
      headers: {
        Authorization: `Bot ${BOT_TOKEN}`,
        "Content-Type": "application/json",
      },
    },
  )
  const data = await response.json()
  return data
}
