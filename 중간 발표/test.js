document.addEventListener("DOMContentLoaded", () => {
  // 1. 단일 페이지 네비게이션 처리
  const navLinks = document.querySelectorAll(".nav-link");
  const pages = document.querySelectorAll(".page");

  navLinks.forEach((link) => {
    link.addEventListener("click", (e) => {
      e.preventDefault();
      const targetId = link.getAttribute("data-target");

      // 메뉴 활성화 스타일 변경
      navLinks.forEach((item) => item.classList.remove("active"));
      link.classList.add("active");

      // 페이지 전환
      pages.forEach((page) => {
        if (page.id === targetId) {
          page.classList.add("active-page");
        } else {
          page.classList.remove("active-page");
        }
      });
    });
  });

  // 프로필 아이콘 클릭 시 Profile 페이지로 이동
  const profileBtn = document.getElementById("profile-btn");
  if (profileBtn) {
    profileBtn.addEventListener("click", () => {
      document.querySelector('[data-target="profile"]').click();
    });
  }

  // 2. 기록 작성 모달 제어
  const modal = document.getElementById("record-modal");
  const openModalBtn = document.getElementById("open-record-modal");
  const closeModalBtn = document.getElementById("close-modal");
  const newRecordForm = document.getElementById("new-record-form");

  if (openModalBtn) {
    openModalBtn.addEventListener("click", () => {
      modal.style.display = "flex";
    });
  }

  if (closeModalBtn) {
    closeModalBtn.addEventListener("click", () => {
      modal.style.display = "none";
    });
  }

  window.addEventListener("click", (e) => {
    if (e.target === modal) {
      modal.style.display = "none";
    }
  });

  // 3. 새 기록 등록 기능 처리
  if (newRecordForm) {
    newRecordForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const title = document.getElementById("rec-title").value;
      const type = document.getElementById("rec-type").value;
      const content = document.getElementById("rec-content").value;

      const container = document.getElementById("record-list-container");
      const newItem = document.createElement("div");
      newItem.className = "record-item";
      newItem.setAttribute("data-type", type);

      const typeLabels = {
        journal: "독서 일지",
        quote: "인상깊은 문장",
        review: "독후감",
      };

      const today = new Date().toISOString().split("T")[0];

      newItem.innerHTML = `
        <div class="record-thumb">책</div>
        <div class="record-info">
          <h4>${title}</h4>
          <p class="record-date">${today} | ${typeLabels[type]}</p>
          <p class="record-desc">${content}</p>
        </div>
      `;

      container.prepend(newItem);
      modal.style.display = "none";
      newRecordForm.reset();
    });
  }

  // 4. Records 탭 필터링 기능
  const recordTabBtns = document.querySelectorAll(".record-tabs .tab-btn");
  recordTabBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      recordTabBtns.forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");

      const filter = btn.getAttribute("data-filter");
      const items = document.querySelectorAll(".record-item");

      items.forEach((item) => {
        if (filter === "all" || item.getAttribute("data-type") === filter) {
          item.style.display = "flex";
        } else {
          item.style.display = "none";
        }
      });
    });
  });
});
