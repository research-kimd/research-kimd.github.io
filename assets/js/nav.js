// 페이지 연도 자동 갱신
document.getElementById('y')?.append(new Date().getFullYear());

// data-page와 메뉴의 data-link 매칭 → 안전하게 active 보정
(() => {
  const current = document.body.getAttribute('data-page');
  if (!current) return;
  document.querySelectorAll('.nav-links a').forEach(a => {
    a.removeAttribute('aria-current');
    a.classList.remove('is-active');
    if (a.dataset.link === current) {
      a.setAttribute('aria-current', 'page'); // <- 값 지정
      a.classList.add('is-active');
    }
  });
})();

(() => {
  const navbar = document.querySelector('.navbar');
  const btn    = document.querySelector('.hamburger');
  const menu   = document.getElementById('primary-nav');
  const body   = document.body;                         // ✅ 추가
  if (!navbar || !btn || !menu) return;

  const close = () => {
    navbar.classList.remove('is-open');
    body.classList.remove('is-menu-open');              // ✅ 오버레이/스크롤 해제
    btn.setAttribute('aria-expanded', 'false');
    btn.setAttribute('aria-label', 'Open menu');
  };

  const open = () => {
    navbar.classList.add('is-open');
    body.classList.add('is-menu-open');                 // ✅ 오버레이/스크롤 적용
    btn.setAttribute('aria-expanded', 'true');
    btn.setAttribute('aria-label', 'Close menu');
  };

  // 햄버거 클릭: 열기/닫기 토글
  btn.addEventListener('click', () => {
    const expanded = btn.getAttribute('aria-expanded') === 'true';
    expanded ? close() : open();
  });

  // 메뉴 항목 클릭 시 자동 닫기
  menu.addEventListener('click', (e) => {
    if (e.target.closest('a')) close();
  });

  // 오버레이 영역 클릭 시 닫기 (메뉴/햄버거 제외 영역)
  document.addEventListener('click', (e) => {
    if (!body.classList.contains('is-menu-open')) return;
    const insidePanel = e.target.closest('.nav-links');
    const onButton    = e.target.closest('.hamburger');
    if (!insidePanel && !onButton) close();
  });

  // ESC 키로 닫기
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') close();
  });

  const mq = window.matchMedia('(max-width: 750px)');
  mq.addEventListener('change', () => {
     // 1) 전환 끄기
   document.documentElement.classList.add('no-anim');
   // 2) 상태 초기화
   close();
    // 3) 다음 페인트 이후 전환 다시 켜기
   requestAnimationFrame(() => {
      document.documentElement.classList.remove('no-anim');
    });
  });

  // ✅ 창 크기 빠르게 변경할 때 안전하게 닫기 (보조)
  let resizeTimer;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    document.documentElement.classList.add('no-anim');   // ✅ 전환 잠시 끄기
    resizeTimer = setTimeout(() => {
      if (window.innerWidth > 750) close();              // 상태 초기화
      document.documentElement.classList.remove('no-anim'); // ✅ 다시 켜기
    }, 150);
  });
})();