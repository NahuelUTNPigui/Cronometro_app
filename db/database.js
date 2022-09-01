const {Sequelize,Model,DataTypes }=require('sequelize')
const sequelize = new Sequelize('sqlite::memory:')
// const sequelize = new Sequelize({
//     dialect: 'sqlite',
//     storage: 'database.sqlite'
//   });
class Proyecto extends Model{}
Proyecto.init({
    nombre:{
        type:DataTypes.STRING,
        allowNull:false
    }},{
        sequelize,
        modelName:'Proyecto',
        paranoid:true,
        deletedAt:'destroyTime',
        freezeTableName:true
    
})
class TrabajoXDia extends Model{}
TrabajoXDia.init({
    //Representa el tiempo medido en segundos
    tiempo_total:{
        type:DataTypes.INTEGER,
        allowNull:false
    },
    fecha:{
        type:DataTypes.DATEONLY,
        allowNull:false
    },
    cod_proyecto:{
        type:DataTypes.INTEGER,
        allowNull:false
    }},{
        sequelize,
        modelName:"TrabajoXDia",
        paranoid:true,
        deletedAt:'destroyTime',
        freezeTableName:true
})
class Tarea extends Model{}
Tarea.init({
    nombre:{
        type:DataTypes.STRING,
        allowNull:false
    },
    cod_txd:{
        type:DataTypes.INTEGER,
        allowNull:false
    }},{
        sequelize,
        modelName:"Tarea",
        freezeTableName:true
    })
module.exports={
    sequelize,
    Tarea
}