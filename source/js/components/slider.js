/* Code javascript here */

window.addEventListener('DOMContentLoaded', ()=> {
  const data = new Data();

  data.generateSlides();

});


setTimeout(() => {
 const slider = new Dulas({
 sliderEl: document.querySelector('.slide-row'),

 controls: {
  nextEl: document.querySelector('#btnNext'),
  prevEl: document.querySelector('#btnPrev')
 },
 autoplay: false,
 slidesToScroll: 2
});

}, 1000);
