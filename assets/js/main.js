function Menu() {
    const telaJogo = document.getElementById('tela-jogo');
    const textoCima =  document.querySelector('.texto-cima');
    const botao =  document.querySelector('.botao');
    const pontFinal = document.querySelector('.pontuacao-final');
    this.inico = true;
    let riverRaid = new RiverRaid();

    if (this.inico) {
        textoCima.innerHTML = 'Bem vindo ao River Raid!';
        botao.innerHTML = 'Inciar';
        botao.addEventListener('click', (event) => {
            telaJogo.style.zIndex = -1;
            riverRaid.start()
        });
    }
    const verificaBateu = setInterval(() => {
       if (riverRaid.perdeu) {
        telaJogo.style.zIndex = 2;
        textoCima.innerHTML = 'Você Perdeu!';
        pontFinal.innerHTML = `${riverRaid.getPontuacao()} pontos <br>${riverRaid.getQtdCombPego()} combustíveis`; 
        botao.innerHTML = 'Reiniciar';
       } 
    }, 20);
    botao.addEventListener('click', (event) => {
        if (riverRaid.perdeu){
            telaJogo.style.zIndex = -1;

            // removendo todos os filhos de window;
            const window = document.getElementById("window");
            while (window.firstChild) {
            window.removeChild(window.firstChild);
            }

            // esgotamento zero
            const esgotamento = document.getElementById("esgotamento");
            esgotamento.style.height = 0;
            riverRaid = new RiverRaid();
            riverRaid.start();
        }
    });
}


function novoElemento(tagName, className) {
    const elemento = document.createElement(tagName)
    elemento.className = className
    return elemento
}

function BackgroundImg () {
    this.elemento = novoElemento('img', 'img-background');
    this.elemento.src = './assets/img/bg.png';
    this.getY = () => parseInt(this.elemento.style.top.split('px')[0])
    this.setY =  y => this.elemento.style.top = `${y}px`
}

function Background () {
    this.elemento = novoElemento('div', 'space')
    this.imagens = [
        new BackgroundImg(),
        new BackgroundImg()
    ]

    this.afastamento = () => {
            let i = 0;
            this.imagens.forEach(img => {
                img.setY(-i*500)
                i++;
            })
        }
    this.afastamento()

    this.deslocamento = 1;
    this.animar = () => {
        this.imagens.forEach(img => {
                if (img.getY() >= 500){
                    img.setY(-img.elemento.clientHeight)
                }
            img.setY(img.getY() + this.deslocamento)
        })
        
    }
}

function Progresso() {
    this.elemento = novoElemento('span', 'progresso')
    this.pontos = -1;
    this.pegouMoeda = () => {
        console.log('Pegou moeda')
        this.pontos+=10;
        this.elemento.innerHTML = this.pontos;
    }
    this.atualizarPontos = () => {
        this.pontos+=1;
        this.elemento.innerHTML = this.pontos;
    }
    this.atualizarPontos(0);
    this.getPontuacao = () => {
        return this.pontos;
    }
}

function Nave(larguraJogo, tamndiv, mov){
    this.elemento = novoElemento('div', 'nave');
    this.img = novoElemento('img', 'naveImg');
    this.img.src = './assets/img/nave.gif'
    this.elemento.appendChild(this.img);
    // this.elemento.src = './assets/img/astronauta.gif'
    this.esqerda = false
    this.direta = false

    this.getX = () => parseInt(this.elemento.style.left.split('px')[0])
    this.setX = x => this.elemento.style.left = `${x}px`
    this.setX((larguraJogo/ 2) - tamndiv/2)

    window.onkeydown = e => {
        if ((e.key === 'ArrowLeft' || e.key === 'a') && this.getX() > 0) {
            this.esqerda = true
        } else if ((e.key === 'ArrowRight' || e.key === 'd') && this.getX() < (larguraJogo-tamndiv)){
            this.direta = true
        }
    }

    this.animar = () => {
        if (this.esqerda) this.setX(this.getX()- mov);
        if (this.direta && (this.getX() < (larguraJogo-tamndiv))) this.setX(this.getX()+ mov);
        this.esqerda = false
        this.direta = false
    }
}

