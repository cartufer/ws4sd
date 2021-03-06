/* global $CC, Utils, $SD */

/**
* Here are a couple of wrappers we created to help ypu quickly setup
* your plugin and subscribe to events sent by Stream Deck to your plugin.
*/

/**
* The 'connected' event is sent to your plugin, after the plugin's instance
* is registered with Stream Deck software. It carries the current websocket
* and other information about the current environmet in a JSON object
* You can use it to subscribe to events you want to use in your plugin.
*/

$SD.on('connected', (jsonObj) => connected(jsonObj));
function isJSON(str) {
  try {
    JSON.parse(str);
  } catch (e) {
    return false;
  }
  return true;
}

var sendsocket = null;
function sendsocketconnect(target) {
  if (sendsocket) {
    sendsocket.close();
    sendsocket = null;
  };
  console.log('new sendoscket');
  sendsocket = new WebSocket(target); // ws://echo.websocket.org:80/
  bindEvents();
  setReadyState();
}

function bindEvents() {
  sendsocket.onopen = function() {
    console.log('onopen called');
    setReadyState();
  };
  sendsocket.onmessage = function (myreply) {
    console.log('onmessage called, ', myreply.data); // this is the data we get back, cartufer
  };
}

function setReadyState() {
  console.log('sendsocket.readyState: ' + sendsocket.readyState);
}

// function sendsocketlog(msg) {
//   if(document.body) {
//     var text = document.createTextNode(msg);
//     document.body.appendChild(text);
//   }
// }
// function prepsendsocket(mydestination) {
//   // if (sendsocket) {
//   //   sendsocket.close();
//   //   sendsocket = null;
//   // };
//
//   sendsocket = new WebSocket('ws://echo.websocket.org:80');
//
//   sendsocket.onopen = function () {
//     // var json = {
//     //   event: inMessageType,
//     //   uuid: inUUID
//     // };
//     console.log("sendsocket:onopen");
//     // console.log('***************', inMessageType + "  websocket:onopen", inUUID, json);
//
//     // websocket.sendJSON(json);
//     // $SD.uuid = inUUID;
//     // $SD.actionInfo = inActionInfo;
//     // $SD.applicationInfo = inApplicationInfo;
//     // $SD.messageType = inMessageType;
//     // $SD.connection = websocket;
//
//     // instance.emit('connected', {
//     //   connection: websocket,
//     //   port: inPort,
//     //   uuid: inUUID,
//     //   actionInfo: inActionInfo,
//     //   applicationInfo: inApplicationInfo,
//     //   messageType: inMessageType
//     // });
//   };
//
//   sendsocket.onerror = function (evt) {
//     var reason = WEBSOCKETERROR(evt);
//     console.warn('SENDSOCKET ERROR', evt, '   ', reason);
//   };
//
//   sendsocket.onclose = function (evt) {
//     // sendsocket is closed
//     var reason = WEBSOCKETERROR(evt);
//     console.warn(
//       '[SENDSOCKET]***** SENDSOCKET CLOSED **** reason:',
//       reason
//     );
//   };
//
//   sendsocket.onmessage = function (myreply) {
//     // var jsonObj = Utils.parseJson(evt.data),
//     //     m;
//     console.log('[STREAMDECK] sendsocket.onmessage ... ', myreply);
//     // console.log('[STREAMDECK] websocket.onmessage ... ', jsonObj.event, jsonObj);
//
//     // if (!jsonObj.hasOwnProperty('action')) {
//     //     m = jsonObj.event;
//     //     // console.log('%c%s', 'color: white; background: red; font-size: 12px;', '[common.js]onmessage:', m);
//     // } else {
//     //     switch (inMessageType) {
//     //     case 'registerPlugin':
//     //         m = jsonObj['action'] + '.' + jsonObj['event'];
//     //         break;
//     //     case 'registerPropertyInspector':
//     //         m = 'sendToPropertyInspector';
//     //         break;
//     //     default:
//     //         console.log('%c%s', 'color: white; background: red; font-size: 12px;', '[STREAMDECK] websocket.onmessage +++++++++  PROBLEM ++++++++');
//     //         console.warn('UNREGISTERED MESSAGETYPE:', inMessageType);
//     //     }
//     // }
//   }
// }




