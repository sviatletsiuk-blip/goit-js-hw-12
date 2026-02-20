import iziToast from "izitoast";
import "izitoast/dist/css/iziToast.min.css";

import { getImagesByQuery } from "./js/pixabay-api.js";

import {
  createGallery,
  clearGallery,
  showLoader,
  hideLoader,
  showLoadMoreButton,
  hideLoadMoreButton,
} from "./js/render-functions.js";

const form = document.querySelector(".form");
const loadMoreBtn = document.querySelector(".load-more");

let currentQuery = "";
let currentPage = 1;
let totalHits = 0;

const PER_PAGE = 15;

// --- Обробник сабміту форми ---
form.addEventListener("submit", async (event) => {
  event.preventDefault();

  const query = event.currentTarget.elements["search-text"].value.trim();

  if (!query) {
    iziToast.warning({
      message: "Please enter a search query!",
      position: "topRight",
    });
    return;
  }

  currentQuery = query;
  currentPage = 1;
  totalHits = 0;

  clearGallery();
  hideLoadMoreButton();
  showLoader();

  try {
    const data = await getImagesByQuery(currentQuery, currentPage);
    totalHits = data.totalHits;

    if (data.hits.length === 0) {
      iziToast.error({
        message:
          "Sorry, there are no images matching your search query. Please try again!",
        position: "topRight",
      });
      return;
    }

    createGallery(data.hits);

    const totalPages = Math.ceil(totalHits / PER_PAGE);

    if (totalPages === 1) {
      // Якщо лише одна сторінка результатів
      iziToast.info({
        message: "We're sorry, but you've reached the end of search results.",
        position: "topRight",
      });
      hideLoadMoreButton();
    } else {
      showLoadMoreButton();
      loadMoreBtn.disabled = false;
    }
  } catch (error) {
    iziToast.error({
      message: "Something went wrong. Please try again!",
      position: "topRight",
    });
  } finally {
    hideLoader();
  }
});

// --- Обробник кліку Load More ---
loadMoreBtn.addEventListener("click", async () => {
  hideLoadMoreButton(); // ховаємо кнопку під час запиту
  showLoader();

  currentPage += 1;

  try {
    const data = await getImagesByQuery(currentQuery, currentPage);
    createGallery(data.hits);

    const totalPages = Math.ceil(totalHits / PER_PAGE);

    if (currentPage >= totalPages) {
      // Досягли кінця результатів
      hideLoadMoreButton();
      iziToast.info({
        message: "We're sorry, but you've reached the end of search results.",
        position: "topRight",
      });
    } else {
      showLoadMoreButton();
      loadMoreBtn.disabled = false; // кнопка знову активна
    }

    // Плавна прокрутка після додавання карток
    const card = document.querySelector(".gallery-item");
    if (card) {
      const cardHeight = card.getBoundingClientRect().height;
      window.scrollBy({
        top: cardHeight * 2,
        behavior: "smooth",
      });
    }
  } catch (error) {
    iziToast.error({
      message: "Something went wrong. Please try again!",
      position: "topRight",
    });
  } finally {
    hideLoader();
  }
});