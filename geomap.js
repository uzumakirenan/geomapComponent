const config = {
    container: {
        id: "canvasContainer",
        width: 700
    },

    mapOptions:{
        border: {
            color: "#ccc",
            display: true,
        },
        labels:{
            fontsize: 16,
            bold: true,
            italic: false,
            align: "left",
            color: "#000",
            display: true
        },
        actions: {
            active: true,

            tooltip:{
                active: true,
            },

            click:{
                active: true,
            }
        }
    },
    
    dataset: {
        information:[
            {
                name: "Rio Grande do Sul",
                data: ["dados", "vindo", "do", "JSON"]
            }
        ],
        custom: {
            active: false,
            data: [
                /*
                {
                    name: "Curitiba",
                    color: "gray",
                    information: []
                },

                {
                    name: "Piraquara",
                    color: "blue",
                    information: []
                },

                {
                    name: "Quatro Barras",
                    color: "green",
                    information: []
                },

                {
                    name: "Colombo",
                    color: "red",
                    information: []
                },
                */
            ]
        }
    }
}
const canvasContainer = document.getElementById(config.container.id)
canvasContainer.style.position = "relative"

const canvas = document.createElement("canvas")
canvas.width = config.container.width
canvas.height = config.container.width
canvas.setAttribute("style", "transform: rotate(-90deg); border: 1px solid green; position: absolute; z-index: 0;")
const ctx = canvas.getContext('2d')

const canvasAction = document.createElement("canvas")
canvasAction.width = config.container.width
canvasAction.height = config.container.width
canvasAction.setAttribute("style", "transform: rotate(-90deg); border: 1px solid red; position: absolute; z-index: 1;")
const ctxAction = canvasAction.getContext('2d')

canvasContainer.appendChild(canvas)
canvasContainer.appendChild(canvasAction)

//BRAZIL = brasilMap
//USA = usaMap
//PARANA = paranaMap
const mapName = brazilMap //<- COLOCAR O NOME DO MAPA AQUI


const mapScales = mapName.scales
const mapFeature = mapName.features

const scale = (canvas.width / 100) * mapScales.scale //12.5 //12 //10
const x = (canvas.width / 100) * mapScales.x //100 //500
const y = (canvas.width / 100) * mapScales.y //1550 //900
const dataset = config.dataset.custom.active === false ? [] : config.dataset.custom.data

var stateFills = []
var selectedFill;
var controllHover = 0;
var colorArray = []
var legends = []

function verificaCor(){
    let cor = '#' + Math.floor(Math.random() * 0x1000000).toString(16).padStart(6, '0');
    if(colorArray.length == 0){
        colorArray.push(cor)
        return cor
    } else if(colorArray.includes(cor)){
        verificaCor()
    } else {
        colorArray.push(cor)
        return cor
    }
}