function connected(jsn) {
  /** subscribe to the willAppear and other events */
  $SD.on('com.github.cartufer.ws4sd.action.willAppear', (jsonObj) => action.onWillAppear(jsonObj));
  $SD.on('com.github.cartufer.ws4sd.action.keyUp', (jsonObj) => action.onKeyUp(jsonObj));
  $SD.on('com.github.cartufer.ws4sd.action.keyDown', (jsonObj) => action.onKeyDown(jsonObj));
  $SD.on('com.github.cartufer.ws4sd.action.sendToPlugin', (jsonObj) => action.onSendToPlugin(jsonObj));
  $SD.on('com.github.cartufer.ws4sd.action.didReceiveSettings', (jsonObj) => action.onDidReceiveSettings(jsonObj));
  $SD.on('com.github.cartufer.ws4sd.action.propertyInspectorDidAppear', (jsonObj) => {
    console.log('%c%s', 'color: white; background: black; font-size: 13px;', '[app.js]propertyInspectorDidAppear:');
  });
  $SD.on('com.github.cartufer.ws4sd.action.propertyInspectorDidDisappear', (jsonObj) => {
    console.log('%c%s', 'color: white; background: red; font-size: 13px;', '[app.js]propertyInspectorDidDisappear:');
  });
};

/** ACTIONS */

