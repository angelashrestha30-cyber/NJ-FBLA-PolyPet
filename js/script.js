// ================= DOCUMENT READY =================
document.addEventListener("DOMContentLoaded", () => {

  // ================= SECTIONS NAV =================
  window.showSection = function(sectionId) {
    document.querySelectorAll(".section").forEach(sec => {
      sec.style.display = "none";
    });
    const target = document.getElementById(sectionId);
    if(target) target.style.display = "block";
  }
  showSection("home"); // default

  // ================= DYNAMIC GREETING =================
  function updateGreeting() {
    const now = new Date();
    const hour = now.getHours();
    let greeting = "Hello";
    if(hour >= 5 && hour < 12) greeting = "Good Morning";
    else if(hour >= 12 && hour < 18) greeting = "Good Afternoon";
    else greeting = "Good Evening";
    document.getElementById("greeting-container").textContent = `${greeting}, Emma! 🌸`;
  }
  updateGreeting();
  setInterval(updateGreeting, 60000);

  // ================= PET DATA =================
  let xp = parseInt(localStorage.getItem("xp")) || 0;
  let level = parseInt(localStorage.getItem("level")) || 1;
  let streak = parseInt(localStorage.getItem("streak")) || 0;
  let petName = localStorage.getItem("petName") || "Pika";

  let petCollection = [
    {name:"Wolf", emoji:"🐺", language:"German"},
    {name:"Lion", emoji:"🦁", language:"Swahili"}
  ];
  let currentPet = petCollection[0];

  function updatePetUI() {
    document.getElementById("level").textContent = level;
    document.getElementById("streak").textContent = streak;
    document.getElementById("xp-fill").style.width = (xp % 100) + "%";
  }
  updatePetUI();

  // ================= PET COLLECTION =================
  function renderPetCollection() {
    const container = document.getElementById("pet-collection");
    if(!container) return;
    container.innerHTML = "";
    petCollection.forEach(pet => {
      const card = document.createElement("div");
      card.className = "pet-card glass";
      card.innerHTML = `<div class="pet-emoji">${pet.emoji}</div>
                        <div class="pet-name">${pet.name}</div>
                        <div class="language-badge">${pet.language}</div>`;
      container.appendChild(card);
    });
  }
  renderPetCollection();

  window.collectPet = function(lang){
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

  // ================= LESSON XP =================
  window.completeLesson = function(){
    xp += 20; streak += 1;
    if(xp >= level*100){
      level++; launchConfetti();
    }
    localStorage.setItem("xp",xp);
    localStorage.setItem("level",level);
    localStorage.setItem("streak",streak);
    updatePetUI();
  }

  // ================= WORLD CLOCK =================
  const timezones = [
    {country:"Japan", code:"Asia/Tokyo", flag:"🇯🇵"},
    {country:"Spain", code:"Europe/Madrid", flag:"🇪🇸"},
    {country:"China", code:"Asia/Shanghai", flag:"🇨🇳"}
  ];

  function renderClocks(){
    const container = document.getElementById("clock-container");
    if(!container) return;
    container.innerHTML="";
    timezones.forEach(tz=>{
      const box = document.createElement("div");
      box.className="clock-box glass";
      const id = tz.code.replace("/","");
      box.innerHTML=`<h4>${tz.flag} ${tz.country}</h4><p id="${id}">--:--</p>`;
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

  // ================= FLASHCARDS =================
  const flashcards = [
    {front:"Aunque", back:"Although"},
    {front:"Sin embargo", back:"However"},
    {front:"A pesar de", back:"Despite"},
    {front:"Lograr", back:"To achieve"},
    {front:"Desarrollar", back:"To develop"}
  ];
  let currentCard = 0;
  let flipped = false;

  function showCard(){
    const card = document.getElementById("flashcard");
    if(!card) return;
    card.textContent = flipped ? flashcards[currentCard].back : flashcards[currentCard].front;
  }

  window.flipCard = function(){ flipped=!flipped; showCard(); }
  window.nextCard = function(){ currentCard=(currentCard+1)%flashcards.length; flipped=false; showCard(); }
  window.loadSpanishLevel3 = function(){ currentCard=0; flipped=false; showCard(); }
  loadSpanishLevel3();

  // ================= PRACTICE MODE =================
  const practiceQuestions=[
    {q:"Translate 'hola'", a:"hello", explanation:"Hola means hello in Spanish."},
    {q:"Translate 'perro'", a:"dog", explanation:"Perro is dog in Spanish."},
    {q:"Translate 'gato'", a:"cat", explanation:"Gato means cat."},
    {q:"Translate 'agua'", a:"water", explanation:"Agua means water."},
    {q:"Translate 'libro'", a:"book", explanation:"Libro means book."}
  ];
  let practiceIndex=0;

  function showPractice(){
    document.getElementById("practiceQuestion").textContent = practiceQuestions[practiceIndex].q;
  }

  window.startPractice = function(){ practiceIndex=0; showPractice(); }

  window.checkPractice = function(){
    const input = document.getElementById("practiceInput").value.toLowerCase().trim();
    const correct = practiceQuestions[practiceIndex].a;
    const result = document.getElementById("practiceResult");
    if(input === correct){
      result.textContent = `✅ Correct! ${practiceQuestions[practiceIndex].explanation}`;
      document.getElementById("nextPracticeBtn").style.display = "inline-block";
    } else {
      result.textContent = `❌ Wrong! Correct: ${correct}. ${practiceQuestions[practiceIndex].explanation}`;
      document.getElementById("nextPracticeBtn").style.display = "inline-block";
    }
  }

  window.nextPractice = function(){
    practiceIndex = (practiceIndex+1)%practiceQuestions.length;
    document.getElementById("practiceInput").value="";
    document.getElementById("practiceResult").textContent="";
    document.getElementById("nextPracticeBtn").style.display="none";
    showPractice();
  }

  // ================= UNIT TEST =================
  const unitTestQuestions=[
    {q:"What does 'hola' mean?", options:["Hello","Bye","Thanks","Please"], answer:"Hello", explanation:"Hola means Hello in Spanish."},
    {q:"Translate 'perro'", options:["Dog","Cat","Fish","Bird"], answer:"Dog", explanation:"Perro means Dog."},
    {q:"Translate 'gato'", options:["Dog","Cat","Fish","Bird"], answer:"Cat", explanation:"Gato means Cat."},
    {q:"Translate 'libro'", options:["Book","Pen","Desk","Chair"], answer:"Book", explanation:"Libro means Book."},
    {q:"Translate 'agua'", options:["Water","Milk","Bread","Juice"], answer:"Water", explanation:"Agua means Water."}
  ];

  const unitTestContainer = document.getElementById("unitTest");
  if(unitTestContainer){
    unitTestQuestions.forEach((q,i)=>{
      const box = document.createElement("div");
      box.className="question-box glass";
      const title = document.createElement("p");
      title.textContent = `${i+1}. ${q.q}`;
      box.appendChild(title);
      q.options.forEach(opt=>{
        const label = document.createElement("label");
        label.style.display="block";
        const input = document.createElement("input");
        input.type="radio"; input.name="q"+i; input.value=opt;
        label.appendChild(input);
        label.appendChild(document.createTextNode(" "+opt));
        box.appendChild(label);
      });
      const checkBtn = document.createElement("button");
      checkBtn.textContent = "Check Answer";
      checkBtn.onclick = ()=>{
        const selected = box.querySelector(`input[name=q${i}]:checked`);
        if(selected){
          if(selected.value===q.answer){
            alert("✅ Correct! "+q.explanation);
          } else {
            alert("❌ Wrong! Correct: "+q.answer+". "+q.explanation);
          }
        } else alert("Select an answer first!");
      }
      box.appendChild(checkBtn);
      unitTestContainer.appendChild(box);
    });
  }

  // ================= CONFETTI =================
  const canvas = document.getElementById("confettiCanvas");
  const ctx = canvas.getContext("2d");
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  let confetti = [];

  window.launchConfetti = function(){
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
      p.y += p.speed;
      ctx.fillStyle="#ff7f7f";
      ctx.fillRect(p.x,p.y,p.size,p.size);
    });
    confetti = confetti.filter(p=>p.y<canvas.height);
    if(confetti.length>0) requestAnimationFrame(animateConfetti);
  }

});