//preenchimento
function gerarPreenchimento(){
    mapFeature.map((estado) => {

        let color = verificaCor();

        ctx.beginPath()
        ctx.fillStyle = color
        let first;
        let total;
        
        const stateFill = new Path2D()
        if(estado.geometry.type == "Polygon"){
            
            total = estado.geometry.coordinates[0].length
            
            if(dataset.length != 0){
                dataset.map(ds => {
                    ctx.fillStyle = ds.color
                    if(estado.properties.name == ds.name){
                        estado.geometry.coordinates[0].map((state, index) => {
                            if(index == 0){
                                stateFill.lineTo((state[1] * scale) + x, (state[0] * scale) + y)
                                first = [(state[1] * scale) + x, (state[0] * scale) + y]
                            } else if(index > 0 && index < total){
                                stateFill.lineTo((state[1] * scale) + x, (state[0] * scale) + y)
                                stateFill.moveTo((state[1] * scale) + x, (state[0] * scale) + y)
                            }
                            
                            stateFill.lineTo(first[0], first[1])
                            ctx.moveTo(0,0)
                            if(index+1 == total){
                                ctx.fill(stateFill)
                                stateFills.push({stateFill: stateFill, name: estado.properties.name, Color: ds.color})
                            }
                        })
                    }
                    
                })
            } else {            
                estado.geometry.coordinates[0].map((state, index) => {
                    if(index == 0){
                        stateFill.lineTo((state[1] * scale) + x, (state[0] * scale) + y)
                        first = [(state[1] * scale) + x, (state[0] * scale) + y]
                    } else if(index > 0 && index < total){
                        stateFill.lineTo((state[1] * scale) + x, (state[0] * scale) + y)
                        stateFill.moveTo((state[1] * scale) + x, (state[0] * scale) + y)
                    }
                    
                    stateFill.lineTo(first[0], first[1])
                    ctx.moveTo(0,0)
                    if(index+1 == total){
                        ctx.fill(stateFill)
                        stateFills.push({stateFill: stateFill, name: estado.properties.name, Color: color})
                    }
                })
            }

        } else if(estado.geometry.type == "MultiPolygon"){
            total = estado.geometry.coordinates[0][0].length

            if(dataset.length != 0){
                dataset.map(ds => {
                    ctx.fillStyle = ds.color
                    if(estado.properties.name == ds.name){
                        estado.geometry.coordinates[0][0].map((state, index) => {
                            if(index == 0){
                                stateFill.lineTo((state[1] * scale) + x, (state[0] * scale) + y)
                                first = [(state[1] * scale) + x, (state[0] * scale) + y]
                            } else if(index > 0 && index < total){
                                stateFill.lineTo((state[1] * scale) + x, (state[0] * scale) + y)
                                stateFill.moveTo((state[1] * scale) + x, (state[0] * scale) + y)
                            }
                            
                            stateFill.lineTo(first[0], first[1])
                            ctx.moveTo(0,0)
                            if(index+1 == total){
                                ctx.fill(stateFill)
                                stateFills.push({stateFill: stateFill, name: estado.properties.name, Color: color})
                            }
                        })
                    }
                })
            } else {
                estado.geometry.coordinates[0][0].map((state, index) => {
                    if(index == 0){
                        stateFill.lineTo((state[1] * scale) + x, (state[0] * scale) + y)
                        first = [(state[1] * scale) + x, (state[0] * scale) + y]
                    } else if(index > 0 && index < total){
                        stateFill.lineTo((state[1] * scale) + x, (state[0] * scale) + y)
                        stateFill.moveTo((state[1] * scale) + x, (state[0] * scale) + y)
                    }
                    
                    stateFill.lineTo(first[0], first[1])
                    ctx.moveTo(0,0)
                    if(index+1 == total){
                        ctx.fill(stateFill)
                        stateFills.push({stateFill: stateFill, name: estado.properties.name, Color: color})
                    }
                })
            }
        }
        
        ctx.closePath()
    })
}


//Contorno
function gerarContorno(){

    mapFeature.map((estado) => {
        ctx.beginPath()
        ctx.strokeStyle = config.mapOptions.border.color || "#ccc"
        let total;
        const stateHover = new Path2D()
        if(estado.geometry.type == "Polygon"){
            total = estado.geometry.coordinates[0].length
            estado.geometry.coordinates[0].map((state, index) => {
                
                if(index == 0){
                    stateHover.lineTo((state[1] * scale) + x, (state[0] * scale) + y)
                } else if(index > 0 && index < total) {
                    stateHover.lineTo((state[1] * scale) + x, (state[0] * scale) + y)
                    ctx.moveTo(0,0)
                }
                
            })
        } else if(estado.geometry.type == "MultiPolygon"){
            total = estado.geometry.coordinates[0][0].length
            estado.geometry.coordinates[0][0].map((state, index) => {
                if(index == 0){
                    stateHover.lineTo((state[1] * scale) + x, (state[0] * scale) + y)
                } else if(index > 0 && index < total) {
                    stateHover.lineTo((state[1] * scale) + x, (state[0] * scale) + y)
                    ctx.moveTo(0,0)
                }
            })
        }
        
        ctx.stroke(stateHover)
        ctx.moveTo(0,0)
        ctx.closePath()
    })

}

//Labels
function gerarLabels(){
    mapFeature.map((estado) => {        
        let posX = []
        let posY = []
        let xMax
        let xMin
        let yMax
        let yMin
        
        if(estado.geometry.type == "Polygon"){            
            estado.geometry.coordinates[0].map((state) => {
                posX.push(state[1])
                posY.push(state[0])                
            })
            xMax = Math.max.apply(null,posX)
            xMin = Math.min.apply(null,posX)
            yMax = Math.max.apply(null,posY)
            yMin = Math.min.apply(null,posY)

        } else if(estado.geometry.type == "MultiPolygon"){
            estado.geometry.coordinates[0][0].map((state, index) => {
                posX.push(state[1])
                posY.push(state[0])
            })
            xMax = Math.max.apply(null,posX)
            xMin = Math.min.apply(null,posX)
            yMax = Math.max.apply(null,posY)
            yMin = Math.min.apply(null,posY)
        }

        let bold = (config.mapOptions.labels.bold == true ? "bold " : "") || ""
        let fontSize = config.mapOptions.labels.fontsize || 16
        ctx.beginPath()
        ctx.save()
        ctx.fillStyle = config.mapOptions.labels.color || "#000"
        ctx.textAlign = config.mapOptions.labels.align || "left"
        ctx.font = bold + fontSize + "px Calibri"
        if(estado.properties.name == "Goiás"){
            ctx.translate((setCenterPosition(xMax, xMin) * scale) + x - 15, (setCenterPosition(yMax, yMin) * scale) + y)
        } else {
            ctx.translate((setCenterPosition(xMax, xMin) * scale) + x, (setCenterPosition(yMax, yMin) * scale) + y)
        }
        
        ctx.rotate(Math.PI/2);
        ctx.fillText(estado.properties.name, 0, 0)
        ctx.restore()
        ctx.closePath()
    })
}

