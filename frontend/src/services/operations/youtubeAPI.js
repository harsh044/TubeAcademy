// Your YouTube API key (replace this with your actual key)
const API_KEY = "AIzaSyBfusPw-j4V76uIt1xaJkHsO3_54omeVwM";
const BASE_URL = "https://www.googleapis.com/youtube/v3/playlists";
const BASE_VIDEOS = "https://www.googleapis.com/youtube/v3/playlistItems"

function getPlaylistId(url) {
  // Ensure url is a string
  if (typeof url !== "string") {
    console.error("Invalid input: URL must be a string");
    return null;
  }

  // Regex to extract playlist ID
  const regex = /(?:list=)([a-zA-Z0-9_-]+)/;
  const match = url.match(regex);

  return match ? match[1] : null; // Return the playlist ID or null if not found
}
// function getPlaylistIdSubsection(url) {
//     const regex = /[?&]playlistId=([a-zA-Z0-9_-]+)/;
//     const match = url.match(regex);
//     return match ? match[1] : null;
//   }

export const fetchYouTubePlaylistData = async (playlist) =>{
  try {
    const playlistId = getPlaylistId(playlist);
    // console.log("playlistId >>",playlistId)
    // Make the API request to fetch the playlist details
    const response = await fetch(
      `${BASE_URL}?part=snippet,contentDetails&id=${playlistId}&key=${API_KEY}`
    );
    
    // console.log("response >>",response.json())
    // Check if the response is OK
    if (!response.ok) {
      throw new Error("Failed to fetch playlist data.");
    }

    // Parse the response JSON
    const data = await response.json();

    // Extract the relevant data from the response
    const items = data.items;
    // console.log("items >>",items)

    if (!items || items.length === 0) {
      throw new Error("No videos found in the playlist.");
    }

    // Assuming the first item in the playlist contains the title, description, etc.
    const playlistData = {
      instructorName: items[0].snippet.channelTitle,
      title: items[0].snippet.title,
      description: items[0].snippet.description,
      thumbnailImage: items[0].snippet.thumbnails.high.url, // Assuming you want the high-res thumbnail
      channelId: items[0].snippet.channelId
    };
    return playlistData;
  } catch (error) {
    console.error("Error fetching playlist data:", error);
    throw new Error("Failed to fetch playlist data.");
  }
};

// function getPlaylistId(url) {
//   const regex = /(?:list=)([a-zA-Z0-9_-]+)/;
//   const match = url.match(regex);
//   return match ? match[1] : null; // Return the playlist ID or null if not found
// }

export async function fetchYouTubePlaylistItems(playlist) {
  try {
    const playlistId = getPlaylistId(playlist);
    let allItems = [];
    let nextPageToken = null;

    // Loop to fetch all pages of the playlist
    do {
      // Make the API request to fetch the playlist details
      const response = await fetch(
        `${BASE_VIDEOS}?part=snippet&playlistId=${playlistId}&maxResults=100&pageToken=${nextPageToken || ''}&key=${API_KEY}`
      );
      
      // Check if the response is OK
      if (!response.ok) {
        throw new Error("Failed to fetch playlist data.");
      }

      // Parse the response JSON
      const data = await response.json();

      // Extract the relevant data from the response
      const items = data.items;
      if (!items || items.length === 0) {
        throw new Error("No videos found in the playlist.");
      }

      // Add the items from the current page to the allItems array
      allItems = [...allItems, ...items];

      // Get the nextPageToken for the next page of results, if any
      nextPageToken = data.nextPageToken;
    } while (nextPageToken); // Continue fetching as long as there is a nextPageToken

    return allItems;
  } catch (error) {
    console.error("Error fetching playlist data:", error);
    throw new Error("Failed to fetch playlist data.");
  }
};

function convertISO8601Duration(duration) {
    // Use regex to extract hours, minutes, and seconds
    const match = duration.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);
    if (!match) {
        return "Invalid format";
    }

    const hours = parseInt(match[1] || 0); // Extract hours or default to 0
    const minutes = parseInt(match[2] || 0); // Extract minutes or default to 0
    const seconds = parseInt(match[3] || 0); // Extract seconds or default to 0

    // Convert everything to minutes
    const totalMinutes = hours * 60 + minutes + seconds / 60;
    return totalMinutes;
}

export async function fetchVideoDuration(videoId) {
  try {
      const response = await fetch(`https://www.googleapis.com/youtube/v3/videos?part=contentDetails&id=${videoId}&key=${API_KEY}`)
      
      // Check if the response is OK
      if (!response.ok) {
        throw new Error("Failed to fetch playlist data.");
      }

      // Parse the response JSON
      const data = await response.json();

      // Extract the relevant data from the response
      const items = data.items;
      if (!items || items.length === 0) {
        throw new Error("No videos found in the playlist.");
      }
      // console.log("duration >>",data.items[0].contentDetails.duration)
      let duration = convertISO8601Duration(data.items[0].contentDetails.duration)

      // console.log("duration >>",duration)
      // console.log("total duration >>",totalduration)

    return duration
  } catch (error) {
    console.error("Error fetching playlist data:", error);
    throw new Error("Failed to fetch playlist data.");
  }
};

export const fetchYouTubeInstructorData = async (channelId) =>{
  try {
    // console.log("playlistId >>",playlistId)
    // Make the API request to fetch the playlist details
    const response = await fetch(`https://www.googleapis.com/youtube/v3/channels?part=snippet&id=${channelId}&key=${API_KEY}`)
    
    // console.log("response >>",response.json())
    // Check if the response is OK
    if (!response.ok) {
      throw new Error("Failed to fetch playlist data.");
    }

    // Parse the response JSON
    const data = await response.json();

    // Extract the relevant data from the response
    const items = data.items;
    // console.log("items >>",items)

    if (!items || items.length === 0) {
      throw new Error("No videos found in the playlist.");
    }

    // Assuming the first item in the playlist contains the title, description, etc.
    const channelData = {
      instructorlogo: items[0].snippet.thumbnails.high.url, // Assuming you want the high-res thumbnail
    };
    return channelData;
  } catch (error) {
    console.error("Error fetching playlist data:", error);
    throw new Error("Failed to fetch playlist data.");
  }
};