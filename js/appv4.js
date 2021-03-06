/*
 * 	Player InstantPlaces
 * 	MEI 12/13 - Universidade do Minho
 */

/*******************************************************************************************************************
 ************************************************** REGION *********************************************************
 *******************************************************************************************************************/

var Region = function(options) {
	
	console.log('A gerar o objecto Region...')
	
	this.scheduleType = localStorage.playerScheduleType;
	//init
	// dimensions
	
	this.region_id = null;
	this.region_name = null;
	
	this.left = null;
	this.top = null;
	this.width = null;
	this.height = null;
	this.minWidth = null;
	this.minHeight = null;
	
	this.scheduleItem = null;
	this.limitCycle = null;
	this.selector = null;
	
	this.el = null;
	
	/*
	$(this.el).css({
		top: (this.top*100)+'%',
		left : (this.left*100)+'%',
		width : (this.width*100)+'%',
		height: (this.height*100)+'%',
		position: 'absolute'
	});*/
	
	//this.stylecss = "";
	
	
	this.containerList = new Array();
	
	this.currentApp = null;
	this.isPaused = false;
	this.started = false;
	
	this.currentCycle = 0;
	this.cycleExpired = false;
	this.overallExpired = false;
	
	//this.addList(options.containerList);
	
	this.checkScheduleType(options);
	
};

Region.prototype.showContent = function() {
	
	if(this.containerList) {
		for(var i=0; i<this.containerList.length; i++) {
			var cl = this.containerList[i];
			//var teste = JSON.stringify(cm.getAppSrc(cl.cid));
			//console.log('----------------- STILL WORKS? ---------------: ' + teste);
			//var teste2 = JSON.stringify(s);
			//console.log('-----------------TESTE---------------: ' + teste2);
			var src = cm.getAppSrc(cl.cid);
			//cm.getAppSrc(cl.cid);
			//var teste = s.getSchedule();
			//console.log('schedule: ' + teste)
			//var x = cm2.getAppSrc(cl.cid);
			console.log('showContent :: id: '+ cl.cid + ' | src: ' + src + ' | dur: ' + cl.dur)
		}
	}	
};

Region.prototype.addContent = function(elems) {
	
	elems = elems instanceof Array ? elems : [elems];
	
	console.log("adding content to the applications list...");
	// s.showApps(); AGORA EM CM
	//this.Schedule.prototype.showApps();
	//console.log("srcs: " + srcs);
		
	for (var i=0; i<elems.length; i++) {
		
		this.containerList.push(elems[i]);
		
		//console.log("containerLst cid: " + elems[i].cid + " dur: " + elems[i].dur);
		//console.log("estou no addlist, get src from this IDapp: " + elems[i].cid);
		//var src = sm2.getAppSrc(elems[i].cid);
		//console.log("ca estou, sou o: " + src);
		
	}
	
	this.showContent();
};

Region.prototype.resetCycle = function(){

	console.log('-- RESET CYCLE REGION --');
	console.log('reseting cycle of region: ' + this.region_id);
	$(this.el).empty();
	var self = this;
		
	self.currentCycle=0;
	self.cycleExpired = false;
	self.overallExpired = false;
	self.isPaused = false;
		
};

Region.prototype.insertApp = function(app) {
	
	// sandbox="allow-same-origin allow-scripts"
	console.log('-- INSERTING APP ' + app.cid + ' --')
	
	var src = cm.getAppSrc(app.cid);
	
	var el = $('<iframe sandbox="allow-same-origin allow-scripts" id="app" src="' + src + '" scrolling="no" />');
	//var el = $('<iframe id="app" src="' + src + '" scrolling="no" />');
	
	$(this.el).append(el);
	
	/*
	var self = this;
	
	
	app.chan = Channel.build({
		window : el[0].contentWindow,
		origin : "*",
		scope : "testScope",
		onReady : function() {
			console.log('ligacao feita');
		}
	});
	
	app.chan.bind("stop", function() {
  		console.log('application ' + app.src + ' executed stop');
  		self.pause();
	});
	
	app.chan.bind("delay", function(trans, t) {
  		console.log('application ' + app.src + ' with delay ' + t);
  		clearTimeout(self.currTimeout);
  		self.currTimeout = setTimeout(function () {
  			console.log('delay over');
			self.next();
		}, t);
	
	});
	
	app.chan.bind("video", function(trans, vdur) {
  		console.log('application ' + app.src + ' has a video');
  		clearTimeout(self.currTimeout);
  		self.currTimeout = setTimeout(function () {
  			console.log('video over');
			self.next();
		}, vdur * 1000);
	});
	*/
};

Region.prototype.updateCurrentApp = function() {
	if(this.currentApp==null) {
		//console.log('primeira vez!');
		this.currentApp = Math.abs((this.currentApp) % this.containerList.length);
	}
	else {
		//console.log('ja tenho numero');
		this.currentApp = Math.abs(((this.currentApp)+1) % this.containerList.length);
	}
};

Region.prototype.updateContentCycle = function() {
	if((this.currentApp+1) >= this.containerList.length) {
		this.currentCycle++;
	}
	if(this.currentCycle >= this.limitCycle && this.cycleExpired == false) {
		this.cycleExpired = true;
		this.overallExpired = cm.notify(this.region_id);
	}
};

