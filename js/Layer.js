export default class Layer{
    constructor(linhas = 8, colunas = 12, tamanho = 32, cena = null, ativar = ()=>{}){
        this.LINHAS = linhas;
        this.COLUNAS = colunas;
        this.SIZE = tamanho;
        this.tiles = [];
        for (let l = 0; l < this.LINHAS; l++) {
            this.tiles[l] = [];
            for (let c = 0; c < this.COLUNAS; c++) {
                this.tiles[l][c] = 0;
            }
        }
        this.cena = cena;
        this.mostrar = false;
        this.ativar = ativar;
        this.layers = [];
        this.direcoes = [];
        this.pcx = null;
        this.pcy = null;
    }

    desenhar(ctx){
        for (let l = 0; l < this.LINHAS; l++) {
            for (let c = 0; c < this.COLUNAS; c++) {
                switch (this.tiles[l][c]){
                    case 1:
                        if(this.mostrar){
                            /*ctx.fillStyle = "grey";
                            ctx.lineWidth = 1;
                            ctx.strokeStyle = "black";
                            ctx.fillRect(c*this.SIZE, l*this.SIZE, this.SIZE, this.SIZE);*/
                            ctx.font = "15px Arial";
                            ctx.fillStyle = "white";
                            //ctx.fillText(this.layers[l][c], c*this.SIZE + this.SIZE/2, l*this.SIZE + this.SIZE/2 + 10);
                            ctx.fillText(this.direcoes[l][c], c*this.SIZE + this.SIZE/2, l*this.SIZE + this.SIZE/2 - 10);
                        }
                    break;
                    case 2:
                        if(this.mostrar){
                            /*ctx.fillStyle = "red";
                            ctx.lineWidth = 2;
                            ctx.strokeStyle = "orange"; 
                            ctx.fillRect(c*this.SIZE, l*this.SIZE, this.SIZE, this.SIZE);*/
                            ctx.font = "15px Arial";
                            ctx.fillStyle = "white";
                            //ctx.fillText(this.layers[l][c], c*this.SIZE + this.SIZE/2, l*this.SIZE + this.SIZE/2 + 10);
                            ctx.fillText(this.direcoes[l][c], c*this.SIZE + this.SIZE/2, l*this.SIZE + this.SIZE/2 -10);
                        }
                    break;
                    default:
                        if(this.mostrar){
                            /*ctx.fillStyle = "black";
                            ctx.lineWidth = 1;
                            ctx.strokeStyle = "grey";
                            ctx.fillRect(c*this.SIZE, l*this.SIZE, this.SIZE, this.SIZE);*/
                            ctx.font = "15px Arial";
                            ctx.fillStyle = "white";
                            //ctx.fillText(this.layers[l][c], c*this.SIZE + this.SIZE/2, l*this.SIZE + this.SIZE/2 + 10);
                            ctx.fillText(this.direcoes[l][c], c*this.SIZE + this.SIZE/2, l*this.SIZE + this.SIZE/2 - 10);
                        }
                }
                if(this.mostrar){
                    ctx.strokeRect(c*this.SIZE, l*this.SIZE, this.SIZE, this.SIZE); 
                }
            }
        }
        if(this.cena.input.comandos.get("ATIVAR_LAYER")){
            this.ativarLayer();
        }
    }

    carregaLayer(modelo){
        this.LINHAS = modelo.length;
        this.COLUNAS = modelo[0]?.length ?? 0;
        this.tiles = [];
        for (let l = 0; l < this.LINHAS; l++) {
            this.tiles[l] = [];
            for (let c = 0; c < this.COLUNAS; c++) {
                this.tiles[l][c] = modelo[l][c];
            }
        }
    }

    ativarLayer(){
        if(this.mostrar) {
            this.mostrar = false;
        } else {
            this.mostrar = true;
        }
    }

    iniciaLayers(){
        for (let l = 0; l < this.LINHAS; l++) {
            this.layers[l] = [];
            for (let c = 0; c < this.COLUNAS; c++) {
                if(this.tiles[l][c] != 0){
                    this.layers[l][c] = -1;
                } else {
                    this.layers[l][c] = 0;
                }
            }
        }
    }

    //Função que atualiza matriz de distâncias de Manhattan
    atualizaDistanciasManhattan(mx, my){
        for (let l = 0; l < this.LINHAS; l++) {
            this.layers[l] = [];
            for (let c = 0; c < this.COLUNAS; c++) {
                if(this.tiles[l][c] === 1){
                    this.layers[l][c] = -1;
                } else {
                    let distL = my - l;
                    let distC = mx - c;
                    this.layers[l][c] = Math.abs(distL) + Math.abs(distC);
                }
            }
        }
    }

    // Função de inundação
    inundar(my, mx, linha, coluna){
        if((my === linha && mx === coluna) && this.layers[linha][coluna] != -1){
            this.layers[linha][coluna] = 0;
            if(this.layers[linha-1][coluna] != -1) {
                this.layers[linha-1][coluna] = this.layers[linha][coluna] + 1;
                this.inundar(my, mx, linha-1, coluna);
            } 
            if(this.layers[linha+1][coluna] != -1){
                this.layers[linha+1][coluna] = this.layers[linha][coluna] + 1;
                this.inundar(my, mx, linha+1, coluna);
            } 
            if(this.layers[linha][coluna-1] != -1){
                this.layers[linha][coluna-1] = this.layers[linha][coluna] + 1;
                this.inundar(my, mx, linha, coluna-1);
            } 
            if(this.layers[linha][coluna+1] != -1){
                this.layers[linha][coluna+1] = this.layers[linha][coluna] + 1;
                this.inundar(my, mx, linha, coluna+1);
            } 
        }  else {
            if((my != linha || mx != coluna) && this.layers[linha-1][coluna] != -1){
                if((my != linha-1 || mx != coluna) && this.layers[linha-1][coluna] === 0 ){
                    this.layers[linha-1][coluna] = this.layers[linha][coluna] + 1;
                    this.inundar(my, mx, linha-1, coluna);
                } else if ((my != linha-1 || mx != coluna) && this.layers[linha-1][coluna] > this.layers[linha][coluna] + 1){
                    this.layers[linha-1][coluna] = this.layers[linha][coluna] + 1;
                    this.inundar(my, mx, linha-1, coluna);
                }
            }
            if((my != linha || mx != coluna) && this.layers[linha+1][coluna] != -1){
                if((my != linha+1 || mx != coluna) && this.layers[linha+1][coluna] === 0){
                    this.layers[linha+1][coluna] = this.layers[linha][coluna] + 1;
                    this.inundar(my, mx, linha+1, coluna);
                } else if ((my != linha+1 || mx != coluna) && this.layers[linha+1][coluna] > this.layers[linha][coluna] + 1){
                    this.layers[linha+1][coluna] = this.layers[linha][coluna] + 1;
                    this.inundar(my, mx, linha+1, coluna);
                }
            }
            if((my != linha || mx != coluna) && this.layers[linha][coluna-1] != -1){
                if((my != linha || mx != coluna-1) && this.layers[linha][coluna-1] === 0){
                    this.layers[linha][coluna-1] = this.layers[linha][coluna] + 1;
                    this.inundar(my, mx, linha, coluna-1);
                } else if ((my != linha || mx != coluna-1) && this.layers[linha][coluna-1] > this.layers[linha][coluna] + 1){
                    this.layers[linha][coluna-1] = this.layers[linha][coluna] + 1;
                    this.inundar(my, mx, linha, coluna-1);
                }
            }
            if((my != linha || mx != coluna) && this.layers[linha][coluna+1] != -1){
                if((my != linha || mx != coluna+1) && this.layers[linha][coluna+1] === 0){
                    this.layers[linha][coluna+1] = this.layers[linha][coluna] + 1;
                    this.inundar(my, mx, linha, coluna+1);
                }else if ((my != linha || mx != coluna+1) && this.layers[linha][coluna+1] > this.layers[linha][coluna] + 1){
                    this.layers[linha][coluna+1] = this.layers[linha][coluna] + 1;
                    this.inundar(my, mx, linha, coluna+1);
                }
            }
        }
    }

    // Função de cálculo de direções
    apontarDirecoes(){
        let temp = [];
        for (let l = 0; l < this.LINHAS; l++) {
            temp[l] = [];
            for (let c = 0; c < this.COLUNAS; c++) {
                if(this.layers[l][c] === -1){
                    temp[l][c] = Infinity;
                } else {
                    temp[l][c] = this.layers[l][c];
                }
            }
        }

        for (let l = 0; l < this.LINHAS; l++) {
            this.direcoes[l] = [];
            for (let c = 0; c < this.COLUNAS; c++) {
                if(temp[l][c] != 0 && temp[l][c] != Infinity){
                    if((temp[l][c-1] <= temp[l][c+1]) && (temp[l][c-1] <= temp[l+1][c]) && (temp[l][c-1] <= temp[l-1][c])){
                        this.direcoes[l][c] = "<";
                    }
                    else if((temp[l][c+1] <= temp[l][c-1]) && (temp[l][c+1] <= temp[l+1][c]) && (temp[l][c+1] <= temp[l-1][c])){
                        this.direcoes[l][c] = ">";
                    }
                    else if((temp[l-1][c] <= temp[l+1][c]) && (temp[l-1][c] <= temp[l][c-1]) && (temp[l-1][c] <= temp[l][c+1])){
                        this.direcoes[l][c] = "^";
                    }
                    else if((temp[l+1][c] <= temp[l-1][c]) && (temp[l+1][c] <= temp[l][c-1]) && (temp[l+1][c] <= temp[l][c+1])){
                        this.direcoes[l][c] = "V";
                    }
                } else {
                    this.direcoes[l][c] = " ";
                }
                //this.direcoes[l][c] = temp[l][c];
            }
        }
    }
}