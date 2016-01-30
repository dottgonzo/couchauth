import * as Promise from "bluebird";
import * as _ from "lodash";

let couchjsonconf=require("couchjsonconf");

let uid=require("uid");
let rpj = require("request-promise-json");



function couchApi(db){
  this.couchurl=new couchjsonconf(db)

  var internal_couchdb=this.couchurl


  rpj.get(this.couchurl.my('_users/org.couchdb.user:'+this.couchurl.user)).then(function(){


    rpj.get(this.couchurl.my('app_main')).then(function(){
      return true
    }).catch(function(err){

      createapp('main',config.couchdb.username).then(function(){
        return true
      }).catch(function(err){

  throw Error('can\'t create main app');

      })

    })
  }).catch(function(err){
    throw Error('wrong admin user')
})



}


couchApi.prototype.testlogin = function (user,password,db) {
var internal_couchdb=this.couchurl

return new Promise(function(resolve,reject){
  rpj.get(internal_couchdb.user(user,password,db)).then(function(){
    resolve(true)
  }).catch(function(err){
    reject(err)
  })
})

};




couchApi.prototype.testapp_id = function (app_id) {
var internal_couchdb=this.couchurl
  return new Promise(function(resolve,reject){
    rpj.get(internal_couchdb.my('app_'+app_id)).then(function(){
      resolve(true)
    }).catch(function(err){
      reject(err)
    })
  })
}

couchApi.prototype.testauth = function (user,password,app_id) {
  return new Promise(function(resolve,reject){
    getuserapp(user,password,app_id).then(function(db){
      testlogin(user,password,db).then(function(){
        resolve(true)
      }).catch(function(err){
        reject(err)
      })
    }).catch(function(err){
      reject(err)
    })

  })

}

couchApi.prototype.getuserdbs = function (username) {
var internal_couchdb=this.couchurl
  return new Promise(function(resolve,reject){
    rpj.get(internal_couchdb.my('_users/org.couchdb.user:'+username)).then(function(doc){
      resolve(doc.db)
    }).catch(function(err){
      reject(err)
    })
  })
}

couchApi.prototype.getuserapp = function (username,app_id) {

  return new Promise(function(resolve,reject){
    getuserdbs(username).then(function(doc){
      _.map(doc.db,function(d){
        if (d.app_id==app_id&&d.dbtype=='mine'){
          resolve(d)
        }
      })
    }).catch(function(err){
      reject(err)
    })
  })
}



couchApi.prototype.getmymachine = function (app_id,username,label) {

  return new Promise(function(resolve,reject){
    getuserdbs(username).then(function(doc){
      _.map(doc.db,function(d){
        if (d.app_id==app_id&&d.dbtype=='machine'&&d.label==label){
          resolve(d)
        }
      })
    }).catch(function(err){
      reject(err)
    })
  })
}

couchApi.prototype.getmymachines = function (app_id,username) {

  return new Promise(function(resolve,reject){
    getuserdbs(username).then(function(doc){
      var dbs=[];
      _.map(doc.db,function(d){
        if (d.app_id==app_id&&d.dbtype=='machine'){
          dbs.push(d)
        }
      })
      resolve(dbs)
    }).catch(function(err){
      reject(err)
    })
  })
}

function gen_db(kind,data){
  switch(kind){
    case 'member':
    return 'mem_'+uid(3)+'_'+data.app_id+'_'+data.username;
    break;
    case 'machine':
    return 'mach_'+uid(6)+'_'+data.app_id;
    break;

  }
}
function random_slave(username){

  return {
    password:uid(12),
    user:'sl_'+username+'_'+uid(6)
  }

}

couchApi.prototype.create_slave_userapp = function (username,userdb) {
var internal_couchdb=this.couchurl
  return new Promise(function(resolve,reject){
    var slave=random_slave(username)
    rpj.put(internal_couchdb.my('/_users/org.couchdb.user:'+slavename),{
      name: slave.user,
      roles: ['slave'],
      app:{db:userdb,user:username},
      dbtype:"userslave",
      type: "user",
      password: slave.password
    }).then(function(){
      resolve(slave)
    }).catch(function(err){
      reject(err)
    });
  })
}

