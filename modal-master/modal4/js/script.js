const btnOpenModal = document.querySelector(".btn");
const modal = document.querySelector(".modal");
const close = document.querySelector(".close");
const btnCancel = document.querySelector(".btn_cancel");

btnOpenModal.addEventListener("click", function(){
    modal.classList.add("is_open");
})

close.addEventListener("click", function(){
    modal.classList.remove("is_open");
})

btnCancel.addEventListener("click", function(){
    modal.classList.remove("is_open");
})