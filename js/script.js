function showPage(page){

document.querySelectorAll(".page").forEach(p=>{
p.classList.remove("active")
})

document.getElementById(page).classList.add("active")

}

/* XP SYSTEM */

let xp=20
let level=1

function gainXP(){

xp+=20

if(xp>=100){
level++
xp=0
document.getElementById("level").textContent=level
}

document.getElementById("xp-fill").style.width=xp+"%"

}

/* WORLD CLOCK */

function updateClock(){

let now=new Date()

document.getElementById("tokyo").textContent=
now.toLocaleTimeString("en-US",{timeZone:"Asia/Tokyo"})

document.getElementById("madrid").textContent=
now.toLocaleTimeString("en-US",{timeZone:"Europe/Madrid"})

document.getElementById("beijing").textContent=
now.toLocaleTimeString("en-US",{timeZone:"Asia/Shanghai"})

}

setInterval(updateClock,1000)

updateClock()
