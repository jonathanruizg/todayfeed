/*
  Please add all Javascript code to this file.
*/

import { newsKey, nyTimesNewsKey } from './keys.js';

// Keys
let newsSources = [
  'https://www.reddit.com/top.json',
  `https://newsapi.org/v2/top-headlines?country=us&apiKey=${newsKey}`,
  `https://api.nytimes.com/svc/topstories/v2/world.json?api-key=${nyTimesNewsKey}`
];

// Global Variables set to empty arrays
let newsApiData = [];
let redditData = [];
let nyTimesData = [];

// PopOver Modal

let popUpOverlay = document.getElementById("popUp");
let contentContainer = document.getElementsByClassName("container");
let closeButton = document.getElementsByClassName("closePopUp")[0];
let button = document.getElementsByClassName("popUpAction");

// Close PopOver Modal

closeButton.addEventListener('click', () => {
  popUpOverlay.classList.add('hidden');
  popUpOverlay.classList.remove('loader');
});

// Search Box 

document.querySelector('.searchInput').addEventListener('click', () => {
  let searchContainer = document.getElementById('search');
  searchContainer.classList.toggle('active');
})


// Search functionality - Tried but it did not work :(

// const searchBar = document.getElementById('searchBar');

// searchBar.addEventListener('keyup', (e) => {
//     const searchString = (e.target.value.toLowerCase());
//     const filteredArticles = article.filter(article) => {
//         return article.title.toLowerCase().includes(searchString) || article.author.toLowerCase().includes(searchString);
//     });
//     renderNewsRows(filteredArticles);
// });



// Set news source from dropdown

function setNewsSource(text) {
  document.getElementById('sourceChoice').innerHTML = text;
}

// Rendering Reddit Data

function renderRows(data) {

  // Vanilla js way
  let article = document.createElement('article');
  article.innerHTML = `
      <section class="featuredImage">
        <img class="popUpToggle" src="${data.thumbnail}" alt="Article Image" />
      </section>
      <section class="articleContent">
          <a href="${data.url}"><h3>${data.title}</h3></a>
          <h6>By ${data.author}</h6>
          <button class="moreBtn">Read More</button>
      </section>
      <section class="impressions">
        <span class="metadata"> ${data.ups}</span>
      </section>
      <div class="clearfix"></div>

  `;
  article.classList.add('article')
  document.getElementById('main').appendChild(article);
}


// Rendering NewsAPI Data

function renderNewsRows(data, i) {

  // Vanilla js way
  let article = document.createElement('article');
  article.innerHTML = `
      <section class="featuredImage">
        <img id="${i}" src="${data.urlToImage}" alt="Article Image" />
      </section>
      <section class="articleContent">
          <a id="${i}" href="${data.url}"><h3>${data.title}</h3></a>
          <h6>By ${data.author}</h6>
          <button class="moreBtn">Read More</button>
      </section>
      <section class="impressions">
        <span class="metadata"> ${data.source.name}</span>
      </section>
      <div class="clearfix"></div>
  `;
  article.classList.add('article')
  document.getElementById('main').appendChild(article);
  let aTag = document.querySelector('a');
}

let clear = function () {
  let articles = document.getElementById('main');
  articles.innerHTML = '';
}

// Rendering NY Times Data

function renderNyNewsRows(data) {
  // Vanilla js way 
  let article = document.createElement('article');
  article.innerHTML = `
     <section class="featuredImage">
       <img class="popUpToggle" src="${data.multimedia[0].url}" alt="Article Image" />
     </section>
     <section class="articleContent">
         <a href="${data.url}"><h3 >${data.title}</h3></a>
         <h6>${data.byline}</h6>
         <button class="moreBtn">Read More</button>
     </section>
     <section class="impressions">
       <span class="metadata"> ${data.geo_facet}</span>
     </section>
     <div class="clearfix"></div>
 `;
  article.classList.add('article')
  document.getElementById('main').appendChild(article);
}


// Clean the data 