Region.prototype.next = function() {
	
	console.log('-- PLAYING REGION --');
	clearTimeout(this.currTimeout);
	console.log('reset timeout');
	
	var elapp = $('#app');

	console.log('------------- next app ---------------');
	console.log('ELEMENTO REGION: ' + this.el);
	$(this.el).empty();
	
	//getNextApp
	console.log('previous app number: ' + this.currentApp + ' lenght lista: ' + this.containerList.length);
	console.log('region: ' + this.el + ' | limitCycle: ' + this.limitCycle + ' | currentCycle: ' + this.currentCycle);
	
	/*
	if(this.cycle>=1) {
		console.log('so posso iterar 1 vez!');
		p.notify();
		// qq coisa que notifique o player pai que esta regiao terminou o seu ciclo/s
	}
	*/
	
	/*
	if(this.currentApp==null) {
		//console.log('primeira vez!');
		this.currentApp = Math.abs((this.currentApp) % this.containerList.length);
	}
	else {
		//console.log('ja tenho numero');
		this.currentApp = Math.abs(((this.currentApp)+1) % this.containerList.length);
	}
	*/
	
	this.updateCurrentApp();
	
	/*
	if((this.currentApp+1) >= this.containerList.length) {
		this.currentCycle++;
	}
	
	if(this.currentCycle >= this.limitCycle && this.cycleExpired == false) {
		console.log('este e o meu ultimo ciclo')
		this.cycleExpired = cm.notify(this.region_id);
		console.log('o content management disse: ' + this.cycleExpired)
		//var layoutCycle = cm.notify(this.region_id);
	}*/
	this.updateContentCycle();
	
	//this.currentApp = ((Math.abs((this.currentApp) % this.containerList.length) + 1) % this.containerList.length);
	console.log('this is app number: ' + this.currentApp);
	var app = this.containerList[this.currentApp];
	this.insertApp(app);	
	
	if(!this.isPaused) {
		var self = this;
		console.log('timeout: '+ app.dur);
		this.currTimeout = setTimeout(function () {
			if(self.overallExpired == true) {
				console.log('ALL REGIONS FINISHED THEIR OWN CYCLES');
				//self.pause();
				cm.resetCycle();
				cm.next();
			}
			else {
				console.log('SOME REGIONS ARE NOT DONE');
				self.next();
			}
		},app.dur * 1000);
	}
	
};

Region.prototype.play = function() {
	console.log('-- STARTING REGION PLAY --');
	this.isPaused = false;
	this.next();	
};

Region.prototype.pause = function() {
	console.log('entered pause; paused at: ' + this.currentApp);
	this.isPaused = true;
	//console.log('curduration: '+this.curDuration);
	clearTimeout(this.currTimeout);
	//clearTimeout(this.curFadeout);
	
};


Region.prototype.checkScheduleType = function(options) {
	
	console.log('starting regions...')
	console.log('checking schedule type...')
	
	if(this.scheduleType == "IP Schedule") {
		this.region_id = options.region_id;
		this.region_name = options.region_name;
		
		this.left = options.left;
		this.top = options.top;
		this.width = options.width;
		this.height = options.height;
		this.minWidth = options.minWidth;
		this.minHeight = options.minHeight;
		
		this.scheduleItem = options.scheduleItem;
		this.limitCycle = options.limitCycle;
		this.selector = options.selector;
		
		this.el = '#'+options.region_id;
				
		$(this.el).css({
			top: (this.top*100)+'%',
			left : (this.left*100)+'%',
			width : (this.width*100)+'%',
			height: (this.height*100)+'%',
			position: 'absolute'
		});

		var lstContent = options.containerList;
		//console.log('o que vejo: ' + lstRegions)
		this.addContent(lstContent);
		
	}
	
}



/*******************************************************************************************************************
 ************************************************** LAYOUT *********************************************************
 *******************************************************************************************************************/

var Layout = function(options) {
	
	console.log('A gerar o objecto Layout...')
	
	this.scheduleType = localStorage.playerScheduleType;
	// ids
	this.layout_id = null;
	this.layout_name = null;
	this.layout_dur = null;
	
	this.el = null;
	
	this.left = null;
	this.top = null;
	this.width = null;
	this.height = null;
	/*
	$(this.el).css({
		top: (this.top*100)+'%',
		left : (this.left*100)+'%',
		width : (this.width*100)+'%',
		height: (this.height*100)+'%',
		display: 'none',
		position: 'absolute'
	});*/
		
	this.stylecss = ""; // nao sei para q serve
	
	this.layoutCycle=0;
	
	this.regions = new Array();
	
	this.checkScheduleType(options);
	
	// falta rever tdo aqui
};

Layout.prototype.showRegions = function() {
	
	if(this.regions) {
		for(var i=0; i<this.regions.length; i++) {
			var r = this.regions[i];
			console.log('showRegions of ' + this.layout_id)
			console.log('showRegions :: id: '+ r.region_id + ' | name: ' + r.region_name)
			console.log('showRegions :: left: ' + r.left + ' | top: ' + r.top + ' | width: ' + r.width + ' | height: ' + r.height + ' | minwidth: ' + r.minWidth + ' | minheight: ' + r.minHeight)
			console.log('showRegions :: type item: ' + r.scheduleItem + ' | selector: ' + r.selector)
			console.log('showRegions :: container list: ' + r.containerList)
		}
	}	
};

