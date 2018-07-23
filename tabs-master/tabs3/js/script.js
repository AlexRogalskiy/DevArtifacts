function changeTab(tab, tabId) {
  document.querySelector(".tab-controls .active").classList.remove("active");
  document.querySelector(".tab-contents .active").classList.remove("active");

  tab.classList.add("active");
  document.querySelector('.tab-contents .tab[data-id="' + tabId + '"]').classList.add("active");
}