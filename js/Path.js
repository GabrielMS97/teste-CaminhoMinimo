export default class Path{
    constructor(linhas = 8, colunas = 12, tamanho = 32, cena = null){
        this.LINHAS = linhas;
        this.COLUNAS = colunas;
        this.SIZE = tamanho;
        this.cena = cena;
        this.tiles = [];
        this.caminho = [];
        this.steps = [];
        for (let l = 0; l < this.LINHAS; l++) {
            this.tiles[l] = [];
            this.steps[l] = [];
            for (let c = 0; c < this.COLUNAS; c++) {
                this.tiles[l][c] = 0;
                this.steps[l][c] = 0;
            }
        }
    }

    desenhar(ctx){
        for (let l = 0; l < this.LINHAS; l++) {
            for (let c = 0; c < this.COLUNAS; c++) {
                ctx.font = "15px Arial";
                ctx.fillStyle = "blue";
                //ctx.fillText(this.caminho[l][c], c*this.SIZE + this.SIZE/2, l*this.SIZE + this.SIZE/2 + 10);
                /*if(this.caminho[l][c] === "<"){
                    ctx.drawImage(this.layer.cena.assets.img("setaO"), c*this.SIZE + 11, l*this.SIZE + 11, 25, 25);
                }
                if(this.caminho[l][c] === ">"){
                    ctx.drawImage(this.layer.cena.assets.img("setaL"), c*this.SIZE + 11, l*this.SIZE + 11, 25, 25);
                }
                if(this.caminho[l][c] === "^"){
                    ctx.drawImage(this.layer.cena.assets.img("setaN"), c*this.SIZE + 11, l*this.SIZE + 11, 25, 25);
                }
                if(this.caminho[l][c] === "v"){
                    ctx.drawImage(this.layer.cena.assets.img("setaS"), c*this.SIZE + 11, l*this.SIZE + 11, 25, 25);
                }*/
                if(this.steps[l][c] === 1){
                    ctx.fillText(" O ", c*this.SIZE + this.SIZE/2, l*this.SIZE + this.SIZE/2 + 10);
                }
                ctx.strokeRect(c*this.SIZE, l*this.SIZE, this.SIZE, this.SIZE); 
            }
        }
    }

    carregaPath(mxE, myE, mxS, myS, caminho){
        for (let l = 0; l < this.LINHAS; l++) {
            this.tiles[l] = [];
            for (let c = 0; c < this.COLUNAS; c++) {
                this.tiles[l][c] = caminho[l][c];
            }
        }
    }

    calculaCaminho(){ // percorre caminho
        for (let l = 0; l < this.LINHAS; l++) {
            this.tiles[l] = [];
            this.caminho[l] = [];
            for (let c = 0; c < this.COLUNAS; c++) {
                this.tiles[l][c] = this.layer.direcoes[l][c];
                this.caminho[l][c] = " ";
            }
        }

        let mxAtual = this.layer.mxEntrada;
        let myAtual = this.layer.myEntrada;

        while(mxAtual != this.layer.mxSaida || myAtual != this.layer.mySaida){
            if(this.tiles[myAtual][mxAtual] === "O"){
                this.caminho[myAtual][mxAtual] = "<";
                mxAtual = mxAtual-1;
            }
            if(this.tiles[myAtual][mxAtual] === "L"){
                this.caminho[myAtual][mxAtual] = ">";
                mxAtual = mxAtual+1;
                
            }
            if(this.tiles[myAtual][mxAtual] === "N"){
                this.caminho[myAtual][mxAtual] = "^";
                myAtual = myAtual-1; 
                
            }
            if(this.tiles[myAtual][mxAtual] === "S"){
                this.caminho[myAtual][mxAtual] = "v";
                myAtual = myAtual+1;
                
            }
        }

    }

    addStep(x,y){
        this.steps[x][y] = 1;
    }

    removeStep(x,y){
        this.steps[x][y] = 0;
    }
}