function Combustivel(){
    this.elemento = document.getElementById('esgotamento');
    this.getY = () => parseInt(this.elemento.clientHeight);
    this.setY = y => this.elemento.style.height = `${y}px`;
    this.pegouCombustivel = false;
    this.esgotou = false;

    this.animar = () => {
        if (this.pegouCombustivel == true) {
            let novoNivel = this.getY() - 167;
            this.setY(novoNivel < 0? 0 : novoNivel);
            this.pegouCombustivel = false;
            return;
        }
        this.setY(this.getY()+ 1);
        if (this.getY() == 500) this.esgotou = true;
    }
}

function CombustivelIcone(Progresso){
    this.elemento = novoElemento('img', 'img-combustivel');
    this.elemento.src = './assets/img/fuel.png';
    this.foiPego = false
    this.qtdCombustivelPego = 0;

    this.getY = () => parseInt(this.elemento.style.top.split('px')[0]);
    this.setY = y => this.elemento.style.top = `${y}px`;
    this.setX = x => this.elemento.style.left = `${x}px`;
    this.randomX = () => {
        const x = Math.floor(Math.random() * 700) + 100;
        this.setX(x);
    }
    this.setY(-700)
    console.log(this.getY())
    this.randomX()
    this.animar = () => {
        if (this.foiPego == true) {
            this.setY(500);
            this.foiPego = false;
        }
        if (this.getY() > 800) {
            Progresso.atualizarPontos()
            this.setY(-500);
            this.randomX();
            return
        } 
        this.setY(this.getY() + 3);
    }
}

function Coin(Progresso){
    this.elemento = novoElemento('img', 'img-coin');
    this.elemento.src = './assets/img/coin.gif';
    this.foiPego = false;

    this.getY = () => parseInt(this.elemento.style.top.split('px')[0]);
    this.setY = y => this.elemento.style.top = `${y}px`;
    this.setX = x => this.elemento.style.left = `${x}px`;
    this.randomX = () => {
        const x = Math.floor(Math.random() * 700) + 100;
        this.setX(x);
    }
    this.setY(-900)
    console.log(this.getY())
    this.randomX()
    this.animar = () => {
        if (this.foiPego == true) {
            this.setY(500);
            Progresso.pegouMoeda()
            this.foiPego = false;
        }
        if (this.getY() > 900) {
            this.setY(-500);
            this.randomX();
            return
        } 
        this.setY(this.getY() + 3);
    }
}

function Obstaculo() {
    this.elemento = novoElemento('div', 'obstaculo')
}

function LinhaDeObstaculos() {
    this.elemento = novoElemento('div', 'linha-de-obstaculo')
    this.arrayObstaculos = [
        new Obstaculo(),
        new Obstaculo(),
        new Obstaculo()
    ]

    this.arrayObstaculos.forEach(obstaculo => this.elemento.appendChild(obstaculo.elemento))

    this.getY = () => parseInt(this.elemento.style.top.split('px')[0])
    this.setY =  y => this.elemento.style.top = `${y}px`
    this.getComprimento = () => this.elemento.clientHeight
    this.setY(0)
} 

function Obstaculos() {
    this.linhas = [    // 14 linhas de obstaculos
        new LinhaDeObstaculos(), 
        new LinhaDeObstaculos(),
        new LinhaDeObstaculos(),
        new LinhaDeObstaculos(),
        new LinhaDeObstaculos(),
        new LinhaDeObstaculos(),
        new LinhaDeObstaculos(),
        new LinhaDeObstaculos(),
        new LinhaDeObstaculos(),
        new LinhaDeObstaculos(), 
        new LinhaDeObstaculos(),
        new LinhaDeObstaculos(),
        new LinhaDeObstaculos(),
        new LinhaDeObstaculos()
    ]

    this.getUltimoElemParticao = (posicao) => {
        let ultimoPosicaoParticao = 7 * posicao;
        return this.linhas[ultimoPosicaoParticao-1].getY()
    }

    this.atual = -1;

    this.inferiorIniciou = false;
    this.superiorIniciou = false;

    this.limparParticao = (posicao) => {
        let fim = posicao*7
        let inico = fim - 7
        for (let linha = inico; linha < fim; linha++){
            this.linhas[linha].arrayObstaculos[0].elemento.style = 'display: block;'
            this.linhas[linha].arrayObstaculos[1].elemento.style = 'display: block;'
            this.linhas[linha].arrayObstaculos[2].elemento.style = 'display: block;'
        }
    }
    this.afastamento = () => {
        let i = 0;
        this.linhas.forEach(linha => {
            linha.setY(-i*100)
            i++;
        })
    }
    this.afastamento()

    const deslocamento = 3
    this.animar = () => {
        this.linhas.forEach(linha => {
            if (linha.getY() < 900){
                linha.setY(-50)
            }
            linha.setY(linha.getY() + deslocamento)
        })
    }
}