//Posiciona elementos no centro de um pais/estado/cidade
function setCenterPosition(max, min){

    //Gera a diferença
    const difMax = max < 0 ? max * -1 : max
    const difMin = min < 0 ? min * -1 : min
    let result;

    if(difMax > difMin){
        if(max < 0){
            result = parseFloat("-" + (difMax + difMin) / 2)
        } else {
            result = (difMax + difMin) / 2
        }
    }

    if(difMin > difMax){
        if(min < 0){
            result = parseFloat("-" + (difMax + difMin) / 2)
        } else {
            result = (difMax + difMin) / 2
        }
    }

    return result
}

function gerarAcao(){
    
    canvasAction.addEventListener('mousemove', showTooltip)

    if(config.mapOptions.actions.click.active){
        canvasAction.addEventListener('click', clickedState)
    }
        
    function showTooltip (event) {
        ctxAction.clearRect(0,0, canvasAction.width,canvasAction.height)
        selecteState = "";
        stateFills.map((obj) => {
            if (ctxAction.isPointInPath(obj.stateFill, event.offsetX, event.offsetY)) {
                ctxAction.fillStyle = "rgba(0,0,0,0.5)" //obj.Color + "5a"
                ctxAction.fill(obj.stateFill)
                selecteState = obj.name
            } 
            
        })
        
        if(config.mapOptions.actions.tooltip.active){
            gerarTooltip(selecteState)
        }
        
    }

    function clickedState (event) {

        stateFills.map((obj) => {
            if (ctxAction.isPointInPath(obj.stateFill, event.offsetX, event.offsetY)) {                
                alert(`${obj.name}\n${obj.Color}`)

            } 
        })
        
    }
}

//Gerar Tooltip
function gerarTooltip(state){
    let dados = [];
    const font = 16

    mapFeature.map((estado) => {        
        if(state == estado.properties.name){
            if(config.dataset.custom.active == false){
                config.dataset.information.find((ds) => { 
                    if(ds.name == state){
                        dados = ds.data
                    } else {
                        dados = null
                        dados = [state]
                    }
                }) 
            } else {
                config.dataset.custom.data.find((ds) => { 
                    if(ds.name == state){
                        dados = ds.information
                    } else {
                        dados = null
                        dados = [state]
                    }
                }) 
            }

            if(dados[0] != state){
                dados.unshift(state)
            }

            let toolWidth = maiorStringArray(dados) * (font / 2)
            if(toolWidth < 100){
                toolWidth = 100
            }
            const qtd = dados.length
            let posX = []
            let posY = []
            let xMax
            let xMin
            let yMax
            let yMin
            
            if(estado.geometry.type == "Polygon"){            
                estado.geometry.coordinates[0].map((state) => {
                    posX.push(state[1])
                    posY.push(state[0])                
                })
                xMax = Math.max.apply(null,posX)
                xMin = Math.min.apply(null,posX)
                yMax = Math.max.apply(null,posY)
                yMin = Math.min.apply(null,posY)

            } else if(estado.geometry.type == "MultiPolygon"){
                estado.geometry.coordinates[0][0].map((state, index) => {
                    posX.push(state[1])
                    posY.push(state[0])
                })
                xMax = Math.max.apply(null,posX)
                xMin = Math.min.apply(null,posX)
                yMax = Math.max.apply(null,posY)
                yMin = Math.min.apply(null,posY)
            }

            //Tooltip container
            ctxAction.beginPath()
            ctxAction.save()
            if(estado.properties.name == "Goiás"){
                ctxAction.translate((setCenterPosition(xMax, xMin) * scale) + x - 15, (setCenterPosition(yMax, yMin) * scale) + y)
            } else {
                ctxAction.translate((setCenterPosition(xMax, xMin) * scale) + x, (setCenterPosition(yMax, yMin) * scale) + y)
            }
            
            ctxAction.rotate(Math.PI/2);
            ctxAction.fillStyle = "rgba(0,0,0,0.9)"
            ctxAction.translate(0, -(((font) * qtd) / 2))

            if(dados.length <= 1){
                ctxAction.moveTo(10,-10)
                ctxAction.arcTo(toolWidth,-10,toolWidth,10,10)
                ctxAction.arcTo(toolWidth,((font) * qtd) + 10,80,((font) * qtd) + 10,10)
                ctxAction.arcTo(0,((font) * qtd) + 10,0,((font) * qtd) - 10,10)
                ctxAction.arcTo(0,-10,10,-10,10)
                ctxAction.fill()
            } else {
                ctxAction.moveTo(10,-10)
                ctxAction.arcTo(toolWidth,-10,toolWidth,10,10)
                ctxAction.arcTo(toolWidth,((font) * qtd) + 10,80,((font) * qtd) + 10,10)
                ctxAction.arcTo(0,((font) * qtd) + 10,0,((font) * qtd) - 10,10)
                ctxAction.lineTo(0,(((font) * qtd) / 2) + 10)
                ctxAction.lineTo(-10,(((font) * qtd) / 2))
                ctxAction.lineTo(0,(((font) * qtd) / 2) - 10)
                ctxAction.arcTo(0,-10,10,-10,10)
                ctxAction.fill()
            }

            ctxAction.restore()
            ctxAction.closePath()
            

            //Informacoes do tooltip
            ctxAction.beginPath()
            ctxAction.save()
            ctxAction.fillStyle = "#fff"
            ctxAction.font = font + "px Calibri";
            ctxAction.textBaseline = "top"
            if(estado.properties.name == "Goiás"){
                ctxAction.translate((setCenterPosition(xMax, xMin) * scale) + x - 15, (setCenterPosition(yMax, yMin) * scale) + y)
            } else {
                ctxAction.translate((setCenterPosition(xMax, xMin) * scale) + x, (setCenterPosition(yMax, yMin) * scale) + y)
            }
            ctxAction.rotate(Math.PI/2);
            dados.map((d, index) => {
                let position = ((font) * index) - ((font) * qtd) / 2
                ctxAction.fillText(d, 5, position)
                
            })
            ctxAction.restore()
            ctxAction.closePath()
        }
    })
}