Layout.prototype.addRegions = function(lstRegions) {

	lstRegions = lstRegions instanceof Array ? lstRegions : [lstRegions];

	for (var i=0; i<lstRegions.length; i++) {

		$(this.el).append('<div id="'+lstRegions[i].region_id+'"></div>');
		var r = new Region(lstRegions[i]);
		
		console.log('completed region ' + i)
		//console.log('lstregion[i]: ' + JSON.stringify(lstRegions[i]))
		//console.log('isto e r = new region: ' + JSON.stringify(r))
		
		this.regions.push(r);
		
		//console.log("region id: " + lstRegions[i].region_id);
	}
	
	this.showRegions();

};

Layout.prototype.resetCycle = function(){

	console.log('-- RESET LAYOUT CYCLE --');
		
	//this.cycle=0;
	this.regions.forEach(function(region){
		region.pause();
		region.resetCycle();
	});
		
};

Layout.prototype.play = function(elLayout){
	
	console.log('-- STARTING LAYOUT PLAY --');
	console.log('el HTML layout: ' + elLayout);
	
	$(elLayout).show();
	console.log('-- Showing Layout ' + elLayout + ' --')
	
	this.regions.forEach(function(region){
		region.play();
	});
	
};

Layout.prototype.checkScheduleType = function(options) {
	
	console.log('starting layouts...')
	console.log('checking schedule type...')
	
	if(this.scheduleType == "IP Schedule") {
		this.layout_id = options.layout_id;
		this.layout_name = options.layout_name;
		this.layout_dur = options.layout_dur;
		this.el = '#'+options.layout_id;
		
		this.left = options.left || 0;
		this.top = options.top || 0;
		this.width = options.width || 1;
		this.height = options.height || 1;
		
		$(this.el).css({
			top: (this.top*100)+'%',
			left : (this.left*100)+'%',
			width : (this.width*100)+'%',
			height: (this.height*100)+'%',
			display: 'none',
			position: 'absolute'
		});

		var lstRegions = options.regions;
		//console.log('o que vejo: ' + lstRegions)
		this.addRegions(lstRegions);

	}
	
}



/*******************************************************************************************************************
 ****************************************** CONTENT MANAGEMENT *****************************************************
 *******************************************************************************************************************/

var ContentManagement = function(options){
	console.log('A gerar o objecto Content Management...')
	
	//this.currentSchedule = this.getSchedule();
	//this.scheduleType = localStorage.playerScheduleType;
	
	this.currentSchedule = null;
	this.scheduleType = null;
	
	this.el = options.el;
	
	this.left = 0;
	this.top = 0;
	this.width = 1;
	this.height = 1;
	
	$(this.el).css({
		top: (this.top*100)+'%',
		left : (this.left*100)+'%',
		width : (this.width*100)+'%',
		height: (this.height*100)+'%'
	});
	
	this.isPaused = false;
	this.currentLayout = null;
	this.previousLayout = null;
	
	this.apps = new Array();
	this.layouts = new Array();
		
	//this.checkScheduleType();
	
	// falta o resto layouts, regions e afins
	
};

ContentManagement.prototype.getSchedule = function() {
	
	var Sschedule = localStorage.getItem('playerSchedule');
	//console.log('ainda sou uma string: ' + Sschedule);
	
	var Oschedule = JSON.parse(Sschedule);
	//console.log('obj maybe? ' + Oschedule)
	//console.log('cenas: ' + Oschedule.schedule.applications)
	
	return Oschedule;
	
};

ContentManagement.prototype.getAppSrc = function(appid) {
	//console.log('entrei com o valor: ' + appid)
	if(this.apps) {
		//console.log('tenho cenas na lista')
		for(var i=0; i<this.apps.length; i++) {
			if(this.apps[i].id == appid) {
				//console.log('iguais') 
				return this.apps[i].src;
			}
		}
	}
	return null;
};

ContentManagement.prototype.showApps = function() {
	
	if(this.apps) {
		for(var i=0; i<this.apps.length; i++) {
			var a = this.apps[i];
			console.log('showApps :: id: '+ a.id + ' | type: ' + a.type + ' | src: ' + a.src)
		}
	}
};

ContentManagement.prototype.addApps = function(lstApps) {

	lstApps = lstApps instanceof Array ? lstApps : [lstApps];

	for (var i=0; i<lstApps.length; i++) {
		//console.log("app id: "+ lstApps[i].id + " Type app: " + lstApps[i].type + " App src: " + lstApps[i].src);
		this.apps.push(lstApps[i]);
		//console.log("this.app id: "+ this.apps[i].id);
	}	
	this.showApps();
};

ContentManagement.prototype.showLayouts = function() {
	
	if(this.layouts) {
		for(var i=0; i<this.layouts.length; i++) {
			var lx = this.layouts[i];
			console.log('showLayouts :: id: '+ lx.layout_id + ' | name: ' + lx.layout_name + ' | dur: ' + lx.layout_dur)
			console.log('showLayouts :: regions: ' + lx.regions)
		}
	}
};

