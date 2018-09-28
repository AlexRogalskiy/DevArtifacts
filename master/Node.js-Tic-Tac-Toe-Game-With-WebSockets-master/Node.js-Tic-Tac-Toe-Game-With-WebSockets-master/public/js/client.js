let player = null;
let socket = null
socket = io.connect('ws://127.0.0.1:8080/');
socket.on("handshake", handshake);
socket.on("go", go);
socket.on("draw", draw);
socket.on("win", win);
socket.on("status",status);

function start(button){
    
        socket.emit("start");
        button.setAttribute("disabled","");
    
}

function handshake(data){
    player = new Player(data);
    document.getElementById("sign").innerText = "You have the "+data;
    for(let i = 0; i < 3; i++){
        for(let j = 0; j < 3; j++){
            draw({"x": i, "y": j, "sign": "&nbsp;"});
        }
    }
}

function go(data){
    if(player != null){
        let sign = player.getSign();
        if(sign == data.plays){
            player.setPlay(true);
            document.getElementById("status").innerText=data.err+" Select a cell!";
        }else{
            player.setPlay(false);
            document.getElementById("status").innerText="Other player's turn!";
        }
    }
}

function win(data){
    document.getElementById("status").innerText = data;
    let button = document.getElementsByTagName("button")[0];
    button.innerText="New Game";
    button.removeAttribute("disabled");
    player = null;
}

function draw(data){
    let x = data.x;
    let y = data.y;
    let sign = data.sign;
    document.getElementById(x+"-"+y).innerHTML = sign;
}

function cell(cell){
    if(player != null){
        if(player.getPlay()){
            let x = cell.getAttribute("x");
            let y = cell.getAttribute("y");
            let sign = player.getSign();
            socket.emit("push",{"sign": sign, "x": x, "y": y});
        }
    }
}

function status(data){
    document.getElementById("status").innerText=data;
}