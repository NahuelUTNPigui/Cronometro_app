class ACCION{
    static ADD=new ACCION('guardar')
    static MOD=new ACCION('modificar')
    static LEER=new ACCION('leer')
    static DEL=new ACCION('eliminar')
}

class Main_data{
    constructor() {
        this.tiempo_actual=Date.now()
        this.accion=ACCION.ADD
        //Es un diccionario donde cada key es un string y el valor es un
        this.cronometros={}
        this.ultimo_tiempo=Date.now()
        this.proyectos={}
        this.txd_p={}
        this.total=0
    }
    now(){
        
        this.tiempo_actual=Date.now()
    }
    getProyectos(ps){
        this.proyectos={}
        ps.forEach(p=>{
            this.proyectos[`${p.id}`]=p
        })
    }
    getTXD(ts){
        this.txd_p={}
        ts.forEach(t=>{
            this.txd_p[`${t.id}`]=t
        })
    }
    
}
class Cronometro{
    constructor(id){
        this.id=id
        this.secs=0
        this.milisecs=0
        this.started=false
        this.stopped=false
    }
    restart(){
        this.milisecs=0
        this.secs=0
        this.started=false
        this.stopped=false
    }
    stop(){
        this.stopped=true
    }
    goon(){
        this.stopped=false
    }
    toString(){
        return secsToStrings(Math.trunc(this.milisecs/1000))
        /*
        let horas=Math.trunc(this.secs/3600)
        let minutos=Math.trunc(this.secs/60)
        

        let segundos=this.secs%60
        return ""+agregarCero(horas)+":"+agregarCero(minutos)+":"+agregarCero(segundos)
        */
    }
    init(){
        this.started=true
        this.stopped=false
    }
    addSecs(milisecs){
        
        this.milisecs+=milisecs
        this.secs=Math.trunc(this.milisecs/1000)
    }
}


//DOM 
//Main
//importar exportar
let btnImportar=document.getElementById('btnImportar')
let btnExportar=document.getElementById('btnExportar')
//Proyecto
let dvAllprojects =document.getElementById('dvAllprojects')
let txtId = document.getElementById('txtId')
let txtNombre = document.getElementById('txtNombre')
let btnProyecto = document.getElementById('btnProyecto')
let spnProyecto = document.getElementById('spnProyecto')
let btnNuevoProyecto = document.getElementById('btnNuevoProyecto')
//Form Proyecto
//Tabla

//Detalle
let projectDetail = document.getElementById('projectDetail')


let btnVolver=document.getElementById('btnVolver')

let dtpDetalle =document.getElementById("dtpDetalle")
let minutosDetalle =document.getElementById("minutosDetalle")
let btnAgregarDetalle = document.getElementById("btnAgregarDetalle")
let btnQuitarDetalle = document.getElementById("btnQuitarDetalle")

let btnBuscar=document.getElementById("btnBuscar")
let spnTotal =document.getElementById("spnTotal")
let dtpDetalleDesde = document.getElementById("dtpDetalleDesde")
let dtpDetalleHasta = document.getElementById("dtpDetalleHasta")
//Tareas
let tareas=document.getElementById("tareas")
let txtIdTarea=document.getElementById("txtIdTarea")
let txtNombreTarea=document.getElementById("txtNombreTarea")


let nuevaTarea=document.getElementById("btnnuevaTarea")
let btnagregarTarea=document.getElementById("btnagregarTarea")
let btnquitarTarea=document.getElementById("btnquitarTarea")
let btnbtnVolverTareas=document.getElementById("btnVolverTareas")

//Tablas
let tblProjects=document.getElementById('tblProjects')
let tblDetalle = document.getElementById("tblDetalle")
let cboTareas=document.getElementById("cboTareas")
//Metodos
function exportar(){
    window.SimpleAPI.exportar()
}
function importar(){
    window.SimpleAPI.importar()
}
function secsToStrings(secs){
    let horas=Math.trunc(secs/3600)
    let minutos=Math.trunc(secs/60)%60
    

    let segundos=secs%60
    return ""+agregarCero(horas)+":"+agregarCero(minutos)+":"+agregarCero(segundos)
}