ContentManagement.prototype.addLayouts = function(lstLayouts) {
	
	lstLayouts = lstLayouts instanceof Array ? lstLayouts : [lstLayouts];

	for (var i=0; i<lstLayouts.length; i++) {

		$(this.el).append('<div id="'+lstLayouts[i].layout_id+'"></div>');
		console.log('starting layout ' + i + '...')
		var l = new Layout(lstLayouts[i]);
		//console.log('isto e a listlayout[i]: ' + lstLayouts[i])
		//console.log('isto e l = new layout bla bla: ' + l)
		//console.log('isto e a listlayout[i] STR: ' + JSON.stringify(lstLayouts[i]))
		//console.log('isto e l = new layout bla bla: ' + JSON.stringify(l))
		/*
		if(JSON.stringify(lstLayouts[i]) == JSON.stringify(l)) {
			console.log('they are both equals, OI CARAMBA!')
		}
		else { console.log('NOT!') }
		*/
		
		this.layouts.push(l); // insere a lista de layouts do normalContent
		
		//console.log("layout id: "+ lstLayouts[i].layout_id + " layout name: " + lstLayouts[i].layout_name + " layout dur: " + lstLayouts[i].dur + " layout regions: " + lstLayouts[i].regions);
	}
	
	this.showLayouts();
	
};

ContentManagement.prototype.startScheduleType_IPSchedule = function(lstLayouts) {
	
	lstLayouts = lstLayouts instanceof Array ? lstLayouts : [lstLayouts];

	for (var i=0; i<lstLayouts.length; i++) {

		$(this.el).append('<div id="'+lstLayouts[i].layout_id+'"></div>');
		var l = new Layout(lstLayouts[i]);
		this.layouts.push(l); // insere a lista de layouts do normalContent
		
		console.log("layout id: "+ lstLayouts[i].layout_id + " layout name: " + lstLayouts[i].layout_name + " layout dur: " + lstLayouts[i].dur + " layout regions: " + lstLayouts[i].regions);
	}
	
	this.play();
	
};

ContentManagement.prototype.next = function(){
	/*
	this.layouts.forEach(function(layout){
		layout.play();
	});
	*/

	console.log('-- NEXT CONTENT --');
	//$(this.el).empty();
	
	if(this.currentLayout==null) {
		console.log('FIRST TIME CONTENT');
		this.currentLayout = Math.abs((this.currentLayout) % this.layouts.length);
		//this.cycle=0;
	}
	else {
		var previousLayout = this.currentLayout;
		var pLayout = this.layouts[previousLayout];
		var elPrevLayout = '#'+pLayout.layout_id;
		
		console.log('PREV LAYOUT: ' + previousLayout + ' Element: ' + elPrevLayout);
		
		$(elPrevLayout).hide(500);
		
		console.log('---------- NEW LAYOUT -----------');
		this.currentLayout = Math.abs(((this.currentLayout)+1) % this.layouts.length);
		/*
		if((this.currentApp+1) >= this.containerList.length) {
			this.cycle++;
		}
		*/
	}
	
	//$(elLayout).show();
	//getNextApp
	//this.currentLayout = Math.abs((this.currentLayout + 1) % this.normalContent.length);
	console.log('Layout number: ' + this.currentLayout + ' Layout list: ' + this.layouts.length);
	var layout = this.layouts[this.currentLayout];
	var elLayout = '#'+layout.layout_id;
	console.log("layout id: " + layout.layout_id + " | el HTML: " + elLayout);
	
	layout.play(elLayout); // vai ao l correspondente dessa lista e faz play()
	
	/*	
	if(!this.isPaused) {
		var self = this;
		console.log('timeout: '+ app.dur);
		this.currTimeout = setTimeout(function () {
			self.next();
		},app.dur * 1000);
	}
	*/
};

ContentManagement.prototype.play = function(){
	/*
	this.layouts.forEach(function(layout){
		layout.play();
	});
	*/	
	console.log('-- STARTING PLAYING --');
	this.isPaused = false;
	this.next();	
};

ContentManagement.prototype.checkScheduleType = function() {
	
	console.log('starting content management...')
	
	this.currentSchedule = this.getSchedule();
	this.scheduleType = localStorage.playerScheduleType;
	
	console.log('checking schedule type...')
	
	if(this.scheduleType == "IP Schedule") {
		//var schedule_typeIP_apps = this.tempSchedule.schedule.applications;
		var lstApps = this.currentSchedule.schedule.applications;
		var lstLayouts = this.currentSchedule.schedule.normalContent;
		console.log('generated apps: ' + lstApps)
		console.log('generated layouts: ' + lstLayouts)
		this.addApps(lstApps);
		this.addLayouts(lstLayouts);
	}
	
	this.play();
	
}

ContentManagement.prototype.resetCycle = function(){
	/*
	this.layouts.forEach(function(layout){
		layout.play();
	});
	*/
	console.log('-- RESET CONTENT CYCLE --');
	
	var layout = this.layouts[this.currentLayout];
	var elLayout = '#'+layout.layout_id;
	//console.log("var layout: " + layout.layout_id + "el layout: " + elLayout);
	
	layout.resetCycle();
	
	//this.isPaused = false;
	//this.next();
	
};

