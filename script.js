/*
  tutorial desde https://www.anieto2k.com/2009/09/25/aplicaciones-javascript-escalables/
*/
var Core = (function() {
  // Variable privadas
  var modules = {}
  var debug = true
  // Cremos la instancia
  function createInstance(moduleID) {
    var instance = modules[moduleID].creator(new Sandbox(this)),
      name,
      method

    if (!debug) {
      for (name in instance) {
        method = instance[name]
        if (typeof method == 'function') {
          instance[name] = function(name, method) {
            return function() {
              try {
                return method.apply(this, arguments)
              } catch (ex) {
                log(1, name + '(): ' + ex.message)
              }
            }
          }
        }
      }
    }
    return instance
  }

  // MÃ©todo pÃºblicos
  return {
    register: function(moduleID, creator) {
      modules[moduleID] = {
        creator: creator,
        instance: null,
      }
    },
    start: function(moduleID) {
      modules[moduleID].instance = createInstance(moduleID)
      modules[moduleID].instance.init()
    },
    stop: function(moduleID) {
      var data = modules[moduleID]
      if (data.instance) {
        data.instance.destroy()
        data.instance = null
      }
    },
    startAll: function() {
      for (var moduleID in modules) {
        if (modules.hasOwnProperty(moduleID)) {
          this.start(moduleID)
        }
      }
    },
    stopAll: function() {
      for (var moduleID in modules) {
        if (modules.hasOwnProperty(moduleID)) {
          this.stop(moduleID)
        }
      }
    },
    getModules: function() {
      return modules
    },
    init: function() {
      return 'iniciado!'
    },
  }
})()

/*
Ejemplo de SandBox
*/
var Sandbox = function() {
  // Variables privadas
  var priv = 'Privado'

  // MÃ©todos pÃºblicos
  return {
    alert: function(str) {
      alert(str + priv)
    },
    console: function(str) {
      console.log(str)
    },
    notify: function(opt) {
      document.getElementById('title').innerText = opt.title
      document.getElementById('content').innerHTML = opt.content
    },
  }
}

Core.register('hola-mundo', function(sandbox) {
  // Variables privadas
  var priv = 'Privada'

  // MÃ©todo privados
  return {
    init: function() {
      try {
        sandbox.alert('iniciamos el mÃ³dulo llamado: ')
        const obj = {
          title: 'ola k ace',
          content: '<h1>xdd</h1>',
        }
        sandbox.notify(obj)
      } catch (ex) {
        console.log(ex)
        alert('No se ha encontrado sandbox')
      }
    },
    destroy: function() {
      // destructor
    },
  }
})

Core.init()