function RiverRaid(){
    const areaJogo = document.getElementById('window');
    const largura = areaJogo.clientWidth;
    const deslocamento = 4;
    this.perdeu = false;
    this.getPontuacao = () => {
        return progresso.getPontuacao();
    }
    this.getQtdCombPego = () => {
        return iconeComb.qtdCombustivelPego;
    }
  
    const obstaculos = new Obstaculos();
    const progresso = new Progresso();
    const imgFundo = new Background();
    const nave = new Nave(largura, 40, 30);
    const iconeComb = new CombustivelIcone(progresso);
    const combustivel = new Combustivel();
    const coin = new Coin(progresso);

    imgFundo.imagens.forEach(img => areaJogo.appendChild(img.elemento));
    obstaculos.linhas.forEach(linha => areaJogo.appendChild(linha.elemento));
    areaJogo.appendChild(nave.elemento);
    areaJogo.appendChild(progresso.elemento);
    areaJogo.appendChild(imgFundo.elemento);
    areaJogo.appendChild(iconeComb.elemento);
    areaJogo.appendChild(coin.elemento);

    this.animar = () => {
        obstaculos.linhas.forEach(linha => {
                if (linha.getY() >= 500) linha.setY(-linha.elemento.clientHeight*9);
                linha.setY(linha.getY() + deslocamento);
        })
        
    }

    this.start = () => {
        const temporizador = setInterval(() => {
            imgFundo.animar();
            nave.animar();
            this.animar();
            iconeComb.animar();
            cenario(obstaculos)
            if (colidiuObstaculos(nave, obstaculos)) {
                clearInterval(temporizador);
                clearInterval(temporizadorCombustivelCoin);
                this.perdeu = true;
            } 
        }, 15);

        const temporizadorCombustivelCoin = setInterval(() => {
            combustivel.animar()
            coin.animar();
            if (estaoSobrepostos(nave.elemento, coin.elemento)) {
                coin.foiPego = true;
            }

            if (combustivel.esgotou) {
                clearInterval(temporizador);
                clearInterval(temporizadorCombustivelCoin);
                this.perdeu = true;
            }
            pegouCombustivel(nave, iconeComb, combustivel);
        }, 50)
        
    }
}


function estaoSobrepostos(elementoA, elementoB) {  // refazer a lógica
    const a = elementoA.getBoundingClientRect()
    const b = elementoB.getBoundingClientRect()
    return !(
        a.top > b.bottom ||
        a.right < b.left ||
        a.bottom < b.top ||
        a.left > b.right
    )
}

function colidiuObstaculos(Nave, Obstaculos) {
    let colidiu = false;
    let cont = 0;
    Obstaculos.linhas.forEach(linha => {
        if (!colidiu) {
            const esq = linha.arrayObstaculos[0].elemento
            const meio = linha.arrayObstaculos[1].elemento
            const dir = linha.arrayObstaculos[2].elemento
            if (estaoSobrepostos(Nave.elemento, esq)) console.log(`colidiu esq ${cont}`)
            if (estaoSobrepostos(Nave.elemento, meio)) console.log(`colidiu meio ${cont}`)
            if (estaoSobrepostos(Nave.elemento, dir)) console.log(`colidiu dir ${cont}`)

            colidiu = estaoSobrepostos(Nave.elemento, esq) || estaoSobrepostos(Nave.elemento, meio) || estaoSobrepostos(Nave.elemento, dir)
        }
        cont++;
    })
    return colidiu;
}