ContentManagement.prototype.checkLayoutCycle = function(){
	
	var layout = this.layouts[this.currentLayout];
	var regions = 0;
	
	for (var i=0; i<layout.regions.length; i++) {
		
		if(layout.regions[i].cycle==1) {
			regions++;
		}
	}
	
	
	if(regions>=layout.regions.length) {
		return true;
	}
	else {
		return false;
	}
	
};

ContentManagement.prototype.notify = function(regionid) {
	/*
	this.layouts.forEach(function(layout){
		layout.play();
	});
	*/
	
	regionid = regionid instanceof Array ? regionid : [regionid];
	
	console.log('-- NOTIFIED FROM: ' + regionid + ' THAT HIS CYCLE ENDED --');
	
	var layout = this.layouts[this.currentLayout];
	
	var regions = 0;
	
	for (var i=0; i<layout.regions.length; i++) {
		
		if(layout.regions[i].currentCycle >= layout.regions[i].limitCycle) {
			regions++;
		}
		else { return false; }
		
	}
	
	if(regions>=layout.regions.length) {
		return true;
	}
	else {
		return false;
	}
	
	
	/*
	
	for (var i=0; i<layout.regions.length; i++) {

		//$(this.el).append('<div id="'+lstLayouts[i].layout_id+'"></div>');
		if(regionid == layout.regions[i].region_id) {
			console.log('MOSTRA-ME O NOTIFY:  ' + layout.regions[i].)
			//layout.regions[i].cycle=1;
		}
		
		
		//var l = new Layout(lstLayouts[i]);
		//this.layouts.push(l); // insere a lista de layouts do normalContent
		
		//console.log("layout id: "+ lstLayouts[i].layout_id + " layout name: " + lstLayouts[i].layout_name + " layout dur: " + lstLayouts[i].dur + " layout regions: " + lstLayouts[i].regions);
	}
	
	
	
	
	var cycleCompleted = this.checkLayoutCycle();
	*/
	
	//return cycleCompleted;

	
};


/*******************************************************************************************************************
 ************************************************ SCHEDULE *********************************************************
 *******************************************************************************************************************/

var Schedule = function(options){
	
	console.log('A gerar o objecto Schedule...')
	
	this.tempSchedule = null;
	this.currentSchedule = localStorage.getItem('playerSchedule');
	this.scheduleType = localStorage.playerScheduleType;
	this.id = null;
	this.name = null;
	this.lastUpdate = null;
	this.etag = null;
	
	//console.log('temp schedule: ' + this.tempSchedule)
	//console.log('temp schedule stringified: ' + JSON.stringify(this.tempSchedule))
	//console.log('current schedule: ' + this.currentSchedule)
		
	//this.checkSchedule();
	
	//console.log('dentro do schedule, id: ' +  JSON.stringify(this.tempSchedule))	
};

Schedule.prototype.getCurrentSchedule = function() {
	
	// para converter a string em LS para objecto
	
	var Sschedule = localStorage.getItem('playerSchedule');
	//console.log('ainda sou uma string: ' + Sschedule);
	
	var Oschedule = JSON.parse(Sschedule);
	//console.log('obj maybe? ' + Oschedule)
	//console.log('cenas: ' + Oschedule.schedule.applications)
	
	return Oschedule;
	
};

Schedule.prototype.setScheduleData = function() {
	
	var sdata = this.getCurrentSchedule();
	
	if (this.scheduleType == "IP Schedule") {
		this.id = sdata.schedule.id;
		this.name = sdata.schedule.name;
		this.lastUpdate = sdata.schedule.updatedOn;
		this.etag = sdata.schedule.etag;
	}	
}

Schedule.prototype.checkSchedule_TypeIP = function() {
	
	this.id = this.tempSchedule.schedule.id;
	this.name = this.tempSchedule.schedule.name;
	this.lastUpdate = this.tempSchedule.schedule.updatedOn;
	this.etag = this.tempSchedule.schedule.etag;
	
	if(this.id == null || this.name == null || this. lastUpdate == null || this.etag == null) {
		console.log('entrei no 1 campo');
		return false;
	}
	
	var schedule_typeIP_apps = this.tempSchedule.schedule.applications;
	//schedule_typeIP_apps = schedule_typeIP_apps instanceof Array ? schedule_typeIP_apps : [schedule_typeIP_apps];
		
	for (var i=0; i<schedule_typeIP_apps.length; i++) {
		console.log('exemplo: ' + schedule_typeIP_apps[i].id)
		if(schedule_typeIP_apps[i].id == null || schedule_typeIP_apps[i].type == null || schedule_typeIP_apps[i].src == null) {
			console.log('entrei nof asle apps')
			return false;
		}
	}
		
	var schedule_typeIP_nc = this.tempSchedule.schedule.normalContent;
	
	for (var i=0; i<schedule_typeIP_nc.length; i++) {
		//console.log('exemplo: ' + schedule_typeIP_apps[i].id)
		if(schedule_typeIP_nc[i].layout_id == null || schedule_typeIP_nc[i].layout_name == null || schedule_typeIP_nc[i].layout_dur == null || schedule_typeIP_nc[i].regions == null) {
			console.log('entrei nof asle')
			return false;
		}
		
		var schedule_typeIP_nc_region = schedule_typeIP_nc[i].regions;
		
		for (var j=0; i<schedule_typeIP_nc_region[j].length; j++) {
			if(schedule_typeIP_nc_region[j].region_id == null || schedule_typeIP_nc_region[j].region_name == null || schedule_typeIP_nc_region[j].left == null || schedule_typeIP_nc_region[j].top == null || schedule_typeIP_nc_region[j].width == null || schedule_typeIP_nc_region[j].height == null || schedule_typeIP_nc_region[j].minWidth == null || schedule_typeIP_nc_region[j].minHeight == null) {
				console.log('entrei nof asle 2')
				return false;
			}			
		}		
	}
	
	// incompleto, falta a lista de content
	
	return true;
	

}
// recebe o schedule; verifica tipo de schedule (validade, tipo); compara com localstorage e guarda se for diferente

