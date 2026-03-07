document.addEventListener("DOMContentLoaded", function() {

  // ================= SPA NAVIGATION =================
  const main = document.getElementById("main-content");
  function loadSection(section){
    main.innerHTML = "";
    if(section==="home") renderHome();
    if(section==="pets") renderPets();
    if(section==="learning") renderLearning();
    if(section==="world-clock") renderWorldClock();
  }
  window.loadSection = loadSection;

  // ================= BLOBS =================
  const blobs = document.createElement("div");
  blobs.className="bg-blobs";
  blobs.innerHTML="<span></span><span></span><span></span>";
  document.body.appendChild(blobs);

  // ================= PET DATA =================
  let xp = parseInt(localStorage.getItem("xp"))||0;
  let level = parseInt(localStorage.getItem("level"))||1;
  let streak = parseInt(localStorage.getItem("streak"))||0;
  let petCollection=[{name:"Wolf",emoji:"🐺",language:"German"}];
  let currentPet = petCollection[0];
  let petName = localStorage.getItem("petName")||"Pika";

  function updatePetUI(){
    const avatar = document.querySelector("#pet-avatar");
    if(avatar) avatar.textContent = currentPet.emoji;
    const nameDisplay = document.getElementById("pet-name-display");
    if(nameDisplay) nameDisplay.textContent = petName;
    const xpFill = document.getElementById("xp-fill");
    if(xpFill) xpFill.style.width = (xp%100)+"%";
    const levelDisplay = document.getElementById("level");
    if(levelDisplay) levelDisplay.textContent = level;
    const streakDisplay = document.getElementById("streak");
    if(streakDisplay) streakDisplay.textContent = streak;
  }

  // ================= CONFETTI =================
  const canvas=document.getElementById("confettiCanvas");
  const ctx=canvas.getContext("2d");
  canvas.width=window.innerWidth; canvas.height=window.innerHeight;
  let confetti=[];
  function launchConfetti(){
    for(let i=0;i<100;i++){ confetti.push({ x:Math.random()*canvas.width, y:Math.random()*canvas.height-canvas.height, size:Math.random()*6+4, speed:Math.random()*3+2 }); }
    animateConfetti();
  }
  function animateConfetti(){
    ctx.clearRect(0,0,canvas.width,canvas.height);
    confetti.forEach(p=>{ p.y+=p.speed; ctx.fillStyle="#ff7f7f"; ctx.fillRect(p.x,p.y,p.size,p.size); });
    confetti=confetti.filter(p=>p.y<canvas.height);
    if(confetti.length>0) requestAnimationFrame(animateConfetti);
  }

  // ================= WORLD CLOCK DATA =================
  let timezones=[
    {country:"Japan",code:"Asia/Tokyo",flag:"🇯🇵"},
    {country:"Spain",code:"Europe/Madrid",flag:"🇪🇸"},
    {country:"China",code:"Asia/Shanghai",flag:"🇨🇳"}
  ];

  function renderWorldClock(){
    const section = document.createElement("div");
    section.className="section active";
    section.innerHTML=`<h2>World Clock</h2><div id="clock-container" class="clock-container"></div>`;
    main.appendChild(section);
    const container=document.getElementById("clock-container");
    timezones.forEach(tz=>{
      const id = tz.code.replace("/","");
      const box = document.createElement("div");
      box.className="clock-box";
      box.innerHTML=`<h4>${tz.flag} ${tz.country}</h4><p id="${id}">--:--</p>`;
      container.appendChild(box);
    });
    updateClocks();
    setInterval(updateClocks,1000);
  }

  function updateClocks(){
    const now=new Date();
    timezones.forEach(tz=>{
      const id=tz.code.replace("/","");
      const el=document.getElementById(id);
      if(el) el.textContent=now.toLocaleTimeString("en-US",{timeZone:tz.code});
    });
  }

  // ================= LOAD SECTIONS =================
  function renderHome(){
    const section=document.createElement("div");
    section.className="section active";
    section.innerHTML=`
      <h2>Good ${getGreeting()} Emma!</h2>
      <div class="pet-panel panel">
        <div id="pet-avatar" class="pet-avatar">${currentPet.emoji}</div>
        <div id="pet-name-display">${petName}</div>
        <div class="xp-bar"><div id="xp-fill"></div></div>
        <p>Level <span id="level">${level}</span> | 🔥 Streak <span id="streak">${streak}</span></p>
        <button onclick="completeLesson()">Play Lesson</button>
      </div>
    `;
    main.appendChild(section);
    updatePetUI();
  }

  function getGreeting(){
    const h=new Date().getHours();
    if(h<12) return "morning";
    else if(h<18) return "afternoon";
    else return "evening";
  }

  // PET LESSON & XP
  window.completeLesson=function(){
    xp+=20; streak+=1;
    if(xp>=level*100){ level++; launchConfetti(); }
    localStorage.setItem("xp",xp); localStorage.setItem("level",level); localStorage.setItem("streak",streak);
    updatePetUI();
  }

  function renderPets(){
    const section=document.createElement("div");
    section.className="section active";
    let petsHTML = petCollection.map(p=>`
      <div class="pet-card panel">
        <div class="pet-emoji">${p.emoji}</div>
        <div class="pet-name">${p.name}</div>
        <div class="language-badge">${p.language}</div>
      </div>
    `).join("");
    section.innerHTML=`<h2>Pet Collection</h2>
      <div class="current-pet panel">
        <div id="pet-avatar" class="pet-avatar">${currentPet.emoji}</div>
        <div id="pet-name-display">${petName}</div>
      </div>
      <div class="lesson-cards">${petsHTML}</div>
      <div style="text-align:center; margin-top:20px;">
        <button onclick="collectPet('Spanish')">Spanish 🦊</button>
        <button onclick="collectPet('Mandarin')">Mandarin 🐼</button>
        <button onclick="collectPet('Japanese')">Japanese 🐱</button>
      </div>
    `;
    main.appendChild(section);
  }

  window.collectPet=function(lang){
    let newPet;
    if(lang==="Spanish") newPet={name:"Fox",emoji:"🦊",language:"Spanish"};
    if(lang==="Mandarin") newPet={name:"Panda",emoji:"🐼",language:"Mandarin"};
    if(lang==="Japanese") newPet={name:"Cat",emoji:"🐱",language:"Japanese"};
    if(!petCollection.find(p=>p.name===newPet.name)){
      petCollection.push(newPet); launchConfetti();
      alert("New pet collected: "+newPet.name); renderPets();
    }
  }

  function renderLearning(){
    const section=document.createElement("div");
    section.className="section active panel";
    section.innerHTML=`<h2>Learning</h2>
      <div class="lesson-cards">
        <div class="lesson-card">Flashcards<div class="lvl">Lv.1</div></div>
        <div class="lesson-card">Practice<div class="lvl">Lv.1</div></div>
        <div class="lesson-card">Unit Test<div class="lvl">Lv.1</div></div>
      </div>
    `;
    main.appendChild(section);
  }

  // ================= INITIAL LOAD =================
  loadSection("home");
});
