import axios from 'axios';

export default async function getImage(value, page) {
  const KEY = '29694280-1f89fd7ceb8297b5baecd65b3';
  const url = `https://pixabay.com/api/?key=${KEY}&q=${value}&image_type=photo&orientation=horizontal&safesearch=true&per_page=40&page=${page}`;
  return await axios.get(url).then(res => res.data);
}
