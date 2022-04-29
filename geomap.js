var tooltipPosX;
var tooltipPosY;

const canvas = document.getElementById("myTeste")
canvas.width = 800
canvas.height = 800
//canvas.setAttribute("width", "800")
//canvas.setAttribute("height", "800")
const ctx = canvas.getContext('2d')

var stateFills = []
var selectedFill;
var controllHover = 0;

//const mapTeste = ChartGeo.topojson.feature(paranaMap, paranaMap.objects.units).features

const mapTeste = paranaMap.features

const scale = 100 //12 //10
const x = 2900 //100 //500
const y = 5530 //1550 //900
const dataset = [/*
    {city: "Curitiba", Color: "gray"},
    {city: "Piraquara", Color: "blue"},
    {city: "Quatro Barras", Color: "green"},
    {city: "Colombo", Color: "red"},
*/]
var colorArray = []

function verificaCor(){
    let cor = '#' + Math.floor(Math.random() * 0x1000000).toString(16).padStart(6, '0');
    if(colorArray.length == 0){
        colorArray.push(cor)
    } else if(colorArray.includes(cor)){
        verificaCor()
    } else {
        colorArray.push(cor)
        return cor
    }
}

//preenchimento
function gerarPreenchimento(){
    mapTeste.map((estado) => {

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
                    ctx.fillStyle = ds.Color
                    if(estado.properties.name == ds.city){
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
                                stateFills.push({stateFill: stateFill, name: estado.properties.name, Color: ds.Color})
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

            dataset.map(ds => {
                if(estado.properties.name == ds){
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
                        
                    })
                }
            })
        }
        ctx.closePath()
    })
    canvas.addEventListener('mousemove', showTooltip)
    canvas.addEventListener('click', clickedState)
        
    function showTooltip (event) {
        ctx.clearRect(0,0, 800,800)
        var selecteState = "";
        stateFills.map((obj) => {
            if (ctx.isPointInPath(obj.stateFill, event.offsetX, event.offsetY)) {
                ctx.fillStyle = obj.Color + "5a"
                
                //console.log(obj.name + " - " + obj.Color)
                //alert(`cidade: ${cidade.city}\nSales: ${cidade.Sales}\nCost:${cidade.Cost}\nQty: ${cidade.Qty}`)                
                ctx.fill(obj.stateFill)
                selecteState = obj.name
            } else {
                ctx.fillStyle = obj.Color
                ctx.fill(obj.stateFill)
            }
            
        })
        gerarTooltip(selecteState)
    }

    function clickedState (event) {

        stateFills.map((obj) => {

            if (ctx.isPointInPath(obj.stateFill, event.offsetX, event.offsetY)) {                
                alert(`${obj.name}\n${obj.Color}`)

            } 
        })
        
    }
}

gerarPreenchimento()
//gerarLabels()

//Contorno
function gerarContorno(){

    mapTeste.map((estado) => {
        ctx.beginPath()
        ctx.strokeStyle = "#ccc"
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

//Gerar Tooltip
function gerarTooltip(state){
    const dados = []
    const font = 16

    mapTeste.map((estado) => {        
        if(state == estado.properties.name){
            dados.push(state, "teste", "teste02", "Teste03", "Teste04", "teste06")
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

            
            ctx.beginPath()
            ctx.save()
            ctx.fillStyle = "rgba(0,0,0,0.7)"
            //ctx.textAlign = "left"
            if(estado.properties.name == "Goiás"){
                ctx.translate((gerarDiferenca(xMax, xMin) * scale) + x - 15, (gerarDiferenca(yMax, yMin) * scale) + y)
            } else {
                ctx.translate((gerarDiferenca(xMax, xMin) * scale) + x, (gerarDiferenca(yMax, yMin) * scale) + y)
            }
            
            ctx.rotate(Math.PI/2);
            //ctx.fillText(estado.properties.name, 0, 0)
            ctx.fillRect(0,0,100,((font) * qtd))
            ctx.restore()
            ctx.closePath()

            ctx.beginPath()
            ctx.save()
            ctx.fillStyle = "#fff"
            ctx.font = font + "px Calibri";
            ctx.textBaseline = "top"
            if(estado.properties.name == "Goiás"){
                ctx.translate((gerarDiferenca(xMax, xMin) * scale) + x - 15, (gerarDiferenca(yMax, yMin) * scale) + y)
            } else {
                ctx.translate((gerarDiferenca(xMax, xMin) * scale) + x, (gerarDiferenca(yMax, yMin) * scale) + y)
            }
            ctx.rotate(Math.PI/2);
            dados.map((d, index) => {
                //ctx.clearRect(0,0,800,800)
                let position = (font) * index
                
                
                ctx.fillText(d, 5, position)
                
            })
            ctx.restore()
            ctx.closePath()

            

        }
    })
}

//Gerar Nomes
function gerarLabels(){
    mapTeste.map((estado) => {        
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

        
        ctx.beginPath()
        ctx.save()
        ctx.fillStyle = "#000"
        ctx.textAlign = "left"
        if(estado.properties.name == "Goiás"){
            ctx.translate((gerarDiferenca(xMax, xMin) * scale) + x - 15, (gerarDiferenca(yMax, yMin) * scale) + y)
        } else {
            ctx.translate((gerarDiferenca(xMax, xMin) * scale) + x, (gerarDiferenca(yMax, yMin) * scale) + y)
        }
        
        ctx.rotate(Math.PI/2);
        ctx.fillText(estado.properties.name, 0, 0)
        ctx.restore()
        ctx.closePath()
    })
}

function gerarDiferenca(max, min){

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

function texto(y){
    ctx.beginPath()
    ctx.translate(0,0)
    ctx.moveTo(0,0)
    ctx.fillStyle = "#000"
    ctx.font = "50px Calibri"
    ctx.fillText("Renan Cano", 250, y)
    ctx.closePath()
}

texto(250)
ctx.beginPath()
ctx.fillStyle = "red"
ctx.fillText("Renan Cano", 10, 10)
ctx.closePath()