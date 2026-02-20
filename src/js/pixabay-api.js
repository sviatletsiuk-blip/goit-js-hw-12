import axios from "axios";

const API_KEY = "54668124-f075674b72691b434b6dd74f8";
const BASE_URL = "https://pixabay.com/api/";

export async function getImagesByQuery(query, page) {
  const response = await axios.get(BASE_URL, {
    params: {
      key: API_KEY,
      q: query,
      image_type: "photo",
      orientation: "horizontal",
      safesearch: true,
      per_page: 15,
      page: page,
    },
  });

  return response.data;
}