function pegouCombustivel(Nave, CombustivelIcone, Combustivel) {
    let colidiu = estaoSobrepostos(Nave.elemento, CombustivelIcone.elemento);
    if (colidiu) {
        Combustivel.pegouCombustivel = true;
        CombustivelIcone.foiPego = true;
        CombustivelIcone.qtdCombustivelPego++;
    }
}

const passageLivre = (posicao, obstaculos) => {
    let fim = posicao*7
    let inico = fim - 7
    obstaculos.atual = 5;
    for (let linha = inico; linha < fim; linha++){
        obstaculos.linhas[linha].arrayObstaculos[0].elemento.style = 'grid-column: 1/2;'
        obstaculos.linhas[linha].arrayObstaculos[1].elemento.style = 'display: none;'
        obstaculos.linhas[linha].arrayObstaculos[2].elemento.style = 'grid-column: 10/11;'
    }
}

const esquerdaDireita = (posicao, obstaculos) => {
    let fim = posicao*7
    let inico = fim -7
    let cont = 0;
    obstaculos.atual = 4;
    for (let linha = inico; linha < fim; linha++){
        if (cont < 1) {
            obstaculos.linhas[linha].arrayObstaculos[0].elemento.style = 'display: none;'
        } else {
            obstaculos.linhas[linha].arrayObstaculos[0].elemento.style = `grid-column: 1/${cont+1};`
        }
        obstaculos.linhas[linha].arrayObstaculos[1].elemento.style = 'display: none;'
        obstaculos.linhas[linha].arrayObstaculos[2].elemento.style = `grid-column: ${cont+5}/11;`
        cont++;
    }
}

const direitaEsquerda = (posicao, obstaculos) => {
    let fim = posicao*7
    let inico = fim -7
    obstaculos.atual = 3;
    let cont = 0;
    for (let linha = inico; linha < fim; linha++){  
        obstaculos.linhas[linha].arrayObstaculos[0].elemento.style = `grid-column: 1/${7-cont};`
        obstaculos.linhas[linha].arrayObstaculos[2].elemento.style = `grid-column: ${11-cont}/11;`
        obstaculos.linhas[linha].arrayObstaculos[1].elemento.style = 'display: none;'
        if (cont > 5) {
            obstaculos.linhas[linha].arrayObstaculos[0].elemento.style = `display:none;`
        }
        cont++;
    }
}

const esquerdaMeioEsquerda = (posicao, obstaculos) => {
    let fim = posicao * 7
    let inico = fim - 7
    let cont = 0;
    obstaculos.atual = 3;
    for (let linha = inico; linha < fim; linha++){
        obstaculos.linhas[linha].arrayObstaculos[1].elemento.style = 'display: none;'
        if (cont > 3) {
            obstaculos.linhas[linha].arrayObstaculos[0].elemento.style = `grid-column: 1/${8-cont};`
            obstaculos.linhas[linha].arrayObstaculos[2].elemento.style = `grid-column: ${12-cont}/11;`
        } else {
            if (cont < 1) {
                obstaculos.linhas[linha].arrayObstaculos[0].elemento.style = 'display: none'
            } else {
                obstaculos.linhas[linha].arrayObstaculos[0].elemento.style = `grid-column: 1/${cont+1};`
                   
            }
            obstaculos.linhas[linha].arrayObstaculos[2].elemento.style = `grid-column: ${cont+5}/11;`
        }
        cont++;
    }
}


const direitaMeioDireita = (posicao, obstaculos) => {
    let fim = posicao * 7
    let inico = fim - 7
    let cont = 0;
    obstaculos.atual = 4;
    for (let linha = inico ; linha < fim; linha++){
        obstaculos.linhas[linha].arrayObstaculos[1].elemento.style = 'display: none;'
        if (cont > 3) {
            obstaculos.linhas[linha].arrayObstaculos[2].elemento.style = `grid-column: ${cont+4}/11;`
            obstaculos.linhas[linha].arrayObstaculos[0].elemento.style = `grid-column: 1/${cont};`
        } else {
            obstaculos.linhas[linha].arrayObstaculos[0].elemento.style = `grid-column: 1/${7-cont};`
            obstaculos.linhas[linha].arrayObstaculos[2].elemento.style = `grid-column: ${11-cont}/11;`
        }
        cont++;
    }
}
const esquerdaMeio = (posicao, obstaculos) => {
    let fim = posicao * 7
    let inico = fim - 7
    let cont = 0;
    obstaculos.atual = 5;
    for (let linha = inico; linha < fim; linha++){
        obstaculos.linhas[linha].arrayObstaculos[1].elemento.style = 'display: none;'
        if (cont > 3) {
            obstaculos.linhas[linha].arrayObstaculos[0].elemento.style = `grid-column: 1/${8-cont};`
            obstaculos.linhas[linha].arrayObstaculos[2].elemento.style = `grid-column: ${cont+4}/11;`
        } else {
            if (cont < 1) obstaculos.linhas[linha].arrayObstaculos[0].elemento.style = 'display: none'
            else obstaculos.linhas[linha].arrayObstaculos[0].elemento.style = `grid-column: 1/${cont+1};`
            obstaculos.linhas[linha].arrayObstaculos[2].elemento.style = `grid-column: ${cont+5}/11;`
        }
        cont++;
    }
}