function agregarCero(numero){
    return (numero<10)?"0"+numero:""+numero
}
function hoy(){
    let d=new Date(Date.now())
    return ""+d.getFullYear()+"-"+agregarCero(d.getMonth()+1)+"-"+agregarCero(d.getDate())
}
function iniciarCronometro(btn){
    let p_id=btn.id.split("_")[0]
    MAIN_DATA.cronometros[p_id].init()
    
}
function pausarCronometro(btn){
    let p_id=btn.id.split("_")[0]
    MAIN_DATA.cronometros[p_id].stop()
    
}
function reiniciarCronometro(btn){
    let p_id=btn.id.split("_")[0]
    MAIN_DATA.cronometros[p_id].restart()
    
}
function guardarCronometro(btn){
    let p_id=btn.id.split("_")[0]
    let c=MAIN_DATA.cronometros[p_id]
    
    let txd={
      fecha:hoy(),
      tiempo_total:parseInt(c.secs),
      cod_proyecto:parseInt(p_id)

    }
    
    agregarTxd(txd).then(t=>{
        
        
        
        let td_tiempo=document.getElementById(txd.cod_proyecto+"_tdTiempo")
        td_tiempo.innerHTML=secsToStrings(t.tiempo_total)
        c.restart()
    })
    
}
function agregarMinutos(btn){
    let p_id=btn.id.split("_")[0]
    if(document.getElementById(p_id+"_txtInput").value){
        let txd={
            fecha:hoy(),
            tiempo_total:parseInt(document.getElementById(p_id+"_txtInput").value)*60,
            cod_proyecto:parseInt(p_id)
        }
        agregarTxd(txd).then(t=>{
            let td_tiempo=document.getElementById(txd.cod_proyecto+"_tdTiempo")
            td_tiempo.innerHTML=secsToStrings(t.tiempo_total)
            document.getElementById(p_id+"_txtInput").value=''
            
        })
    }

}
function quitarMinutos(btn){
    let p_id=btn.id.split("_")[0]
    if(document.getElementById(p_id+"_txtInput").value){
        let txd={
            fecha:hoy(),
            tiempo_total:parseInt(document.getElementById(p_id+"_txtInput").value)*(-60),
            cod_proyecto:parseInt(p_id)
        }
        agregarTxd(txd).then(t=>{
            let td_tiempo=document.getElementById(txd.cod_proyecto+"_tdTiempo")
            td_tiempo.innerHTML=secsToStrings(t.tiempo_total)
            document.getElementById(p_id+"_txtInput").value=''
        })
    
        
    }
}
function agregarMinutosDetalle(btn){
    let t_id=btn.id.split("_")[0]
    let txtInput=document.getElementById(`${t_id}_txtInput_detalle`)
    let td_tiempo=document.getElementById(`${t_id}_tdTiempo_detalles`)
    if(txtInput.value){
        let trabajo=MAIN_DATA.txd_p[t_id]
        let tiempo_total =parseInt(txtInput.value)*60
        MAIN_DATA.total+=tiempo_total 
        let txd={
            fecha:trabajo.fecha,
            tiempo_total:tiempo_total,
            cod_proyecto:trabajo.cod_proyecto
        }
        agregarTxd(txd).then(t=>{
            
            td_tiempo.innerHTML=secsToStrings(t.tiempo_total)
            txtInput.value=''
            spnTotal.innerHTML=secsToStrings(MAIN_DATA.total)
            
        })
    }
}
function quitarMinutosDetalle(btn){
    let t_id=btn.id.split("_")[0]
    let txtInput=document.getElementById(`${t_id}_txtInput_detalle`)
    let td_tiempo=document.getElementById(`${t_id}_tdTiempo_detalles`)
    if(txtInput.value){
        let trabajo=MAIN_DATA.txd_p[t_id]
        let tiempo_total=parseInt(txtInput.value)*(-60)
        MAIN_DATA.total=(MAIN_DATA.total+tiempo_total<0)?0:MAIN_DATA.total+tiempo_total
        let txd={
            fecha:trabajo.fecha,
            tiempo_total:tiempo_total,
            cod_proyecto:trabajo.cod_proyecto
        }
        agregarTxd(txd).then(t=>{
            
            td_tiempo.innerHTML=secsToStrings(t.tiempo_total)
            txtInput.value=''
            spnTotal.innerHTML=secsToStrings(MAIN_DATA.total)
        })
    }
}
function guardarProyecto(){
    if(MAIN_DATA.accion===ACCION.ADD){
        if(txtNombre.value){
            agregarProyecto(txtNombre.value).then(()=>location.reload())
        }
        fillProjForm({id:'',nombre:''})
    }
    else if(MAIN_DATA.accion===ACCION.MOD){
        if(txtNombre.value!=='' & txtNombre.value!==MAIN_DATA.proyectos[txtId.value].nombre){
            modificarProyecto(txtId.value,txtNombre.value).then(()=>{
                let p_id=""+txtId.value
                let td_nombre=document.getElementById(p_id+"_tdNombre")
                td_nombre.innerHTML=txtNombre.value
                MAIN_DATA.cronometros[p_id].nombre=txtNombre.value
                
            })
        }
    }
    else{
        if(txtNombre.value){
            deleteProyecto(txtId.value,txtNombre.value).then(()=>{
                let p_id=""+txtId.value
                let rowTable=p_id+"_rowTable"
                let row=document.getElementById(rowTable)
                delete MAIN_DATA.cronometros[txtId.value]
                txtId.value=''
                txtNombre.value=''
                row.remove()
            })
        }
    }
    
    

}
function detalleP(btn){
    let p_id=btn.id.split("_")[0]
    
    let hNombre=document.getElementById("hNombre")
    let hId=document.getElementById("hId")
    let p=MAIN_DATA.proyectos[p_id]
    hNombre.innerHTML=p.nombre
    hId.innerHTML=p.id
}
function modificarP(btn){
    let p_id=btn.id.split("_")[0]
    let p=MAIN_DATA.proyectos[p_id]
    txtId.value=p.id
    txtNombre.value=p.nombre
    spnProyecto.innerHTML="Modificar"
    MAIN_DATA.accion=ACCION.MOD
}
function eliminarP(btn){
    let p_id=btn.id.split("_")[0]

    let p=MAIN_DATA.proyectos[p_id]
    txtId.value=p.id
    txtNombre.value=p.nombre
    spnProyecto.innerHTML="Eliminar"
    MAIN_DATA.accion=ACCION.DEL
}
//Estaria que vuelva la interior pero ahora vuelve al principal
function hideTareas(){
    tareas.classList.add("hidden")
    dvAllprojects.classList.remove("hidden")
}
function showTareas(){
    let projectDetailClassList=projectDetail.classList
    let dvAllprojectsClassList=dvAllprojects.classList
    if(!projectDetailClassList.contains("hidden")){
        projectDetailClassList.add("hidden")
    }
    if(!dvAllprojectsClassList.contains("hidden")){
        dvAllprojectsClassList.add("hidden")
    }
    tareas.classList.remove("hidden")
    
}
function agregarTarea(btn){
    let p_id=btn.id.split("_")[0]

    let p=MAIN_DATA.proyectos[p_id]
    showTareas()
}
function fillProjects(lista){
    tblProjects.tBodies[0].innerHTML=''
    lista.forEach(p=>{
        
        let row=document.createElement('tr')
        row.id=`${p.id}_rowTable`
        let td_nombre=document.createElement('td')
        td_nombre.id=`${p.id}_tdNombre`
        td_nombre.innerHTML=p.nombre
        let td_tiempo=document.createElement('td')
        
        td_tiempo.innerHTML=secsToStrings(p.txd.tiempo_total)
        td_tiempo.id=""+p.id+"_tdTiempo"
        let td_cronometro=document.createElement('td')
        let div_cron=document.createElement('div')
        div_cron.classList.add("pure-g")
        let div_col_cron=document.createElement('div')
        div_col_cron.classList.add("pure-u-1-1")
        let spnCron=document.createElement('span')
        spnCron.id=""+p.id+"_spnCron"
        spnCron.innerHTML="00:00:00"
        div_col_cron.appendChild(spnCron)
        div_cron.appendChild(div_col_cron)


        let dv_cron_btns=document.createElement('div')
        dv_cron_btns.classList.add("pure-g")
        const btnInit=document.createElement('button')
        btnInit.id=""+p.id+"_btnCronInit"
        let cron_i=new Cronometro(p.id)
        MAIN_DATA.cronometros[""+p.id]=cron_i
        btnInit.addEventListener('click',(e)=>{
            iniciarCronometro(e.currentTarget)
        })
        let btnPaus=document.createElement('button')
        btnPaus.id=""+p.id+"_btnCronPaus"
        btnPaus.addEventListener('click',function(e){
            pausarCronometro(e.currentTarget)
        })
        let btnReinit=document.createElement('button')
        btnReinit.id=""+p.id+"_btnCronbtnReinit"
        btnReinit.addEventListener('click',function(e){
            reiniciarCronometro(e.currentTarget)
        })
        let btnSave=document.createElement('button')
        btnSave.id=""+p.id+"_btnCronSave"
        btnSave.addEventListener('click',function(e){
            guardarCronometro(e.currentTarget)
        })
        let imgInit=document.createElement('img')
        imgInit.width="30"
        imgInit.height="20"
        imgInit.src="./res/img/circle-play-solid.svg"
        let imgPaus=document.createElement('img')
        imgPaus.width="30"
        imgPaus.height="20"
        imgPaus.src="./res/img/circle-stop-solid.svg"
        let imgReinit=document.createElement('img')
        imgReinit.width="30"
        imgReinit.height="20"
        imgReinit.src="./res/img/rotate-left-solid.svg"
        let imgSave=document.createElement('img')
        imgSave.width="30"
        imgSave.height="20"
        imgSave.src="./res/img/save-solid.svg"
        btnInit.appendChild(imgInit)
        btnPaus.appendChild(imgPaus)
        btnReinit.appendChild(imgReinit)
        btnSave.appendChild(imgSave)
        dv_cron_btns.appendChild(btnInit)
        dv_cron_btns.appendChild(btnPaus)
        dv_cron_btns.appendChild(btnReinit)
        dv_cron_btns.appendChild(btnSave)
        td_cronometro.appendChild(div_cron)
        td_cronometro.appendChild(dv_cron_btns)
        let td_input=document.createElement('td')
        let div_input=document.createElement("div")
        div_input.classList.add("pure-g")
        let txtInput=document.createElement("input")
        txtInput.type="number"
        
        txtInput.oninput=(e)=>{
            if (e.currentTarget.value > 99999)
            {
                e.currentTarget.value = 99999;
            }
             
        }
        txtInput.id=""+p.id+"_txtInput"
        div_input.appendChild(txtInput)
        let div_input_btns=document.createElement("div")
        div_input_btns.classList.add("pure-g")
        let btn_add_minutos=document.createElement("button")
        btn_add_minutos.innerHTML="Agregar"
        btn_add_minutos.id=""+p.id+"_addMin"
        btn_add_minutos.addEventListener('click',(e)=>{agregarMinutos(e.currentTarget)})
        div_input_btns.appendChild(btn_add_minutos)
        let btn_del_minutos=document.createElement("button")
        btn_del_minutos.innerHTML="Quitar"
        btn_del_minutos.id=""+p.id+"_delMin"
        btn_del_minutos.addEventListener('click',(e)=>{quitarMinutos(e.currentTarget)})
        div_input_btns.appendChild(btn_del_minutos)
        td_input.appendChild(div_input)
        td_input.appendChild(div_input_btns)
        let td_guardar=document.createElement('td')
        let btn_detail=document.createElement("button")
        btn_detail.innerHTML="Detalle"
        btn_detail.id=""+p.id+"_btnDetail"
        btn_detail.classList.add("btnDetalle")
        btn_detail.addEventListener('click',(e)=>{
            detalleP(e.currentTarget)
        })
        let btn_modificar=document.createElement("button")
        btn_modificar.id=""+p.id+"_btnMod"
        btn_modificar.innerHTML="Modificar"
        btn_modificar.addEventListener("click",(e)=>{
            modificarP(e.currentTarget)
        })
        let btn_eliminar=document.createElement("button")
        btn_eliminar.id=""+p.id+"_btnDel"
        btn_eliminar.innerHTML="Eliminar"
        btn_eliminar.addEventListener("click",(e)=>{
            eliminarP(e.currentTarget)
        })
        let btn_agregar_tareas=document.createElement("button")
        btn_agregar_tareas.id=""+p.id+"_agregar_tares"
        btn_agregar_tareas.innerHTML="Tareas"
        btn_agregar_tareas.addEventListener("click",(e)=>{
            agregarTarea(e.currentTarget)
        })
        td_guardar.appendChild(btn_detail)
        td_guardar.appendChild(btn_modificar)
        td_guardar.appendChild(btn_eliminar)
        td_guardar.appendChild(btn_agregar_tareas)
        //td_guardar.innerHTML=`
        //<button class="btnDetalle">Detalle</button><button class="btnModificar">Modificar</button><button class="btnEliminar">Eliminar</button>
        //`
        row.appendChild(td_nombre)
        row.appendChild(td_tiempo)
        row.appendChild(td_cronometro)
        row.appendChild(td_input)
        row.appendChild(td_guardar)
        tblProjects.tBodies[0].appendChild(row)
    })
}
function fillProjForm(proy){
    txtId.value=proy.id
    txtNombre.value=proy.nombre
}
function fillDetalles(lista){
    tblDetalle.tBodies[0].innerHTML=''
    let total=0
    lista.forEach(element=>{
        let row=document.createElement('tr')
        let td_tiempo=document.createElement("td")
        td_tiempo.id=`${element.id}_tdTiempo_detalles`
        td_tiempo.innerHTML=secsToStrings(element.tiempo_total)
        total+=element.tiempo_total
        let td_fecha=document.createElement('td')
        td_fecha.innerHTML=element.fecha
        let td_input = document.createElement("td")
        let div_input=document.createElement("div")
        div_input.classList.add("pure-g")
        let minutos=document.createElement("input")
        minutos.type="number"
        minutos.oninput=(e)=>{
            if (e.currentTarget.value > 99999)
            {
                e.currentTarget.value = 99999;
            }
             
        }
        minutos.id=`${element.id}_txtInput_detalle`
        let div_input_btns=document.createElement("div")
        div_input_btns.classList.add("pure-g")

        let btn_add_minutos=document.createElement("button")
        btn_add_minutos.innerHTML="Agregar"
        btn_add_minutos.id=`${element.id}_btnAdd_detalles`
        btn_add_minutos.addEventListener('click',function(e){
            agregarMinutosDetalle(e.currentTarget)
        })
        let btn_del_minutos=document.createElement("button")
        btn_del_minutos.innerHTML="Quitar"
        btn_del_minutos.id=`${element.id}_btnDel_detalles`
        btn_del_minutos.addEventListener('click',function(e){
            quitarMinutosDetalle(e.currentTarget)
        })
        div_input_btns.appendChild(btn_add_minutos)
        div_input_btns.appendChild(btn_del_minutos)
        div_input.appendChild(minutos)
        td_input.appendChild(div_input)
        td_input.appendChild(div_input_btns)
        //Tareas
        let btn_agregar_tareas=document.createElement("button")
        btn_agregar_tareas.id=""+element.id+"_agregar_tares"
        btn_agregar_tareas.innerHTML="Tareas"
        btn_agregar_tareas.addEventListener("click",(e)=>{
            agregarTarea(e.currentTarget)
        })
        row.appendChild(td_tiempo)
        row.appendChild(td_fecha)
        row.appendChild(td_input)
        row.appendChild(btn_agregar_tareas)
        tblDetalle.tBodies[0].appendChild(row)
    })
    MAIN_DATA.total=total
    spnTotal.innerHTML=secsToStrings(MAIN_DATA.total)
}
//Para hacerlos menos acoplado todas las llamadas a la API se hacen por aca
async function modificarProyecto(id,nombre){
    let p={
        id:parseInt(id),
        nombre:nombre
    }
    console.log("MOdificando")
    return await window.SimpleAPI.mod("proyectos",p)
}
async function deleteProyecto(id,nombre){
    let p = {
        id:parseInt(id),
        nombre:nombre
    }
    return await await window.SimpleAPI.del("proyectos",p)
}
async function agregarProyecto(nombre){
    return await window.SimpleAPI.add("proyectos",{id:-1,nombre:nombre})
}
function getAllProjectsWin(){
    return window.SimpleAPI.getAllToday("proyectos")
}
async function getDetallesWin(where){
    
    return await window.SimpleAPI.getWhere("trabajosxdia",where)
}
async function agregarTxd(txd){
    return await window.SimpleAPI.add("trabajosxdia",txd)
}


