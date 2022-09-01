const {sequelize,Tarea} = require("./database.js")
const {Op}=require("sequelize")

let fs = require('fs');

function getStringFecha(fecha){
    let dia=fecha.getDate()
    let s_dia=(dia<10)?"0"+dia:""+dia
    let mes=fecha.getMonth()+1
    let s_mes=(mes<10)?"0"+mes:""+mes
    let year=fecha.getFullYear()
    let s_year=""+year
    return s_year+"-"+s_mes+"-"+s_dia
}

async function getTXDWhere(trabajoXDia_model,where_db){
    let txd_bd=await trabajoXDia_model.findAll({where:where_db})
    let txds=txd_bd.map(t=>{
        return {
            id:t.id,
            fecha:t.fecha,
            tiempo_total:t.tiempo_total,
            cod_proyecto:t.cod_proyecto
        }
    })
    return txds    
}
async function getTrabajoXDiaByProjectoByDate(trabajoXDia_model,cod_projecto,date){
    let where={
        cod_proyecto:{[Op.eq]:cod_projecto},
        fecha:{[Op.eq]:date}
    }
    let t_bd= await trabajoXDia_model.findAll({where:where})
    let t=t_bd.map(ts=>ts.dataValues)
    if(t[0]){
        return {
            id:t[0].id,
            fecha:t[0].fecha,
            tiempo_total:t[0].tiempo_total
        }
    }
    else{
        return {
            id:-1,
            fecha:date,
            tiempo_total:0
        }
    }
}
async function getPkProject(project_model,id,paranoid){
    let project_bd=await project_model.findByPk(id,{paranoid:paranoid})
    if(project_bd){
        return {
            id:project_bd.id,
            nombre:project_bd.nombre
        }

    }else{
        return {
            id:-1,
            nombre:'no existe'
        }
    }
}
async function getAllProjects(project_model){
    let projetcs_bd=await project_model.findAll({})
    let projects=projetcs_bd.map(p_bd=>{
        return {
            id:p_bd.dataValues.id,
            nombre:p_bd.dataValues.nombre
        }
    })
    return projects
}
function getProjects(project_bd_data){
    let ps=project_bd_data.map(p=>{
        return {
            id:p.id,
            nombre:p.nombre
        }
    })
    return ps
}
async function addtxd(trabajoxdia_model,txd){
    //Si no existe guardo, si existe modifico
    let t=await getTrabajoXDiaByProjectoByDate(trabajoxdia_model,txd.cod_proyecto,txd.fecha)
    
    if(t.id===-1){
        if(txd.tiempo_total<0){
            txd.tiempo_total=0
        }
        let c= await trabajoxdia_model.create({
            fecha:txd.fecha,
            tiempo_total:txd.tiempo_total,
            cod_proyecto:txd.cod_proyecto
        })
        
        return {
            id:c.dataValues.id,
            fecha:c.dataValues.fecha,
            tiempo_total:c.dataValues.tiempo_total,
            cod_proyecto:c.dataValues.cod_proyecto
        }
    }
    else{

        let tiempo_total=txd.tiempo_total+t.tiempo_total
        if(tiempo_total<0){
            tiempo_total=0
        }

        let u= await trabajoxdia_model.update({
            
            tiempo_total:tiempo_total,
            
        },{where:{
            [Op.and]:{fecha:txd.fecha,cod_proyecto:txd.cod_proyecto}
            
        }})
        
        return {
            fecha:txd.fecha,
            tiempo_total:tiempo_total,
            cod_proyecto:txd.cod_proyecto
        };
    }

}
async function addP(proyecto_model,p){
    return await proyecto_model.create({nombre:p.nombre})
}
async function modP(proyecto_model,p){
    
    await proyecto_model.update({nombre:p.nombre},{where:{id:p.id}})
}
async function delP(proyecto_model,p){
    await proyecto_model.destroy({where:{id:p.id}})
}
async function addTarea(tarea){
    return await Tarea.create({tarea})
}
async function delTarea(id){
    return await Tarea.destroy({id:id})
}
async function getTareasTXD(txd){
    return await Tarea.findAll({where:{cod_txd:txd}})
}
class App_data{
    constructor(data_base){
        this.data_base=data_base
        this.data={}
        //this.getFakeData()
    }
    sync(options,callback,err){
        this.data_base.sync(options).then(callback).catch(err)
    }
    getFakeData(){
        this.data=JSON.parse(fs.readFileSync("./res/toy/fake_data.json",{encoding:"utf-8",flag:'r'}))
    }
    fillDB(){
        this.data.projs.forEach(p=>{
            this.data_base.model("Proyecto").create({nombre:p.nombre})
        })
        this.data.tiempos.forEach(t=>{
            this.data_base.model("TrabajoXDia").create({tiempo_total:t.tiempo_total,fecha:t.fecha,cod_proyecto:t.cod_proyecto})
        })
    }
    async getTXDWhere(where){
        let where_db={}
        if(where.cod_proyecto){
            where_db.cod_proyecto=where.cod_proyecto
        }

        if(where.fecha_desde){
            where_db.fecha={[Op.gte]:where.fecha_desde}
        }
        if(where.fecha_hasta){
            where_db.fecha={[Op.lte]:where.fecha_hasta}
            if(where.fecha_desde){
                where_db.fecha={[Op.and]:{[Op.gte]:where.fecha_desde,[Op.lte]:where.fecha_hasta}}
            }
        }
        
        return await getTXDWhere(this.data_base.model("TrabajoXDia"),where_db)
    }
    async getAllProyectos(){
        return await getAllProjects(this.data_base.model("Proyecto"))
    }
    async getAllProyectosToday(){
        let hoy=getStringFecha(new Date(Date.now()))
        let projects_bd_data=await getAllProjects(this.data_base.model("Proyecto"))
        let projects_bd=getProjects(projects_bd_data)
        let txd_promises=[]
        
        for(let i =0;i<projects_bd.length;i++){
            txd_promises.push(getTrabajoXDiaByProjectoByDate(this.data_base.model("TrabajoXDia"),projects_bd[i].id,hoy))
        }
        let txd=await Promise.all(txd_promises)
        let projects=[]
        for(let i =0;i<projects_bd.length;i++){
            let t=txd[i]

            let p_bd=projects_bd[i]
            let p={
                id:p_bd.id,
                nombre:p_bd.nombre,
                txd:t
            }
            projects.push(p)
        }
        return projects

        
    }
    async addtxd(txd){
        return await addtxd(this.data_base.model("TrabajoXDia"),txd)
    }
    async addP(p){
        await addP(this.data_base.model("Proyecto"),p)
    }
    async modP(p){
        return await modP(this.data_base.model("Proyecto"),p)
    }
    async delP(p){
        return await delP(this.data_base.model("Proyecto"),p)
    }
}
let APP_DATA=new App_data(sequelize)
module.exports={
    APP_DATA,
    addTarea,
    delTarea,
    getTareasTXD
}