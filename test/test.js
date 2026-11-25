// HTML 요소 가져오기
const searchForm = document.getElementById("searchForm");
const searchInput = document.getElementById("searchInput");
const resultContainer = document.getElementById("resultContainer");

searchForm.addEventListener("submit", function (event) {
  event.preventDefault();

  const keyword = searchInput.value.trim();
  if (!keyword) {
    alert("검색어를 입력해 주세요!");
    return;
  }

  // 실제 YES24 API 호출 함수 실행
  searchYes24API(keyword);
});

// 실제 YES24 API 연동 함수
async function searchYes24API(keyword) {
  // 1. 여기에 본인의 YES24 API 키를 입력하세요!
  const apiKey = "";

  // 2. YES24 상품 검색 API 엔드포인트 주소
  const url = `https://apis.yes24.com/v1/goods/itemList?query=${encodeURIComponent(keyword)}&pageSize=5&detail=Y`;

  try {
    resultContainer.innerHTML =
      '<p class="placeholder-text">검색 중입니다...</p>';

    // 3. fetch 요청 시 헤더('X-Api-Key')에 API 키 담아서 전송[cite: 1]
    const response = await fetch(url, {
      method: "GET",
      headers: {
        "X-Api-Key": apiKey,
      },
    });

    const result = await response.json();

    // 4. API 응답 성공 여부 확인 후 화면에 표시[cite: 1]
    if (result.success && result.data.items.length > 0) {
      displayResults(result.data.items);
    } else {
      resultContainer.innerHTML =
        '<p class="placeholder-text">검색 결과가 없습니다.</p>';
    }
  } catch (error) {
    console.error("API 연동 오류:", error);
    resultContainer.innerHTML =
      '<p class="placeholder-text" style="color: red;">데이터를 불러오는 중 오류가 발생했습니다.</p>';
  }
}

// 결과를 화면에 그려주는 함수 (데이터 구조에 맞게 수정)
function displayResults(books) {
  resultContainer.innerHTML = "";

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
    resultContainer.appendChild(card);
  });
}
