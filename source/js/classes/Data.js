class Data{
 constructor(){

 }

async getHeroes(){
   let api = '../data/heroes.json';

   let response = await fetch(api);
   let results = await response.json();


   return results;
 }

 async generateSlides(){

  this.getHeroes()
  .then((results) => {
   let html = ' ';

   results.forEach(hero => {

    /* Creates a UI for the Hero slides */
    html += this.createSlideUI(hero);
    document.querySelector('.slide-track').innerHTML = html;

   });


  }).catch((err) => {
   console.log(err);
  });
 }


 createSlideUI(hero){
  let slide;

  /* Destructuring hero's skills */
  const [skillFirst, skillSecond, skillThird, skillUltimate] = [
   hero.skills[0].first,
   hero.skills[0].second,
   hero.skills[0].third,
   hero.skills[0].ultimate
  ];


  slide = `
   <div class="slide">
    <!-- Row Img -->
    <div class="slide-img__container">
      <img src="${hero.image}" alt="hero" title="hero" class="slide-img">
    </div>


    <!-- Row Texts -->
    <div class="slide-texts__container">
      <h3 class="slide-heading">${hero.name}</h3>

      <p class="slide-blurb">${hero.blurb}</p>
    </div>

    <!-- Row Skills -->
    <div class="slide-skills__container">
      <img src="${skillFirst}" alt="skill1" title="skill1" class="skill">
      <img src="${skillSecond}" alt="skill1" title="skill1" class="skill">
      <img src="${skillThird}" alt="skill1" title="skill1" class="skill">
      <img src="${skillUltimate}" alt="skill1" title="skill1" class="skill">
    </div>
   </div>
  `;

  return slide;
 }

}