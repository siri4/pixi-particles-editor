!function(a){var b=function(b){if(window.$===a)throw"jQuery must be included to use cloudkid.UpdateChecker";b=b||2;var c=localStorage.getItem("lastUpdateCheck")||0;if(!(Date.now()-c<=1e3*b*3600)){this.repository=null,this.currentTag=null,this._destroyed=!1;var d="package.json",e=this;$.getJSON(d,function(a){if(!e._destroyed&&a.repository&&-1!==a.repository.url.search(/github\.com/)){e.currentTag=a.version,e.repository=a.repository.url;var b=a.repository.url.replace("http:","https:").replace("github.com","api.github.com/repos")+"/tags";$.getJSON(b,e.onTagsLoaded)}}),this.onTagsLoaded=this.onTagsLoaded.bind(this)}},c=b.prototype;c.onTagsLoaded=function(a){if(!this._destroyed&&(localStorage.setItem("lastUpdateCheck",Date.now()),a&&Array.isArray(a)&&0!==a.length)){var b,c,d=require("semver"),e=a.length;for(b=0;e>b;b++)if(c=a[b],d.valid(c.name)&&d.gt(c.name,this.currentTag)){if(confirm("An update is available. Download now?")){window.open(this.repository+"/releases/latest")}return}}},c.destroy=function(){this._destroyed=!0},namespace("cloudkid").UpdateChecker=b}(),function(a){var b,c=function(){if(b=this,window.$===a)throw"jQuery must be included to use cloudkid.Browser";this.file=$('<input type="file" />').css("visibility","hidden").change(function(){var a=$(this);a.removeAttr("accept");var c=a.val(),d=b._fileCallback;b._fileCallback=null,a.val(""),d(c)}),this.saveAs=$('<input type="file" nwsaveas />').css("visibility","hidden").change(function(){var a=$(this);a.attr("nwsaveas","");var c=a.val(),d=b._fileCallback;b._fileCallback=null,a.val(""),d(c)});var c="webkitdirectory";this.folder=$('<input type="file" '+c+" />").css("visibility","hidden").change(function(){var a=$(this),c=a.val(),d=b._folderCallback;b._folderCallback=null,a.val(""),d(c)}),$("body").append(this.file,this.folder,this.saveAs),this._fileCallback=null,this._folderCallback=null},d=c.prototype={};c.init=function(){if(b)throw"Only once instance file created at once";return new c},Object.defineProperty(c,"instance",{get:function(){return b}}),c.folder=function(a,c){if(!b)throw"Call cloudkid.Browser.init() first";b.folder.removeAttr("nwworkingdir"),b._folderCallback=a,b.folder.trigger("click")},c.file=function(a,c,d){if(!b)throw"Call cloudkid.Browser.init() first";b.file.removeAttr("accept"),c&&b.file.attr("accept",c),b._fileCallback=a,b.file.trigger("click")},c.saveAs=function(a,c,d){if(!b)throw"Call cloudkid.Browser.init() first";b.saveAs.attr("nwsaveas",c||""),b._fileCallback=a,b.saveAs.trigger("click")},c.destroy=function(){b&&b.destroy()},d.destroy=function(){this.file.off("change").remove(),this.folder.off("change").remove(),this.saveAs.off("change").remove(),this.file=null,this.folder=null,this.saveAs=null,b=null},namespace("cloudkid").Browser=c}(),function(a){a.cloudkid=a.cloudkid||{};var b=function(b){this.updater=null,this.browser=null,this.gui=null,this.main=null;a.onerror=this._handleErrors.bind(this)},c=b.prototype;c._handleErrors=function(a){alert(a)},c._onClose=function(){var a=this.main,b=this.gui;localStorage.setItem("windowSettings",JSON.stringify({width:a.width,height:a.height,x:a.x,y:a.y})),a.hide(),this.browser&&(this.browser.destroy(),this.browser=null),this.updater&&(this.updater.destroy(),this.updater=null),this.close(),b.App.closeAllWindows(),b.App.quit()},c.close=function(){},namespace("cloudkid").NodeWebkitApp=b}(window),function($){var EventDispatcher=include("cloudkid.EventDispatcher"),EditorInterface=function(a){EventDispatcher.call(this),this.spawnTypes=a;for(var b=["alphaStart","alphaEnd","scaleStart","scaleEnd","minimumScaleMultiplier","colorStart","colorEnd","speedStart","speedEnd","accelX","accelY","startRotationMin","startRotationMax","rotationSpeedMin","rotationSpeedMax","lifeMin","lifeMax","blendMode","customEase","emitFrequency","emitLifetime","emitMaxParticles","emitSpawnPosX","emitSpawnPosY","emitAddAtBack","emitSpawnType","emitRectX","emitRectY","emitRectW","emitRectH","emitCircleX","emitCircleY","emitCircleR","emitParticlesPerWave","emitParticleSpacing","emitAngleStart","defaultConfigSelector","defaultImageSelector","configUpload","configPaste","imageUpload","imageDialog","imageList","refresh","loadConfig","downloadConfig","configDialog","addImage","stageColor","content","renderer"],c=0;c<b.length;c++)this[b[c]]=$("#"+b[c]);this.downloadConfig.click(this.download.bind(this)),this.init()},p=EditorInterface.prototype=Object.create(EventDispatcher.prototype);p.changed=function(){this.trigger("change")},p.init=function(){var a=this,b=(cloudkid.Application.instance,this.changed.bind(this));this.refresh.button({icons:{primary:"ui-icon-arrowrefresh-1-s"}}),this.loadConfig.button({icons:{primary:"ui-icon-folder-open"}}),this.downloadConfig.button({icons:{primary:"ui-icon-arrowthickstop-1-s"}}),$(".unitSlider").slider({animate:"fast",min:0,max:1,step:.01}).on("slidechange slidestop",b);var c=$(".slider");c.on("slide slidechange",function(a,b){$(this).children("input").val(b.value)}).on("slidechange slidestop",b),$(".slider input").change(function(){$(this).parent().slider("value",$(this).val().replace(/[^0-9.]+/,"")),b()}),$(".positiveSpinner").spinner({min:0,numberFormat:"n",step:.01}).on("spinchange spinstop",b),$(".frequencySpinner").spinner({min:0,numberFormat:"n",step:.001}).on("spinchange spinstop",b),$(".generalSpinner").spinner({numberFormat:"n",step:.1}).on("spinchange spinstop",b),$(".posIntSpinner").spinner({min:1,step:1}).on("spinchange spinstop",b),$(".colorPicker").colorpicker({parts:["header","map","bar","hsv","rgb","hex","preview","footer"],showOn:"both",buttonColorize:!0,okOnEnter:!0,revert:!0,mode:"h",buttonImage:"assets/js/colorpicker/images/ui-colorpicker.png",select:b}),this.renderer.buttonset().find("input").change(function(){a.trigger("renderer",this.value),b()}),this.blendMode.selectmenu().on("selectmenuchange",b),this.customEase.on("input",b),this.addImage.button().click(function(b){a.defaultImageSelector.find("option:contains('-Default Images-')").prop("selected",!0),a.defaultImageSelector.selectmenu("refresh"),a.imageUpload.wrap("<form>").parent("form").trigger("reset"),a.imageUpload.unwrap(),a.imageDialog.dialog("open"),b.preventDefault()}),this.imageDialog.dialog({autoOpen:!1,width:400,buttons:[{text:"Cancel",click:function(){$(this).dialog("close")}}]}),this.defaultImageSelector.selectmenu(),this.loadConfig.click(function(b){a.defaultConfigSelector.find("option:contains('-Default Emitters-')").prop("selected",!0),a.defaultConfigSelector.selectmenu("refresh"),a.configUpload.wrap("<form>").parent("form").trigger("reset"),a.configUpload.unwrap(),a.configPaste.val(""),a.configDialog.dialog("open"),b.preventDefault()}),this.configDialog.dialog({autoOpen:!1,width:400,buttons:[{text:"Cancel",click:function(){$(this).dialog("close")}}]}),this.defaultConfigSelector.selectmenu();var d=this.spawnTypes;this.emitSpawnType.selectmenu({select:function(){for(var b=a.emitSpawnType.val(),c=0;c<d.length;++c)d[c]==b?$(".settings-"+d[c]).show():$(".settings-"+d[c]).hide()}}).on("selectmenuchange",b),this.stageColor.colorpicker({select:function(b,c){a.trigger("stageColor",c.formatted)}})},p.set=function(a){this.alphaStart.slider("value",a.alpha?a.alpha.start:1),this.alphaEnd.slider("value",a.alpha?a.alpha.end:1),this.scaleStart.spinner("value",a.scale?a.scale.start:1),this.scaleEnd.spinner("value",a.scale?a.scale.end:1),this.minimumScaleMultiplier.spinner("value",a.scale?a.scale.minimumScaleMultiplier||1:1),this.colorStart.colorpicker("setColor",a.color?a.color.start:"FFFFFF"),this.colorEnd.colorpicker("setColor",a.color?a.color.end:"FFFFFF"),this.speedStart.spinner("value",a.speed?a.speed.start:0),this.speedEnd.spinner("value",a.speed?a.speed.end:0),this.accelX.spinner("value",a.acceleration?a.acceleration.x:0),this.accelY.spinner("value",a.acceleration?a.acceleration.y:0),this.startRotationMin.spinner("value",a.startRotation?a.startRotation.min:0),this.startRotationMax.spinner("value",a.startRotation?a.startRotation.max:0),this.rotationSpeedMin.spinner("value",a.rotationSpeed?a.rotationSpeed.min:0),this.rotationSpeedMax.spinner("value",a.rotationSpeed?a.rotationSpeed.max:0),this.lifeMin.spinner("value",a.lifetime?a.lifetime.min:1),this.lifeMax.spinner("value",a.lifetime?a.lifetime.max:1),this.customEase.val(a.ease?JSON.stringify(a.ease):"");var b;if(a.blendMode&&cloudkid.ParticleUtils.getBlendMode(a.blendMode))for(b=a.blendMode.toLowerCase();b.indexOf(" ")>=0;)b=b.replace("_");else b="normal";this.blendMode.find("option[value='"+b+"']").prop("selected",!0),this.blendMode.selectmenu("refresh"),this.emitFrequency.spinner("value",parseFloat(a.frequency)>0?parseFloat(a.frequency):.5),this.emitLifetime.spinner("value",a.emitterLifetime||-1),this.emitMaxParticles.spinner("value",a.maxParticles||1e3),this.emitSpawnPosX.spinner("value",a.pos?a.pos.x:0),this.emitSpawnPosY.spinner("value",a.pos?a.pos.y:0),this.emitAddAtBack.prop("checked",!!a.addAtBack);var c=a.spawnType,d=this.spawnTypes;-1==d.indexOf(c)&&(c=d[0]),this.emitSpawnType.val(c),this.emitSpawnType.selectmenu("refresh");for(var e=0;e<d.length;++e)d[e]==c?$(".settings-"+d[e]).show():$(".settings-"+d[e]).hide();this.emitRectX.spinner("value",a.spawnRect?a.spawnRect.x:0),this.emitRectY.spinner("value",a.spawnRect?a.spawnRect.y:0),this.emitRectW.spinner("value",a.spawnRect?a.spawnRect.w:0),this.emitRectH.spinner("value",a.spawnRect?a.spawnRect.h:0),this.emitCircleX.spinner("value",a.spawnCircle?a.spawnCircle.x:0),this.emitCircleY.spinner("value",a.spawnCircle?a.spawnCircle.y:0),this.emitCircleR.spinner("value",a.spawnCircle?a.spawnCircle.r:0),this.emitParticlesPerWave.spinner("value",a.particlesPerWave>0?a.particlesPerWave:1),this.emitParticleSpacing.spinner("value",a.particleSpacing?a.particleSpacing:0),this.emitAngleStart.spinner("value",a.angleStart?a.angleStart:0)},p.get=function(){var output={},start=parseFloat(this.alphaStart.slider("value")),end=parseFloat(this.alphaEnd.slider("value"));output.alpha={start:start==start?start:1,end:end==end?end:1},output.scale={start:parseFloat(this.scaleStart.spinner("value"))||1,end:parseFloat(this.scaleEnd.spinner("value"))||1,minimumScaleMultiplier:parseFloat(this.minimumScaleMultiplier.spinner("value"))||1},output.color={start:this.colorStart.val()||"#ffffff",end:this.colorEnd.val()||"#ffffff"},output.speed={start:parseFloat(this.speedStart.spinner("value"))||0,end:parseFloat(this.speedEnd.spinner("value"))||0},output.acceleration={x:parseFloat(this.accelX.spinner("value")||0),y:parseFloat(this.accelY.spinner("value")||0)},output.startRotation={min:parseFloat(this.startRotationMin.spinner("value"))||0,max:parseFloat(this.startRotationMax.spinner("value"))||0},output.rotationSpeed={min:parseFloat(this.rotationSpeedMin.spinner("value"))||0,max:parseFloat(this.rotationSpeedMax.spinner("value"))||0},output.lifetime={min:parseFloat(this.lifeMin.spinner("value"))||1,max:parseFloat(this.lifeMax.spinner("value"))||1},output.blendMode=this.blendMode.val();var val=this.customEase.val();if(val)try{eval("val = "+val+";"),val&&val instanceof Array&&(output.ease=val)}catch(e){Debug.error("Error evaluating easing data: "+e.message)}var frequency=this.emitFrequency.spinner("value");output.frequency=parseFloat(frequency)>0?parseFloat(frequency):.5,output.emitterLifetime=parseFloat(this.emitLifetime.spinner("value"))||-1,output.maxParticles=parseInt(this.emitMaxParticles.spinner("value"))||1e3,output.pos={x:parseFloat(this.emitSpawnPosX.spinner("value")||0),y:parseFloat(this.emitSpawnPosY.spinner("value")||0)},output.addAtBack=this.emitAddAtBack.prop("checked");var spawnType=output.spawnType=this.emitSpawnType.val();return"rect"==spawnType?output.spawnRect={x:parseFloat(this.emitRectX.spinner("value"))||0,y:parseFloat(this.emitRectY.spinner("value"))||0,w:parseFloat(this.emitRectW.spinner("value"))||0,h:parseFloat(this.emitRectH.spinner("value"))||0}:"circle"==spawnType?output.spawnCircle={x:parseFloat(this.emitCircleX.spinner("value"))||0,y:parseFloat(this.emitCircleY.spinner("value"))||0,r:parseFloat(this.emitCircleR.spinner("value"))||0}:"burst"==spawnType&&(output.particlesPerWave=parseInt(this.emitParticlesPerWave.spinner("value"))||1,output.particleSpacing=parseFloat(this.emitParticleSpacing.spinner("value"))||0,output.angleStart=parseFloat(this.emitAngleStart.spinner("value"))||0),output},p.download=function(){var a=JSON.stringify(this.get(),null,"	"),b="data:application/json;charset=utf-8",c=!1;try{c=!!new Blob}catch(d){}c?window.saveAs(new Blob([a],{type:b}),"emitter.json"):window.open(encodeURI(b+","+a))},namespace("pixiparticles").EditorInterface=EditorInterface}(jQuery),function(){var Texture=include("PIXI.Texture"),Sprite=include("PIXI.Sprite"),Point=include("PIXI.Point"),Graphics=include("PIXI.Graphics"),PixiTask=include("cloudkid.PixiTask"),LoadTask=include("cloudkid.LoadTask"),PixiDisplay=include("cloudkid.PixiDisplay"),TaskManager=include("cloudkid.TaskManager"),Emitter=include("cloudkid.Emitter"),Application=include("cloudkid.Application"),Loader=include("cloudkid.Loader"),SavedData=include("cloudkid.SavedData"),EditorInterface=include("pixiparticles.EditorInterface"),Editor=function(a){Application.call(this,a)},p=Editor.prototype=Object.create(Application.prototype),stage,backgroundSprite,emitter,emitterContainer,emitterEnableTimer=0,particleDefaults={},particleDefaultImages={},particleDefaultImageUrls={},jqImageDiv=null,particleCountDiv=null;p.init=function(){this.onMouseIn=this.onMouseIn.bind(this),this.onMouseOut=this.onMouseOut.bind(this),this.onMouseMove=this.onMouseMove.bind(this),this.onMouseUp=this.onMouseUp.bind(this),this.onTexturesLoaded=this.onTexturesLoaded.bind(this),this.loadFromUI=this.loadFromUI.bind(this),jqImageDiv=$(".particleImage"),jqImageDiv.remove(),particleCountDiv=document.getElementById("particleCount");var a=parseInt(SavedData.read("stageColor")||"999999",16);backgroundSprite=new PIXI.Sprite(PIXI.Texture.fromImage("assets/images/bg.png")),backgroundSprite.tint=a,emitterContainer=new PIXI.DisplayObjectContainer;var b={clearView:!0,backgroundColor:a};this.webgl=this.addDisplay("webgl",PixiDisplay,b),this.webgl.isWebGL?(b.forceContext="canvas2d",this.canvas2d=this.addDisplay("canvas2d",PixiDisplay,b)):(this.canvas2d=this.webgl,this.webgl=null,document.getElementById("webglRenderer").disabled=!0,document.getElementById("canvas2dRenderer").checked=!0),this.setRenderer(this.webgl?"webgl":"canvas2d"),Loader.instance.load("assets/config/config.json",this.onInitialized.bind(this)),backgroundSprite.scale.x=this.canvas2d.width,backgroundSprite.scale.y=this.canvas2d.height,this.on("resize",this.onResize)},p.onResize=function(a,b){backgroundSprite.scale.x=a,backgroundSprite.scale.y=b},p.onInitialized=function(a){$("body").removeClass("loading"),this.config=a.content,this.ui=new EditorInterface(this.config.spawnTypes),this.ui.refresh.click(this.loadFromUI),this.ui.defaultImageSelector.on("selectmenuselect",this.loadImage.bind(this,"select")),this.ui.imageUpload.change(this.loadImage.bind(this,"upload")),this.ui.defaultConfigSelector.on("selectmenuselect",this.loadConfig.bind(this,"default")),this.ui.configUpload.change(this.loadConfig.bind(this,"upload")),this.ui.configPaste.on("paste",this.loadConfig.bind(this,"paste")),this.ui.stageColor.colorpicker("setColor",SavedData.read("stageColor")||"999999"),this.ui.on({change:this.loadFromUI,renderer:this.setRenderer.bind(this),stageColor:this.stageColor.bind(this)});for(var b,c=[],d=[],e=0;e<this.config.emitters.length;e++)b=this.config.emitters[e],c.push(new LoadTask(b.id,b.config,this.onConfigLoaded));for(var f in this.config.images)d.push(this.config.images[f]);var g;try{g=SavedData.read("customImages")}catch(h){}if(g)for(e=0;e<g.length;e++)-1==d.indexOf(g[e])&&d.push(g[e]);c.push(new PixiTask("particle",d,this.onTexturesLoaded)),TaskManager.process(c,this._onCompletedLoad.bind(this))},p.onConfigLoaded=function(a,b){particleDefaults[b.id]=a.content},p.onTexturesLoaded=function(){for(var a,b,c,d=this.config.images,e=0;e<this.config.emitters.length;e++){a=this.config.emitters[e],c=a.id,particleDefaultImageUrls[c]=[],particleDefaultImages[c]=[];for(var f=0;f<a.images.length;f++)b=a.images[f],particleDefaultImageUrls[c].push(d[b]),particleDefaultImages[c].push(Texture.fromImage(b))}},p._onCompletedLoad=function(){emitter=new Emitter(emitterContainer);var a,b,c=window.location.hash.replace("#","");try{a=SavedData.read("customConfig"),b=SavedData.read("customImages")}catch(d){}if(c)this.loadDefault(c);else if(a&&b){this.loadSettings(getTexturesFromUrls(b),a),this.setConfig(a);for(var e=0;e<b.length;++e)this.addImage(b[e])}else this.loadDefault(this.config.default);this.on({resize:this._centerEmitter.bind(this),update:this.update.bind(this)})},p.stageColor=function(a){SavedData.write("stageColor",a),backgroundSprite.tint=parseInt(a,16)},p.setRenderer=function(a){if("webgl"!=a||this.webgl){var b="webgl"==a?this.canvas2d:this.webgl;b&&(b.enabled=b.visible=!1);var c=this[a];stage&&(stage.mousemove=null),stage=c.stage,stage.interactionManager.stageIn=this.onMouseIn,stage.interactionManager.stageOut=this.onMouseOut,stage.mouseup=this.onMouseUp,c.enabled=c.visible=!0,backgroundSprite&&stage.addChild(backgroundSprite),emitterContainer&&stage.addChild(emitterContainer)}},p.loadDefault=function(a){a&&particleDefaultImageUrls[a]||(a=trail),window.location.hash="#"+a,this.ui.imageList.children().remove();var b=particleDefaultImageUrls[a];SavedData.write("customImages",b);for(var c=0;c<b.length;++c)this.addImage(b[c]);this.loadSettings(particleDefaultImages[a],particleDefaults[a]),this.setConfig(particleDefaults[a])},p.setConfig=function(a){this.ui.off("change"),this.ui.set(a),this.ui.on("change",this.loadFromUI)};var getTexturesFromUrls=function(a){for(var b=[],c=0;c<a.length;++c)b[c]=Texture.fromImage(a[c]);return b};p.loadConfig=function(type,event){var ui=this.ui;if("default"==type){var value=ui.defaultConfigSelector.val();if("-Default Emitters-"==value)return;this.loadDefault(value),ui.configDialog.dialog("close")}else if("paste"==type){var elem=ui.configPaste;setTimeout(function(){try{eval("var obj = "+elem.val()+";"),this.setConfig(obj),this.loadFromUI()}catch(e){}ui.configDialog.dialog("close")}.bind(this),10)}else if("upload"==type){for(var files=event.originalEvent.target.files,scope=this,onloadend=function(readerObj){try{eval("var obj = "+readerObj.result+";"),scope.setConfig(obj),scope.loadFromUI()}catch(e){}},i=0;i<files.length;i++){var file=files[i],reader=new FileReader;reader.onloadend=onloadend.bind(this,reader),reader.readAsText(file)}ui.configDialog.dialog("close")}},p.loadImage=function(a,b){if("select"==a){var c=this.ui.defaultImageSelector.val();if("-Default Images-"==c)return;this.addImage(c),this.loadFromUI()}else if("upload"==a)for(var d=b.originalEvent.target.files,e=function(a){this.addImage(a.result),this.loadFromUI()},f=0;f<d.length;f++){var g=d[f],h=new FileReader;h.onloadend=e.bind(this,h),h.readAsDataURL(g)}this.ui.imageDialog.dialog("close")},p.addImage=function(a){PIXI.Texture.fromFrame(a,!0)||TaskManager.process([new PixiTask("image",[a],this.onTexturesLoaded)],function(){});var b=jqImageDiv.clone();b.children("img").prop("src",a),this.ui.imageList.append(b),b.children(".remove").button({icons:{primary:"ui-icon-close"},text:!1}).click(removeImage.bind(this)),b.children(".download").button({icons:{primary:"ui-icon-arrowthickstop-1-s"},text:!1}).click(downloadImage)};var downloadImage=function(a){var b=$(a.delegateTarget).siblings("img").prop("src");window.open(b)},removeImage=function(a){$(a.delegateTarget).parent().remove(),this.loadFromUI()};p.loadFromUI=function(){window.location.hash="";var a=this.ui.get(),b=this.getTexturesFromImageList();SavedData.write("customConfig",a),this.loadSettings(b,a)},p.getTexturesFromImageList=function(){var a=[],b=this.ui.imageList.find("img");if(0===b.length)return null;return b.each(function(){a.push(this.src)}),SavedData.write("customImages",a),getTexturesFromUrls(a)},p.loadSettings=function(a,b){emitter&&(emitter.init(a,b),this._centerEmitter(),emitterEnableTimer=0)},p.update=function(a){emitter&&(emitter.update(.001*a),!emitter.emit&&0>=emitterEnableTimer?emitterEnableTimer=1e3+1e3*emitter.maxLifetime:emitterEnableTimer>0&&(emitterEnableTimer-=a,0>=emitterEnableTimer&&(emitter.emit=!0)),particleCountDiv.innerHTML=emitter._activeParticles.length+" Particles")},p.onMouseUp=function(){emitter&&(emitter.resetPositionTracking(),emitter.emit=!0,emitterEnableTimer=0)},p.onMouseIn=function(){emitter&&(stage.mousemove=this.onMouseMove,emitter.resetPositionTracking())},p._centerEmitter=function(){emitter&&emitter.ownerPos&&emitter.updateOwnerPos(this.display.canvas.width/2,this.display.canvas.height/2)},p.onMouseOut=function(){emitter&&(stage.mousemove=null,this._centerEmitter(),emitter.resetPositionTracking())},p.onMouseMove=function(a){emitter&&emitter.updateOwnerPos(a.global.x,a.global.y)},namespace("pixiparticles").Editor=Editor}(),function(){{var a=cloudkid.NodeWebkitApp,b=pixiparticles.Editor,c=(pixiparticles.Menu,function(c){a.apply(this),this.editor=new b(c),!function(a,b,c,d,e,f,g){a.GoogleAnalyticsObject=e,a[e]=a[e]||function(){(a[e].q=a[e].q||[]).push(arguments)},a[e].l=1*new Date,f=b.createElement(c),g=b.getElementsByTagName(c)[0],f.async=1,f.src=d,g.parentNode.insertBefore(f,g)}(window,document,"script","//www.google-analytics.com/analytics.js","ga"),ga("create","UA-54925270-1","auto"),ga("send","pageview")});c.prototype=Object.create(a.prototype)}namespace("pixiparticles").App=c}(),function(){window.app=new pixiparticles.App({framerate:"framerate",fps:60,raf:!0,debug:!1,resizeElement:"content",uniformResize:!1})}();