Schedule.prototype.changeSchedule = function() {

	this.currentSchedule = this.tempSchedule; // currentSchedule passa a ser o valor Obj do temp
	
	var Sschedule = JSON.stringify(this.currentSchedule); // converte o objecto para string
	//console.log('string schedule a gravar: ' + Sschedule)
	localStorage.setItem('playerSchedule', Sschedule); // grava a string em localstorage
	
	this.scheduleType = "IP Schedule";
	localStorage.playerScheduleType = this.scheduleType;
}

Schedule.prototype.startContentManagement = function() {
	console.log('entrei')	
	cm = new ContentManagement({el:'#content'});
}

Schedule.prototype.checkSchedule = function(options, callback) {
	
	console.log('Starting Schedule...')
	
	this.tempSchedule = options;

	if(this.currentSchedule != JSON.stringify(this.tempSchedule)) {
		console.log('Different schedules...')
		console.log('Checking type')
		
		// verificar os varios tipos de schedule
		var typeIP = this.checkSchedule_TypeIP();
		
		console.log('tipo do schedule: ' +typeIP)
		
		// verifica o tipo q foi devolvido a true
		if(typeIP == true) {
			this.changeSchedule();
			console.log('schedule type: ' + this.scheduleType);			
		}	
	}
	else {
		console.log('Same schedules!')
		this.setScheduleData(); // se forem iguais
	}
	
	callback();
	//this.startContentManagement();	

}

// update ficheiro json e respectiva callback a efectuar depois de lido
/*
Schedule.prototype.update = function(callback){
	var self = this;
	$.getJSON(this.url,function(data){
		self.schedule = data.schedule;
		self.id = data.schedule.id;
		self.name = data.schedule.name;
		self.lastUpdate = data.schedule.updatedOn;
		self.etag = data.schedule.etag;
		
		self.apps = new Array();
		
		self.addApps(data.schedule.applications);
		
		if (callback && typeof(callback) === 'function')
			callback(data.schedule); 
  	});
};
*/

/*
Schedule.prototype.addApps = function(lstApps) {

	lstApps = lstApps instanceof Array ? lstApps : [lstApps];

	for (var i=0; i<lstApps.length; i++) {

		//console.log("app id: "+ lstApps[i].id + " Type app: " + lstApps[i].type + " App src: " + lstApps[i].src);
		this.apps.push(lstApps[i]);
		//console.log("this.app id: "+ this.apps[i].id);
	}
	
	this.showApps();

};

Schedule.prototype.showApps = function() {
	
	if(this.apps) {
		for(var i=0; i<this.apps.length; i++) {
			console.log("app id: "+ this.apps[i].id + " Type app: " + this.apps[i].type + " App src: " + this.apps[i].src)
		}
	}
};

Schedule.prototype.getAppSrc = function(appid) {
	if(this.apps) {
		for(var i=0; i<this.apps.length; i++) {
			if(this.apps[i].id == appid) { return this.apps[i].src; }
		}
	}
	return null;
};

//obtem todo o conteudo schedule
Schedule.prototype.getSchedule = function() {
	if(this.schedule) return this.schedule;
};

//devolve ao Player a lista de apps
Schedule.prototype.getApps = function() {
	if(self.apps) return self.apps;
};
*/

/*******************************************************************************************************************
 ************************************** SERVER COMMUNICATION *******************************************************
 *******************************************************************************************************************/

var ServerCommunication = function(options) {
	console.log('A gerar o objecto ServerCommunication...')
	this.url = options.url;
	this.playerUUID = localStorage.playerUUID;
	this.schedule = null;
};

ServerCommunication.prototype.auth = function(){
	console.log('arranca callback')
	if(this.playerUUID == localStorage.playerUUID) {
		console.log('UUID e valido!')
	}
};

ServerCommunication.prototype.update = function(callback){
	
	console.log('Starting ServerCommunication...')
	
	var self = this;
	
	$.getJSON(this.url,function(data){
		//self.schedule = data.schedule;
		self.schedule = data;
		
		if (callback && typeof(callback) === 'function')
			//callback(data.schedule);
			callback(data);
					
	});
	
	console.log('Finishing ServerCommunication...')	
	
};

