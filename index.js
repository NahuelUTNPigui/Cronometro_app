const { app, BrowserWindow,ipcMain,dialog } = require('electron')

const{APP_DATA,addTarea,delTarea,getTareasTXD}=require('./db/entry_point.js')
const path = require('path')
let fs = require('fs');
let db_path=path.join(__dirname,'database.sqlite')
let files={
    html:"index.html",
    preload:'preload.js'
}
function createWindow () {
    const win = new BrowserWindow({
      width: 1200,
      height: 900,
      webPreferences: {
        preload: path.join(__dirname,files.preload)
      }
    })
    
    win.loadFile(files.html)
}
function exportar(){
  dialog.showOpenDialog({
    defaultPath:app.getPath('desktop'),
    buttonLabel:"Selecciona una carpeta",
    properties: [ 'openDirectory']
  }).then(resultado=>{
    //Devuelve un string[]
    res=resultado.filePaths
   
    if(res.length===1){
      try{
        fs.copyFileSync(path.join(__dirname,'database.sqlite'),path.join(res[0],'database.sqlite'))
      }
      catch(err){
        console.log("Hubo un error")
      }
    }
  })
  
}

function importar(app_data){
  console.log()
  dialog.showOpenDialog({
    defaultPath:app.getPath('desktop'),
    buttonLabel:"Selecciona un archivo",
    properties: [ 'openFile'],
    filters:[
      {name:'base de datos',extensions:["sqlite"]}
    ]
  }).then(resultado=>{
    res=resultado.filePaths
    console.log(res)
    if(res.length===1){
      try{
        //fs.unlinkSync(path.join(__dirname,'database.sqlite'))
        fs.copyFileSync(path.join(res[0]),path.join(__dirname,'database.sqlite'))
        app_data.sync({},()=>console.log("todo ok again"),()=>{})
      }
      catch(err){
        console.log(err)
      }
    }
  })
  
  
}
app.whenReady().then(() => {
    APP_DATA.sync({},()=>{console.log("todo ok")},()=>{})
    createWindow()
    ipcMain.handle('proyectos:getAll',(evento)=>{return APP_DATA.getAllProyectos()})
    ipcMain.handle('proyectos:get:today',async(evento)=>{let p_t= await APP_DATA.getAllProyectosToday();return p_t})
    ipcMain.handle("trabajosxdia:get:where",async(evento,where)=>{return await APP_DATA.getTXDWhere(where)})
    ipcMain.handle("tareas:get:where",async(evento,where)=>{return await getTareasTXD(where.txd)})
    //Te devuelve el trabajo modificado
    ipcMain.handle("trabajosxdia:add",async (evento,txd)=>{let t= await APP_DATA.addtxd(txd);return t})
    ipcMain.handle("proyectos:add",async(evento,p)=>{let p_bd=await APP_DATA.addP(p);return p_bd})
    ipcMain.on("proyectos:mod",async(evento,p)=> await APP_DATA.modP(p))
    ipcMain.on("proyectos:del",async(evento,p)=>await APP_DATA.delP(p))

    ipcMain.handle("tareas:add",async(evento,t)=>await addTarea(t))
    ipcMain.handle("tareas:del",async(evento,t)=>await delTarea(t))

    //Importacion
    ipcMain.on("export",(event)=>{exportar()})
    ipcMain.on("import",(event)=>{importar(APP_DATA)})
})