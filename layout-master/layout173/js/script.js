document.addEventListener('DOMContentLoaded', function(){
	let btnToggle = document.querySelector('#btn-toggle');
	let rowCards = document.querySelector('.row-cards');
	let mainRow = document.querySelector('.main-row');
	let colCardAll = document.querySelectorAll('.col-card');
	let cardAll = document.querySelectorAll('.card');

	btnToggle.addEventListener('click', function(){
		if (!rowCards.classList.contains('is-moving')) {
			mainRow.classList.toggle("no-menu");

			for(i=0; i<cardAll.length; i++){
				let clone = cardAll[i].cloneNode(true);
				clone.classList.add("clone");
				cardAll[i].parentElement.insertBefore(clone, cardAll[i]);

				let top = clone.getBoundingClientRect().top;
				let left = clone.getBoundingClientRect().left;
				let width = clone.getBoundingClientRect().width;
				let height = clone.getBoundingClientRect().height;

				
				clone.style.position = 'fixed';
				clone.style.top = top+'px';
				clone.style.left = left+'px';
				clone.style.width = width+'px';
				clone.style.height = height+'px';
			}

			document.querySelector('.col-menu').classList.toggle('col-0');
			document.querySelector('.col-menu').classList.toggle('col-4');
			document.querySelector('.col-cards').classList.toggle('col-8');
			document.querySelector('.col-cards').classList.toggle('col-12');
			for(i=0; i<colCardAll.length; i++){
				colCardAll[i].classList.toggle('col-4');
				colCardAll[i].classList.toggle('col-6');
			}
			rowCards.classList.add('is-moving');

			let cardCloneAll = document.querySelectorAll('.card.clone');
			for(i=0; i<cardCloneAll.length; i++){
				let top = cardAll[i].getBoundingClientRect().top;
				let left = cardAll[i].getBoundingClientRect().left;
				let width = cardAll[i].getBoundingClientRect().width;
				let height = cardAll[i].getBoundingClientRect().height;

				cardCloneAll[i].style.top = top+'px';
				cardCloneAll[i].style.left = left+'px';
				cardCloneAll[i].style.width = width+'px';
				cardCloneAll[i].style.height = height+'px';
			}

			setTimeout(function(){
				rowCards.classList.remove('is-moving');
				for(i=0; i<cardCloneAll.length; i++){
					cardCloneAll[i].remove();
				}
			}, 1000)

		}

	})


	//simulate click for thumbnail 
	setTimeout(function(){
		document.getElementById('btn-toggle').click();
	}, 500);
	setTimeout(function(){
		document.getElementById('btn-toggle').click();
	}, 2500)
})
