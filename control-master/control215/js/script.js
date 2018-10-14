const button = document.querySelector('button');
const subInput = document.querySelector('input');
const result = document.querySelector('#result');

function renderList(json) {
  const posts = json.data.children;
  return `<ol>
    ${posts.map(
      post => `<li>${post.data.title} <a href=${post.data.url} target='_blank'>Link</a></li>`
    ).join('')}
  </ol>`;
}

async function fetchTopFive(sub) {
  const URL = `https://www.reddit.com/r/${sub}/top/.json?limit=5`;
  try {
    const fetchResult = fetch(new Request(URL, { method: 'GET', cache: 'reload' }));
    const response = await fetchResult;
    if (response.ok) {
      const jsonData = await response.json();
      result.innerHTML = renderList(jsonData);
    } else {
      result.innerHTML = `Response.status: ${response.status}`;
    }
  } catch (e) {
    result.innerHTML = e;
  }
}

button.addEventListener('click', () => {
  fetchTopFive(subInput.value);
});