ServerCommunication.prototype.getSchedule = function(){
	return this.schedule;
	// devolve o ficheiro descarregado
};

/*******************************************************************************************************************
 ********************************************* INFORMATION *********************************************************
 *******************************************************************************************************************/

var Information = function(options){
	
	console.log('A gerar o objecto Information...')
	// Player UUID
	this.playerUUID = localStorage.playerUUID;
	
	// Screen info
	this.screenWidth = localStorage.screenWidth;
	this.screenHeight = localStorage.screenHeight;
	
	// Browser info
	this.userAgent = localStorage.userAgent;
	this.browserName = localStorage.browserName;
	this.fullVersion = localStorage.browserFullVersion;
	this.majorVersion = localStorage.browserMajorVersion;
	
	// OS info
	this.OSName = localStorage.OSName;
	this.OSVersion = localStorage.OSVersion;
	
	this.validInfo = localStorage.playerValidInfo;
	
};

Information.prototype.resetPlayer = function() {
	console.log('-- RESETTING PLAYER INFO --')
	localStorage.clear();
	console.log('-- RESET COMPLETE --')
}
	
Information.prototype.checkPlayerUUID = function() {
	if(this.playerUUID == null) {
		localStorage.playerUUID = uuid.v1();
		this.playerUUID = localStorage.playerUUID;
		console.log('generated player uuid :: ' + this.playerUUID);
	}
}
	
Information.prototype.checkScreen = function() {
	if(this.screenWidth == null || this.screenHeight == null) {
		localStorage.screenWidth = 0 || screen.width;
		localStorage.screenHeight = 0 || screen.height;
		this.screenWidth = localStorage.screenWidth;
		this.screenHeight = localStorage.screenHeight;
		console.log('generated screen info :: width x height: ' + this.screenWidth + ' x ' + this.screenHeight);
	}
}

Information.prototype.checkUserAgent = function() {
	if(this.userAgent == null) {
		localStorage.userAgent = navigator.userAgent;
		this.userAgent = localStorage.userAgent;
		
		console.log('generated browser info :: user-agent: ' + this.userAgent)
	}
}


Information.prototype.checkBrowser = function() {
	if(this.userAgent != null) {
		if(this.browserName == null || this.fullVersion == null || this.majorVersion == null) {

			var nameOffset, verOffset, ix;
	
			// In Opera, the true version is after "Opera" or after "Version"
			if ((verOffset = this.userAgent.indexOf("Opera"))!=-1) {
		 		this.browserName = "Opera";
		 		this.fullVersion = this.userAgent.substring(verOffset+6);
		 		if ((verOffset = this.userAgent.indexOf("Version"))!=-1) 
		   			this.fullVersion = this.userAgent.substring(verOffset+8);
			}
			// In MSIE, the true version is after "MSIE" in userAgent
			else if ((verOffset = this.userAgent.indexOf("MSIE"))!=-1) {
		 		this.browserName = "Microsoft Internet Explorer";
		 		this.fullVersion = this.userAgent.substring(verOffset+5);
			}
			// In Chrome, the true version is after "Chrome" 
			else if ((verOffset = this.userAgent.indexOf("Chrome"))!=-1) {
		 		this.browserName = "Chrome";
		 		this.fullVersion = this.userAgent.substring(verOffset+7);
			}
			// In Safari, the true version is after "Safari" or after "Version" 
			else if ((verOffset = this.userAgent.indexOf("Safari"))!=-1) {
		 		this.browserName = "Safari";
		 		this.fullVersion = this.userAgent.substring(verOffset+7);
		 		if ((verOffset = this.userAgent.indexOf("Version"))!=-1) 
		   			this.fullVersion = this.userAgent.substring(verOffset+8);
			}
			// In Firefox, the true version is after "Firefox" 
			else if ((verOffset = this.userAgent.indexOf("Firefox"))!=-1) {
		 		this.browserName = "Firefox";
		 		this.fullVersion = this.userAgent.substring(verOffset+8);
			}
			// In most other browsers, "name/version" is at the end of userAgent 
			else if ((nameOffset = this.userAgent.lastIndexOf(' ')+1) < (verOffset = this.userAgent.lastIndexOf('/')) ) 
			{
		 		this.browserName = this.userAgent.substring(nameOffset,verOffset);
		 		this.fullVersion = this.userAgent.substring(verOffset+1);
		 		if (this.browserName.toLowerCase() == this.browserName.toUpperCase()) {
		  			this.browserName = navigator.appName;
		 		}
			}
			
			// trim the fullVersion string at semicolon/space if present
			if ((ix = this.fullVersion.indexOf(";"))!=-1)
		   		this.fullVersion = this.fullVersion.substring(0,ix);
			if ((ix = this.fullVersion.indexOf(" "))!=-1)
		   		this.fullVersion = this.fullVersion.substring(0,ix);
		
			this.majorVersion = parseInt(''+this.fullVersion,10);
			if (isNaN(this.majorVersion)) {
		 		this.fullVersion  = ''+parseFloat(navigator.appVersion); 
		 		this.majorVersion = parseInt(navigator.appVersion,10);
			}
			
			localStorage.browserName = this.browserName;
			localStorage.browserFullVersion = this.fullVersion;
			localStorage.browserMajorVersion = this.majorVersion;
		
			console.log('generated browser data :: name - ' + this.browserName + ' fullversion: ' + this.fullVersion + ' major version: ' + this.majorVersion);
		}
	}
	
}