const direitaMeio = (posicao, obstaculos) => {
    let fim = posicao * 7
    let inico = fim - 7
    let cont = 0;
    obstaculos.atual = 5;
    for (let linha = inico ; linha < fim; linha++){
        obstaculos.linhas[linha].arrayObstaculos[1].elemento.style = 'display: none;'
        if (cont > 3) {
            obstaculos.linhas[linha].arrayObstaculos[0].elemento.style = `grid-column: 1/${8-cont};`
            obstaculos.linhas[linha].arrayObstaculos[2].elemento.style = `grid-column: ${cont+4}/11;`
            if (cont > 6) {
                obstaculos.linhas[linha].arrayObstaculos[0].elemento.style = `grid-column: 1/2;`;
                obstaculos.linhas[linha].arrayObstaculos[2].elemento.style = `grid-column: 10/11;`;
            }
        } 
        else {
            obstaculos.linhas[linha].arrayObstaculos[0].elemento.style = `grid-column: 1/${7-cont};`
            obstaculos.linhas[linha].arrayObstaculos[2].elemento.style = `grid-column: ${11-cont}/11;`
        }
        cont++;
    }
}


const meioDireita = (posicao, obstaculos) => {
    let fim = posicao * 7
    let inico = fim - 7
    let cont = 0;
    obstaculos.atual = 4;
    for (let linha = inico ; linha < fim; linha++){
        obstaculos.linhas[linha].arrayObstaculos[1].elemento.style = 'display: none;'
        obstaculos.linhas[linha].arrayObstaculos[0].elemento.style = `grid-column: 1/2;`
        obstaculos.linhas[linha].arrayObstaculos[2].elemento.style = `grid-column: 10/11;`
        if (cont > 1) obstaculos.linhas[linha].arrayObstaculos[0].elemento.style = `grid-column: 1/${cont+1};`;
        if (cont == 6) obstaculos.linhas[linha].arrayObstaculos[2].elemento.style = 'display: none;';
        cont++;
    }   
}

const meioEsquerda = (posicao, obstaculos) => {
    let fim = posicao * 7
    let inico = fim - 7
    let cont = 0;
    obstaculos.atual = 3;
    for (let linha = inico ; linha < fim; linha++){
        obstaculos.linhas[linha].arrayObstaculos[1].elemento.style = 'display: none;'
        obstaculos.linhas[linha].arrayObstaculos[0].elemento.style = `grid-column: 1/2;`
        obstaculos.linhas[linha].arrayObstaculos[2].elemento.style = `grid-column: 10/11;`
        if (cont > 1) obstaculos.linhas[linha].arrayObstaculos[2].elemento.style = `grid-column: ${11-cont}/11;`;
        if (cont == 6) obstaculos.linhas[linha].arrayObstaculos[0].elemento.style = `display: none;`;
        cont++;
    }   
}

