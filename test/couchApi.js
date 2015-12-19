var expect    = require("chai").expect,
couchApi=require('../modules/couchApi');
var couchjsonconf=require('couchjsonconf');

var rpj = require('request-promise-json');

var db=require('./db.json')
var API=new couchApi(db)
var url=new couchjsonconf(db)

console.log(API)





describe("couchApi", function() {
  this.timeout(50000);

  before(function(done){

    rpj.get(url.my('app_main')).then(function(){

      done()
    }).catch(function(err){
      throw Error(err)


    })

  })

  describe("users", function() {

    before(function(done){
      done()


      describe("create fake user", function() {

        it("create user", function(done) {
          expect(API).to.have.property('couchurl').that.is.an('object');
          done()
          //     console.log('after'+new Date().getTime())
          //     var newuser='testuser'
          //     API.register(newuser).then(function(){
          //       rpj.get(url.my('_users/org.couchdb.user:'+newuser)).then(function(doc){
          //
          //         expect(doc).to.be.ok;
          //         expect(doc).is.an.('object');
          //
          //       }).catch(function(err){
          //         throw err
          //
          //       })
          //
          //
          //     }).catch(function(err){
          //       throw err
          //
          //     })
          //
        });
      });



    })


    after(function(done){
      done()


      describe("remove fake user", function() {

        it("remove user", function(done) {
          expect(API).to.have.property('couchurl').that.is.an('object');
          done()
          //     console.log('after'+new Date().getTime())
          //     var newuser='testuser'
          //     API.register(newuser).then(function(){
          //       rpj.get(url.my('_users/org.couchdb.user:'+newuser)).then(function(doc){
          //
          //         expect(doc).to.be.ok;
          //         expect(doc).is.an.('object');
          //
          //       }).catch(function(err){
          //         throw err
          //
          //       })
          //
          //
          //     }).catch(function(err){
          //       throw err
          //
          //     })
          //
        });
      });



    })


    describe("functions", function() {
      describe("get db", function() {

        it("ddd user", function() {
          expect(API).to.have.property('couchurl').that.is.an('object');
        });
      });
    });

    describe("actions", function() {


      describe("get db", function() {

        it("ddd user", function() {
          expect(API).to.have.property('couchurl').that.is.an('object');
        });
      });
      describe("get user machines", function() {

        it("ddd user", function() {
          expect(API).to.have.property('couchurl').that.is.an('object');
        });
      });

      describe("login user", function() {

        it("login user", function() {
          expect(API).to.have.property('couchurl').that.is.an('object');
        });
      });


      describe("remove user", function() {

        it("get user db", function() {
          expect(API).to.have.property('couchurl').that.is.an('object');
        });
      });



    });

    describe("machines", function() {
      before(function(done){
        done()


        describe("create new machine for user", function() {

          it("create machine", function(done) {
            expect(API).to.have.property('couchurl').that.is.an('object');
            done()
          });

         });
       });
       after(function(done){
         done()


         describe("remove fake machine", function() {

           it("remove machine", function(done) {
             expect(API).to.have.property('couchurl').that.is.an('object');
             done()
           });

          });
        });
            describe("actions", function() {

              describe("login", function() {

                it("login user", function() {
                  expect(API).to.have.property('couchurl').that.is.an('object');
                });
              });

            });
            describe("functions", function() {
              describe("add", function() {

                it("add user", function() {
                  expect(API).to.have.property('couchurl').that.is.an('object');
                });
              });
            });
          });



        });



      });
