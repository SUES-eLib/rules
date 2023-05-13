document.getElementById('search-stats').innerText = '正在下载搜索索引。'
document.getElementById('search-result').style.display = 'none'
document.getElementById('loading').style.display = null
document.addEventListener('DOMContentLoaded', () => {
  var CONFIG = {
    localsearch: {
      preload: false,
      trigger: 'auto'
    }
  }
  const localSearch = new LocalSearch({
    path: '/rules/search.json',
    top_n_per_article: 2,
    unescape: false
  });
  localSearch.fetchData()
  const input = document.querySelector('.search-input');
  const inputEventFunction = () => {
    if (!localSearch.isfetched) {
      document.querySelector('.search-result-container').classList.remove('no-result');
      return
    };
    document.querySelector('.search-result-container').classList.add('no-result');
    document.getElementById('loading').style.display = 'none'
    document.getElementById('search-result').style.display = null
    const searchText = input.value.trim().toLowerCase();
    const keywords = searchText.split(/[-\s]+/);
    const container = document.querySelector('.search-result-container');
    const stats = document.getElementById('search-stats');
    const list = document.querySelector('.search-result-list');
    let resultItems = [];
    if (searchText.length > 0) {
      resultItems = localSearch.getResultItems(keywords);
    }
    if (keywords.length === 1 && keywords[0] === '' || resultItems.length === 0) {
      container.classList.add('no-result');
    } else {
      resultItems.sort((left, right) => {
        if (left.includedCount !== right.includedCount) {
          return right.includedCount - left.includedCount;
        } else if (left.hitCount !== right.hitCount) {
          return right.hitCount - left.hitCount;
        }
        return right.id - left.id;
      });
      stats.innerHTML = '找到 ${hits} 个搜索结果'.replace('${hits}', resultItems.length);
      container.classList.remove('no-result');
      list.innerHTML = resultItems.map(result => result.item).join('')
    }
  };
  localSearch.highlightSearchWords(document.querySelector('.post-body'));
  if (CONFIG.localsearch.preload) {
    localSearch.fetchData();
  }
  if (CONFIG.localsearch.trigger === 'auto') {
    input.addEventListener('input', inputEventFunction);
  } else {
    document.querySelector('.search-icon').addEventListener('click', inputEventFunction);
    input.addEventListener('keypress', event => {
      if (event.key === 'Enter') {
        inputEventFunction();
      }
    });
  }
  window.addEventListener('search:loaded', inputEventFunction);
});