Information.prototype.checkOS = function() {
	if(this.userAgent != null) {
		
		if(this.OSName == null || this.OSVersion == null) {
		
			var verOffset;
		
			if ((verOffset = this.userAgent.indexOf("Mac OS X"))!=-1) {
	 			this.OSName = "Mac OS X";
	 			this.OSVersion = this.userAgent.substring(verOffset+9);
	 			this.OSVersion = this.OSVersion.split(")",1);
			}
			else if ((verOffset = this.userAgent.indexOf("Windows"))!=-1) {
	 			this.OSName = "Windows";
	 			this.OSVersion = this.userAgent.substring(verOffset+8);
	 			this.OSVersion = this.OSVersion.split(";",1);
	 			if (this.OSVersion=="NT 5.1") { this.OSVersion = "XP"; }
	 			else if (this.OSVersion=="NT 6.0") { this.OSVersion = "Vista"; }
	 			else if (this.OSVersion=="NT 6.1") { this.OSVersion = "7"; }
	 			else if (this.OSVersion=="NT 6.2") { this.OSVersion = "8"; }
	 			else { this.OSVersion = "Unknown"; }	
			}
			else if ((verOffset=this.userAgent.indexOf("X11"))!=-1) {
	 			this.OSName = "Linux";
	 			this.OSVersion = this.userAgent.substring(verOffset+4);
	 		}
	 		
	 		localStorage.OSName = this.OSName;
	 		localStorage.OSVersion = this.OSVersion;	
			
			console.log('generated OS info :: name: ' + this.OSName + ' version: ' + this.OSVersion)
		}
	}
	
}

Information.prototype.showInfo = function() {
	console.log('showInfo :: player uuid: ' + this.playerUUID);
	console.log('showInfo :: width x height: ' + this.screenWidth + ' x ' + this.screenHeight);
	console.log('showInfo :: useragent: ' + this.userAgent);
	console.log('showInfo :: browser data: name - ' + this.browserName + ' fullversion: ' + this.fullVersion + ' major version: ' + this.majorVersion);
	console.log('showInfo :: OS name: ' + this.OSName + ' version: ' + this.OSVersion);	
}


Information.prototype.setValidInfo = function() {
	
	localStorage.playerValidInfo = true;
	this.validInfo = localStorage.playerValidInfo;
		
	console.log('player has valid info?: ' + this.validInfo)
}

Information.prototype.checkInfo = function(callback) {
	
	console.log('Starting Information...')
	
	if(this.validInfo == null) {
		
		console.log('a gerar informacao do player...')
	
		this.checkPlayerUUID();
		this.checkScreen();
		
		this.checkUserAgent();
		this.checkBrowser();
		
		this.checkOS();
		
		this.setValidInfo();		
	}
	else {
		console.log('player has valid info already!')
		this.showInfo();		
	}
	
	if(this.validInfo != null && this.playerUUID != null) {
		if (callback && typeof(callback) === 'function') {
				console.log('Finishing Information...')
				callback();
		}		
	}
	
	
};

/*******************************************************************************************************************
 ************************************************** MAIN ***********************************************************
 *******************************************************************************************************************/

var sm, s, s2, cm2, p, cm;
$(function() {
	
	var i = new Information();
	sm = new ServerCommunication({url:'json/schedulerv4.json'});
	s = new Schedule();
	//cm = new ContentManagement();
	cm = new ContentManagement({el:'#content'});
	//cm = new ContentManagement2({el:'#content'});

	//i.resetPlayer();
	
	//i.checkInfo();
	/*
	sm.update(function() {
		console.log('teste dentro da callback: ' + JSON.stringify({schedule:sm}))
		s = new Schedule({schedule:sm});
	});
	*/
	
	
	i.checkInfo(function() {
		if(navigator.onLine) {
			//sm.auth();
			sm.update(function() {
				//console.log('teste dentro da callback: ' + JSON.stringify({schedule:sm.getSchedule()}))
				//s = new Schedule({schedule:sm.getSchedule()});
				var temps = sm.getSchedule(); // obtem o ficheiro descarregado
				//console.log('sm:schedule: ' + JSON.stringify(temps));
				//s.checkSchedule(temps);
				s.checkSchedule(temps, function() { // verifica o tipo de schedule e trata da config
					cm.checkScheduleType();
				});
			});
		}
		else {
			// nothing yet
		}
		
		
	});

		
	//s.update(function(){
		//p = new Player({el:'#content', schedule:s});
		//p.play();
	//});
	
	/**
	setInterval(function () {
		if(navigator.onLine) {
			console.log('connected...');
		}
		else {
			console.log('disconnected!');
		}
	}, 10000);**/
	
	$('#stop').click( function() {
		p.pause();
	});
	
	$('#play').click( function() {
		p.play();
	});
	
	$('#fwd').click( function() {
		p.next();
	});
	
	$('#back').click( function() {
		p.previous();
	});
	
});