const action = {
  settings:{},
  onDidReceiveSettings: function(jsn) {
    console.log('%c%s', 'color: white; background: red; font-size: 15px;', '[app.js]onDidReceiveSettings:');

    this.settings = Utils.getProp(jsn, 'payload.settings', {});
    sendsocketconnect()
    //this.doSomeThing(this.settings, 'onDidReceiveSettings', 'orange');
    // setup websocket, cartufer
    // if(sendsocket){sendsocket.close();console.log('closing socket');}
    // var sendsocket = new WebSocket(this.settings.myTarget);
    // console.log('socket setup');
    // sendsocket.onerror = function(evt) {
    //   console.log("sendsocket error.");
    //   //this.ShowReaction(context, "Alert");
    // };
    // sendsocket.onmessage = function(str) {
    //   console.log("Someone sent: ", str);
    //   // this.ShowReaction(context, "Alert");
    // };
    /**
    * In this example we put a HTML-input element with id='mynameinput'
    * into the Property Inspector's DOM. If you enter some data into that
    * input-field it get's saved to Stream Deck persistently and the plugin
    * will receice the updated 'didReceiveSettings' event.
    * Here we look for this setting and use it to change the title of
    * the key.
    */

    //this.setTitle(jsn);
  },

  /**
  * The 'willAppear' event is the first event a key will receive, right before it gets
  * showed on your Stream Deck and/or in Stream Deck software.
  * This event is a good place to setup your plugin and look at current settings (if any),
  * which are embedded in the events payload.
  */


  onWillAppear: function (jsn) {
    console.log("You can cache your settings in 'onWillAppear'", jsn.payload.settings);
    /**
    * "The willAppear event carries your saved settings (if any). You can use these settings
    * to setup your plugin or save the settings for later use.
    * If you want to request settings at a later time, you can do so using the
    * 'getSettings' event, which will tell Stream Deck to send your data
    * (in the 'didReceiceSettings above)
    *
    * $SD.api.getSettings(jsn.context);
    var websocket = new WebSocket(this.settings.myTarget);this.settings.myTarget
    */
    this.settings = jsn.payload.settings;
    sendsocketconnect(this.settings.myTarget);
    // this.settings.myTarget

    // this is where i'm going to do setup, cartufer

    // nothing in the settings pre-fill something just for demonstration purposes
    /*        if (!this.settings || Object.keys(this.settings).length === 0) {
    *            this.settings.mynameinput = 'TEMPLATE';
    *        }
    */
    //this.setTitle(jsn);
  },

  onKeyUp: function (jsn) {
    this.doSomeThing(jsn, 'onKeyUp', 'green');
    console.log("onKeyUp");
    // this.ShowReaction(context, "Alert");
    // this is where i'm going to do stuff, cartufer
  },
  onKeyDown: function (jsn) {
    console.log("onKeyDown");
    // this.doSomeThing(jsn, 'onKeyDown', 'green');
    //sendsocket.send(JSON.stringify(this.settings.myPayload));
    if(typeof sendsocket !== 'undefined'){
      console.log('sending to sendsocket !==');

      if (isJSON(this.settings.myPayload)){
        console.log('sending to sendsocket json as a string');
        sendsocket.send(this.settings.myPayload); // JSON.stringify(
      }else{
        console.log('sending to sendsocket string');
        sendsocket.send(this.settings.myPayload);
      }
      // sendsocket.send(JSON.stringify(this.settings.myPayload));

    }else{
      console.log('sendsocket is emptying, attempting reload');
      sendsocketconnect(this.settings.myTarget);
      if (isJSON(this.settings.myPayload)){
        console.log('sending to sendsocket json as a string');
        sendsocket.send(this.settings.myPayload); // JSON.stringify(
      }else{
        console.log('sending to sendsocket string');
        sendsocket.send(this.settings.myPayload);
      }

    }//else{this.ShowReaction(jsn, "Alert");}
    // this.ShowReaction(context, "Alert");
    // this is where i'm going to do stuff, cartufer
  },

  onSendToPlugin: function (jsn) {
    /**
    * this is a message sent directly from the Property Inspector
    * (e.g. some value, which is not saved to settings)
    * You can send this event from Property Inspector (see there for an example)
    */

    const sdpi_collection = Utils.getProp(jsn, 'payload.sdpi_collection', {});
    if (sdpi_collection.value && sdpi_collection.value !== undefined) {
      this.doSomeThing({ [sdpi_collection.key] : sdpi_collection.value }, 'onSendToPlugin', 'fuchsia');
    }
  },

  /**
  * This snippet shows, how you could save settings persistantly to Stream Deck software
  * It is not used in this example plugin.
  */

  saveSettings: function (jsn, sdpi_collection) {
    console.log('saveSettings:', jsn);
    if (sdpi_collection.hasOwnProperty('key') && sdpi_collection.key != '') {
      if (sdpi_collection.value && sdpi_collection.value !== undefined) {
        this.settings[sdpi_collection.key] = sdpi_collection.value;
        console.log('setSettings....', this.settings);
        $SD.api.setSettings(jsn.context, this.settings);
      }
    }
  },

  /**
  * Here's a quick demo-wrapper to show how you could change a key's title based on what you
  * stored in settings.
  * If you enter something into Property Inspector's name field (in this demo),
  * it will get the title of your key.
  *
  * @param {JSON} jsn // the JSON object passed from Stream Deck to the plugin, which contains the plugin's context
  *
  */
  // lets see what happens if i just leave out this function, will it autoset, cartufer
  /**
  *  setTitle: function(jsn) {
  *      if (this.settings && this.settings.hasOwnProperty('mynameinput')) {
    *          console.log("watch the key on your StreamDeck - it got a new title...", this.settings.mynameinput);
    *          $SD.api.setTitle(jsn.context, this.settings.mynameinput);
    *      }
    *  },
    */
    /**
    * Finally here's a methood which gets called from various events above.
    * This is just an idea how you can act on receiving some interesting message
    * from Stream Deck.
    */

    doSomeThing: function(inJsonData, caller, tagColor) {
      console.log('%c%s', `color: white; background: ${tagColor || 'grey'}; font-size: 15px;`, `[app.js]doSomeThing from: ${caller}`);
      // console.log(inJsonData);
    },


  };
