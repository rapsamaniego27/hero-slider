class Dulas {
 constructor({ sliderEl, controls, autoplay, slidesToScroll = 1 }) {
  /* Verification */
  if (sliderEl instanceof Element) {
   /* Variables */
   this.sliderEl = sliderEl;
   this.slideTrack = this.sliderEl.children[0];
   this.slides = Array.from(this.slideTrack.children);
   this.slidesToScroll = slidesToScroll;
   this.controls = controls;
   this.autoplay = autoplay;
   this.counter = (this.slidesToScroll > 1) ? 3 : 1;
  

   /* Automatic runs */
   this.newSlides = this.clone(this.slides, this.slidesToScroll);
   this.slideIndexes = this.createImportantIndexes(this.newSlides);
   this.bars = this.createBars(this.slideIndexes.length);
   this.delayArrange(this.newSlides);
   this.setClasses();
   this.bindControls();
   this.autoSlide(this.autoplay);
   this.autoResize();
   this.bindClickOnBars();
   console.log(this.slideIndexes);
  } else {
   console.error('No slider passed in');
  }

 }

 /* Arranges the slides */
 arrange(slides, firstSlide = 1) {
   
  firstSlide = (firstSlide > 1) ? 3 : 1;

    slides[firstSlide].classList.add('dulas--current');

    //Sets the overall width of Slide track based on how many slides there
    this.slideTrack.style.width = `${this.sliderEl.clientWidth * slides.length}px`;

    this.slideTrack.style.transform = `translate3d(-${this.sliderEl.clientWidth * this.counter}px, 0, 0)`;

    //Each slide will have a width of the Slider Element or Row
    slides.forEach(slide => {
       slide.style.width = `${this.sliderEl.clientWidth}px`;
    });

 }


 //Cloning both ends of slides
 //Returns the new set of slides
 clone(slides, count = 1) {
 let newSlides;

  switch (count) {
     case 1:
        const cloneFirst = slides[0].cloneNode(true);
        const cloneLast = slides[slides.length - 1].cloneNode(true);

        /* Add clone class to each end */
        cloneFirst.classList.add('dulas--clone', 'dulas--last');
        cloneLast.classList.add('dulas--clone', 'dulas--first');

        /* Inserts the element on each end */
        this.slideTrack.appendChild(cloneFirst);
        this.slideTrack.insertBefore(cloneLast, slides[0]);

        /* Returns the new set of slides */
        newSlides = Array.from(this.slideTrack.children);
        break;
     
     case 2:
        const firstThreeSlides = slides.slice(0, 3);
        const lastThreeSlides = slides.slice(-3).reverse();

        this.appendClonedSlides(firstThreeSlides, 'last');
        this.appendClonedSlides(lastThreeSlides, 'first');

        newSlides = Array.from(this.slideTrack.children);

      break;
  
     default:
        break;
  }
  return newSlides;

 }

 /* For Cloning more than 1 */
 appendClonedSlides(slides, location){
    slides.forEach((slide, index) => {
      
       // the captured clone in the loop
       const clone = slide.cloneNode(true);

       slides.push(clone);
       clone.classList.add('dulas--clone');
       
       
       // Location where to put the cloned slides
       /* Appends after the the Slide Track */
       if (location == 'last'){
          this.slideTrack.appendChild(clone);
         
          if (index == 0 ? clone.classList.add('dulas--last') : '');
       }
;
    /* Appends before the the Slide Track */
       if (location == 'first'){
          this.slideTrack.prepend(clone);

          if (index == 0 ? clone.classList.add('dulas--first') : '');
       }

    });

    
 }

 /* Next click, Prev click and transitionend */
 bindControls() {
  /* Next Button */
  this.controls.nextEl.addEventListener('click', (e) => {
   e.preventDefault();
   this.counter++;

   this.gotoSlide(this.counter);

   /* Refactor this */
   if(this.inSlideIndex(this.counter)){
      const activeBar = document.querySelector('.bar--active');

      const indexOfSlideIndex = this.slideIndexes.indexOf(this.counter);
      
      activeBar.classList.remove('bar--active');
      this.bars[indexOfSlideIndex].classList.add('bar--active');
   }

   this.newSlides[this.counter].classList.add('dulas--current');
   this.newSlides[this.counter].previousElementSibling.classList.remove('dulas--current');

   this.freeze(true, this.controls.nextEl);
  });

  /* Previous Button */
  this.controls.prevEl.addEventListener('click', (e) => {
   e.preventDefault();
   this.counter--;
   this.gotoSlide(this.counter);

   /* Refactor this */
   if(this.inSlideIndex(this.counter)){
      const activeBar = document.querySelector('.bar--active');

      const indexOfSlideIndex = this.slideIndexes.indexOf(this.counter);
      
      activeBar.classList.remove('bar--active');
      this.bars[indexOfSlideIndex].classList.add('bar--active');
   }

   this.newSlides[this.counter].classList.add('dulas--current');
   this.newSlides[this.counter].nextElementSibling.classList.remove('dulas--current');

   this.freeze(true, this.controls.prevEl);
  });

  /* Detects if its in the last or first clone 
     which makes infinite slide possible
  */

  this.slideTrack.addEventListener('transitionend', () => {

   /* Uses this function to check if its in either of the cloned elements */
   this.checkFirstOrLast();
   this.freeze(false, this.controls.nextEl);
   this.freeze(false, this.controls.prevEl);
  });
 }

 /* Function to go to a specific slide */
 gotoSlide(i) {
  //slider element multiplies by any integer
  //in this case the counter variable we use

  const basisWidth = (this.slidesToScroll > 1) ? this.newSlides[0].clientWidth : this.sliderEl.clientWidth;

  this.slideTrack.style.transform = `translate3d(-${this.sliderEl.clientWidth * i}px, 0, 0)`;

  //The animation of the sliding
  this.slideTrack.style.transition = `transform 0.4s ease-in-out`;
 }


 /* Checks if slide is in the cloned element */
 checkFirstOrLast() {
  /* If Counter is larger than the number of slides */
   const firstSlide = this.slideTrack.querySelector('.dulas--first');

   const lastSlide = this.slideTrack.querySelector('.dulas--last');
   
   /*  If last cloned slide has the current class is 0 */
   if (lastSlide.classList.contains('dulas--current')) {
   /* Sets the counter to the first slide on how many the slides are */
      this.counter = (this.slidesToScroll > 1) ? 3 : 1;

      this.newSlides[this.counter].classList.add('dulas--current');
      lastSlide.classList.remove('dulas--current');
      this.gotoSlide(this.counter);

      this.slideTrack.style.transition = `none`;

      /* Refactor this */
      const activeBar = document.querySelector('.bar--active');

      const indexOfSlideIndex = this.slideIndexes.indexOf(this.counter);

      activeBar.classList.remove('bar--active');
      this.bars[indexOfSlideIndex].classList.add('bar--active');
  }

  /* If first cloned slide has the current class is 0 */
   if (firstSlide.classList.contains('dulas--current')) {
      /* Sets the counter depending on how many the slides are */
      this.counter = (this.slidesToScroll > 1) ? this.newSlides.length - 4 : this.newSlides.length - 2;

      this.newSlides[this.counter].classList.add('dulas--current');
      firstSlide.classList.remove('dulas--current');
      this.gotoSlide(this.counter);

      this.slideTrack.style.transition = `none`;

      /* Refactor this */
      const activeBar = document.querySelector('.bar--active');

      const indexOfSlideIndex = this.slideIndexes.indexOf(this.counter);

      activeBar.classList.remove('bar--active');
      this.bars[indexOfSlideIndex].classList.add('bar--active');
  }
 }

 /* Auto plays the slider */
 /* TODO: Add clear interval in the future when hovered */
 autoSlide(condition) {
  if (condition == true) {
   setInterval(() => {
    this.controls.nextEl.click();
   }, 2000);
  }
 }

 /* Freezes a click event adding a pointer-events none */
 freeze(condition, element) {
  if (condition == true) {
   element.classList.add('dulas--freeze');
  } else {
   setTimeout(element.classList.remove('dulas--freeze'), 500);
  }
 }

 /* Auto resizes the slides when it shrinks */
 autoResize() {
  window.addEventListener('resize', () => {
   this.arrange(this.newSlides, slidesToScroll);
  });
 }

 /* Sets Default classes of this Dulas plugin */
 setClasses() {
  this.sliderEl.classList.add('dulas-row');
  this.slideTrack.classList.add('dulas-track');

  this.newSlides.forEach(slide => {
   slide.classList.add('dulas-slide');
  });
 }

 /* Made a delay because the window calculates width too early  */
 delayArrange(slides) {
  setTimeout(window.onload = () => {
   this.arrange(slides, this.slidesToScroll);
  }, 10);
 }

 bindClickOnBars(){
    
    this.bars.forEach((bar, index) => {
       bar.addEventListener('click', ()=> {
         const activeBar = document.querySelector('.bar--active');
         const slideIndex = this.slideIndexes[index];
         this.counter = slideIndex;
         

         activeBar.classList.remove('bar--active');
         bar.classList.add('bar--active');
         

         this.gotoSlide(this.counter);
       });
    });
 }

 createBars(quantity){
   
   const parentBar = document.querySelector('.slide-bars');
   let list = ' ';

   for (let index = 0; index < quantity; index++) {
      if(index <= 0){
         list += `<li class="bar bar--active"></li>`;
      }else{
         list += `<li class="bar"></li>`;
      }
   }

   parentBar.innerHTML = list;
   const bars = document.querySelectorAll('.bar');

   return bars;
 }

 createImportantIndexes(slides){
   let slideIndexes = [];

   slides.forEach((slide, index) => {
       if (index % 2 == 1) {
          slideIndexes.push(index);
       }
    });

    /* Removes the clones for each sides */
    slideIndexes.shift();
    slideIndexes.pop();
    
    return slideIndexes;
    
 }

 inSlideIndex(counter){

    const existence = this.slideIndexes.some((slideIndex) => slideIndex == counter);

    return existence;
 }

 /* Refactor Active Bar Class */
 /* BUG it only works if slides are in even numbers */
 applyActiveBarClass(){
    /*  */
 }

}
