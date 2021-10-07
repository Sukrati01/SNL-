const dieImages = ['dice-01.svg', 'dice-02.svg', 'dice-03.svg', 'dice-04.svg', 'dice-05.svg', 'dice-06.svg']

const dieImg = document.querySelector('.die-image');

const roll = ()=>{
      dieImg.classList.add("shake"); 
      let dieValue = Math.floor(Math.random()*6) + 1;
      dieImg.setAttribute('src' , dieImages[dieValue-1])
      const dieNumber = document.querySelector('.die-number');
      dieNumber.innerHTML = dieValue;
}

const dieRollBtn = document.querySelector('.roll-die-btn');
dieRollBtn.addEventListener('click', (e)=>{
    roll()
    setTimeout(()=>{
        dieImg.classList.remove("shake");
    },  1000);
})