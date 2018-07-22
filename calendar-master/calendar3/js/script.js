moment.locale('fr');
console.log(moment(1316116057189).fromNow())
console.log(moment.locales());
const picker = new MaterialDatePicker()
    .on('submit', (val) => {
      events.innerHTML += val.toDate() +'\n';
    })
    .on('open', () => {
      events.innerHTML += 'open\n';
    })
    .on('close', () => {
      events.innerHTML += 'close\n';
    });


document.querySelector('.c-datepicker-btn')
    .addEventListener('click', () => picker.open() || picker.set(moment()));      
