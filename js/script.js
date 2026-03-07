document.addEventListener("DOMContentLoaded", function () {

  // ==================== PAGE SWITCHING ====================
  const pages = document.querySelectorAll(".page");
  const navButtons = document.querySelectorAll(".nav-links button");

  function showPage(pageId) {
    pages.forEach(p => p.classList.remove("active"));
    const page = document.getElementById(pageId);
    if(page) page.classList.add("active");
  }

  navButtons.forEach(btn => {
    btn.addEventListener("click", () => showPage(btn.dataset.page));
  });

  // ==================== GREETING ====================
  function updateGreeting() {
    const now = new Date();
    const hour = now.getHours();
    let greetingText = "Hello, Emma!";
    if(hour < 12) greetingText = "Good Morning, Emma!";
    else if(hour < 18) greetingText = "Good Afternoon, Emma!";
    else greetingText = "Good Evening, Emma!";
    document.getElementById("greeting").textContent = greetingText;
  }
  updateGreeting();
  setInterval(updateGreeting, 60000);

  // ==================== WORLD CLOCK ====================
  const timezones = [
    {country:"Japan", code:"Asia/Tokyo", flag:"🇯🇵"},
    {country:"Spain", code:"Europe/Madrid", flag:"🇪🇸"},
    {country:"China", code:"Asia/Shanghai", flag:"🇨🇳"}
  ];

  function renderClocks() {
    const container = document.getElementById("clock-container");
    if(!container) return;
    container.innerHTML = "";
    timezones.forEach(tz => {
      const box = document.createElement("div");
      box.className = "clock-box";
      const id = tz.code.replace("/", "");
      box.innerHTML = `<h4>${tz.flag} ${tz.country}</h4><p id="${id}">--:--</p>`;
      container.appendChild(box);
    });
  }

  function updateClocks() {
    const now = new Date();
    timezones.forEach(tz => {
      const id = tz.code.replace("/","");
      const el = document.getElementById(id);
      if(el) el.textContent = now.toLocaleTimeString("en-US",{timeZone:tz.code});
    });
  }

  renderClocks();
  updateClocks();
  setInterval(updateClocks, 1000);

  // ==================== PET DATA ====================
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
    document.querySelector(".pet-avatar").textContent = currentPet.emoji;
    document.getElementById("pet-name-display").textContent = petName;
    document.getElementById("level").textContent = level;
    document.getElementById("streak").textContent = streak;
    document.getElementById("xp-fill").style.width = (xp % 100) + "%";
  }

  updatePetUI();

  // ==================== PET RENAME ====================
  document.getElementById("pet-name-btn").addEventListener("click", () => {
    const newName = document.getElementById("pet-name-input").value.trim();
    if(newName){
      petName = newName;
      localStorage.setItem("petName", newName);
      updatePetUI();
      document.getElementById("pet-name-input").value = "";
    }
  });

  // ==================== LESSON / XP ====================
  window.completeLesson = function() {
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

  // ==================== PET COLLECTION ====================
  function renderPetCollection(){
    const container = document.getElementById("pet-collection");
    if(!container) return;
    container.innerHTML = "";
    petCollection.forEach(pet=>{
      const card = document.createElement("div");
      card.className = "pet-card";
      card.innerHTML = `
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

  // ==================== FLASHCARDS ====================
  const flashcards = [
    {front:"Aunque", back:"Although"},
    {front:"Sin embargo", back:"However"},
    {front:"A pesar de", back:"Despite"},
    {front:"Lograr", back:"To achieve"},
    {front:"Desarrollar", back:"To develop"}
  ];
  let currentCard=0, flipped=false;

  function showCard(){
    const card = document.getElementById("flashcard");
    if(!card) return;
    card.textContent = flipped ? flashcards[currentCard].back : flashcards[currentCard].front;
  }
  window.flipCard = function(){ flipped=!flipped; showCard(); }
  window.nextCard = function(){ currentCard=(currentCard+1)%flashcards.length; flipped=false; showCard(); }

  // ==================== PRACTICE MODE ====================
  const practiceQuestions = [
    {q:"Translate 'hola'", a:"hello", exp:"Hola means hello."},
    {q:"Translate 'perro'", a:"dog", exp:"Perro is dog."},
    {q:"Translate 'gato'", a:"cat", exp:"Gato is cat."},
    {q:"Translate 'agua'", a:"water", exp:"Agua means water."},
    {q:"Translate 'libro'", a:"book", exp:"Libro means book."},
  ];
  let practiceIndex=0;

  function showPractice(){
    document.getElementById("practiceQuestion").textContent = practiceQuestions[practiceIndex].q;
  }

  window.startPractice = function(){ practiceIndex=0; showPractice(); }
  window.checkPractice = function(){
    const input = document.getElementById("practiceInput").value.toLowerCase();
    const correct = practiceQuestions[practiceIndex].a.toLowerCase();
    const result = document.getElementById("practiceResult");
    if(input === correct){
      result.textContent = "✅ Correct! " + practiceQuestions[practiceIndex].exp;
      document.getElementById("nextPracticeBtn").style.display = "inline-block";
    } else {
      result.textContent = "❌ Wrong! " + practiceQuestions[practiceIndex].exp;
      document.getElementById("nextPracticeBtn").style.display = "inline-block";
    }
  }
  window.nextPractice = function(){
    practiceIndex=(practiceIndex+1)%practiceQuestions.length;
    document.getElementById("practiceInput").value="";
    document.getElementById("practiceResult").textContent="";
    document.getElementById("nextPracticeBtn").style.display="none";
    showPractice();
  }

  // ==================== UNIT TEST ====================
  const unitTestQuestions = [
    {q:"What does hola mean?", options:["Hello","Bye","Thanks","Please"], ans:"Hello", exp:"Hola means hello."},
    {q:"Translate perro", options:["Dog","Cat","Fish","Bird"], ans:"Dog", exp:"Perro is dog."},
    {q:"Translate gato", options:["Dog","Cat","Fish","Bird"], ans:"Cat", exp:"Gato is cat."},
    {q:"Translate libro", options:["Book","Pen","Desk","Chair"], ans:"Book", exp:"Libro means book."},
    {q:"Translate agua", options:["Water","Milk","Bread","Juice"], ans:"Water", exp:"Agua means water."}
  ];

  const unitTestContainer = document.getElementById("unitTest");
  if(unitTestContainer){
    unitTestQuestions.forEach((q,i)=>{
      const box = document.createElement("div");
      box.className="question-box";
      const title = document.createElement("p");
      title.textContent = (i+1)+". "+q.q;
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

      const explain = document.createElement("p");
      explain.className="explanation";
      explain.style.display="none";
      explain.textContent = q.exp;
      box.appendChild(explain);

      unitTestContainer.appendChild(box);
    });

    const submitBtn = document.createElement("button");
    submitBtn.textContent = "Submit Test";
    submitBtn.onclick = function(){
      let score = 0;
      unitTestQuestions.forEach((q,i)=>{
        const selected = document.querySelector(`input[name=q${i}]:checked`);
        const explain = document.querySelectorAll(".explanation")[i];
        explain.style.display="block";
        if(selected && selected.value === q.ans) score++;
      });
      alert(`Your score: ${score}/${unitTestQuestions.length}`);
    };
    unitTestContainer.appendChild(submitBtn);
  }

  // ==================== CONFETTI ====================
  const canvas = document.getElementById("confettiCanvas");
  const ctx = canvas.getContext("2d");
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  let confetti = [];

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
    confetti = confetti.filter(p=>p.y<canvas.height);
    if(confetti.length>0) requestAnimationFrame(animateConfetti);
  }

  // ==================== RESOURCE SWITCH ====================
  window.showResource=function(name){
    const sections=document.querySelectorAll(".resource-content");
    sections.forEach(sec=>sec.classList.remove("active"));
    const target=document.getElementById(name);
    if(target) target.classList.add("active");
  }
  showResource("video");

});
