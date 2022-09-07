import './styles.css';
import getImage from './js/fetch_image';
import LoadMoreBtn from './js/loadmore';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

const searchForm = document.querySelector('.search-form');
const galleryList = document.querySelector('.gallery');
const btnLoadMore = new LoadMoreBtn({
  selector: '.load-more',
  hidden: true,
});

searchForm.addEventListener('submit', onSubmit);
btnLoadMore.refs.button.addEventListener('click', onLoadMore);
btnLoadMore.hide();

let queryItem = '';
let currentPage = 1;
let currentHits = 0;

function createGalleryCard(gallery) {
  const markup = gallery
    .map(
      ({
        webformatURL,
        largeImageURL,
        tags,
        likes,
        views,
        comments,
        downloads,
      }) => {
        return `<li class="photo-card"><a class="gallery__item" href="${largeImageURL}">
  <img src="${webformatURL}" alt="${tags}" loading="lazy" />
  <div class="info">
    <p class="info-item">
      <b>Likes:</b> <span>${likes}</span> 
    </p>
    <p class="info-item">
      <b>Views:</b> <span>${views}</span>
    </p>
    <p class="info-item">
      <b>Comments:</b> <span>${comments}</span> 
    </p>
    <p class="info-item">
      <b>Downloads:</b> <span>${downloads}</span> 
    </p>
  </div>
  </a></li>`;
      }
    )
    .join('');
  galleryList.insertAdjacentHTML('beforeend', markup);
}

async function onSubmit(e) {
  e.preventDefault();
  queryItem = e.currentTarget.searchQuery.value;
  currentPage = 1;
  clearGallery();

  if (queryItem === '') {
    return;
  }
  const res = await getImage(queryItem, currentPage);
  currentHits = res.hits.length;
  try {
    if (res.totalHits > 0) {
      Notify.success(`Hooray! We found ${res.totalHits} images.`);
      createGalleryCard(res.hits);
      btnLoadMore.show();
      scrollPage();
      lightbox.refresh();
    }

    if (res.totalHits === 0) {
      Notify.failure(
        'Sorry, there are no images matching your search query. Please try again.'
      );
    }
  } catch (error) {
    console.log(error);
  }
}

function clearGallery() {
  galleryList.innerHTML = '';
}

let lightbox = new SimpleLightbox('.gallery a', {
  captionsData: 'alt',
  captionDelay: 250,
  showCounter: false,
  overlayOpacity: 0.9,
});

async function onLoadMore() {
  currentPage += 1;
  const res = await getImage(queryItem, currentPage);
  createGalleryCard(res.hits);
  lightbox.refresh();
  currentHits += res.hits.length;
  scrollPage();

  if (currentHits === res.totalHits) {
    btnLoadMore.hide();
    Notify.info("We're sorry, but you've reached the end of search results.");
  }
}

function scrollPage() {
  const { height: cardHeight } = document
    .querySelector('.gallery')
    .firstElementChild.getBoundingClientRect();

  window.scrollBy({
    top: cardHeight * 2,
    behavior: 'smooth',
  });
}
