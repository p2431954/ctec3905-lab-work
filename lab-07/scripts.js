"use strict";

async function loadObject(id) {
  const url = `https://collectionapi.metmuseum.org/public/collection/v1/objects/${id}`;
  const response = await fetch(url);
  return response.json();
}

function buildArticleFromData(obj) {
  const article = document.createElement("article");
  const img = document.createElement("img");
  img.src = obj.primaryImageSmall;
  img.alt = obj.title;
  article.appendChild(img);
  return article;
}

async function insertArticle(id) {
  const obj = await loadObject(id);
  const article = buildArticleFromData(obj);
  results.appendChild(article);
}

function buildArticleFromData(obj) {
  const article = document.createElement("article");
  const title = document.createElement("h2");
  const primaryImageSmall = document.createElement("img");
  const objectInfo = document.createElement("p");
  const objectName = document.createElement("span");
  const objectDate = document.createElement("span");
  const medium = document.createElement("p");

  title.textContent = obj.title;
  primaryImageSmall.src = obj.primaryImageSmall;
  primaryImageSmall.alt = obj.title;
  objectName.textContent = obj.objectName;
  objectDate.textContent = `, ${obj.objectDate}`;
  medium.textContent = obj.medium;

  article.appendChild(title);
  article.appendChild(primaryImageSmall);
  article.appendChild(objectInfo);
  article.appendChild(medium);

  objectInfo.appendChild(objectName);
  if(obj.objectDate) {
    objectInfo.appendChild(objectDate);
  }

  return article;
}

async function insertArticles(objIds) {
  const objects = await Promise.all(objIds.map(loadObject))
  const articles = objects.map(buildArticleFromData);
  articles.forEach(a => results.appendChild(a));
}

async function doSearch() {
	clearResults();
	loader.classList.add("waiting");
  const result = await loadSearch(query.value);
  objectIDs = result.objectIDs || [];   // store the search result (or an empty list) in our variable
  count.textContent = `found ${objectIDs.length} results for "${query.value}"`;
  nPages.textContent = Math.ceil(objectIDs.length / pageSize);
  currentPage = 1;     // set the currentPage
  loadPage();          // load the appropriate page
}
function clearResults() {
  while(results.firstChild) {
    results.firstChild.remove();
  }
}

async function loadPage() {
  clearResults();
  const myObjects = objectIDs.slice((currentPage - 1) * pageSize, currentPage * pageSize);
  // myObjects.forEach(insertArticle);
	loader.classList.add("waiting");
	await insertArticles(myObjects);
	loader.classList.remove("waiting");
  pageIndicator.textContent = currentPage;
}

function nextPage() {
  currentPage += 1;
  const nPages = Math.ceil(objectIDs.length / pageSize);
  if(currentPage > nPages) { currentPage = 1;}
  loadPage();
}
function prevPage() {
  currentPage -= 1;
  const nPages = Math.ceil(objectIDs.length / pageSize);
  if(currentPage < 1) { currentPage = nPages;}
  loadPage();
}

prev.addEventListener('click', prevPage);
next.addEventListener('click', nextPage);
query.addEventListener('change', doSearch);