couchApi.prototype.subscribeapp = function (app_id,username,owner) {
  var internal_couchdb=this.couchurl

  return new Promise(function(resolve,reject){

    getuserdbs(username).then(function(doc){

      var newuserdb=gen_db('member',{username:username,app_id:app_id});

      create_slave_userapp(username,newuserdb).then(function(slave){

        var newdb={app_id:app_id,dbname:newuserdb,slave:{username:slave.user,password:slave.password},dbtype:"mine",roles:['owner']};
        doc.db.push(newdb);

        if (owner){
          doc.roles.push('app_'+app_id);
          var startapp={app_id:app_id,dbname:'app_'+app_id,dbtype:"application",roles:['owner']};
          doc.db.push(startapp);
        }

        rpj.put(internal_couchdb.my('/_users/org.couchdb.user:'+slavename),doc).then(function(){ // push new user settings
          rpj.put(internal_couchdb.my('/'+newuserdb),doc).then(function(){  // create an empty db
            rpj.put(internal_couchdb.my('/'+newuserdb+'/_security'),{"members":{"names":[username,slave.user],"roles":[] } }).then(function(){ // push security changes to app db
              resolve(true)

              // confirmDB.post({confirm:false}).then(function(doc){
              //   //  registerMail('darioyzf@gmail.com',doc.id); // TO BE ALIVE
              // }).catch(function(err){
              //   reject(err)
              // });

            }).catch(function(err){
              reject(err)
            })
          }).catch(function(err){
            reject(err)
          })
        }).catch(function(err){
          reject(err)
        })
      }).catch(function(err){
        reject(err)
      })
    }).catch(function(err){
      reject(err)
    })
  })
}

couchApi.prototype.createapp = function (app_id,username) {
  var internal_couchdb=this.couchurl

  return new Promise(function(resolve,reject){

    rpj.put(internal_couchdb.my('app_'+app_id)).then(function(){
      rpj.put(internal_couchdb.my('/app_'+app_id+'/_design/auth'),{
        "language": "javascript",
        "validate_doc_update": "function(n,o,u){if(n._id&&!n._id.indexOf(\"_local/\"))return;if(!u||!u.roles||u.roles.indexOf(\"app_"+app_id+"\")==-1){throw({forbidden:'Denied.'})}}"
      }).then(function(){
        resolve(true)
      }).catch(function(err){
        reject(err)
      })
    }).catch(function(err){
      reject(err)
    })

  })

}

couchApi.prototype.postapp = function (app_id,username) { // create or subscribe new application
  return new Promise(function(resolve,reject){

    var newuserdb=gen_db('member',{username:username,app_id:app_id});

    testapp_id(app_id).then(function(){

      getuserapp(app_id,username).then(function(){
        subscribeapp(app_id,username,owner).then(function(){
          resolve(true)
        }).catch(function(err){
          reject(err)
        })
      }).catch(function(err){
        resolve(true)
      })
    }).catch(function(err){

      createapp(app_id,username).then(function(){
        subscribeapp(app_id,username,true).then(function(){
          resolve(true)
        }).catch(function(err){
          reject(err)
        })
      }).catch(function(err){
        reject(err)
      })
    })
  })
}

couchApi.prototype.sharemach = function (app_id,user,label,friend) { // create or subscribe new application
  var internal_couchdb=this.couchurl

  return new Promise(function(resolve,reject){
    getmymachine(app_id,user,label).then(function(m){

      getuserapp(app_id,friend).then(function(){

        getmymachine(app_id,friend,label).then(function(){
          resolve(true)
        }).catch(function(err){

          var newdb={app_id:app_id,dbname:machinedb,slave:{username:machineuser,password:machinepassw,token:machinetoken},label:label,dbtype:"machine",roles:['shared']};
          doc.db.push(newdb)

          rpj.put(internal_couchdb.my('/_users/org.couchdb.user:'+friend),doc).then(function(){

            rpj.get(internal_couchdb.my('/_users/org.couchdb.user:'+machineuser),doc).then(function(updateslave){

              updateslave.app.users.push(newusername);

              rpj.put(internal_couchdb.my('/_users/org.couchdb.user:'+machineuser),updateslave).then(function(){
                resolve(true)
              }).catch(function(err){
                reject(err)
              })
            }).catch(function(err){
              reject(err)
            })
          }).catch(function(err){
            reject(err)
          })
        })
      }).catch(function(err){
        reject(err)
      })
    }).catch(function(err){
      reject(err)
    })
  })
}


module.exports=couchApi
