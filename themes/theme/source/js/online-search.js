var page = 1
document.addEventListener('DOMContentLoaded', () => {
  const input = document.querySelector('.search-input');
  const inputEventFunction = () => {
    const searchText = input.value.trim().toLowerCase();
    const keywords = searchText.split(/[-\s]+/);
    page = 1
    const container = document.querySelector('.search-result-container');
    const value = input.value
    if (keywords.length === 1 && keywords[0] === '') {
      container.classList.add('no-result');
    } else {
      // Perform online searching
      document.getElementById('search-stats').innerHTML = '';
      document.querySelector('.search-result-list').classList.add('no-result');
      container.classList.remove('no-result');
      load(value, 1)
    }
  };
  const button = document.querySelector('.search-button')
  button.addEventListener('click', inputEventFunction);
  button.disabled = false
});

function load(word) {
  document.getElementById('loading').style.display = null
  document.getElementById('more').style.display = 'none'
  var xhr = new XMLHttpRequest()
  xhr.open('GET', '/api/s?w=' + encodeURIComponent(word) + '&p=' + page)
  xhr.onreadystatechange = function () {
    if (xhr.readyState == 4 && xhr.status == 200) {
      update(JSON.parse(xhr.responseText), word);
    }
  };
  xhr.send()
}

function update(data, word) {
  //if (document.querySelector('.search-input').value == word) {
    document.getElementById('more').style.display = data.more ? null : 'none'
    document.getElementById('loading').style.display = 'none'
    const container = document.querySelector('.search-result-container');
    const list = document.querySelector('.search-result-list');
    const stats = document.getElementById('search-stats')
    if (data.page == 1) {
      if (data.resultItems.length === 0) {
        container.classList.remove('no-result');
        stats.innerText = '未找到搜索结果';
      } else {
        stats.innerText = `找到 ${data.length} 个搜索结果`;
        list.innerHTML = ''
        list.classList.remove('no-result');
      }
    };
    list.innerHTML += data.resultItems.map(result => result.item).join('');
  //}
}

function more() {
  document.getElementById('more').style.display = 'none'
  document.getElementById('loading').style.display = null
  page++
  load(document.querySelector('.search-input').value, page)
}