//Database
function getAllProjects(){
    getAllProjectsWin().then(ps=>{
        
        MAIN_DATA.getProyectos(ps)
        fillProjects(ps)
        let btnDs=document.getElementsByClassName('btnDetalle')
        agregarComportamientoBotones(btnDs)
        setInterval(modificarCronometros,800)
        }
        
    )
}
function getDetalles(){
    let cod_proyecto=parseInt(hId.innerHTML)
    let where={cod_proyecto:cod_proyecto}
    if(dtpDetalleDesde.value){
        
        where.fecha_desde=dtpDetalleDesde.value
    }
    if(dtpDetalleHasta.value){
        where.fecha_hasta=dtpDetalleHasta.value
    }
    console.log(where)
    getDetallesWin(where).then(ts=>{
        
        MAIN_DATA.getTXD(ts)
        fillDetalles(ts)
    })
}
//Botones
function agregarComportamientoBotones(btnDs){
    for(let i=0;i<btnDs.length;i++){
        b=btnDs[i]
        b.addEventListener('click',function(e){
            e.preventDefault()
            dvAllprojects.classList.add('hidden')
            projectDetail.classList.remove('hidden')
        })
    }
}

//Modificar todos los cronometros
function modificarCronometros(){
    MAIN_DATA.now()
    
    for(const c_k in MAIN_DATA.cronometros){
        let c=MAIN_DATA.cronometros[c_k]
        
        let milisecs=MAIN_DATA.tiempo_actual-MAIN_DATA.ultimo_tiempo
        if(c.started && !c.stopped){
            c.addSecs(milisecs)
        }
        let spn_cron=document.getElementById(c_k+"_spnCron")
        
        spn_cron.innerHTML=c.toString()
        
    }
    MAIN_DATA.ultimo_tiempo=Date.now()
}
//Funcionalidad
btnVolver.addEventListener('click',function(e){
    e.preventDefault()
    dvAllprojects.classList.remove('hidden')
    projectDetail.classList.add('hidden')
})
btnBuscar.addEventListener('click',function(e){
    getDetalles()
})