const meioZigZagMeio = (posicao, obstaculos) => {
    let fim = posicao * 7
    let inico = fim - 7
    let cont = 0;
    obstaculos.atual = 5;
    for (let linha = inico ; linha < fim; linha++){
        obstaculos.linhas[linha].arrayObstaculos[1].elemento.style = 'display: none;';
        if (cont < 4) {
            obstaculos.linhas[linha].arrayObstaculos[0].elemento.style = `grid-column: 1/${cont+3};`;
            obstaculos.linhas[linha].arrayObstaculos[2].elemento.style = `grid-column: ${cont+6}/11;` ; 
            if (cont == 0) obstaculos.linhas[linha].arrayObstaculos[2].elemento.style = `grid-column: 7/11;`;
        } else {
            obstaculos.linhas[linha].arrayObstaculos[0].elemento.style = `grid-column: 1/${10-cont};`;
            obstaculos.linhas[linha].arrayObstaculos[2].elemento.style = `grid-column: ${13-cont}/11;`;
            if (cont == 6) obstaculos.linhas[linha].arrayObstaculos[2].elemento.style = `grid-column: 8/11;`;    
        }

        cont++;
    }   
}


const bifurcacao = (posicao, obstaculos) => {
    let fim = posicao * 7
    let inico = fim - 7
    let cont = 0;
    obstaculos.atual = 5;
    for (let linha = inico ; linha < fim; linha++){
            obstaculos.linhas[linha].arrayObstaculos[1].elemento.style = `display: none`;
            obstaculos.linhas[linha].arrayObstaculos[0].elemento.style = `grid-column: 1/${3-cont};`
            obstaculos.linhas[linha].arrayObstaculos[2].elemento.style = `grid-column: ${cont+9}/11`;
            if (cont > 0 && cont < 4) obstaculos.linhas[linha].arrayObstaculos[1].elemento.style = `grid-column: ${6-cont}/${cont+6}`;
            if (cont > 3) obstaculos.linhas[linha].arrayObstaculos[1].elemento.style = `grid-column: ${cont}/${12-cont}`;
            if (cont == 6) obstaculos.linhas[linha].arrayObstaculos[1].elemento.style = `display:none;`; 
            if (cont > 1 && cont < 5) {
                obstaculos.linhas[linha].arrayObstaculos[0].elemento.style = `display: none`;
                obstaculos.linhas[linha].arrayObstaculos[2].elemento.style = `display: none`;
            } else if (cont > 4) {
                obstaculos.linhas[linha].arrayObstaculos[0].elemento.style = `grid-column: 1/${cont-3};`
                obstaculos.linhas[linha].arrayObstaculos[2].elemento.style = `grid-column: ${15-cont}/11`;
            }
        cont++;
    } 
}


const choice = (arr) => {
    const randomIndex = Math.floor(Math.random() * arr.length);
    const randomElement = arr[randomIndex];
    return randomElement;
}

const escolheFuncao = (Obstaculos) => { // se o elemento atual termina em tal posição, retorna um array correspondente
    if (Obstaculos.atual == 3) return funcoes[0]; 
    if (Obstaculos.atual == 4) return funcoes[1];
    if (Obstaculos.atual == 5) return funcoes[2];
}

const cenario = (Obstaculos) => {
   if (Obstaculos.inferiorIniciou == false || Obstaculos.getUltimoElemParticao(1) >= 500) {
    if (Obstaculos.atual == -1) {
        funcoes[2][2](1, Obstaculos);
    } else choice(escolheFuncao(Obstaculos))(1, Obstaculos);
    Obstaculos.inferiorIniciou = true;
   }
   if (Obstaculos.superiorIniciou == false || Obstaculos.getUltimoElemParticao(2) >= 500){
    choice(escolheFuncao(Obstaculos))(2, Obstaculos);
    Obstaculos.superiorIniciou = true;
   }
}

const funcoes = [
    [ // começa esquerda -- 0
        esquerdaDireita,
        esquerdaMeio,
        esquerdaMeioEsquerda
    ],
    [// começa direita -- 1
        direitaEsquerda,
        direitaMeio,
        direitaMeioDireita
    ],
    [ // começa meio -- 2
        meioDireita,
        meioEsquerda,
        passageLivre,
        bifurcacao,
        meioZigZagMeio,
    ],
    [ // termina esquerda -- 3
        direitaEsquerda,
        esquerdaMeioEsquerda,
        meioEsquerda
    ], 
    [ // termina direita -- 4
        esquerdaDireita,
        direitaMeioDireita,
        meioDireita
    ],
    [ // termina meio -- 5
        esquerdaMeio,
        direitaMeio,
        bifurcacao,
        meioZigZagMeio
    ]
]
new Menu();