function normalizeData(data) {
  console.log('data', data);
  function ArticleObj(title, author, url, img) {
    this.title = title;
    this.author = author;
    this.url = url;
    this.img = img;
    // this.imp = imp; //impressions
    // this.cat = cat; //categories
  }
  for (let i = 0; i < data.length; i++) {
    let cleanData = [];
    if (i === 0) {
      data[i].articles.forEach(function (result) {
        cleanData.push(new ArticleObj(result.title, result.author, result.url, result.urlToImage));
      });
      data[i] = cleanData;
    } else if (i === 1) {
      data[i].data.children.forEach(function (result) {
        cleanData.push(new ArticleObj(result.data.title, result.data.author, result.data.url, result.data.thumbnail));
      });
      data[i] = cleanData;
    }
  }
  return data;
}

// Reddit API call
let redditCall = () => {
  let apiCall = fetch(`https://cors.bridged.cc/${newsSources[0]}`);

  apiCall
    .then(res => res.json())
    .then(results => {
      clear();
      let cleanData = normalizeData(results);
      // cleanData.data.children.forEach(function (article) {
        redditData = cleanData.data.children;
        console.log(redditData);
        redditData.forEach(function (article, i) {
          renderRows(article.data, i);
          i++;
        })
      let moreBtn = document.getElementsByClassName('moreBtn');
      for (let i = 0; i < moreBtn.length; i++) {
        moreBtn[i].addEventListener('click', (e) => {
            popUpOverlay.classList.remove('hidden', 'loader');
            console.log(redditData, i);
            document.getElementById('title').innerHTML = redditData[i].data.title;
            document.getElementById('description').innerHTML = redditData[i].data.subreddit_name_prefixed;
            document.getElementById('articleImg').src = redditData[i].data.thumbnail;
            document.getElementById('articleUrl').href = `https://www.reddit.com/${redditData[i].data.permalink}`;
          });
      }
    })
    .catch(err => console.log(err));
};


// Newsapi API call
let newsCall = () => {
let newsApiCall = fetch(`https://cors.bridged.cc/${newsSources[1]}`);

  newsApiCall
    .then(res => res.json())
    .then(results => {
      clear();
      console.log(results.articles);
      newsApiData = results.articles;
      results.articles.forEach(function (article, i) {
        renderNewsRows(article, i);
        i++;
      })
      let moreBtn = document.getElementsByClassName('moreBtn');
      for (let i = 0; i < moreBtn.length; i++) {
        moreBtn[i].addEventListener('click', (e) => {
            popUpOverlay.classList.remove('hidden', 'loader');
            document.getElementById('title').innerHTML = newsApiData[i].title;
            document.getElementById('description').innerHTML = newsApiData[i].description;
            document.getElementById('articleImg').src = newsApiData[i].urlToImage;
            document.getElementById('articleUrl').href = newsApiData[i].url;
          });
      }
    })
    .catch(err => console.log(err));
};
newsCall();
setNewsSource('News API');


// NyTimes API call
let nyTimesNewsCall = () => {
  let nyApiCall = fetch(`${newsSources[2]}`);

  nyApiCall
    .then(res => res.json())
    .then(results => {
      nyTimesData = results.results;
      clear();
      console.log(results.results);
      nyTimesData.forEach(function (article, i) {
        renderNyNewsRows(article, i);
        i++;
      })
      let moreBtn = document.getElementsByClassName('moreBtn');
      for (let i = 0; i < moreBtn.length; i++) {
        moreBtn[i].addEventListener('click', (e) => {
            popUpOverlay.classList.remove('hidden', 'loader');
            document.getElementById('title').innerHTML = nyTimesData[i].title;
            document.getElementById('description').innerHTML = nyTimesData[i].abstract;
            document.getElementById('articleImg').src = nyTimesData[i].multimedia[0].url;
            document.getElementById('articleUrl').href = nyTimesData[i].url;
          });
      }
    })
};


// Add redditApi data click event to dropdown menu 
let sourceTwo = document.getElementById('redditApi');
sourceTwo.addEventListener('click', () => {
  redditCall();
  setNewsSource('Reddit');
});

// Add newsApi data click event to dropdown menu 
let sourceOne = document.getElementById('newsApi');
sourceOne.addEventListener('click', () => {
  newsCall();
  setNewsSource('News API');
});

// Add nyTimesApi data click event to dropdown menu
let sourceThree = document.getElementById('nyTimesApi');
sourceThree.addEventListener('click', () => {
  nyTimesNewsCall();
  setNewsSource('NY Times');
});

// Add TodayFeed "logo" data click event
let homePage = document.getElementById('homePage');
homePage.addEventListener('click', () => {
  newsCall();
  setNewsSource('News API');
});
