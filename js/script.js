// ================= DOM CONTENT LOADED =================
document.addEventListener("DOMContentLoaded", function () {

  // ================= SECTION NAVIGATION =================
  window.loadSection = function(id){
    document.querySelectorAll(".section").forEach(sec=>{
      sec.style.display = "none";
    });
    const target = document.getElementById(id);
    if(target) target.style.display = "block";
  }
  loadSection('home'); // default

  // ================= TIME-BASED GREETING =================
  function updateGreeting() {
    const now = new Date();
    const hour = now.getHours();
    const greetingEl = document.getElementById("dynamicGreeting");
    let greeting = "Hello";
    if(hour < 12) greeting = "Good morning";
    else if(hour < 18) greeting = "Good afternoon";
    else greeting = "Good evening";
    greetingEl.textContent = `${greeting}, Emma!`;
  }
  updateGreeting();
  setInterval(updateGreeting, 60000);

  // ================= PET DASHBOARD =================
  let xp = parseInt(localStorage.getItem("xp")) || 0;
  let level = parseInt(localStorage.getItem("level")) || 1;
  let streak = parseInt(localStorage.getItem("streak")) || 0;
  let petCollection = [
    {name:"Wolf", emoji:"🐺", language:"German"},
    {name:"Lion", emoji:"🦁", language:"Swahili"}
  ];
  let currentPet = petCollection[0];
  let petName = localStorage.getItem("petName") || "Pika";

  function updatePetUI(){
    document.querySelector(".pet-avatar").textContent = currentPet.emoji;
    document.getElementById("pet-name-display").textContent = petName;
    document.getElementById("level").textContent = level;
    document.getElementById("streak").textContent = streak;
    document.getElementById("xp-fill").style.width = (xp % 100) + "%";
  }
  updatePetUI();

  // ================= PET RENAME =================
  const nameBtn = document.getElementById("pet-name-btn");
  const nameInput = document.getElementById("pet-name-input");
  nameBtn.addEventListener("click", function(){
    const newName = nameInput.value.trim();
    if(newName){
      petName = newName;
      localStorage.setItem("petName", newName);
      updatePetUI();
      nameInput.value="";
    }
  });

  // ================= COMPLETE LESSON =================
  window.completeLesson = function(){
    xp += 20;
    streak += 1;
    if(xp >= level*100){
      level++;
      launchConfetti();
    }
    localStorage.setItem("xp", xp);
    localStorage.setItem("level", level);
    localStorage.setItem("streak", streak);
    updatePetUI();
  }

  // ================= PET COLLECTION =================
  function renderPetCollection(){
    const container = document.getElementById("pet-collection");
    container.innerHTML="";
    petCollection.forEach(pet=>{
      const card = document.createElement("div");
      card.className="pet-card";
      card.innerHTML=`
        <div class="pet-emoji">${pet.emoji}</div>
        <div class="pet-name">${pet.name}</div>
        <div class="language-badge">${pet.language}</div>
      `;
      container.appendChild(card);
    });
  }
  renderPetCollection();

  window.collectPet = function(lang){
    let newPet;
    if(lang==="Spanish") newPet={name:"Fox", emoji:"🦊", language:"Spanish"};
    if(lang==="Mandarin") newPet={name:"Panda", emoji:"🐼", language:"Mandarin"};
    if(lang==="Japanese") newPet={name:"Cat", emoji:"🐱", language:"Japanese"};
    if(!petCollection.find(p=>p.name===newPet.name)){
      petCollection.push(newPet);
      renderPetCollection();
      launchConfetti();
      alert("New pet collected: "+newPet.name);
    }
  }

  // ================= WORLD CLOCK =================
  let timezones=[
    {country:"Japan", code:"Asia/Tokyo", flag:"🇯🇵"},
    {country:"Spain", code:"Europe/Madrid", flag:"🇪🇸"},
    {country:"China", code:"Asia/Shanghai", flag:"🇨🇳"}
  ];

  function renderClocks(){
    const container=document.getElementById("clock-container");
    container.innerHTML="";
    timezones.forEach(tz=>{
      const box=document.createElement("div");
      box.className="clock-box";
      const id=tz.code.replace("/","");
      box.innerHTML=`
        <h4>${tz.flag} ${tz.country}</h4>
        <p id="${id}">--:--</p>
      `;
      container.appendChild(box);
    });
  }

  function updateClocks(){
    const now=new Date();
    timezones.forEach(tz=>{
      const id=tz.code.replace("/","");
      const el=document.getElementById(id);
      if(el){
        el.textContent = now.toLocaleTimeString("en-US",{timeZone:tz.code});
      }
    });
  }

  renderClocks();
  updateClocks();
  setInterval(updateClocks,1000);

  document.getElementById("add-clock-btn").addEventListener("click", ()=>{
    const country = document.getElementById("new-country").value.trim();
    const tz = document.getElementById("new-tz").value.trim();
    if(country && tz){
      timezones.push({country, code:tz, flag:"🌐"});
      renderClocks();
      updateClocks();
    }
  });

  // ================= FLASHCARDS =================
  let flashcards=[
    {front:"Aunque", back:"Although", explanation:"Means 'although' in English."},
    {front:"Sin embargo", back:"However", explanation:"Used to show contrast."},
    {front:"A pesar de", back:"Despite", explanation:"Used to indicate 'despite'."},
    {front:"Lograr", back:"To achieve", explanation:"Means 'to achieve'."},
    {front:"Desarrollar", back:"To develop", explanation:"Means 'to develop'."}
  ];
  let currentCard=0;
  let flipped=false;
  let flashScore=0;

  function showCard(){
    const card=document.getElementById("flashcard");
    card.textContent=flipped ? flashcards[currentCard].back : flashcards[currentCard].front;
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

  window.loadSpanishLevel3=function(){
    currentCard=0;
    flipped=false;
    showCard();
  }

  // ================= PRACTICE MODE =================
  let practiceQuestions=[
    {q:"Translate 'hola'", a:"hello", explanation:"Hola means Hello."},
    {q:"Translate 'perro'", a:"dog", explanation:"Perro means Dog."},
    {q:"Translate 'gato'", a:"cat", explanation:"Gato means Cat."},
    {q:"Translate 'agua'", a:"water", explanation:"Agua means Water."}
  ];
  let practiceIndex=0;
  let practiceScore=0;

  function showPractice(){
    document.getElementById("practiceQuestion").textContent=practiceQuestions[practiceIndex].q;
  }

  window.startPractice=function(){
    practiceIndex=0; practiceScore=0;
    showPractice();
  }

  window.checkPractice=function(){
    const input=document.getElementById("practiceInput").value.toLowerCase();
    const correct=practiceQuestions[practiceIndex].a.toLowerCase();
    const result=document.getElementById("practiceResult");
    if(input===correct){
      result.textContent=`✅ Correct! ${practiceQuestions[practiceIndex].explanation}`;
      practiceScore++;
    } else{
      result.textContent=`❌ Wrong! Correct: ${practiceQuestions[practiceIndex].a}. ${practiceQuestions[practiceIndex].explanation}`;
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

  // ================= UNIT TEST =================
  const unitTestQuestions=[
    {q:"What does hola mean?", options:["Hello","Bye","Thanks","Please"], a:"Hello", explanation:"Hola means Hello."},
    {q:"Translate perro", options:["Dog","Cat","Fish","Bird"], a:"Dog", explanation:"Perro means Dog."},
    {q:"Translate gato", options:["Dog","Cat","Fish","Bird"], a:"Cat", explanation:"Gato means Cat."},
    {q:"Translate libro", options:["Book","Pen","Desk","Chair"], a:"Book", explanation:"Libro means Book."},
    {q:"Translate agua", options:["Water","Milk","Bread","Juice"], a:"Water", explanation:"Agua means Water."},
    {q:"Translate mesa", options:["Table","Chair","Door","Window"], a:"Table", explanation:"Mesa means Table."},
    {q:"Translate silla", options:["Chair","Table","Pen","Book"], a:"Chair", explanation:"Silla means Chair."},
    {q:"Translate puerta", options:["Door","Window","Room","Wall"], a:"Door", explanation:"Puerta means Door."},
    {q:"Translate ventana", options:["Window","Door","Ceiling","Floor"], a:"Window", explanation:"Ventana means Window."},
    {q:"Translate cielo", options:["Sky","Earth","Sea","Mountain"], a:"Sky", explanation:"Cielo means Sky."},
    {q:"Translate mar", options:["Sea","Sky","Land","River"], a:"Sea", explanation:"Mar means Sea."},
    {q:"Translate río", options:["River","Lake","Sea","Pond"], a:"River", explanation:"Río means River."},
    {q:"Translate perro grande", options:["Big Dog","Small Dog","Big Cat","Small Cat"], a:"Big Dog", explanation:"Perro Grande means Big Dog."},
    {q:"Translate gato pequeño", options:["Small Cat","Big Cat","Small Dog","Big Dog"], a:"Small Cat", explanation:"Gato Pequeño means Small Cat."},
    {q:"Translate correr", options:["To run","To jump","To swim","To eat"], a:"To run", explanation:"Correr means To run."},
    {q:"Translate comer", options:["To eat","To sleep","To drink","To play"], a:"To eat", explanation:"Comer means To eat."},
    {q:"Translate dormir", options:["To sleep","To run","To eat","To read"], a:"To sleep", explanation:"Dormir means To sleep."},
    {q:"Translate leer", options:["To read","To write","To run","To eat"], a:"To read", explanation:"Leer means To read."},
    {q:"Translate escribir", options:["To write","To read","To play","To jump"], a:"To write", explanation:"Escribir means To write."},
    {q:"Translate beber", options:["To drink","To eat","To sleep","To play"], a:"To drink", explanation:"Beber means To drink."}
  ];

  const unitTestContainer=document.getElementById("unitTest");

  if(unitTestContainer){
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
    const submitBtn=document.createElement("button");
    submitBtn.textContent="Submit Test";
    submitBtn.addEventListener("click", ()=>{
      let score=0;
      unitTestQuestions.forEach((q,i)=>{
        const selected=document.querySelector(`input[name=q${i}]:checked`);
        const box=unitTestContainer.children[i];
        const explanation=document.createElement("p");
        explanation.style.fontWeight="600";
        if(selected && selected.value===q.a){
          score++; explanation.textContent="✅ Correct! "+q.explanation;
        } else{
          explanation.textContent="❌ Wrong! Correct: "+q.a+". "+q.explanation;
        }
        box.appendChild(explanation);
      });
      alert("Test Completed! Score: "+score+"/"+unitTestQuestions.length);
    });
    unitTestContainer.appendChild(submitBtn);
  }

  // ================= CONFETTI =================
  const canvas=document.getElementById("confettiCanvas");
  const ctx=canvas.getContext("2d");
  canvas.width=window.innerWidth;
  canvas.height=window.innerHeight;
  let confetti=[];
  function launchConfetti(){
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
    if(confetti.length>0) requestAnimationFrame(animateConfetti);
  }

  // ================= RESOURCE SWITCH =================
  window.showResource=function(name){
    document.querySelectorAll(".resource-content").forEach(sec=>sec.style.display="none");
    const target=document.getElementById(name);
    if(target) target.style.display="block";
  }
  showResource("video");

});
