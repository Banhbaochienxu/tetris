
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext( "2d");

const ROW = 18;
const COL = 10;
const SQ = 40;
const COLOR = "WHITE";
let score = 0;

function DrawSquare(x,y,color){
    ctx.fillStyle = color;
    ctx.fillRect(x * SQ, y * SQ, SQ, SQ);

    ctx.strokeStyle = "#ccc";
    ctx.strokeRect(x * SQ, y * SQ, SQ, SQ);
}

let broad = [];
for (r = 0; r < ROW; r++){
    broad[r] = [];
    for (c = 0; c < COL; c++){
        broad[r][c] = COLOR;
    }
}

function DrawBoard(){
    for(r = 0; r < ROW; r++){
        for(c = 0; c < COL; c++){
            DrawSquare(c,r,broad[r][c]);
        }
    }
}
DrawBoard();


class Piece {
    constructor(shape,color){
        this.shape = shape;
        this.color = color;

        let N = Math.floor(Math.random() * (this.shape.length));
        this.shapeN = N;
        this.actionShape = this.shape[this.shapeN];

        this.x = 3;
        this.y = -3;
    }
    fill(color) {
        for (let r = 0; r < this.actionShape.length; r++){
            for (let c = 0; c < this.actionShape.length; c++){
                if (this.actionShape[r][c]){
                    DrawSquare(this.x + c, this.y + r,color);
                }
            }
        }
    }
    Draw(){
        this.fill(this.color);
    }
    unDraw(){
        this.fill(COLOR);
    }
    circular(){
        if (!this.collision(0,1,this.actionShape)){
            let netxshape = this.shape[(this.shapeN + 1) % this.shape.length]
            let move = 0;
            if(this.collision(0,0,netxshape)){
                if (this.x > COL/2){
                    this.unDraw();                   
                    if (this.shape == I){
                        this.x += -2;
                    }
                    else{
                        this.x += -1;
                    }
                    this.shapeN = (this.shapeN+1) % this.shape.length;
                    this.actionShape = this.shape[this.shapeN];
                    this.Draw();
                }               
                else{
                    this.unDraw();
                    this.x += 1;
                    this.shapeN = (this.shapeN+1) % this.shape.length;
                    this.actionShape = this.shape[this.shapeN];
                    this.Draw();
                }
            }

            else if(!this.collision(0,0,netxshape)){
                this.unDraw();
                this.shapeN = (this.shapeN+1) % this.shape.length;
                this.actionShape = this.shape[this.shapeN];
                this.Draw();
            }
        }
    }
    moveDown(){
        if (!this.collision(0,1,this.actionShape)){
        this.unDraw();
        this.y++;
        this.Draw();
        } 
        else{
            this.lock();
            p = randomPiece();
        }
    }
    moveLeft(){
        if (!this.collision(-1,0,this.actionShape)){
            this.unDraw();
            this.x--;
            this.Draw();
        }
    }
    moveRight(){
        if (!this.collision(1,0,this.actionShape)){
            this.unDraw();
            this.x++;
            this.Draw();
        }
    }

    lock(){
        for (let r = 0; r < this.actionShape.length; r++){
            for (let c = 0; c < this.actionShape.length; c++){
                if(!this.actionShape[r][c]){
                    continue;
                }

                if(this.y + r < 0){
                    alert(`game over\nSố điểm của bạn là: ` + score);
                    gameOver = true;
                    break;
                }

                broad[this.y + r][this.x + c] = this.color;
            }
        }
        this.finish();
    }

    finish(){
        for (let r = 0; r < ROW; r++){
            let isFull = true;
            for (let c = 0; c < COL; c++){
                isFull = isFull && (broad[r][c] != COLOR)                                  
            }
            if(isFull){
                for(let y = r; y > 1; y--){
                    for(let c = 0; c < COL; c++){
                        broad[y][c] = broad[y-1][c];
                    }

                    for(let c = 0; c < COL; c++){
                        broad[0][c] = COLOR;
                    }
                }
                score += 10;                
            }
        }
        DrawBoard();
        document.querySelector('#score').innerText = score;
    }
    
    collision(x,y,piece) {
        for (let r = 0; r < piece.length; r++){
            for (let c = 0; c < piece.length; c++){
                if (!piece[r][c]){
                    continue
                }
                
                let newX = this.x + c + x;
                let newY = this.y + r + y;

                if (newX < 0 || newX >= COL || newY >= ROW){
                    return true;
                }

                if (newY < 0){
                    continue
                }

                if(broad[newY][newX] != COLOR ){
                    return true
                }
            }
        }
        return false;
    }
}
const PIECE =[
    [I,"red"],
    [L,"green"],
    [O,"yellow"],
    [J,"blue"],
    [S,"purple"],
    [T,"orange"],
]

document.addEventListener('keydown', function(e){
    if(e.keyCode == 37){
        p.moveLeft();
    }
    else if(e.keyCode == 38){
        p.circular();
    }
    else if(e.keyCode == 39){
        p.moveRight();
    }
    else if(e.keyCode == 40){
        p.moveDown();
    }
})

function randomPiece(){
    let r = Math.floor(Math.random() * PIECE.length);
    return new Piece(PIECE[r][0],PIECE[r][1]);   
}
let p  = randomPiece();

console.log(p);

let gameOver = false;
let time;

function drop(){
    time = setInterval(function(){
        if(!gameOver){           
            p.moveDown();
        }
        else{
            clearInterval(time);
            location.reload();
        }
    }, 1000)
}

function start(){
    const btnStart = document.querySelector('.btn-start')
    btnStart.style.display = 'none'
    drop();
}
