document.addEventListener("DOMContentLoaded", function () {

  // ===================== GREETING =====================
  function updateGreeting() {
    const greetingEl = document.getElementById("dynamicGreeting");
    if(!greetingEl) return;
    const now = new Date();
    const hour = now.getHours();
    let greeting = "Welcome Back";
    if(hour >= 5 && hour < 12) greeting = "Good morning";
    else if(hour >= 12 && hour < 17) greeting = "Good afternoon";
    else greeting = "Good evening";
    greetingEl.textContent = `${greeting}, Emma!`;
  }
  updateGreeting();
  setInterval(updateGreeting, 60000); // updates every minute

  // ===================== SCROLL FUNCTION =====================
  window.scrollToSection = function(id){
    const el = document.getElementById(id);
    if(el) el.scrollIntoView({behavior:"smooth"});
  }

  // ===================== PET DATA =====================
  let xp = parseInt(localStorage.getItem("xp")) || 0;
  let level = parseInt(localStorage.getItem("level")) || 1;
  let streak = parseInt(localStorage.getItem("streak")) || 0;
  let petName = localStorage.getItem("petName") || "Pika";

  let petCollection = [
    {name:"Wolf", emoji:"🐺", language:"German"},
    {name:"Lion", emoji:"🦁", language:"Swahili"}
  ];
  let currentPet = petCollection[0];

  function updatePetUI(){
    const avatar = document.querySelector(".pet-avatar");
    const nameDisplay = document.getElementById("pet-name-display");
    if(avatar) avatar.textContent = currentPet.emoji;
    if(nameDisplay) nameDisplay.textContent = petName;
    document.getElementById("level").textContent = level;
    document.getElementById("streak").textContent = streak;
    document.getElementById("xp-fill").style.width = (xp % 100) + "%";
  }
  updatePetUI();

  // ===================== PET RENAME =====================
  const nameBtn = document.getElementById("pet-name-btn");
  const nameInput = document.getElementById("pet-name-input");
  if(nameBtn){
    nameBtn.addEventListener("click", function(){
      const newName = nameInput.value.trim();
      if(newName){
        petName = newName;
        localStorage.setItem("petName", newName);
        updatePetUI();
        nameInput.value="";
      }
    });
  }

  // ===================== LESSON XP =====================
  window.completeLesson = function(){
    xp += 20;
    streak += 1;
    if(xp >= level*100){
      level++;
      launchConfetti();
    }
    localStorage.setItem("xp",xp);
    localStorage.setItem("level",level);
    localStorage.setItem("streak",streak);
    updatePetUI();
  }

  // ===================== PET COLLECTION =====================
  function renderPetCollection(){
    const container = document.getElementById("pet-collection");
    if(!container) return;
    container.innerHTML="";
    petCollection.forEach(pet=>{
      const card = document.createElement("div");
      card.className="pet-card";
      card.innerHTML = `
        <div class="pet-emoji">${pet.emoji}</div>
        <div class="pet-name">${pet.name}</div>
        <div class="language-badge">${pet.language}</div>
      `;
      container.appendChild(card);
    });
  }
  renderPetCollection();

  window.collectPet=function(lang){
    let newPet;
    if(lang==="Spanish") newPet={name:"Fox",emoji:"🦊",language:"Spanish"};
    if(lang==="Mandarin") newPet={name:"Panda",emoji:"🐼",language:"Mandarin"};
    if(lang==="Japanese") newPet={name:"Cat",emoji:"🐱",language:"Japanese"};
    if(!petCollection.find(p=>p.name===newPet.name)){
      petCollection.push(newPet);
      renderPetCollection();
      launchConfetti();
      alert("New pet collected: "+newPet.name);
    }
  }

  // ===================== WORLD CLOCK =====================
  let timezones=[
    {country:"Japan",code:"Asia/Tokyo",flag:"🇯🇵"},
    {country:"Spain",code:"Europe/Madrid",flag:"🇪🇸"},
    {country:"China",code:"Asia/Shanghai",flag:"🇨🇳"}
  ];

  function renderClocks(){
    const container = document.getElementById("clock-container");
    if(!container) return;
    container.innerHTML="";
    timezones.forEach(tz=>{
      const box = document.createElement("div");
      box.className="clock-box";
      const id = tz.code.replace("/","");
      box.innerHTML = `<h4>${tz.flag} ${tz.country}</h4><p id="${id}">--:--</p>`;
      container.appendChild(box);
    });
  }
  function updateClocks(){
    const now = new Date();
    timezones.forEach(tz=>{
      const id = tz.code.replace("/","");
      const el = document.getElementById(id);
      if(el){
        el.textContent = now.toLocaleTimeString("en-US",{timeZone:tz.code});
      }
    });
  }
  renderClocks();
  updateClocks();
  setInterval(updateClocks,1000);

  // ===================== FLASHCARDS =====================
  let flashcards = [
    {front:"Aunque",back:"Although",explanation:"Used to show contrast."},
    {front:"Sin embargo",back:"However",explanation:"Contrasts with previous statement."},
    {front:"A pesar de",back:"Despite",explanation:"Shows contrast."},
    {front:"Lograr",back:"To achieve",explanation:"Indicates success."},
    {front:"Desarrollar",back:"To develop",explanation:"To grow or improve."}
  ];
  let currentCard=0;
  let flipped=false;
  let flashScore=0;

  function showCard(){
    const card=document.getElementById("flashcard");
    if(!card) return;
    card.textContent=flipped ? flashcards[currentCard].back+" ✅" : flashcards[currentCard].front;
  }

  window.flipCard=function(){ 
    flipped=!flipped; 
    showCard(); 
  }
  window.nextCard=function(){ 
    currentCard=(currentCard+1)%flashcards.length; 
    flipped=false; 
    showCard(); 
  }
  window.loadSpanishLevel3=function(){ currentCard=0; flipped=false; showCard(); }

  // ===================== PRACTICE MODE =====================
  let practiceQuestions=[
    {q:"Translate 'hola'",a:"hello",explanation:"Hola means hello in Spanish."},
    {q:"Translate 'perro'",a:"dog",explanation:"Perro = dog."},
    {q:"Translate 'gato'",a:"cat",explanation:"Gato = cat."},
    {q:"Translate 'agua'",a:"water",explanation:"Agua = water."},
    {q:"Translate 'libro'",a:"book",explanation:"Libro = book."}
  ];
  let practiceIndex=0;
  let practiceScore=0;

  function showPractice(){
    const pq = document.getElementById("practiceQuestion");
    if(!pq) return;
    pq.textContent = practiceQuestions[practiceIndex].q;
  }

  window.startPractice=function(){ practiceIndex=0; practiceScore=0; showPractice(); }

  window.checkPractice=function(){
    const input=document.getElementById("practiceInput").value.toLowerCase();
    const correct=practiceQuestions[practiceIndex].a;
    const result=document.getElementById("practiceResult");
    if(input===correct){
      result.textContent="✅ Correct! "+practiceQuestions[practiceIndex].explanation;
      practiceScore++;
    } else {
      result.textContent="❌ Wrong. "+practiceQuestions[practiceIndex].explanation;
    }
    document.getElementById("nextPracticeBtn").style.display="inline-block";
  }

  window.nextPractice=function(){
    practiceIndex=(practiceIndex+1)%practiceQuestions.length;
    document.getElementById("practiceInput").value="";
    document.getElementById("practiceResult").textContent="";
    document.getElementById("nextPracticeBtn").style.display="none";
    showPractice();
  }

  // ===================== UNIT TEST =====================
  const unitTestQuestions=[
    {q:"What does 'hola' mean?",type:"mc",options:["Hello","Bye","Thanks","Please"],answer:"Hello",explanation:"Hola = Hello"},
    {q:"Translate 'perro'",type:"mc",options:["Dog","Cat","Fish","Bird"],answer:"Dog",explanation:"Perro = Dog"},
    {q:"Translate 'gato'",type:"mc",options:["Dog","Cat","Fish","Bird"],answer:"Cat",explanation:"Gato = Cat"},
    {q:"Translate 'libro'",type:"mc",options:["Book","Pen","Desk","Chair"],answer:"Book",explanation:"Libro = Book"},
    {q:"Translate 'agua'",type:"mc",options:["Water","Milk","Bread","Juice"],answer:"Water",explanation:"Agua = Water"},
    {q:"What does 'aunque' mean?",type:"mc",options:["Although","Because","Then","But"],answer:"Although",explanation:"Aunque = Although"},
    {q:"What does 'sin embargo' mean?",type:"mc",options:["However","Because","Then","But"],answer:"However",explanation:"Sin embargo = However"},
    {q:"Translate 'desarrollar'",type:"mc",options:["To develop","To run","To sleep","To eat"],answer:"To develop",explanation:"Desarrollar = To develop"},
    {q:"Translate 'lograr'",type:"mc",options:["To achieve","To sleep","To eat","To run"],answer:"To achieve",explanation:"Lograr = To achieve"},
    {q:"Translate 'casa'",type:"mc",options:["House","Car","Tree","Dog"],answer:"House",explanation:"Casa = House"},
    {q:"Translate 'escuela'",type:"mc",options:["School","Hospital","Store","Tree"],answer:"School",explanation:"Escuela = School"},
    {q:"Translate 'amigo'",type:"mc",options:["Friend","Enemy","Teacher","Dog"],answer:"Friend",explanation:"Amigo = Friend"},
    {q:"Translate 'hermano'",type:"mc",options:["Brother","Sister","Friend","Father"],answer:"Brother",explanation:"Hermano = Brother"},
    {q:"Translate 'agua'",type:"mc",options:["Water","Milk","Bread","Juice"],answer:"Water",explanation:"Agua = Water"},
    {q:"Translate 'perro'",type:"mc",options:["Dog","Cat","Fish","Bird"],answer:"Dog",explanation:"Perro = Dog"},
    {q:"Translate 'gato'",type:"mc",options:["Dog","Cat","Fish","Bird"],answer:"Cat",explanation:"Gato = Cat"},
    {q:"Translate 'libro'",type:"mc",options:["Book","Pen","Desk","Chair"],answer:"Book",explanation:"Libro = Book"},
    {q:"Translate 'manzana'",type:"mc",options:["Apple","Banana","Orange","Pear"],answer:"Apple",explanation:"Manzana = Apple"},
    {q:"Translate 'perro'",type:"mc",options:["Dog","Cat","Fish","Bird"],answer:"Dog",explanation:"Perro = Dog"},
    {q:"Translate 'gato'",type:"mc",options:["Dog","Cat","Fish","Bird"],answer:"Cat",explanation:"Gato = Cat"}
  ];

  const unitTestContainer=document.getElementById("unitTest");
  if(unitTestContainer){
    unitTestContainer.innerHTML="";
    unitTestQuestions.forEach((q,i)=>{
      const box=document.createElement("div");
      box.className="question-box";
      const title=document.createElement("p");
      title.textContent=(i+1)+". "+q.q;
      box.appendChild(title);
      q.options.forEach(opt=>{
        const label=document.createElement("label");
        label.style.display="block";
        const input=document.createElement("input");
        input.type="radio";
        input.name="q"+i;
        input.value=opt;
        label.appendChild(input);
        label.appendChild(document.createTextNode(" "+opt));
        box.appendChild(label);
      });
      unitTestContainer.appendChild(box);
    });
  }

  // ===================== CONFETTI =====================
  const canvas=document.getElementById("confettiCanvas");
  if(canvas){
    const ctx=canvas.getContext("2d");
    canvas.width=window.innerWidth;
    canvas.height=window.innerHeight;
    let confetti=[];
    window.launchConfetti=function(){
      for(let i=0;i<100;i++){
        confetti.push({
          x:Math.random()*canvas.width,
          y:Math.random()*canvas.height-canvas.height,
          size:Math.random()*6+4,
          speed:Math.random()*3+2
        });
      }
      animateConfetti();
    }
    function animateConfetti(){
      ctx.clearRect(0,0,canvas.width,canvas.height);
      confetti.forEach(p=>{
        p.y+=p.speed;
        ctx.fillStyle="#ff7f7f";
        ctx.fillRect(p.x,p.y,p.size,p.size);
      });
      confetti=confetti.filter(p=>p.y<canvas.height);
      if(confetti.length>0){
        requestAnimationFrame(animateConfetti);
      }
    }
  }

  // ===================== RESOURCE SWITCH =====================
  window.showResource=function(name){
    const sections=document.querySelectorAll(".resource-content");
    sections.forEach(sec=>{ sec.style.display="none"; });
    const target=document.getElementById(name);
    if(target) target.style.display="block";
  }
  showResource("video");

});
