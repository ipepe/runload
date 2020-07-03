function setupCanvas(canvas) {
    var dpr = (window.devicePixelRatio || 1)*2;
    canvas.width = canvas.width * dpr;
    canvas.height = canvas.height * dpr;
    var ctx = canvas.getContext('2d');
    ctx.scale(dpr, dpr);
    return ctx;
}
function drawPixel(x, y, style){
    if(x*4 > canvas.width || y*4 > canvas.height){
        throw "outside canvas"
    }
    if(x*4 < 0 || y*4 < 0){
        throw "outside canvas"
    }
    ctx.fillStyle = style;
    ctx.fillRect( x*4, y*4, 4, 4 );
}

function clearCanvas(){
    ctx.clearRect(0, 0, canvas.width, canvas.height);
}

function resizeCanvas(x, y) {
    canvas.width = x * 4
    canvas.height = y * 4
    ctx = setupCanvas(canvas);
}

const socket = io();

canvas = document.querySelector('canvas');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

ctx = setupCanvas(canvas);
clearCanvas(canvas);


socket.on("clear", function (data) {
    clearCanvas();
});

socket.on("setsize", function (data) {
    resizeCanvas(data.x, data.y)
});

socket.on("paint", function(data){
    console.log("on paint", data)
    try{
        drawPixel(data.x-1, data.y-1, data.style)
    }catch(error){
        socket.emit("canvas error", {name: data.name})
    }
})