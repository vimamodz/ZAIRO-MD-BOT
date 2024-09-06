const { cmd } = require('../command');
const yts = require('yt-search');
const { fetchJson } = require('../lib/functions');

// Helper function to format views
const formatViews = (views) => {
    if (views >= 1_000_000_000) {
        return `${(views / 1_000_000_000).toFixed(1)}B`;
    } else if (views >= 1_000_000) {
        return `${(views / 1_000_000).toFixed(1)}M`;
    } else if (views >= 1_000) {
        return `${(views / 1_000).toFixed(1)}K`;
    } else {
        return views.toString();
    }
};

// URL for the voice note


//========= YTS Search Command for Horizontal Scroll Thumbnails =========//

cmd({
    pattern: "yts",
    alias: ["yta", "ytv", "yt"],
    desc: "Search and display YouTube video details with thumbnails for horizontal scrolling",
    category: "search",
    filename: __filename
},
async (conn, mek, m, { from, q, reply }) => {
    try {
        if (!q) return reply("Please type a Name or Url... 🤖");

        const search = await yts(q);
        const videos = search.videos.slice(0, 10); // Get only the first 10 videos

        if (videos.length === 0) return reply("No videos found for your query.");

        // Send video details in a horizontal scroll style
        for (let video of videos) {
            const message = `🎶 *Title*: _${video.title}_\n` +
                            `👤 *Channel*: _${video.author.name}_\n` +
                            `⏳ *Duration*: _${video.timestamp}_\n` +
                            `👁️ *Views*: _${formatViews(video.views)}_\n` +
                            `🔗 *Link*: ${video.url}\n\n`;

            // Send thumbnail with details
            await conn.sendMessage(from, { image: { url: video.thumbnail }, caption: message }, { quoted: mek });
        }

        // Send the voice note after sending the thumbnails
        await conn.sendMessage(from, { audio: { url: voiceUrl }, mimetype: 'audio/mp4', ptt: true }, { quoted: mek });

    } catch (e) {
        console.log(e);
        reply(`Error: ${e.message}`);
    }
});