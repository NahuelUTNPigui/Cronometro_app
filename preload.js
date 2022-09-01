const { contextBridge, ipcRenderer } = require('electron')
contextBridge.exposeInMainWorld("SimpleAPI",{
    getAll:(model)=>ipcRenderer.invoke(model+":getAll"),
    getAllToday:()=>ipcRenderer.invoke("proyectos:get:today"),
    getWhere:(model,where)=>ipcRenderer.invoke(model+":get:where",where),
    add:(model,obj)=>ipcRenderer.invoke(model+":add",obj),
    mod:(model,obj)=>ipcRenderer.send(model+":mod",obj),
    del:(model,obj)=>ipcRenderer.send(model+":del",obj),
    exportar:()=>ipcRenderer.send("export"),
    importar:()=>ipcRenderer.send("import")

})