btnNuevoProyecto.addEventListener('click',function(e){
    e.preventDefault()
    MAIN_DATA.accion=ACCION.ADD
    fillProjForm({id:'',nombre:''})
    
})
btnProyecto.addEventListener('click',function(e){
    e.preventDefault()
    guardarProyecto()
})
btnAgregarDetalle.addEventListener('click',e=>{
    let fecha=dtpDetalle.value
    
    let minutos =minutosDetalle.value
    if(minutos && fecha){
        let txd={
            fecha:fecha,
            tiempo_total:parseInt(minutos)*60,
            cod_proyecto:parseInt(hId.innerHTML)
        }
        
        agregarTxd(txd).then(t=>{
            if(fecha===hoy()){
                getAllProjects()
            }
            dtpDetalle.value=''
            minutosDetalle.value=''
        })
    }
})
btnQuitarDetalle.addEventListener('click',e=>{
    let fecha=dtpDetalle.value
    
    let minutos =minutosDetalle.value
    if(minutos && fecha){
        let txd={
            fecha:fecha,
            tiempo_total:parseInt(minutos)*(-60),
            cod_proyecto:parseInt(hId.innerHTML)
        }
        
        agregarTxd(txd).then(t=>{
            if(fecha===hoy()){
                
                getAllProjects()
            }
            dtpDetalle.value=''
            minutosDetalle.value=''
        })
    }
})
btnImportar.addEventListener('click',e=>{
    
    importar()
    location.reload()
})
btnExportar.addEventListener('click',e=>{
    exportar()
})
btnVolverTareas.addEventListener('click',e=>{
    hideTareas()
})
let MAIN_DATA=new Main_data()
getAllProjects()


