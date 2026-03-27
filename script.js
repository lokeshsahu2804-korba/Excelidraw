let canvas = document.getElementById('canvas');
let ctx = canvas.getContext('2d');

canvas.width = 700;
canvas.height = 450;

let isDrawing = false;
let currentColor = "black";
let lineWidth = 3;

let history = [];
let step = -1;


canvas.addEventListener('mousedown', start);
canvas.addEventListener('mousemove', draw);
canvas.addEventListener('mouseup', stop);

canvas.addEventListener('touchstart', start);
canvas.addEventListener('touchmove', draw);
canvas.addEventListener('touchend', stop);


function start(e){
    isDrawing = true;
    ctx.beginPath();
    let pos = getPos(e);
    ctx.moveTo(pos.x, pos.y);
}


function draw(e){
    if(!isDrawing) return;

    let pos = getPos(e);

    ctx.lineTo(pos.x, pos.y);
    ctx.strokeStyle = currentColor;
    ctx.lineWidth = lineWidth;
    ctx.lineCap = "round";
    ctx.stroke();
}


function stop(){
    if(!isDrawing) return;
    isDrawing = false;

    saveState();
}


function getPos(e){
    let rect = canvas.getBoundingClientRect();

    if(e.touches){
        return {
            x: e.touches[0].clientX - rect.left,
            y: e.touches[0].clientY - rect.top
        }
    }

    return {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top
    }
}


function saveState(){
    step++;
    history = history.slice(0, step);
    history.push(canvas.toDataURL());
}


document.getElementById("undo").onclick = () => {
    if(step > 0){
        step--;
        restore();
    }
};


document.getElementById("redo").onclick = () => {
    if(step < history.length - 1){
        step++;
        restore();
    }
};


function restore(){
    let img = new Image();
    img.src = history[step];
    img.onload = () => {
        ctx.clearRect(0,0,canvas.width,canvas.height);
        ctx.drawImage(img,0,0);
    }
}


document.getElementById("clear").onclick = () => {
    ctx.clearRect(0,0,canvas.width,canvas.height);
    saveState();
};


document.querySelectorAll(".color").forEach(el => {
    el.addEventListener("click", () => {
        currentColor = el.id;
    });
});


document.getElementById("color-picker").addEventListener("input", (e)=>{
    currentColor = e.target.value;
});


document.getElementById("volume").addEventListener("input", (e)=>{
    lineWidth = e.target.value;
});

saveState();