function gerarTitulos(){

}



function maiorStringArray(stringArray){
    let qtdCaractere = 0;
    stringArray.map(text => {
        if(qtdCaractere == 0){
            qtdCaractere = text.length;
        } else if(text.length > qtdCaractere){
            qtdCaractere = text.length;
        }
        
    })
    return qtdCaractere;
}

function gerarLegendas(rectColor, textColor){
    const rect = new Path2D()
    const text = new Path2D()

    rectColor = "red"
    textColor = "blue"

    const index = legends.length + 1
    const font = 16
    const size = 12
    let rectMargem
    let textMargem

    if(index == 1){
        rectMargem = 0
        textMargem = 0
    } else {
        rectMargem = 7
        textMargem = 5
    }

    ctx.beginPath()
    ctx.fillStyle = rectColor
    ctx.save()
    ctx.translate(canvas.width,-(canvas.height - 40))
    ctx.rotate(Math.PI/2)
    ctx.fillRect((canvas.width - size) - font, (10 * index) + rectMargem, size, size)
        
    ctx.fillStyle = textColor
    ctx.font = font + "px calibri"
    
    ctx.fillText("Teste", (canvas.width - size) - (font) + size + 3, (10 + (size * index)) + textMargem)
    ctx.restore()
    ctx.closePath()

    /*
    ctx.beginPath()
    ctx.fillStyle = rectColor
    ctx.save()
    ctx.translate(canvas.width,-(canvas.height - 40))
    ctx.rotate(Math.PI/2)
    ctx.fillRect((canvas.width - size) - (font * index), (10 * 2) + 7, size, size)
        
    ctx.fillStyle = textColor
    ctx.font = font + "px calibri"
    
    ctx.fillText("Teste", (canvas.width - size) - (font) + size + 3, (10 + (size * 2)) + 5)
    ctx.restore()
    ctx.closePath()
    */

    legends.push({rect, text})
    console.log(index)
}

function draw(){
    const legenda = true

    if(legenda){
        ctx.clearRect(0,0,canvas.width, canvas.height)
        ctx.save()
        ctx.scale(1/1.2,1/1.2)
        ctx.translate(100, 130)
            gerarPreenchimento()

            if(config.mapOptions.border.display){
                gerarContorno()
            }

            if(config.mapOptions.labels.display){
                gerarLabels()
            }
        ctx.restore()
        gerarLegendas()
        gerarLegendas()
        gerarLegendas()
        gerarLegendas()
        gerarLegendas()
        gerarLegendas()

        ctxAction.scale(1/1.2,1/1.2)
        ctxAction.translate(100, 130)
            if(config.mapOptions.actions.active){
                gerarAcao()
            }
    } else {
        gerarPreenchimento()

        if(config.mapOptions.border.display){
            gerarContorno()
        }

        if(config.mapOptions.labels.display){
            gerarLabels()
        }

        if(config.mapOptions.actions.active){
            gerarAcao()
        }
    }
}

draw()
