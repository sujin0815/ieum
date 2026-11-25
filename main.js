document.addEventListener("DOMContentLoaded", () => {
  // 1. Explore 페이지 검색 기능 실행 (기존 코드)
  initExploreSearch();

  // 2. Home 페이지 베스트셀러 실행
  const bestsellerContainer = document.getElementById("bestsellerContainer");
  if (bestsellerContainer) {
    loadRealtimeBestsellers();
  }

  // 3. 모달 닫기 이벤트 등록
  const closeModalBtn = document.getElementById("closeModalBtn");
  if (closeModalBtn) {
    closeModalBtn.addEventListener("click", closeModal);
  }
});

// ----------------------------------------------------
// Explore 검색 기능
// ----------------------------------------------------
function initExploreSearch() {
  const searchForm = document.getElementById("exploreForm");
  const searchInput = document.getElementById("exploreInput");

  if (searchForm) {
    searchForm.addEventListener("submit", function (event) {
      event.preventDefault();
      const keyword = searchInput.value.trim();
      if (!keyword) {
        alert("검색어를 입력해 주세요!");
        return;
      }
      searchYes24API(keyword);
    });
  }
}

async function searchYes24API(keyword) {
  const apiKey = "yk_live_24bdb88d6806626a0446442d400e30a2aa486111f6177069"; // 본인 API Key 입력
  const resultContainer = document.getElementById("exploreResultContainer");
  const url = `https://apis.yes24.com/v1/goods/itemList?query=${encodeURIComponent(keyword)}&pageSize=10&detail=Y`;

  try {
    resultContainer.innerHTML =
      '<p class="placeholder-text">검색 중입니다...</p>';
    const response = await fetch(url, { headers: { "X-Api-Key": apiKey } }); //
    const result = await response.json();

    if (result.success && result.data.items && result.data.items.length > 0) {
      displayResults(result.data.items);
    } else {
      resultContainer.innerHTML =
        '<p class="placeholder-text">검색 결과가 없습니다.</p>';
    }
  } catch (error) {
    console.error("API 연동 오류:", error);
    resultContainer.innerHTML =
      '<p class="placeholder-text" style="color: red;">오류가 발생했습니다.</p>';
  }
}

function displayResults(books) {
  const resultContainer = document.getElementById("exploreResultContainer");
  resultContainer.innerHTML = "";

  const listWrapper = document.createElement("div");
  listWrapper.className = "results-wrapper";

  books.forEach((book) => {
    const card = document.createElement("div");
    card.className = "book-card";
    card.innerHTML = `
      <img class="book-cover-img" src="${book.cover}" alt="${book.title}" />
      <div class="book-info">
        <h3 class="book-title">${book.title}</h3>
        <p class="book-author">저자: ${book.author} | 출판사: ${book.publisher}</p>
        <p class="book-price">판매가: ${book.salePrice.toLocaleString()}원</p>
      </div>
    `;
    listWrapper.appendChild(card);
  });

  resultContainer.appendChild(listWrapper);
}

// ----------------------------------------------------
// Home 실시간 베스트셀러 API 조회
// ----------------------------------------------------
let selectedBook = null; // 선택된 책 임시 저장용

async function loadRealtimeBestsellers() {
  const apiKey = "yk_live_24bdb88d6806626a0446442d400e30a2aa486111f6177069"; // 본인 API Key 입력
  const container = document.getElementById("bestsellerContainer");

  // categoryId=001: 종합 국내도서 카테고리 기본값
  const url = `https://apis.yes24.com/v1/category/bestsellerRealtime?categoryId=001&detail=N`; //

  try {
    const response = await fetch(url, {
      method: "GET",
      headers: { "X-Api-Key": apiKey }, //
    });

    const result = await response.json();

    if (result.success && result.data.items && result.data.items.length > 0) {
      // 상위 5개 책만 가져와서 출력
      const topBooks = result.data.items.slice(0, 5);
      displayBestsellers(topBooks);
    } else {
      container.innerHTML =
        '<p class="placeholder-text">베스트셀러 정보를 불러올 수 없습니다.</p>';
    }
  } catch (error) {
    console.error("베스트셀러 로드 에러:", error);
    container.innerHTML =
      '<p class="placeholder-text">데이터 로드 중 에러가 발생했습니다.</p>';
  }
}

function displayBestsellers(books) {
  const container = document.getElementById("bestsellerContainer");
  container.innerHTML = "";

  books.forEach((book) => {
    const card = document.createElement("div");
    card.className = "bestseller-card";

    card.innerHTML = `
      <img class="bestseller-img" src="${book.cover}" alt="${book.title}" />
      <div class="bestseller-info">
        <h3 class="bestseller-title">${book.title}</h3>
        <p class="bestseller-author">${book.author}</p>
      </div>
      <div class="bestseller-hover-overlay">
        <button class="add-library-btn">+ 내 서재에 추가</button>
      </div>
    `;

    // 마우스 오버 후 "+ 내 서재에 추가" 버튼 클릭 시 모달 팝업 열기
    const addBtn = card.querySelector(".add-library-btn");
    addBtn.addEventListener("click", () => {
      openLibraryModal(book);
    });

    container.appendChild(card);
  });
}

// ----------------------------------------------------
// 내 서재 추가 모달 조작 로직
// ----------------------------------------------------
function openLibraryModal(book) {
  selectedBook = book;
  document.getElementById("modalBookTitle").innerText = book.title;
  document.getElementById("modalBookAuthor").innerText = `저자: ${book.author}`;

  const modal = document.getElementById("libraryModal");
  modal.classList.add("active");

  // 서재 상태 선택 버튼들에 이벤트 바인딩
  const optionBtns = document.querySelectorAll(".modal-option-btn");
  optionBtns.forEach((btn) => {
    btn.onclick = () => {
      const status = btn.getAttribute("data-status");
      saveToMyLibrary(selectedBook, status);
      closeModal();
    };
  });
}

function closeModal() {
  const modal = document.getElementById("libraryModal");
  modal.classList.remove("active");
  selectedBook = null;
}

// 선택한 책을 내 서재에 저장 (localStorage 활용)
function saveToMyLibrary(book, status) {
  let myLibrary = JSON.parse(localStorage.getItem("myLibrary")) || [];

  // 이미 추가된 책인지 확인
  const isAlreadyAdded = myLibrary.some((item) => item.itemId === book.itemId);

  if (isAlreadyAdded) {
    alert("이미 내 서재에 등록된 책입니다!");
    return;
  }

  const newBook = {
    itemId: book.itemId,
    title: book.title,
    author: book.author,
    cover: book.cover,
    status: status, // 'wish', 'reading', 'completed'
    addedAt: new Date().toLocaleDateString(),
  };

  myLibrary.push(newBook);
  localStorage.setItem("myLibrary", JSON.stringify(myLibrary));

  const statusName =
    status === "wish"
      ? "읽고 싶은 책"
      : status === "reading"
        ? "읽는 중인 책"
        : "다 읽은 책";
  alert(`'${book.title}'이(가) 내 서재 [${statusName}]에 추가되었습니다!`);
}
