const lh1 = document.querySelector('#lh1');
const lh2 = document.querySelector('#lh2');
const lv1 = document.querySelector('#lv1');
const esign = document.querySelector('#esign');

const expand = document.querySelector('.expand');
const reduce = document.querySelector('.reduce');

expand.addEventListener('click', () => {
	TweenMax.to([lh1, lh2], 1.2, {
	  attr: {
		 x2: 800,
	  },
		ease: Quint.easeInOut
	})
	
	TweenMax.to(lv1, 1.2, {
	  attr: {
		 x1: 800,
		 x2: 800,
	  },
		ease: Quint.easeInOut
	})
	
	TweenMax.to(esign, 1.2, {
	  attr: {
		 transform: "translate(820 60.11)"
	  },
		ease: Quint.easeInOut
	})

});

reduce.addEventListener('click', () => {
	TweenMax.to([lh1, lh2], 1.2, {
	  attr: {
		 x2: 421.41,
	  },
		ease: Quint.easeInOut
	})
	
	TweenMax.to(lv1, 1.2, {
	  attr: {
		 x1: 421.41,
		 x2: 421.41,
	  },
		ease: Quint.easeInOut
	})
	
	TweenMax.to(esign, 1.2, {
	  attr: {
		 transform: "translate(445 60.11)"
	  },
		ease: Quint.easeInOut
	})

});