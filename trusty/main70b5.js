/*=====================================================================================
MISC HELPER FUNCTIONS
=======================================================================================*/
function l(what) {return document.getElementById(what);}
function choose(arr) {return arr[Math.floor(Math.random()*arr.length)];}

if(!Array.prototype.indexOf) {
    Array.prototype.indexOf = function(needle) {
        for(var i = 0; i < this.length; i++) {
            if(this[i] === needle) {
                return i;
            }
        }
        return -1;
    };
}

function shuffle(array)
{
	var counter = array.length, temp, index;
	// While there are elements in the array
	while (counter--)
	{
		// Pick a random index
		index = (Math.random() * counter) | 0;

		// And swap the last element with it
		temp = array[counter];
		array[counter] = array[index];
		array[index] = temp;
	}
	return array;
}
function Beautify(what,floats)//turns 9999999 into 9,999,999
{
	var str='';
	what=Math.round(what*100000)/100000;//get rid of weird rounding errors
	if (floats>0)
	{
		var floater=what-Math.floor(what);
		floater=Math.round(floater*100000)/100000;//get rid of weird rounding errors
		var floatPresent=floater?1:0;
		floater=(floater.toString()+'0000000').slice(2,2+floats);//yes this is hacky (but it works)
		str=Beautify(Math.floor(what))+(floatPresent?('.'+floater):'');
	}
	else
	{
		what=Math.floor(what);
		what=(what+'').split('').reverse();
		for (var i in what)
		{
			if (i%3==0 && i>0) str=','+str;
			str=what[i]+str;
		}
	}
	return str;
}


function utf8_to_b64( str ) {
	try{
		return Base64.encode(unescape(encodeURIComponent( str )));
		//return window.btoa(unescape(encodeURIComponent( str )));
	}
	catch(err)
	{
		//Popup('There was a problem while encrypting to base64.<br>('+err+')');
		return '';
	}
}

function b64_to_utf8( str ) {
	try{
		return decodeURIComponent(escape(Base64.decode( str )));
		//return decodeURIComponent(escape(window.atob( str )));
	}
	catch(err)
	{
		//Popup('There was a problem while decrypting from base64.<br>('+err+')');
		return '';
	}
}


function CompressBin(arr)//compress a sequence like [0,1,1,0,1,0]... into a number like 54.
{
	var str='';
	var arr2=arr.slice(0);
	arr2.unshift(1);
	arr2.push(1);
	arr2.reverse();
	for (var i in arr2)
	{
		str+=arr2[i];
	}
	str=parseInt(str,2);
	return str;
}

function UncompressBin(num)//uncompress a number like 54 to a sequence like [0,1,1,0,1,0].
{
	var arr=num.toString(2);
	arr=arr.split('');
	arr.reverse();
	arr.shift();
	arr.pop();
	return arr;
}

function CompressLargeBin(arr)//we have to compress in smaller chunks to avoid getting into scientific notation
{
	var arr2=arr.slice(0);
	var thisBit=[];
	var bits=[];
	for (var i in arr2)
	{
		thisBit.push(arr2[i]);
		if (thisBit.length>=50)
		{
			bits.push(CompressBin(thisBit));
			thisBit=[];
		}
	}
	if (thisBit.length>0) bits.push(CompressBin(thisBit));
	arr2=bits.join(';');
	return arr2;
}

function UncompressLargeBin(arr)
{
	var arr2=arr.split(';');
	var bits=[];
	for (var i in arr2)
	{
		bits.push(UncompressBin(parseInt(arr2[i])));
	}
	arr2=[];
	for (var i in bits)
	{
		for (var ii in bits[i]) arr2.push(bits[i][ii]);
	}
	return arr2;
}

//seeded random function, courtesy of http://davidbau.com/archives/2010/01/30/random_seeds_coded_hints_and_quintillions.html
(function(a,b,c,d,e,f){function k(a){var b,c=a.length,e=this,f=0,g=e.i=e.j=0,h=e.S=[];for(c||(a=[c++]);d>f;)h[f]=f++;for(f=0;d>f;f++)h[f]=h[g=j&g+a[f%c]+(b=h[f])],h[g]=b;(e.g=function(a){for(var b,c=0,f=e.i,g=e.j,h=e.S;a--;)b=h[f=j&f+1],c=c*d+h[j&(h[f]=h[g=j&g+b])+(h[g]=b)];return e.i=f,e.j=g,c})(d)}function l(a,b){var e,c=[],d=(typeof a)[0];if(b&&"o"==d)for(e in a)try{c.push(l(a[e],b-1))}catch(f){}return c.length?c:"s"==d?a:a+"\0"}function m(a,b){for(var d,c=a+"",e=0;c.length>e;)b[j&e]=j&(d^=19*b[j&e])+c.charCodeAt(e++);return o(b)}function n(c){try{return a.crypto.getRandomValues(c=new Uint8Array(d)),o(c)}catch(e){return[+new Date,a,a.navigator.plugins,a.screen,o(b)]}}function o(a){return String.fromCharCode.apply(0,a)}var g=c.pow(d,e),h=c.pow(2,f),i=2*h,j=d-1;c.seedrandom=function(a,f){var j=[],p=m(l(f?[a,o(b)]:0 in arguments?a:n(),3),j),q=new k(j);return m(o(q.S),b),c.random=function(){for(var a=q.g(e),b=g,c=0;h>a;)a=(a+c)*d,b*=d,c=q.g(1);for(;a>=i;)a/=2,b/=2,c>>>=1;return(a+c)/b},p},m(c.random(),b)})(this,[],Math,256,6,52);


/*=====================================================================================
GAME INITIALIZATION
=======================================================================================*/
Game={};

Game.Launch=function()
{
	Game.ready=0;
	Game.Init=function()
	{
		Game.ready=1;
		l('javascriptError').innerHTML='<div style="padding:64px 128px;"><div class="title">Loading...</div></div>';


		/*=====================================================================================
		VARIABLES AND PRESETS
		=======================================================================================*/
		Game.T=0;
		Game.fps=30;

		Game.version=1.036;
		Game.beta=0;
		l('versionNumber').innerHTML='v.'+Game.version+(Game.beta?' <span style="color:#ff0;">beta</span>':'');
		l('links').innerHTML='<a href="http://charlie-coleman.com/gray/" target="blank">Try Gray Clicker!</a>';

		//latency compensator stuff
		Game.time=new Date().getTime();
		Game.fpsMeasure=new Date().getTime();
		Game.accumulatedDelay=0;
		Game.catchupLogic=0;

		Game.computersEarned=0;//all computers earned during gameplay
		Game.computers=0;//computers
		Game.computersd=0;//computers display
		Game.computersPs=1;//computers per second (to recalculate with every new purchase)
		Game.computersReset=0;//computers lost to resetting
		Game.frenzy=0;//as long as >0, computer production is multiplied by frenzyPower
		Game.frenzyPower=1;
		Game.clickFrenzy=0;//as long as >0, mouse clicks get 777x more computers
		Game.computerClicks=0;//+1 for each click on the computer
		Game.goldenClicks=0;//+1 for each golden computer clicked
		Game.missedGoldenClicks=0;//+1 for each golden computer missed
		Game.handmadeComputers=0;//all the computers made from clicking the computer
		Game.milkProgress=0;//you can a little bit for each achievement; 0-1 : milk; 1-2 : chocolate milk; 2-3 : raspberry milk
		Game.milkH=Game.milkProgress/2;//milk height, between 0 and 1 (although should never go above 0.5)
		Game.milkHd=0;//milk height display
		Game.milkType=-1;//custom milk : 0=plain, 1=chocolate...
		Game.backgroundType=-1;//custom background : 0=blue, 1=red...
		Game.prestige=[];//cool stuff that carries over beyond resets

		Game.elderWrath=0;
		Game.elderWrathD=0;
		Game.pledges=0;
		Game.pledgeT=0;
		Game.researchT=0;
		Game.nextResearch=0;

		Game.bg='';//background (Mr. Trustys and such)
		Game.bgFade='';//fading to background
		Game.bgR=0;//ratio (0 - not faded, 1 - fully faded)
		Game.bgRd=0;//ratio displayed

		Game.startDate=parseInt(new Date().getTime());

		Game.prefs=[];
		Game.DefaultPrefs=function()
		{
			Game.prefs.particles=1;
			Game.prefs.numbers=1;
			Game.prefs.autosave=1;
			Game.prefs.autoupdate=1;
			Game.prefs.milk=1;
			Game.prefs.fancy=1;
			Game.prefs.christmas=0;
		}
		Game.DefaultPrefs();

		/*=====================================================================================
		UPDATE CHECKER (broken?)
		=======================================================================================*/
		Game.CheckUpdates=function()
		{
			ajax('server.php?q=checkupdate',Game.CheckUpdatesResponse);
		}
		Game.CheckUpdatesResponse=function(response)
		{
			var r=response.split('|');
			if (parseFloat(r[0])>Game.version)
			{
				var str='<b>New version available : v.'+r[0]+'!</b>';
				if (r[1]) str+='<br>Update note : "'+r[1]+'"';
				str+='<br><b>Refresh to get it!</b>';
				l('alert').innerHTML=str;
				l('alert').style.display='block';
			}
		}

		/*=====================================================================================
		SAVE
		=======================================================================================*/
		Game.ExportSave=function()
		{
			var save=prompt('Copy this text and keep it somewhere safe!',Game.WriteSave(1));
		}
		Game.ImportSave=function()
		{
			var save=prompt('Please paste in the text that was given to you on save export.','');
			if (save && save!='') Game.LoadSave(save);
			Game.WriteSave();
		}

		Game.WriteSave=function(exporting)//guess what we'e using to save the game?
		{
			var str='';
			str+=Game.version+'|';
			str+='|';//just in case we need some more stuff here
			str+=//save stats
			parseInt(Game.startDate)+
			'|';
			str+=//prefs
			(Game.prefs.particles?'1':'0')+
			(Game.prefs.numbers?'1':'0')+
			(Game.prefs.autosave?'1':'0')+
			(Game.prefs.autoupdate?'1':'0')+
			(Game.prefs.milk?'1':'0')+
			(Game.prefs.fancy?'1':'0')+
			'|';
			str+=parseFloat(Math.floor(Game.computers))+';'+
			parseFloat(Math.floor(Game.computersEarned))+';'+
			parseInt(Math.floor(Game.computerClicks))+';'+
			parseInt(Math.floor(Game.goldenClicks))+';'+
			parseFloat(Math.floor(Game.handmadeComputers))+';'+
			parseInt(Math.floor(Game.missedGoldenClicks))+';'+
			parseInt(Math.floor(Game.backgroundType))+';'+
			parseInt(Math.floor(Game.milkType))+';'+
			parseFloat(Math.floor(Game.computersReset))+';'+
			parseInt(Math.floor(Game.elderWrath))+';'+
			parseInt(Math.floor(Game.pledges))+';'+
			parseInt(Math.floor(Game.pledgeT))+';'+
			parseInt(Math.floor(Game.nextResearch))+';'+
			parseInt(Math.floor(Game.researchT))+
			'|';//computers
			for (var i in Game.Objects)//buildings
			{
				var me=Game.Objects[i];
				str+=me.amount+','+me.bought+','+Math.floor(me.totalComputers)+','+me.specialUnlocked+';';
			}
			str+='|';
			var toCompress=[];
			for (var i in Game.Upgrades)//upgrades
			{
				var me=Game.Upgrades[i];
				toCompress.push(Math.min(me.unlocked,1),Math.min(me.bought,1));
			}
			toCompress=CompressLargeBin(toCompress);
			str+=toCompress;
			str+='|';
			var toCompress=[];
			for (var i in Game.Achievements)//achievements
			{
				var me=Game.Achievements[i];
				toCompress.push(Math.min(me.won));
			}
			toCompress=CompressLargeBin(toCompress);
			str+=toCompress;


			if (exporting)
			{
				str=escape(utf8_to_b64(str)+'!END!');
				return str;
			}
			else
			{
				//that's right
				//we're using computers
				//yeah I went there
				var now=new Date();//we storin dis for 5 years, people
				now.setFullYear(now.getFullYear()+5);//mmh stale computers
				str=utf8_to_b64(str)+'!END!';
				str='CookieClickerGame='+escape(str)+'; expires='+now.toUTCString()+';';
				document.cookie=str;//aaand save
				if (document.cookie.indexOf('CookieClickerGame')<0) Game.Popup('Error while saving.<br>Export your save instead!');
				else Game.Popup('Game saved');
			}
		}

		/*=====================================================================================
		LOAD
		=======================================================================================*/
		Game.LoadSave=function(data)
		{
			var str='';
			if (data) str=unescape(data);
			else if (document.cookie.indexOf('CookieClickerGame')>=0) str=unescape(document.cookie.split('CookieClickerGame=')[1]);//get computer here

			if (str!='')
			{
				var version=0;
				var oldstr=str.split('|');
				if (oldstr[0]<1) {}
				else
				{
					str=str.split('!END!')[0];
					str=b64_to_utf8(str);
				}
				if (str!='')
				{
					var spl='';
					str=str.split('|');
					version=parseFloat(str[0]);
					if (version>=1 && version>Game.version)
					{
						alert('Error : you are attempting to load a save from a later version (v.'+version+'; you are using v.'+Game.version+').');
						return;
					}
					else if (version>=1)
					{
						spl=str[2].split(';');//save stats
						Game.startDate=parseInt(spl[0]);
						spl=str[3].split('');//prefs
						Game.prefs.particles=parseInt(spl[0]);
						Game.prefs.numbers=parseInt(spl[1]);
						Game.prefs.autosave=parseInt(spl[2]);
						Game.prefs.autoupdate=spl[3]?parseInt(spl[3]):1;
						Game.prefs.milk=spl[4]?parseInt(spl[4]):1;
						Game.prefs.fancy=parseInt(spl[5]);if (Game.prefs.fancy) Game.removeClass('noFancy'); else if (!Game.prefs.fancy) Game.addClass('noFancy');
						spl=str[4].split(';');//computers
						Game.computers=parseFloat(spl[0]);Game.computersEarned=parseFloat(spl[1]);
						Game.computerClicks=spl[2]?parseInt(spl[2]):0;
						Game.goldenClicks=spl[3]?parseInt(spl[3]):0;
						Game.handmadeComputers=spl[4]?parseFloat(spl[4]):0;
						Game.missedGoldenClicks=spl[5]?parseInt(spl[5]):0;
						Game.backgroundType=spl[6]?parseInt(spl[6]):0;
						Game.milkType=spl[7]?parseInt(spl[7]):0;
						Game.computersReset=spl[8]?parseFloat(spl[8]):0;
						Game.elderWrath=spl[9]?parseInt(spl[9]):0;
						Game.pledges=spl[10]?parseInt(spl[10]):0;
						Game.pledgeT=spl[11]?parseInt(spl[11]):0;
						Game.nextResearch=spl[12]?parseInt(spl[12]):0;
						Game.researchT=spl[13]?parseInt(spl[13]):0;
						spl=str[5].split(';');//buildings
						Game.BuildingsOwned=0;
						for (var i in Game.ObjectsById)
						{
							var me=Game.ObjectsById[i];
							if (spl[i])
							{
								var mestr=spl[i].toString().split(',');
								me.amount=parseInt(mestr[0]);me.bought=parseInt(mestr[1]);me.totalComputers=parseInt(mestr[2]);me.specialUnlocked=parseInt(mestr[3]);
								Game.BuildingsOwned+=me.amount;
							}
							else
							{
								me.unlocked=0;me.bought=0;me.totalComputers=0;
							}
						}
						if (version<1.035)//old non-binary algorithm
						{
							spl=str[6].split(';');//upgrades
							Game.UpgradesOwned=0;
							for (var i in Game.UpgradesById)
							{
								var me=Game.UpgradesById[i];
								if (spl[i])
								{
									var mestr=spl[i].split(',');
									me.unlocked=parseInt(mestr[0]);me.bought=parseInt(mestr[1]);
									if (me.bought) Game.UpgradesOwned++;
								}
								else
								{
									me.unlocked=0;me.bought=0;
								}
							}
							if (str[7]) spl=str[7].split(';'); else spl=[];//achievements
							Game.AchievementsOwned=0;
							for (var i in Game.AchievementsById)
							{
								var me=Game.AchievementsById[i];
								if (spl[i])
								{
									var mestr=spl[i].split(',');
									me.won=parseInt(mestr[0]);
								}
								else
								{
									me.won=0;
								}
								if (me.won && me.hide!=3) Game.AchievementsOwned++;
							}
						}
						else
						{
							if (str[6]) spl=str[6]; else spl=[];//upgrades
							spl=UncompressLargeBin(spl);
							Game.UpgradesOwned=0;
							for (var i in Game.UpgradesById)
							{
								var me=Game.UpgradesById[i];
								if (spl[i*2])
								{
									var mestr=[spl[i*2],spl[i*2+1]];
									me.unlocked=parseInt(mestr[0]);me.bought=parseInt(mestr[1]);
									if (me.bought) Game.UpgradesOwned++;
								}
								else
								{
									me.unlocked=0;me.bought=0;
								}
							}
							if (str[7]) spl=str[7]; else spl=[];//achievements
							spl=UncompressLargeBin(spl);
							Game.AchievementsOwned=0;
							for (var i in Game.AchievementsById)
							{
								var me=Game.AchievementsById[i];
								if (spl[i])
								{
									var mestr=[spl[i]];
									me.won=parseInt(mestr[0]);
								}
								else
								{
									me.won=0;
								}
								if (me.won && me.hide!=3) Game.AchievementsOwned++;
							}
						}


						for (var i in Game.ObjectsById)
						{
							var me=Game.ObjectsById[i];
							if (me.buyFunction) me.buyFunction();
							me.setSpecial(0);
							if (me.special) me.special();
							me.refresh();
						}
					}
					else//importing old version save
					{
						/*
						Game.startDate=parseInt(new Date().getTime());
						Game.computers=parseInt(str[1]);
						Game.computersEarned=parseInt(str[1]);

						for (var i in Game.ObjectsById)
						{
							var me=Game.ObjectsById[i];
							me.amount=0;me.bought=0;me.totalComputers=0;
							me.refresh();
						}
						for (var i in Game.UpgradesById)
						{
							var me=Game.UpgradesById[i];
							me.unlocked=0;me.bought=0;
						}

						var moni=0;
						moni+=15*Math.pow(1.1,parseInt(str[2]));
						moni+=100*Math.pow(1.1,parseInt(str[4]));
						moni+=500*Math.pow(1.1,parseInt(str[6]));
						moni+=2000*Math.pow(1.1,parseInt(str[8]));
						moni+=7000*Math.pow(1.1,parseInt(str[10]));
						moni+=50000*Math.pow(1.1,parseInt(str[12]));
						moni+=1000000*Math.pow(1.1,parseInt(str[14]));
						if (parseInt(str[16])) moni+=123456789*Math.pow(1.1,parseInt(str[16]));

						alert('Imported old save from version '+version+'; recovered '+Beautify(Game.computers)+' computers, and converted buildings back to '+Beautify(moni)+' computers.');

						Game.computers+=moni;
						Game.computersEarned+=moni;
						*/
						alert('Sorry, you can\'t import saves from the old version anymore.');
						return;
					}


					Game.goldenComputer.reset();

					Game.prestige=[];

					Game.Upgrades['Elder Pledge'].basePrice=Math.pow(8,Math.min(Game.pledges+2,13));

					Game.RebuildUpgrades();

					Game.TickerAge=0;

					Game.elderWrathD=0;
					Game.frenzy=0;
					Game.frenzyPower=1;
					Game.clickFrenzy=0;
					Game.recalculateGains=1;
					Game.storeToRebuild=1;
					Game.upgradesToRebuild=1;
					Game.Popup('Game loaded');
				}
			}
		}

		/*=====================================================================================
		RESET
		=======================================================================================*/
		Game.Reset=function(bypass)
		{
			if (bypass || confirm('Do you REALLY want to start over?\n(Mr. Trusty will not be happy.)'))
			{
				if (!bypass)
				{
					if (Game.computersEarned>=1000000) Game.Win('Sacrifice');
					if (Game.computersEarned>=1000000000) Game.Win('Oblivion');
					if (Game.computersEarned>=1000000000000) Game.Win('From scratch');
					if (Game.computersEarned>=1000000000000000) Game.Win('Nihilism');
				}
				Game.computersReset+=Game.computersEarned;
				Game.computers=0;
				Game.computersEarned=0;
				Game.computerClicks=0;
				//Game.goldenClicks=0;
				//Game.missedGoldenClicks=0;
				Game.handmadeComputers=0;
				Game.backgroundType=-1;
				Game.milkType=-1;
				Game.frenzy=0;
				Game.frenzyPower=1;
				Game.clickFrenzy=0;
				Game.pledges=0;
				Game.pledgeT=0;
				Game.elderWrath=0;
				Game.nextResearch=0;
				Game.researchT=0;
				Game.Upgrades['Elder Pledge'].basePrice=Math.pow(8,Math.min(Game.pledges+2,13));
				for (var i in Game.ObjectsById)
				{
					var me=Game.ObjectsById[i];
					me.amount=0;me.bought=0;me.totalComputers=0;me.specialUnlocked=0;
					me.setSpecial(0);
					me.refresh();
				}
				for (var i in Game.UpgradesById)
				{
					var me=Game.UpgradesById[i];
					me.unlocked=0;me.bought=0;
				}
				/*
				for (var i in Game.AchievementsById)
				{
					var me=Game.AchievementsById[i];
					me.won=0;
				}*/
				//Game.DefaultPrefs();
				Game.BuildingsOwned=0;
				Game.UpgradesOwned=0;
				Game.RebuildUpgrades();
				Game.TickerAge=0;
				Game.recalculateGains=1;
				Game.storeToRebuild=1;
				Game.upgradesToRebuild=1;
				Game.startDate=parseInt(new Date().getTime());
				Game.goldenComputer.reset();

				Game.Popup('Game reset');

				if (!bypass)
				{
					var prestige=0;
					if (Game.prestige.ready) prestige=Game.prestige['Heavenly chips'];
					Game.prestige=[];
					Game.CalculatePrestige();
					prestige=Game.prestige['Heavenly chips']-prestige;
					if (prestige!=0) Game.Popup('You earn '+prestige+' heavenly chip'+(prestige==1?'':'s')+'!');
				}
			}
		}
		Game.HardReset=function()
		{
			if (confirm('Do you REALLY want to wipe your save?\n(you will lose your progress, your achievements, and your prestige!)'))
			{
				if (confirm('Whoah now, are you really, REALLY sure?\n(don\'t say we didn\'t warn you!)'))
				{
					for (var i in Game.AchievementsById)
					{
						var me=Game.AchievementsById[i];
						me.won=0;
					}
					Game.AchievementsOwned=0;
					Game.goldenClicks=0;
					Game.missedGoldenClicks=0;
					Game.Reset(1);
					Game.computersReset=0;
					Game.prestige=[];
					Game.CalculatePrestige();
				}
			}
		}


		/*=====================================================================================
		COMPUTER ECONOMICS
		=======================================================================================*/
		Game.Earn=function(howmuch)
		{
			Game.computers+=howmuch;
			Game.computersEarned+=howmuch;
		}
		Game.Spend=function(howmuch)
		{
			Game.computers-=howmuch;
		}
		Game.mouseCps=function()
		{
			var add=0;
			if (Game.Has('Thousand fingers')) add+=0.1;
			if (Game.Has('Million fingers')) add+=0.5;
			if (Game.Has('Billion fingers')) add+=2;
			if (Game.Has('Trillion fingers')) add+=10;
			if (Game.Has('Quadrillion fingers')) add+=20;
			if (Game.Has('Quintillion fingers')) add+=100;
			var num=0;
			for (var i in Game.Objects) {if (Game.Objects[i].name!='Cursor') num+=Game.Objects[i].amount;}
			add=add*num;
			if (Game.Has('Plastic mouse')) add+=Game.computersPs*0.01;
			if (Game.Has('Iron mouse')) add+=Game.computersPs*0.01;
			if (Game.Has('Titanium mouse')) add+=Game.computersPs*0.01;
			if (Game.Has('Adamantium mouse')) add+=Game.computersPs*0.01;
			var mult=1;
			if (Game.clickFrenzy>0) mult*=777;
			return mult*Game.ComputeCps(1,Game.Has('Reinforced index finger'),Game.Has('Carpal tunnel prevention cream')+Game.Has('Ambidextrous'),add);
		}
		Game.computedMouseCps=1;
		Game.globalCpsMult=1;
		Game.lastClick=0;
		Game.autoclickerDetected=0;
		Game.ClickComputer=function()
		{
			if (new Date().getTime()-Game.lastClick<1000/250)
			{
			}
			else
			{
				if (new Date().getTime()-Game.lastClick<1000/15)
				{
					Game.autoclickerDetected+=Game.fps;
					if (Game.autoclickerDetected>=Game.fps*5) Game.Win('Uncanny clicker');
				}
				Game.Earn(Game.computedMouseCps);
				Game.handmadeComputers+=Game.computedMouseCps;
				if (Game.prefs.particles) Game.computerParticleAdd();
				if (Game.prefs.numbers) Game.computerNumberAdd('+'+Beautify(Game.computedMouseCps,1));
				Game.computerClicks++;
			}
			Game.lastClick=new Date().getTime();
		}
		l('bigComputer').onclick=Game.ClickComputer;

		Game.HowMuchPrestige=function(computers)
		{
			var prestige=computers/1000000000000;
			//prestige=Math.max(0,Math.floor(Math.pow(prestige,0.5)));//old version
			prestige=Math.max(0,Math.floor((-1+Math.pow(1+8*prestige,0.5))/2));//geometric progression
			return prestige;
		}
		Game.CalculatePrestige=function()
		{
			var prestige=Game.HowMuchPrestige(Game.computersReset);
			Game.prestige=[];
			Game.prestige['Heavenly chips']=prestige;
			Game.prestige.ready=1;
		}
		/*=====================================================================================
		CPS RECALCULATOR
		=======================================================================================*/
		Game.recalculateGains=1;
		Game.CalculateGains=function()
		{
			Game.computersPs=0;
			var mult=1;
			for (var i in Game.Upgrades)
			{
				var me=Game.Upgrades[i];
				if (me.bought>0)
				{
					if (me.type=='computer' && Game.Has(me.name)) mult+=me.power*0.01;
					if (me.type=='Super' && Game.Has(me.name)) mult+=me.power*0.01;
					if (me.type=='Google' && Game.Has(me.name)) mult+=me.power*0.01;
				}
			}
			mult+=Game.Has('Specialized chocolate chips')*0.01;
			mult+=Game.Has('Designer cocoa beans')*0.02;
			mult+=Game.Has('Underworld ovens')*0.03;
			mult+=Game.Has('Exotic nuts')*0.04;
			mult+=Game.Has('Arcane sugar')*0.05;

			if (!Game.prestige.ready) Game.CalculatePrestige();
			mult+=parseInt(Game.prestige['Heavenly chips'])*0.02;

			for (var i in Game.Objects)
			{
				var me=Game.Objects[i];
				me.storedCps=(typeof(me.cps)=='function'?me.cps():me.cps);
				me.storedTotalCps=me.amount*me.storedCps;
				Game.computersPs+=me.storedTotalCps;
			}

			if (Game.Has('Kitten helpers')) mult*=(1+Game.milkProgress*0.05);
			if (Game.Has('Kitten workers')) mult*=(1+Game.milkProgress*0.1);
			if (Game.Has('Kitten engineers')) mult*=(1+Game.milkProgress*0.2);
			if (Game.Has('Kitten overseers')) mult*=(1+Game.milkProgress*0.3);

			if (Game.frenzy>0) mult*=Game.frenzyPower;

			if (Game.Has('Elder Covenant')) mult*=0.95;
			if (Game.Has('Mr. Trusty\'s wrath')) mult*=1.00;
			Game.globalCpsMult=mult;
			Game.computersPs*=Game.globalCpsMult;

			for (var i=0;i<Game.cpsAchievs.length/2;i++)
			{
				if (Game.computersPs>=Game.cpsAchievs[i*2+1]) Game.Win(Game.cpsAchievs[i*2]);
			}

			Game.computedMouseCps=Game.mouseCps();

			Game.recalculateGains=0;
		}
		/*=====================================================================================
		GOLDEN COOKIE
		=======================================================================================*/
		Game.goldenComputer={x:0,y:0,life:0,delay:0,dur:13,toDie:1,wrath:0,chain:0,last:''};
		Game.goldenComputer.reset=function()
		{
			Game.goldenComputer.life=0;
			Game.goldenComputer.delay=0;
			Game.goldenComputer.dur=13;
			Game.goldenComputer.toDie=1;
			Game.goldenComputer.last='';
			Game.goldenComputer.chain=0;
		}
		Game.goldenComputer.spawn=function()
		{
			if (Game.goldenComputer.delay!=0 || Game.goldenComputer.life!=0) Game.Win('Cheated computers taste awful');
			var me=l('goldenComputer');
			if ((Game.elderWrath==1 && Math.random()<0.33) || (Game.elderWrath==2 && Math.random()<0.66) || (Game.elderWrath==3))
			{
				Game.goldenComputer.wrath=1;
				me.style.background='url(img/wrathComputer.png)';
			}
			else
			{
				Game.goldenComputer.wrath=0;
				me.style.background='url(img/goldComputer.png)';
			}
			var r=Math.floor(Math.random()*360);
			me.style.transform='rotate('+r+'deg)';
			me.style.mozTransform='rotate('+r+'deg)';
			me.style.webkitTransform='rotate('+r+'deg)';
			me.style.msTransform='rotate('+r+'deg)';
			me.style.oTransform='rotate('+r+'deg)';
			var screen=l('game').getBoundingClientRect();
			Game.goldenComputer.x=Math.floor(Math.random()*(screen.right-screen.left-128)+screen.left+64)-64;
			Game.goldenComputer.y=Math.floor(Math.random()*(screen.bottom-screen.top-128)+screen.top+64)-64;
			me.style.left=Game.goldenComputer.x+'px';
			me.style.top=Game.goldenComputer.y+'px';
			me.style.display='block';
			var dur=13;
			if (Game.Has('Lucky day')) dur*=2;
			if (Game.Has('Serendipity')) dur*=2;
			if (Game.goldenComputer.chain>0) dur=6;
			Game.goldenComputer.dur=dur;
			Game.goldenComputer.life=Game.fps*Game.goldenComputer.dur;
			me.toDie=0;
		}
		Game.goldenComputer.update=function()
		{
			if (Game.goldenComputer.delay==0 && Game.goldenComputer.life==0) Game.goldenComputer.spawn();
			if (Game.goldenComputer.life>0)
			{
				Game.goldenComputer.life--;
				l('goldenComputer').style.opacity=1-Math.pow((Game.goldenComputer.life/(Game.fps*Game.goldenComputer.dur))*2-1,4);
				if (Game.goldenComputer.life==0 || Game.goldenComputer.toDie==1)
				{
					if (Game.goldenComputer.life==0) Game.goldenComputer.chain=0;
					var m=(5+Math.floor(Math.random()*10));
					if (Game.Has('Lucky day')) m/=2;
					if (Game.Has('Serendipity')) m/=2;
					if (Game.goldenComputer.chain>0) m=0.05;
					if (Game.Has('Gold hoard')) m=0.01;
					Game.goldenComputer.delay=Math.ceil(Game.fps*60*m);
					l('goldenComputer').style.display='none';
					if (Game.goldenComputer.toDie==0) Game.missedGoldenClicks++;
					Game.goldenComputer.toDie=0;
					Game.goldenComputer.life=0;
				}
			}
			if (Game.goldenComputer.delay>0) Game.goldenComputer.delay--;
		}
		Game.goldenComputer.choose=function()
		{
			var list=[];
			if (Game.goldenComputer.wrath>0) list.push('clot','multiply computers','ruin computers');
			else list.push('frenzy','multiply computers');
			if (Game.goldenComputer.wrath>0 && Math.random()<0.3) list.push('blood frenzy','chain computer');
			else if (Math.random()<0.01 && Game.computersEarned>=100000) list.push('chain computer');
			if (Math.random()<0.05) list.push('click frenzy');
			if (Game.goldenComputer.last!='' && Math.random()<0.8 && list.indexOf(Game.goldenComputer.last)!=-1) list.splice(list.indexOf(Game.goldenComputer.last),1);//80% chance to force a different one
			var choice=choose(list);
			return choice;
		}
		Game.goldenComputer.click=function()
		{
			if (Game.goldenComputer.life>0)
			{
				Game.goldenComputer.toDie=1;
				Game.goldenClicks++;

				if (Game.goldenClicks>=1) Game.Win('Golden computer');
				if (Game.goldenClicks>=7) Game.Win('Lucky computer');
				if (Game.goldenClicks>=27) Game.Win('A stroke of luck');
				if (Game.goldenClicks>=77) Game.Win('Fortune');
				if (Game.goldenClicks>=777) Game.Win('Leprechaun');
				if (Game.goldenClicks>=7777) Game.Win('Black cat\'s paw');

				if (Game.goldenClicks>=7) Game.Unlock('Lucky day');
				if (Game.goldenClicks>=27) Game.Unlock('Serendipity');
				if (Game.goldenClicks>=77) Game.Unlock('Get lucky');

				l('goldenComputer').style.display='none';

				var choice=Game.goldenComputer.choose();

				if (Game.goldenComputer.chain>0) choice='chain computer';
				Game.goldenComputer.last=choice;

				if (choice!='chain computer') Game.goldenComputer.chain=0;
				if (choice=='frenzy')
				{
					var time=77+77*Game.Has('Get lucky');
					Game.frenzy=Game.fps*time;
					Game.frenzyPower=7;
					Game.recalculateGains=1;
					Game.Popup('Frenzy : computer production x7 for '+time+' seconds!');
				}
				else if (choice=='multiply computers')
				{
					var moni=Math.min(Game.computers*0.2,Game.computersPs*60*20)+13;//add 10% to computers owned (+13), or 20 minutes of computer production - whichever is lowest
					Game.Earn(moni);
					Game.Popup('Lucky! +'+Beautify(moni)+' computers!');
				}
				else if (choice=='ruin computers')
				{
					var moni=Math.min(Game.computers*0.05,Game.computersPs*60*10)+13;//lose 5% of computers owned (-13), or 10 minutes of computer production - whichever is lowest
					moni=Math.min(Game.computers,moni);
					Game.Spend(moni);
					Game.Popup('Ruin! Lost '+Beautify(moni)+' computers!');
				}
				else if (choice=='blood frenzy')
				{
					var time=6+6*Game.Has('Get lucky');
					Game.frenzy=Game.fps*time;//*2;//we shouldn't need *2 but I keep getting reports of it lasting only 3 seconds
					Game.frenzyPower=666;
					Game.recalculateGains=1;
					Game.Popup('Elder frenzy : computer production x666 for '+time+' seconds!');
				}
				else if (choice=='clot')
				{
					var time=66+66*Game.Has('Get lucky');
					Game.frenzy=Game.fps*time;
					Game.frenzyPower=0.5;
					Game.recalculateGains=1;
					Game.Popup('Clot : computer production halved for '+time+' seconds!');
				}
				else if (choice=='click frenzy')
				{
					var time=13+13*Game.Has('Get lucky');
					Game.clickFrenzy=Game.fps*time;
					Game.recalculateGains=1;
					Game.Popup('Click frenzy! Clicking power x777 for '+time+' seconds!');
				}
				else if (choice=='chain computer')
				{
					Game.goldenComputer.chain++;
					var moni='';
					for (var i=0;i<Game.goldenComputer.chain;i++) {moni+='6';}
					moni=parseInt(moni);
					Game.Popup('Computer chain : +'+Beautify(moni)+' computers!');
					if ((Math.random()<0.1 || Game.goldenComputer.chain>12 || moni>=Game.computers*1) && Game.goldenComputer.chain>4) Game.goldenComputer.chain=0;
					Game.Earn(moni);
				}
			}
		}
		l('goldenComputer').onclick=Game.goldenComputer.click;


		/*=====================================================================================
		PARTICLES
		=======================================================================================*/
		//falling computers
		Game.computerParticles=[];
		var str='';
		for (var i=0;i<40;i++)
		{
			Game.computerParticles[i]={x:0,y:0,life:-1};
			str+='<div id="computerParticle'+i+'" class="computerParticle"></div>';
		}
		l('computerShower').innerHTML=str;
		Game.computerParticlesUpdate=function()
		{
			for (var i in Game.computerParticles)
			{
				var me=Game.computerParticles[i];
				if (me.life!=-1)
				{
					me.y+=me.life*0.5+Math.random()*0.5;
					me.life++;
					var el=me.l;
					el.style.left=Math.floor(me.x)+'px';
					el.style.top=Math.floor(me.y)+'px';
					el.style.opacity=1-(me.life/(Game.fps*2));
					if (me.life>=Game.fps*2)
					{
						me.life=-1;
						me.l.style.opacity=0;
					}
				}
			}
		}
		Game.computerParticleAdd=function()
		{
			//pick the first free (or the oldest) particle to replace it
			if (Game.prefs.particles)
			{
				var highest=0;
				var highestI=0;
				for (var i in Game.computerParticles)
				{
					if (Game.computerParticles[i].life==-1) {highestI=i;break;}
					if (Game.computerParticles[i].life>highest)
					{
						highest=Game.computerParticles[i].life;
						highestI=i;
					}
				}
				var i=highestI;
				var rect=l('computerShower').getBoundingClientRect();
				var x=Math.floor(Math.random()*(rect.right-rect.left));
				var y=-32;
				var me=Game.computerParticles[i];
				if (!me.l) me.l=l('computerParticle'+i);
				me.life=0;
				me.x=x;
				me.y=y;
				var r=Math.floor(Math.random()*360);
				me.l.style.backgroundPosition=(Math.floor(Math.random()*8)*64)+'px 0px';
				me.l.style.transform='rotate('+r+'deg)';
				me.l.style.mozTransform='rotate('+r+'deg)';
				me.l.style.webkitTransform='rotate('+r+'deg)';
				me.l.style.msTransform='rotate('+r+'deg)';
				me.l.style.oTransform='rotate('+r+'deg)';
			}
		}

		//rising numbers
		Game.computerNumbers=[];
		var str='';
		for (var i=0;i<20;i++)
		{
			Game.computerNumbers[i]={x:0,y:0,life:-1,text:''};
			str+='<div id="computerNumber'+i+'" class="computerNumber title"></div>';
		}
		l('computerNumbers').innerHTML=str;
		Game.computerNumbersUpdate=function()
		{
			for (var i in Game.computerNumbers)
			{
				var me=Game.computerNumbers[i];
				if (me.life!=-1)
				{
					me.y-=me.life*0.5+Math.random()*0.5;
					me.life++;
					var el=me.l;
					el.style.left=Math.floor(me.x)+'px';
					el.style.top=Math.floor(me.y)+'px';
					el.style.opacity=1-(me.life/(Game.fps*1));
					//l('computerNumber'+i).style.zIndex=(1000+(Game.fps*1-me.life));
					if (me.life>=Game.fps*1)
					{
						me.life=-1;
						me.l.style.opacity=0;
					}
				}
			}
		}
		Game.computerNumberAdd=function(text)
		{
			//pick the first free (or the oldest) particle to replace it
			var highest=0;
			var highestI=0;
			for (var i in Game.computerNumbers)
			{
				if (Game.computerNumbers[i].life==-1) {highestI=i;break;}
				if (Game.computerNumbers[i].life>highest)
				{
					highest=Game.computerNumbers[i].life;
					highestI=i;
				}
			}
			var i=highestI;
			var x=-100+(Math.random()-0.5)*40;
			var y=0+(Math.random()-0.5)*40;
			var me=Game.computerNumbers[i];
			if (!me.l) me.l=l('computerNumber'+i);
			me.life=0;
			me.x=x;
			me.y=y;
			me.text=text;
			me.l.innerHTML=text;
			me.l.style.left=Math.floor(Game.computerNumbers[i].x)+'px';
			me.l.style.top=Math.floor(Game.computerNumbers[i].y)+'px';
		}

		//generic particles
		Game.particles=[];
		Game.particlesY=0;
		var str='';
		for (var i=0;i<20;i++)
		{
			Game.particles[i]={x:0,y:0,life:-1,text:''};
			str+='<div id="particle'+i+'" class="particle title"></div>';
		}
		l('particles').innerHTML=str;
		Game.particlesUpdate=function()
		{
			Game.particlesY=0;
			for (var i in Game.particles)
			{
				var me=Game.particles[i];
				if (me.life!=-1)
				{
					Game.particlesY+=64;//me.l.clientHeight;
					var y=me.y-(1-Math.pow(1-me.life/(Game.fps*4),10))*50;
					//me.y=me.life*0.25+Math.random()*0.25;
					me.life++;
					var el=me.l;
					el.style.left=Math.floor(-200+me.x)+'px';
					el.style.bottom=Math.floor(-y)+'px';
					el.style.opacity=1-(me.life/(Game.fps*4));
					if (me.life>=Game.fps*4)
					{
						me.life=-1;
						el.style.opacity=0;
						el.style.display='none';
					}
				}
			}
		}
		Game.particlesAdd=function(text,el)
		{
			//pick the first free (or the oldest) particle to replace it
			var highest=0;
			var highestI=0;
			for (var i in Game.particles)
			{
				if (Game.particles[i].life==-1) {highestI=i;break;}
				if (Game.particles[i].life>highest)
				{
					highest=Game.particles[i].life;
					highestI=i;
				}
			}
			var i=highestI;
			var x=(Math.random()-0.5)*40;
			var y=0;//+(Math.random()-0.5)*40;
			if (!el)
			{
				var rect=l('game').getBoundingClientRect();
				var x=Math.floor((rect.left+rect.right)/2);
				var y=Math.floor((rect.bottom));
				x+=(Math.random()-0.5)*40;
				y+=0;//(Math.random()-0.5)*40;
			}
			var me=Game.particles[i];
			if (!me.l) me.l=l('particle'+i);
			me.life=0;
			me.x=x;
			me.y=y-Game.particlesY;
			me.text=text;
			me.l.innerHTML=text;
			me.l.style.left=Math.floor(Game.particles[i].x-200)+'px';
			me.l.style.bottom=Math.floor(-Game.particles[i].y)+'px';
			me.l.style.display='block';
			Game.particlesY+=60;
		}
		Game.Popup=function(text)
		{
			Game.particlesAdd(text);
		}


		Game.veil=1;
		Game.veilOn=function()
		{
			//l('sectionMiddle').style.display='none';
			l('sectionRight').style.display='none';
			l('backgroundLayer2').style.background='#000 url(img/darkNoise.png)';
			Game.veil=1;
		}
		Game.veilOff=function()
		{
			//l('sectionMiddle').style.display='block';
			l('sectionRight').style.display='block';
			l('backgroundLayer2').style.background='transparent';
			Game.veil=0;
		}

		/*=====================================================================================
		MENUS
		=======================================================================================*/
		Game.cssClasses=[];
		Game.addClass=function(what) {if (Game.cssClasses.indexOf(what)==-1) Game.cssClasses.push(what);Game.updateClasses();}
		Game.removeClass=function(what) {var i=Game.cssClasses.indexOf(what);if(i!=-1) {Game.cssClasses.splice(i,1);}Game.updateClasses();}
		Game.updateClasses=function() {var str='';for (var i in Game.cssClasses) {str+=Game.cssClasses[i]+' ';}l('game').className=str;}

		Game.WriteButton=function(prefName,button,on,off,callback)
		{
			return '<a class="option" id="'+button+'" onclick="Game.Toggle(\''+prefName+'\',\''+button+'\',\''+on+'\',\''+off+'\');'+(callback||'')+'">'+(Game.prefs[prefName]?on:off)+'</a>';
		}
		Game.Toggle=function(prefName,button,on,off)
		{
			if (Game.prefs[prefName])
			{
				l(button).innerHTML=off;
				l(button).className='';
				Game.prefs[prefName]=0;
			}
			else
			{
				l(button).innerHTML=on;
				l(button).className='enabled';
				Game.prefs[prefName]=1;
			}
		}
		Game.ToggleFancy=function()
		{
			if (Game.prefs.fancy) Game.removeClass('noFancy');
			else if (!Game.prefs.fancy) Game.addClass('noFancy');
		}
		Game.onMenu='';
		Game.ShowMenu=function(what)
		{
			if (!what) what='';
			if (Game.onMenu=='' &&  what!='') Game.addClass('onMenu');
			else if (Game.onMenu!='' &&  what!=Game.onMenu) Game.addClass('onMenu');
			else if (what==Game.onMenu) {Game.removeClass('onMenu');what='';}
			Game.onMenu=what;
			Game.UpdateMenu();
		}
		Game.sayTime=function(time,detail)
		{
			var str='';
			var detail=detail||0;
			time=Math.floor(time);
			if (time>=Game.fps*60*60*24*2 && detail<2) str=Beautify(time/(Game.fps*60*60*24))+' days';
			else if (time>=Game.fps*60*60*24 && detail<2) str='1 day';
			else if (time>=Game.fps*60*60*2 && detail<3) str=Beautify(time/(Game.fps*60*60))+' hours';
			else if (time>=Game.fps*60*60 && detail<3) str='1 hour';
			else if (time>=Game.fps*60*2 && detail<4) str=Beautify(time/(Game.fps*60))+' minutes';
			else if (time>=Game.fps*60 && detail<4) str='1 minute';
			else if (time>=Game.fps*2 && detail<5) str=Beautify(time/(Game.fps))+' seconds';
			else if (time>=Game.fps && detail<5) str='1 second';
			return str;
		}

		Game.UpdateMenu=function()
		{
			var str='';
			if (Game.onMenu!='')
			{
				str+='<div style="position:absolute;top:8px;right:8px;cursor:pointer;font-size:16px;" onclick="Game.ShowMenu(Game.onMenu);">X</div>';
			}
			if (Game.onMenu=='prefs')
			{
				str+='<div class="section">Menu</div>'+
				'<div class="subsection">'+
				'<div class="title">General</div>'+
				'<div class="listing"><a class="option" onclick="Game.WriteSave();">Save</a><label>Save manually (the game autosaves every 60 seconds)</label></div>'+
				'<div class="listing"><a class="option" onclick="Game.ExportSave();">Export save</a><a class="option" onclick="Game.ImportSave();">Import save</a><label>You can use this to backup your save or to transfer it to another computer</label></div>'+
				//'<div class="listing"><span class="warning" style="font-size:12px;">[Note : importing saves from earlier versions than 1.0 will be disabled beyond September 1st, 2013.]</span></div>'+
				'<div class="listing"><a class="option warning" onclick="Game.Reset();">Reset</a><label>Reset your game (you will keep your achievements)</label></div>'+
				'<div class="listing"><a class="option warning" onclick="Game.HardReset();">Wipe save</a><label>Delete all your progress, including your achievements and prestige</label></div>'+
				'<div class="title">Settings</div>'+
				'<div class="listing">'+
				Game.WriteButton('fancy','fancyButton','Fancy graphics ON','Fancy graphics OFF','Game.ToggleFancy();')+
				Game.WriteButton('particles','particlesButton','Particles ON','Particles OFF')+
				Game.WriteButton('numbers','numbersButton','Numbers ON','Numbers OFF')+
				Game.WriteButton('milk','milkButton','Milk ON','Milk OFF')+
				Game.WriteButton('christmas','christmasButton','Christmas Mode ON (WIP)','Christmas Mode OFF (WIP)') +
				'</div>'+
				'<div class="listing">'+Game.WriteButton('autoupdate','autoupdateButton','Offline mode OFF','Offline mode ON')+'<label>(note : this disables update notifications)</label></div>'+
				//'<div class="listing">'+Game.WriteButton('autosave','autosaveButton','Autosave ON','Autosave OFF')+'</div>'+
				'</div>'
				;
			}
			if (Game.onMenu=='log')
			{
				str+='<div class="section">Updates</div>'+
				'<div class="subsection">'+
				'<div class="title">Now working on :</div>'+
				'<div class="listing">-Whatever you tell me to: <a href="https://mail.google.com/mail/?view=cm&fs=1&tf=1&source=mailto&to=thoughts@charlie-coleman.com" target="_blank">My Email</a>! </div>'+
				'<div class="listing">-More music</div>'+
				'<div class="listing">-Finishing base code</div>'+
				'<div class="listing">-New upgrades/achievements</div>'+
				'<div class="listing">-More buildings</div>'+
				'<div class="listing">-More random sh*t</div>'+
				'<div class="listing">-More music</div>'+
				'<div class="listing">-Better image sprites</div>'+


				'</div><div class="subsection update small">'+
				'<div class="title">12/5/2013 - Log and Music</div>'+
				'<div class="listing">-Sitting in silence? Try the Music button at the top, and hit the random song button for random tunes.</div>'+
				'<div class="listing">-Ready for Christmas time? Activate Christmas mode in the menu</div>'+
				'<div class="listing">-Fixed some upgrades from not unlocking(my fault)</div>'+
				'<div class="listing">-Fixed all of Nolan Dotts complaints(computers baked -> computers made)</div>'+
				'<div class="listing">-TrustMan image changed to buff Mr. Trusty</div>'+
				'<div class="listing">-Made the log!(the thing you are reading now)<label>(probably)</label></div>' +


				'</div><div class="subsection update small">'+
				'<div class="title">12/5/2013 - Log and Music</div>'+
				'<div class="listing">-Fixed saves, should actually save now ☺</div>'+
				'<div class="listing">-Added new songs</div>'+
				'<div class="listing">-Fixed random song on pause</div>'+
				'<div class="listing">-Working on random music when current song ends</div>'
				;
			}
			else if (Game.onMenu=='stats')
			{
				var buildingsOwned=0;
				buildingsOwned=Game.BuildingsOwned;
				var upgrades='';
				var computerUpgrades='';
				var SuperUpgrades='';
				var GoogleUpgrades='';
				var upgradesTotal=0;
				var upgradesOwned=0;

				var list=[];
				for (var i in Game.Upgrades)//sort the upgrades
				{
					list.push(Game.Upgrades[i]);
				}
				var sortMap=function(a,b)
				{
					if (a.order>b.order) return 1;
					else if (a.order<b.order) return -1;
					else return 0;
				}
				list.sort(sortMap);
				for (var i in list)
				{
					var str2='';
					var me=list[i];
					if (!Game.Has('Neuromancy'))
					{
						if (me.bought>0 && me.hide!=3)
						{
							str2+='<div class="crate upgrade enabled" '+Game.getTooltip(
							'<div style="min-width:200px;"><div style="float:right;"><span class="price">'+Beautify(Math.round(me.basePrice))+'</span></div><small>[Upgrade] [Purchased]</small><div class="name">'+me.name+'</div><div class="description">'+me.desc+'</div></div>'
							,0,0,'bottom-right')+' style="background-position:'+(-me.icon[0]*48+6)+'px '+(-me.icon[1]*48+6)+'px;"></div>';
							upgradesOwned++;
						}
					}
					else
					{
						str2+='<div onclick="Game.UpgradesById['+me.id+'].toggle();" class="crate upgrade'+(me.bought>0?' enabled':'')+'" '+Game.getTooltip(
						'<div style="min-width:200px;"><div style="float:right;"><span class="price">'+Beautify(Math.round(me.basePrice))+'</span></div><small>[Upgrade]'+(me.bought>0?' [Purchased]':'')+'</small><div class="name">'+me.name+'</div><div class="description">'+me.desc+'</div></div>'
						,0,0,'bottom-right')+' style="background-position:'+(-me.icon[0]*48+6)+'px '+(-me.icon[1]*48+6)+'px;"></div>';
						upgradesOwned++;
					}
					if (me.hide!=3) upgradesTotal++;
					if (me.type=='computer') computerUpgrades+=str2; else if(me.type=='Super') SuperUpgrades+=str2;
					else if(me.type=='Google') GoogleUpgrades+=str2; else upgrades+=str2;

				}
				var achievements='';
				var shadowAchievements='';
				var achievementsOwned=0;
				var achievementsTotal=0;

				var list=[];
				for (var i in Game.Achievements)//sort the achievements
				{
					list.push(Game.Achievements[i]);
				}
				var sortMap=function(a,b)
				{
					if (a.order>b.order) return 1;
					else if (a.order<b.order) return -1;
					else return 0;
				}
				list.sort(sortMap);

				for (var i in list)
				{
					var me=list[i];
					if (!me.disabled && me.hide!=3 || me.won>0) achievementsTotal++;
					if (me.won>0 && me.hide==3)
					{
						shadowAchievements+='<div class="crate achievement enabled" '+Game.getTooltip(
						'<div style="min-width:200px;"><small>[Achievement] [Unlocked]'+(me.hide==3?' [Shadow]':'')+'</small><div class="name">'+me.name+'</div><div class="description">'+me.desc+'</div></div>'
						,0,0,'bottom-right')+' style="background-position:'+(-me.icon[0]*48+6)+'px '+(-me.icon[1]*48+6)+'px;"></div>';
						achievementsOwned++;
					}
					else if (me.won>0)
					{
						achievements+='<div class="crate achievement enabled" '+Game.getTooltip(
						'<div style="min-width:200px;"><small>[Achievement] [Unlocked]'+(me.hide==3?' [Shadow]':'')+'</small><div class="name">'+me.name+'</div><div class="description">'+me.desc+'</div></div>'
						,0,0,'bottom-right')+' style="background-position:'+(-me.icon[0]*48+6)+'px '+(-me.icon[1]*48+6)+'px;"></div>';
						achievementsOwned++;
					}
					else if (me.hide==0)
					{//onclick="Game.Win(\''+me.name+'\');"
						achievements+='<div class="crate achievement" '+Game.getTooltip(
						'<div style="min-width:200px;"><small>[Achievement]</small><div class="name">'+me.name+'</div><div class="description">'+me.desc+'</div></div>'
						,0,0,'bottom-right')+' style="background-position:'+(-me.icon[0]*48+6)+'px '+(-me.icon[1]*48+6)+'px;"></div>';
					}
					else if (me.hide==1)
					{//onclick="Game.Win(\''+me.name+'\');"
						achievements+='<div class="crate achievement" '+Game.getTooltip(
						'<div style="min-width:200px;"><small>[Achievement]</small><div class="name">'+me.name+'</div><div class="description">???</div></div>'
						,0,0,'bottom-right')+' style="background-position:'+(-0*48+6)+'px '+(-7*48+6)+'px;"></div>';
					}
					else if (me.hide==2)
					{//onclick="Game.Win(\''+me.name+'\');"
						achievements+='<div class="crate achievement" '+Game.getTooltip(
						'<div style="min-width:200px;"><small>[Achievement]</small><div class="name">???</div><div class="description">???</div></div>'
						,0,0,'bottom-right')+' style="background-position:'+(-0*48+6)+'px '+(-7*48+6)+'px;"></div>';
					}
				}
				var milkName='plain milk';
				if (Game.milkProgress>=2.5) milkName='raspberry milk';
				else if (Game.milkProgress>=1.5) milkName='chocolate milk';

				var researchStr=Game.sayTime(Game.researchT);
				var pledgeStr=Game.sayTime(Game.pledgeT);
				var wrathStr='';
				if (Game.elderWrath==1) wrathStr='awoken';
				else if (Game.elderWrath==2) wrathStr='displeased';
				else if (Game.elderWrath==3) wrathStr='angered';
				else if (Game.elderWrath==0 && Game.pledges>0) wrathStr='appeased';

				var date=new Date();
				date.setTime(new Date().getTime()-Game.startDate);
				date=Game.sayTime(date.getTime()/1000*Game.fps);


				str+='<div class="section">Statistics</div>'+
				'<div class="subsection">'+
				'<div class="title">General</div>'+
				'<div class="listing"><b>Computers in bank :</b> <div class="price plain">'+Beautify(Game.computers)+'</div></div>'+
				'<div class="listing"><b>Computers created (all time) :</b> <div class="price plain">'+Beautify(Game.computersEarned)+'</div></div>'+
				(Game.computersReset>0?'<div class="listing"><b>Computers forfeited by resetting :</b> <div class="price plain">'+Beautify(Game.computersReset)+'</div></div>':'')+
				'<div class="listing"><b>Game started :</b> '+date+' ago</div>'+
				'<div class="listing"><b>Buildings owned :</b> '+Beautify(buildingsOwned)+'</div>'+
				'<div class="listing"><b>Computers per second :</b> '+Beautify(Game.computersPs,1)+' <small>(multiplier : '+Beautify(Math.round(Game.globalCpsMult*100),1)+'%)</small></div>'+
				'<div class="listing"><b>Computers per click :</b> '+Beautify(Game.computedMouseCps,1)+'</div>'+
				'<div class="listing"><b>Computer clicks :</b> '+Beautify(Game.computerClicks)+'</div>'+
				'<div class="listing"><b>Hand-made computers :</b> '+Beautify(Game.handmadeComputers)+'</div>'+
				'<div class="listing"><b>Golden computer clicks :</b> '+Beautify(Game.goldenClicks)+'</div>'+//' <span class="hidden">(<b>Missed golden computers :</b> '+Beautify(Game.missedGoldenClicks)+')</span></div>'+
				'<br><div class="listing"><b>Running version :</b> '+Game.version+'</div>'+

				((researchStr!='' || wrathStr!='' || pledgeStr!='')?(
				'</div><div class="subsection">'+
				'<div class="title">Special</div>'+
				(researchStr!=''?'<div class="listing"><b>Research :</b> '+researchStr+' remaining</div>':'')+
				(wrathStr!=''?'<div class="listing"><b>Grandmatriarchs status :</b> '+wrathStr+'</div>':'')+
				(pledgeStr!=''?'<div class="listing"><b>Pledge :</b> '+pledgeStr+' remaining</div>':'')+
				''
				):'')+

				(Game.prestige['Heavenly chips']>0?(
				'</div><div class="subsection">'+
				'<div class="title">Prestige</div>'+
				'<div class="listing"><small>(Note : each heavenly chip grants you +2% CpS multiplier. You can gain more chips by resetting with a lot of computers.)</small></div>'+
				'<div class="listing"><div class="icon" style="background-position:'+(-19*48)+'px '+(-7*48)+'px;"></div> <span style="vertical-align:100%;"><span class="title" style="font-size:22px;">'+Game.prestige['Heavenly chips']+' heavenly chip'+(Game.prestige['Heavenly chips']==1?'':'s')+'</span> (+'+(Game.prestige['Heavenly chips']*2)+'% CpS)</span></div>'):'')+

				'</div><div class="subsection">'+
				'<div class="title">Upgrades unlocked</div>'+
				'<div class="listing"><b>Unlocked :</b> '+upgradesOwned+'/'+upgradesTotal+' ('+Math.round((upgradesOwned/upgradesTotal)*100)+'%)</div>'+
				'<div class="listing" style="overflow-y:hidden;">'+upgrades+'</div>'+
				(computerUpgrades!=''?('<div class="listing"><b>Computer upgrades</b></div>'+
				'<div class="listing" style="overflow-y:hidden;">'+computerUpgrades+'</div>'):'')+
				(SuperUpgrades!=''?('<div class="listing"><b>Super Upgrades</b></div>'+
				'<div class="listing" style="overflow-y:hidden;">'+SuperUpgrades+'</div>'):'')+
				(GoogleUpgrades!=''?('<div class="listing"><b>Google Power!</b></div>'+
				'<div class="listing" style="overflow-y:hidden;">'+GoogleUpgrades+'</div>'):'')+
				'</div><div class="subsection" style="padding-bottom:128px;">'+
				'<div class="title">Achievements</div>'+
				'<div class="listing"><b>Unlocked :</b> '+achievementsOwned+'/'+achievementsTotal+' ('+Math.round((achievementsOwned/achievementsTotal)*100)+'%)</div>'+
				'<div class="listing"><b>Milk :</b> '+Math.round(Game.milkProgress*100)+'% ('+milkName+') <small>(Note : you gain milk through achievements. Milk can unlock unique upgrades over time.)</small></div>'+
				'<div class="listing" style="overflow-y:hidden;">'+achievements+'</div>'+
				(shadowAchievements!=''?(
					'<div class="listing"><b>Shadow achievements</b> <small>(These are feats that are either unfair or difficult to attain. They do not give milk.)</small></div>'+
					'<div class="listing" style="overflow-y:hidden;">'+shadowAchievements+'</div>'
				):'')+
				'</div>'
				;
			}
			l('menu').innerHTML=str;
		}
		l('prefsButton').onclick=function(){Game.ShowMenu('prefs');};
		l('statsButton').onclick=function(){Game.ShowMenu('stats');};
		var songs = new Array("img/songs/doomsday.mp3","img/songs/ICantStop.mp3","img/songs/Daymanstep.mp3","img/songs/WelcomeToFyrestone.mp3","img/songs/WarriorBoss.mp3","img/songs/GuileTheme.mp3");
		var csongs = new Array("img/songs/santaclauseiscomingtotown.mp3","img/songs/MarshmallowWorld.mp3","img/songs/rudolphtherednosedreindeer.mp3","img/songs/LetItSnow.mp3","img/songs/HomeAloneRemix.mp3");
		var randomnum = 0;
		var randomcsong = 0;
		random=function(){
			randomnum = Math.floor((Math.random()*songs.length))
			randomcsong = Math.floor((Math.random()*csongs.length))
		}
		l('logButton').onclick=function(){Game.ShowMenu('log');};

		var i = 0

		function PlayPause(audioFile,volume) {
			var audie = document.getElementById("myAudio");
			audie.load();
		    audie.volume = volume;
		    if (!audie.src || audie.src !== audioFile){audie.src = audioFile;}
		    if (i == 0){audie.play(); i = 1;}
		    else if(i == 1){audie.pause(); i = 2;}
		    else{audie.play(); i = 1;}
		}
		l('musicButton').onclick=function(){ if(Game.prefs.christmas) {PlayPause(csongs[randomcsong],0.1);} else {PlayPause(songs[randomnum],0.1);}}
		/*=====================================================================================
		TOOLTIP
		=======================================================================================*/
		Game.tooltip={text:'',x:0,y:0,origin:0,on:0};
		Game.tooltip.draw=function(from,text,x,y,origin)
		{
			this.text=text;
			this.x=x;
			this.y=y;
			this.origin=origin;
			var tt=l('tooltip');
			var tta=l('tooltipAnchor');
			tta.style.display='block';
			var rect=from.getBoundingClientRect();
			//var screen=tta.parentNode.getBoundingClientRect();
			var x=0,y=0;
			tt.style.left='auto';
			tt.style.top='auto';
			tt.style.right='auto';
			tt.style.bottom='auto';
			tta.style.left='auto';
			tta.style.top='auto';
			tta.style.right='auto';
			tta.style.bottom='auto';
			tt.style.width='auto';
			tt.style.height='auto';
			if (this.origin=='left')
			{
				x=rect.left;
				y=rect.top;
				tt.style.right='0';
				tt.style.top='0';
			}
			else if (this.origin=='bottom-right')
			{
				x=rect.right;
				y=rect.bottom;
				tt.style.right='0';
				tt.style.top='0';
			}
			else {alert('Tooltip anchor '+this.origin+' needs to be implemented');}
			tta.style.left=Math.floor(x+this.x)+'px';
			tta.style.top=Math.floor(y-32+this.y)+'px';
			tt.innerHTML=unescape(text);
			this.on=1;
		}
		Game.tooltip.hide=function()
		{
			l('tooltipAnchor').style.display='none';
			this.on=0;
		}
		Game.getTooltip=function(text,x,y,origin)
		{
			origin=(origin?origin:'middle');
			return 'onMouseOut="Game.tooltip.hide();" onMouseOver="Game.tooltip.draw(this,\''+escape(text)+'\','+x+','+y+',\''+origin+'\');"';
		}

		/*=====================================================================================
		NEWS TICKER
		=======================================================================================*/
		Game.Ticker='';
		Game.TickerAge=0;
		Game.TickerN=0;
		Game.getNewTicker=function()
		{
			var list=[];

			if (Game.TickerN%2==0 || Game.computersEarned>=10100000000)
			{
				if (Game.Objects['Mr. Trusty'].amount>0) list.push(choose([
				'<q>Nice code.</q><sig>Mr. Trusty</sig>',
				'<q>We\'re nice Mr. Trustys.</q><sig>Mr. Trusty</sig>',
				'<q>Indentured servitude.</q><sig>Mr. Trusty</sig>',
				'<q>Come give Mr. Trusty a kiss.</q><sig>Mr. Trusty</sig>',
				'<q>Why don\'t you work more?</q><sig>Mr. Trusty</sig>',
				'<q>Shut up Tom-ass</q><sig>Mr. Trusty</sig>'
				]));

				if (Game.Objects['Mr. Trusty'].amount>=50) list.push(choose([
				'<q>Absolutely disgusting code.</q><sig>Mr. Trusty</sig>',
				'<q>You make me sick.</q><sig>Mr. Trusty</sig>',
				'<q>You disgust me.</q><sig>Mr. Trusty</sig>',
				'<q>Ole Susan was a funny old man.</q><sig>Mr. Trusty</sig>',
				'<q>The code begins.</q><sig>Mr. Trusty</sig>',
				'<q>The code\'ll be over soon.</q><sig>Mr. Trusty</sig>',
				'<q>You could have fixed it.</q><sig>Mr. Trusty</sig>'
				]));

				if (Game.HasAchiev('Just wrong')) list.push(choose([
				'News : computer manufacturer downsizes, sells Mr. Trusty!',
				'<q>It has used while(true), the filthy little thing.</q><sig>Mr. Trusty</sig>',
				'<q>It tried to get rid of me, the nasty little thing.</q><sig>Mr. Trusty</sig>',
				'<q>It thought I would go away because it was coding. How quaint.</q><sig>Mr. Trusty</sig>',
				'<q>I can smell your bad code.</q><sig>Mr. Trusty</sig>'
				]));

				if (Game.Objects['Mr. Trusty'].amount>=1 && Game.pledges>0 && Game.elderWrath==0) list.push(choose([
				'<q>Always code</q><sig>Mr. Trusty</sig>',
				'<q>Keep coding</q><sig>Mr. Trusty</sig>',
				'<q>Code</q><sig>Mr. Trusty</sig>',
				'<q>Code more</q><sig>Mr. Trusty</sig>',
				'<q>We will code mode.</q><sig>Mr. Trusty</sig>',
				'<q>A mere setback in the code.</q><sig>Mr. Trusty</sig>',
				'<q>We are not happy with the code.</q><sig>Mr. Trusty</sig>',
				'<q>Too late.</q><sig>Mr. Trusty</sig>'
				]));

				if (Game.Objects['Farm'].amount>0) list.push(choose([
				'News : Computer farms suspected of employing a student workforce!',
				'News : computer farms release harmful silicon in our rivers, says scientist!',
				'News : genetically-modified Mr. Trusty controversy strikes computer farmers!',
				'News : free-range farm computers popular with today\'s hip youth, says specialist.',
				'News : farm computers deemed unfit for Apple fan boys, says nutritionist.'
				]));

				if (Game.Objects['Factory'].amount>0) list.push(choose([
				'News : computer factories linked to global warming!',
				'News : computer factories involved in computer weather controversy!',
				'News : computer factories on strike, robotic minions employed to replace workforce!',
				'News : computer factories on strike - workers demand to stop being paid in computer!',
				'News : factory-made computer linked to success, says study.'
				]));

				if (Game.Objects['Mine'].amount>0) list.push(choose([
				'News : '+Math.floor(Math.random()*1000+2)+' computers broken in mine catastrophe!',
				'News : '+Math.floor(Math.random()*1000+2)+' computers trapped in collapsed chocolate mine!',
				'News : computer mines found to cause earthquakes and sink holes!',
				'News : computer mine goes awry, floods village in chocolate!',
				'News : depths of computer mines found to house "peculiar, Mr. Trusty-y beings"!'
				]));

				if (Game.Objects['Shipment'].amount>0) list.push(choose([
				'News : new computer planet found, becomes target of computer-trading spaceships!',
				'News : massive computer planet found with 99.8% certified pure computer core!',
				'News : space tourism booming as distant planets attract more bored millionaires!',
				'News : computer-based organisms found on distant planet!',
				'News : ancient computing artifacts found on distant planet; "terrifying implications", experts say.'
				]));

				if (Game.Objects['Alchemy lab'].amount>0) list.push(choose([
				'News : national gold reserves dwindle as more and more of the precious mineral is turned to computers!',
				'News : computerized jewelry found fashionable, gold and diamonds "just a fad", says specialist.',
				'News : silver found to also be transmutable into PCs!',
				'News : defective alchemy lab shut down, found to convert computer to useless gold.',
				'News : alchemy-made computers shunned by purists!'
				]));

				if (Game.Objects['Portal'].amount>0) list.push(choose([
				'News : nation worried as more and more unsettling creatures emerge from dimensional portals!',
				'News : dimensional portals involved in city-engulfing disaster!',
				'News : tourism to Trustyverse popular with bored teenagers! Casualty rate as high as 73%!',
				'News Trustyportals suspected to cause fast aging and obsession with baking, says study.',
				'News : "do not settle near portals," says specialist; "your children will become strange and corrupted inside."'
				]));

				if (Game.Objects['Time machine'].amount>0) list.push(choose([
				'News : time machines involved in history-rewriting scandal! Or are they?',
				'News : time machines used in unlawful time tourism!',
				'News : computers brought back from the past "unfit for human use", says historian.',
				'News : various historical figures inexplicably replaced with talking lumps computers!',
				'News : "I have seen the future," says time machine operator, "and I do not wish to go there again."'
				]));

				if (Game.Objects['TrustyMan'].amount>0) list.push(choose([
				'News : Trustyman saves the day once again. He fixed all codes in no time at all.',
				'News : "explain to me again why we need Trustyman to fix computers?" asks misguided local teacher.',
				'News : first Trustyman successfully hired, doesn\'t rip apart computers!',
				'News : researchers conclude that what the computer industry needs, first and foremost, is "more magnets".',
				'News : "unravelling the fabric of reality just makes these computers so much faster", claims scientist.'
				]));

				if (Game.HasAchiev('Base 10')) list.push('News : computer manufacturer completely forgoes common sense, lets OCD drive building decisions!');
				if (Game.HasAchiev('From scratch')) list.push('News : follow the tear-jerking, riches-to-rags story about a local computer manufacturer who decided to give it all up!');
				if (Game.HasAchiev('A world filled with computers')) list.push('News : known universe now jammed with computers! No vacancies!');
				if (Game.HasAchiev('Serendipity')) list.push('News : local computer manufacturer becomes luckiest being alive!');

				if (Game.Has('Kitten helpers')) list.push('News : faint meowing heard around local computer facilities; suggests new ingredient being tested.');
				if (Game.Has('Kitten workers')) list.push('News : crowds of meowing kittens with little hard hats reported near local computer facilities.');
				if (Game.Has('Kitten engineers')) list.push('News : surroundings of local computer facilities now overrun with kittens in adorable little suits. Authorities advise to stay away from the premises.');
				if (Game.Has('Kitten overseers')) list.push('News : locals report troups of bossy kittens meowing adorable orders at passerbys.');

				var animals=['newts','penguins','scorpions','axolotls','puffins','porpoises','blowfish','horses','crayfish','slugs','humpback whales','nurse sharks','giant squids','polar bears','fruit bats','frogs','sea squirts','velvet worms','mole rats','paramecia','nematodes','tardigrades','giraffes'];
				if (Game.computersEarned>=10000) list.push(
				'News : '+choose([
					'Mr. Trusty found to '+choose(['increase lifespan','sensibly increase intelligence','reverse aging','decrease hair loss','prevent arthritis','cure blindness'])+' in '+choose(animals)+'!',
					'Mr. Trusty found to make '+choose(animals)+' '+choose(['more docile','more handsome','nicer','less hungry','more pragmatic','tastier'])+'!',
					'Mr. Trusty tested on '+choose(animals)+', found to have no ill effects.',
					'Mr. Trusty unexpectedly popular among '+choose(animals)+'!',
					'unsightly lumps found on '+choose(animals)+' near Dowling Catholic; "they\'ve pretty much always looked like that", say biologists.',
					'new species of '+choose(animals)+' discovered in distant country; "yup, tastes like computers", says biologist.',
					'computers worked well by '+choose(animals)+', says controversial chef.',
					'"are your computers run by '+choose(animals)+'?", asks PSA warning against counterfeit computers.'
					]),
				'News : "'+choose([
					'I\'m all about Mr. Trusty',
					'I just can\'t stop thinking about Mr. Trusty. I think I seriously need help',
					'I guess I have a computer problem',
					'I\'m not addicted to Mr. Trusty. That\'s just speculation by fans with too much free time',
					'my upcoming album contains 3 songs about Mr. Trusty',
					'I\'ve had dreams about Mr. Trusty 3 nights in a row now. I\'m a bit worried honestly',
					'accusations of computer abuse are only vile slander',
					'Mr. Trusty really helped me when I was feeling low',
					'computers are the secret behind my perfect skin',
					'Mr. Trusty helped me stay sane while filming my upcoming movie',
					'Mr. Trusty helped me stay thin and healthy',
					'Sam B. only knows one letter, and that\'s gaspedal',
					'alright, I\'ll say it - I\'ve never eaten a single computer in my life'
					])+'", reveals celebrity.',
				'News : '+choose(['doctors recommend twice-daily consumption of computer.','doctors warn against computer-sniffing teen fad.','doctors advise against new computer-free fad diet.','doctors warn mothers about the dangers of "home-made computers".']),
				choose([
					'News : scientist predicts imminent computer-related "end of the world"; becomes joke among peers.',
					'News : man robs bank, buys Mr. Trusty stuff.',
					'News : what makes Mr. Trusty seem so right? "Probably all the [*****] they put in them", says anonymous tipper.',
					'News : man found allergic to Mr. Trusty; "what a weirdo", says family.',
					'News : foreign politician involved in computer-smuggling scandal.',
					'News : Mr. Trusty now more popular than '+choose(['cough drops','broccoli','smoked herring','cheese','video games','stable jobs','relationships','time travel','cat videos','tango','fashion','television','nuclear warfare','whatever it is we ate before','politics','oxygen','lamps'])+', says study.',
					'News : obesity epidemic strikes nation; experts blame '+choose(['twerking','that darn rap music','video-games','lack of computers','mysterious ghostly entities','aliens','parents','schools','comic-books','computer-sniffing fad'])+'.',
					'News : computer shortage strikes town, people forced to use Macs; "just not the same", concedes mayor.',
					'News : "you gotta admit, all this Mr. Trusty stuff is a bit ominous", says confused idiot.',
					'News : movie cancelled from lack of actors; "everybody\'s at home eating computers", laments director.',
					'News : comedian forced to cancel Mr. Trusty routine due to unrelated indigestion.',
					'News : new Mr. Trusty-based religion sweeps the nation.',
					'News : fossil records show Mr. Trusty-based organisms prevalent during Cambrian explosion, scientists say.',
					'News : mysterious illegal computer seized; "works terribly", says police.',
					'News : man found dead after insulting Mr. Trusty; investigators favor "mafia snitch" hypothesis.',
					'News : "the universe pretty much loops on itself," suggests researcher; "it\'s computers all the way down."',
					'News : minor computer-related incident turns whole town to ashes; neighboring cities asked to chip in for reconstruction.',
					'News : is our media controlled by the computer industry? This could very well be the case, says crackpot conspiracy theorist.',
					'News : '+choose(['computer-flavored popcorn pretty damn popular; "we kinda expected that", say scientists.','Mr. Trusty\'s cereals break all known cereal-related records','computers popular among all age groups, including fetuses, says study.','Mr. Trusty\'s popcorn sales exploded during screening of Mr. Trusty II : The Moistening.']),
					'News : all-computer restaurant opening downtown. Dishes such as braised computer, computer thermidor, and for dessert : crepes.',
					'News : computers could be the key to '+choose(['eternal life','infinite riches','eternal youth','eternal beauty','curing baldness','world peace','solving world hunger','ending all wars world-wide','making contact with extraterrestrial life','mind-reading','better living','better eating','more interesting TV shows','faster-than-light travel','quantum baking','Mr. Trusty-y goodness','gooder thoughtness'])+', say scientists.',
					'News : "Mr. Trusty, you\'re so cool!" says Tom-ass'
					])
				);
			}

			if (list.length==0)
			{
				if (Game.computersEarned<5) list.push('You feel like making computers. But nobody wants to use your computers.');
				else if (Game.computersEarned<50) list.push('Your first computer goes to the trash. The neighborhood raccoon barely uses it.');
				else if (Game.computersEarned<100) list.push('Your family accepts to try one of your computers.');
				else if (Game.computersEarned<500) list.push('Your computers are popular in the neighborhood.');
				else if (Game.computersEarned<1000) list.push('People are starting to talk about your computers.');
				else if (Game.computersEarned<3000) list.push('Your computers are talked about for miles around.');
				else if (Game.computersEarned<6000) list.push('Your computers are renowned in the whole town!');
				else if (Game.computersEarned<10000) list.push('Your computers bring all the boys to the yard.');
				else if (Game.computersEarned<20000) list.push('Your computers now have their own website!');
				else if (Game.computersEarned<30000) list.push('Your computers are worth a lot of money.');
				else if (Game.computersEarned<40000) list.push('Your computers sell very well in distant countries.');
				else if (Game.computersEarned<60000) list.push('People come from very far away to try your computers.');
				else if (Game.computersEarned<80000) list.push('Kings and queens from all over the world are enjoying your computers.');
				else if (Game.computersEarned<100000) list.push('There are now museums dedicated to Mr. Trusty.');
				else if (Game.computersEarned<200000) list.push('A national day has been created in honor of Mr. Trusty.');
				else if (Game.computersEarned<300000) list.push('Your computers have been named a part of the world wonders.');
				else if (Game.computersEarned<450000) list.push('History books now include a whole chapter about Mr. Trusty.');
				else if (Game.computersEarned<600000) list.push('Your computers have been placed under government surveillance.');
				else if (Game.computersEarned<1000000) list.push('The whole planet is enjoying your computers!');
				else if (Game.computersEarned<5000000) list.push('Strange creatures from neighboring planets wish to try your computers.');
				else if (Game.computersEarned<10000000) list.push('Elder gods from the whole cosmos have awoken to try your computers.');
				else if (Game.computersEarned<30000000) list.push('Beings from other dimensions lapse into existence just to try your computers.');
				else if (Game.computersEarned<100000000) list.push('Your computers have achieved sentience.');
				else if (Game.computersEarned<300000000) list.push('The universe has now turned into computer hardware, to the molecular level.');
				else if (Game.computersEarned<1000000000) list.push('Your computers are rewriting the fundamental laws of the universe.');
				else if (Game.computersEarned<10000000000) list.push('A local news station runs a 10-minute segment about your computers. Success!<br><span style="font-size:50%;">(you win a computer)</span>');
				else if (Game.computersEarned<10100000000) list.push('it\'s time to stop playing');//only show this for 100 millions (it's funny for a moment)
			}

			if (Game.elderWrath>0 && (Game.pledges==0 || Math.random()<0.5))
			{
				list=[];
				if (Game.elderWrath==1) list.push(choose([
					'News : Mr. Trusty reported missing!',
					'News : Mr. Trusty sighted around computer facilities!',
					'News : families around the continent report an agitated, transfixed Mr. Trusty!',
					'News : doctors swarmed by cases of old women with glassy eyes and a foamy mouth!',
					'News : nurses report "strange scent of computers" around Mr. Trusty!'
				]));
				if (Game.elderWrath==2) list.push(choose([
					'News : town in disarray as Mr. Trusty breakS into homes to steal computers and tablets!',
					'News : sightings of Mr. Trusty with glowing eyes terrify local population!',
					'News : retirement homes report "computers slowly awakening from their slumber"!',
					'News : whole continent undergoing mass exodus of walking computers!',
					'News : computers freeze in place in streets, ooze warm sugary syrup!'
				]));
				if (Game.elderWrath==3) list.push(choose([
					'News : large "digital highways" scar continent, stretch between various computer facilities!',
					'News : wrinkled "digital tendrils" visible from space!',
					'News : remains of "old computers" found frozen in the middle of growing digital structures!',
					'News : all hope lost as writhing mass of data and code engulfs whole city!',
					'News : nightmare continues as wrinkled acres of data expand at alarming speeds!'
				]));
			}

			Game.TickerAge=Game.fps*10;
			Game.Ticker=choose(list);
			Game.TickerN++;
		}
		Game.TickerDraw=function()
		{
			var str='';
			var o=0;
			if (Game.Ticker!='')
			{
				if (Game.TickerAge<Game.fps*1 && 1==2)//too bad this doesn't work well with html tags
				{
					str=Game.Ticker.substring(0,(Game.Ticker+'<').indexOf('<'));
					str=str.substring(0,str.length*Math.min(1,Game.TickerAge/(Game.fps*1)));
				}
				else str=Game.Ticker;
				//o=Math.min(1,Game.TickerAge/(Game.fps*0.5));//*Math.min(1,1-(Game.TickerAge-Game.fps*9.5)/(Game.fps*0.5));
			}
			//l('commentsText').style.opacity=o;
			l('commentsText').innerHTML=str;
			//'<div style="font-size:70%;"><span onclick="Game.Earn(1000);">add 1,000</span> | <span onclick="Game.Earn(1000000);">add 1,000,000</span></div>';
		}


		/*=====================================================================================
		BUILDINGS
		=======================================================================================*/
		Game.storeToRebuild=1;
		Game.priceIncrease=1.15;
		var objectNameList = []
		Game.Objects=[];
		Game.ObjectsById=[];
		Game.ObjectsN=0;
		Game.BuildingsOwned=0;
		Game.Object=function(name,commonName,desc,pic,icon,background,price,cps,drawFunction,buyFunction)
		{
			this.id=Game.ObjectsN;
			this.name=name;
			this.displayName=this.name;
			commonName=commonName.split('|');
			this.single=commonName[0];
			this.plural=commonName[1];
			this.actionName=commonName[2];
			this.desc=desc;
			this.basePrice=price;
			this.price=this.basePrice;
			this.cps=cps;
			this.totalComputers=0;
			this.storedCps=0;
			this.storedTotalCps=0;
			this.pic=pic;
			this.icon=icon;
			this.background=background;
			this.buyFunction=buyFunction;
			this.drawFunction=drawFunction;

			this.special=null;//special is a function that should be triggered when the object's special is unlocked, or on load (if it's already unlocked). For example, creating a new dungeon.
			this.onSpecial=0;//are we on this object's special screen (dungeons etc)?
			this.specialUnlocked=0;
			this.specialDrawFunction=null;
			this.drawSpecialButton=null;

			this.amount=0;
			this.bought=0;

			this.buy=function()
			{
				var price=this.basePrice*Math.pow(Game.priceIncrease,this.amount);
				if (Game.computers>=price)
				{
					Game.Spend(price);
					this.amount++;
					this.bought++;
					price=this.basePrice*Math.pow(Game.priceIncrease,this.amount);
					this.price=price;
					if (this.buyFunction) this.buyFunction();
					if (this.drawFunction) this.drawFunction();
					Game.storeToRebuild=1;
					Game.recalculateGains=1;
					if (this.amount==1 && this.id!=0) l('row'+this.id).className='row enabled';
					Game.BuildingsOwned++;
				}
			}
			this.sell=function()
			{
				var price=this.basePrice*Math.pow(Game.priceIncrease,this.amount);
				price=Math.floor(price*0.5);
				if (this.amount>0)
				{
					//Game.Earn(price);
					Game.computers+=price;
					this.amount--;
					price=this.basePrice*Math.pow(Game.priceIncrease,this.amount);
					this.price=price;
					if (this.sellFunction) this.sellFunction();
					if (this.drawFunction) this.drawFunction();
					Game.storeToRebuild=1;
					Game.recalculateGains=1;
					Game.BuildingsOwned--;
				}
			}

			this.setSpecial=function(what)//change whether we're on the special overlay for this object or not
			{
				if (what==1) this.onSpecial=1;
				else this.onSpecial=0;
				if (this.id!=0)
				{
					if (this.onSpecial)
					{
						l('rowSpecial'+this.id).style.display='block';
						if (this.specialDrawFunction) this.specialDrawFunction();
					}
					else
					{
						l('rowSpecial'+this.id).style.display='none';
						if (this.drawFunction) this.drawFunction();
					}
				}
			}
			this.unlockSpecial=function()
			{
				if (this.specialUnlocked==0)
				{
					this.specialUnlocked=1;
					this.setSpecial(0);
					if (this.special) this.special();
					this.refresh();
				}
			}

			this.refresh=function()
			{
				this.price=this.basePrice*Math.pow(Game.priceIncrease,this.amount);
				if (this.amount==0 && this.id!=0) l('row'+this.id).className='row';
				else if (this.amount>0 && this.id!=0) l('row'+this.id).className='row enabled';
				if (this.drawFunction && !this.onSpecial) this.drawFunction();
				//else if (this.specialDrawFunction && this.onSpecial) this.specialDrawFunction();
			}

			if (this.id!=0)//draw it
			{
				var str='<div class="row" id="row'+this.id+'"><div class="separatorBottom"></div><div class="content"><div id="rowBackground'+this.id+'" class="background" style="background:url(img/'+this.background+'.png) repeat-x;"><div class="backgroundLeft"></div><div class="backgroundRight"></div></div><div class="objects" id="rowObjects'+this.id+'"> </div></div><div class="special" id="rowSpecial'+this.id+'"></div><div class="specialButton" id="rowSpecialButton'+this.id+'"></div><div class="info" id="rowInfo'+this.id+'"><div class="infoContent" id="rowInfoContent'+this.id+'"></div><div><a onclick="Game.ObjectsById['+this.id+'].sell();">Sell 1</a></div></div></div>';
				l('rows').innerHTML=l('rows').innerHTML+str;
			}

			Game.Objects[this.name]=this;
			Game.ObjectsById[this.id]=this;
			Game.ObjectsN++;
			return this;
		}

		Game.NewDrawFunction=function(pic,xVariance,yVariance,w,shift,heightOffset)
		{
			//pic : either 0 (the default picture will be used), a filename (will be used as override), or a function to determine a filename
			//xVariance : the pictures will have a random horizontal shift by this many pixels
			//yVariance : the pictures will have a random vertical shift by this many pixels
			//w : how many pixels between each picture (or row of pictures)
			//shift : if >1, arrange the pictures in rows containing this many pictures
			//heightOffset : the pictures will be displayed at this height, +32 pixels
			return function()
			{
				if (pic==0 && typeof(pic)!='function') pic=this.pic;
				shift=shift || 1;
				heightOffset=heightOffset || 0;
				var bgW=0;
				var str='';
				var offX=0;
				var offY=0;

				if (this.drawSpecialButton && this.specialUnlocked)
				{
					l('rowSpecialButton'+this.id).style.display='block';
					l('rowSpecialButton'+this.id).innerHTML=this.drawSpecialButton();
					str+='<div style="width:128px;height:128px;">'+this.drawSpecialButton()+'</div>';
					l('rowInfo'+this.id).style.paddingLeft=(8+128)+'px';
					offX+=128;
				}

				for (var i=0;i<this.amount;i++)
				{
					if (shift!=1)
					{
						var x=Math.floor(i/shift)*w+((i%shift)/shift)*w+Math.floor((Math.random()-0.5)*xVariance)+offX;
						var y=32+heightOffset+Math.floor((Math.random()-0.5)*yVariance)+((-shift/2)*32/2+(i%shift)*32/2)+offY;
					}
					else
					{
						var x=i*w+Math.floor((Math.random()-0.5)*xVariance)+offX;
						var y=32+heightOffset+Math.floor((Math.random()-0.5)*yVariance)+offY;
					}
					var usedPic=(typeof(pic)=='function'?pic():pic);
					str+='<div class="object" style="background:url(img/'+usedPic+'.png);left:'+x+'px;top:'+y+'px;z-index:'+Math.floor(1000+y)+';"></div>';
					bgW=Math.max(bgW,x+64);
				}
				bgW+=offX;
				l('rowObjects'+this.id).innerHTML=str;
				l('rowBackground'+this.id).style.width=bgW+'px';
			}
		}

		Game.RebuildStore=function()//redraw the store from scratch
		{
			var str='';
			for (var i in Game.Objects)
			{
				var me=Game.Objects[i];
				str+='<div class="product" '+Game.getTooltip(
				'<div style="min-width:300px;"><div style="float:right;"><span class="price">'+Beautify(Math.round(me.price))+'</span></div><div class="name">'+me.name+'</div>'+'<small>[owned : '+me.amount+'</small>]<div class="description">'+me.desc+'</div></div>'
				,0,0,'left')+' onclick="Game.ObjectsById['+me.id+'].buy();" id="product'+me.id+'"><div class="icon" style="background-image:url(img/'+me.icon+'.png);"></div><div class="content"><div class="title">'+me.displayName+'</div><span class="price">'+Beautify(Math.round(me.price))+'</span>'+(me.amount>0?('<div class="title owned">'+me.amount+'</div>'):'')+'</div></div>';
			}
			l('products').innerHTML=str;
			Game.storeToRebuild=0;
		}

		Game.ComputeCps=function(base,add,mult,bonus)
		{
			if (!bonus) bonus=0;
			return ((base+add)*(Math.pow(2,mult))+bonus);
		}

		//define objects
		new Game.Object('Cursor','cursor|cursors|clicked','Mr. Trusty takes control and autoclicks once every 10 seconds.','cursor','cursoricon','',15,function(){
			var add=0;
			if (Game.Has('Thousand fingers')) add+=0.1;
			if (Game.Has('Million fingers')) add+=0.5;
			if (Game.Has('Billion fingers')) add+=2;
			if (Game.Has('Trillion fingers')) add+=10;
			if (Game.Has('Quadrillion fingers')) add+=20;
			if (Game.Has('Quintillion fingers')) add+=100;
			var num=0;
			for (var i in Game.Objects) {if (Game.Objects[i].name!='Cursor') num+=Game.Objects[i].amount;}
			add=add*num;
			return Game.ComputeCps(0.1,Game.Has('Reinforced index finger')*0.1,Game.Has('Carpal tunnel prevention cream')+Game.Has('Ambidextrous'),add);
		},function(){//draw function for cursors
			var str='';
			for (var i=0;i<this.amount;i++)
			{
				/*//old
				var x=Math.floor(Math.sin((i/this.amount)*Math.PI*2)*132)-16;
				var y=Math.floor(Math.cos((i/this.amount)*Math.PI*2)*132)-16;
				var r=Math.floor(-(i/this.amount)*360);
				*/
				//layered
				var n=Math.floor(i/50);
				var a=((i+0.5*n)%50)/50;
				var x=Math.floor(Math.sin(a*Math.PI*2)*(140+n*16))-16;
				var y=Math.floor(Math.cos(a*Math.PI*2)*(140+n*16))-16;
				var r=Math.floor(-(a)*360);
				/*//spiral
				var a=i/50;
				var w=(i/50)*16;
				var x=Math.floor(Math.sin(a*Math.PI*2)*(132+w))-16;
				var y=Math.floor(Math.cos(a*Math.PI*2)*(132+w))-16;
				var r=Math.floor(-(a)*360);
				*/
				str+='<div class="cursor" id="cursor'+i+'" style="left:'+x+'px;top:'+y+'px;transform:rotate('+r+'deg);-moz-transform:rotate('+r+'deg);-webkit-transform:rotate('+r+'deg);-ms-transform:rotate('+r+'deg);-o-transform:rotate('+r+'deg);"></div>';

			}
			l('computerCursors').innerHTML=str;
			if (!l('rowInfo'+this.id)) l('sectionLeftInfo').innerHTML='<div class="info" id="rowInfo'+this.id+'"><div class="infoContent" id="rowInfoContent'+this.id+'"></div><div><a onclick="Game.ObjectsById['+this.id+'].sell();">Sell 1</a></div></div>';
		},function(){
			if (this.amount>=1) Game.Unlock(['Reinforced index finger','Carpal tunnel prevention cream']);
			if (this.amount>=10) Game.Unlock('Ambidextrous');
			if (this.amount>=20) Game.Unlock('Thousand fingers');
			if (this.amount>=40) Game.Unlock('Million fingers');
			if (this.amount>=80) Game.Unlock('Billion fingers');
			if (this.amount>=120) Game.Unlock('Trillion fingers');
			if (this.amount>=160) Game.Unlock('Quadrillion fingers');
			if (this.amount>=200) Game.Unlock('Quintillion fingers');

			if (this.amount>=1) Game.Win('Click');if (this.amount>=2) Game.Win('Double-click');if (this.amount>=50) Game.Win('Mouse wheel');if (this.amount>=100) Game.Win('Of Mice and Men');if (this.amount>=200) Game.Win('The Digital');
		});

		Game.SpecialGrandmaUnlock=15;
		new Game.Object('Mr. Trusty','Mr. Trusty|Mr. Trustys|crafted','Mr. Trusty has mad computer making skillz.','trusty','grandmaIcon','grandmaBackground',100,function(){
			var mult=0;
			if (Game.Has('Farmer Mr. Trustys')) mult++;
			if (Game.Has('Worker Mr. Trustys')) mult++;
			if (Game.Has('Miner Mr. Trustys')) mult++;
			if (Game.Has('Cosmic Mr. Trustys')) mult++;
			if (Game.Has('Transmuted Mr. Trustys')) mult++;
			if (Game.Has('Altered Mr. Trustys')) mult++;
			if (Game.Has('Mr. Trusty\'s Grandma')) mult++;
			if (Game.Has('AntiMr. Trustys')) mult++;
			if (Game.Has('Opera house/Computer lab')) mult+=2;
			if (Game.Has('Ritual rolling pins')) mult++;
			var add=0;
			if (Game.Has('One mind')) add+=Game.Objects['Mr. Trusty'].amount*0.02;
			if (Game.Has('Communal brainsweep')) add+=Game.Objects['Mr. Trusty'].amount*0.02;
			if (Game.Has('Elder Pact')) add+=Game.Objects['Portal'].amount*0.05;
			return Game.ComputeCps(0.5,Game.Has('Forwards from Mr. Trusty')*0.3+add,Game.Has('Steel-plated rolling pins')+Game.Has('Lubricated dentures')+Game.Has('Joe\'s Juice')+mult);
		},Game.NewDrawFunction(function(){
			var list=['trusty'];
			if (Game.Has('Farmer Mr. Trustys')) list.push('farmerTrusty');
			if (Game.Has('Worker Mr. Trustys')) list.push('workerTrusty');
			if (Game.Has('Miner Mr. Trustys')) list.push('minerTrusty');
			if (Game.Has('Cosmic Mr. Trustys')) list.push('cosmicTrusty');
			if (Game.Has('Transmuted Mr. Trustys')) list.push('transmutedTrusty');
			if (Game.Has('Altered Mr. Trustys')) list.push('alteredTrusty');
			if (Game.Has('Mr. Trusty\'s Grandpa')) list.push('trustysGrandpa');
			if (Game.Has('AntiMr. Trustys')) list.push('antitrusty');
			return choose(list);
		},8,8,32,3,16),function(){
			if (this.amount>=1) Game.Unlock(['Forwards from Mr. Trusty','Steel-plated mice']);if (this.amount>=10) Game.Unlock('Lubricated dentures');if (this.amount>=50) Game.Unlock('Joe\'s Juice');
			if (this.amount>=1) Game.Win('Mr. Trusty\'s praise');if (this.amount>=50) Game.Win('Sloppy codes');if (this.amount>=100) Game.Win('Mr. Trusty\'s room');if(this.amount>=1000) Game.Win('Mr. Trusty\'s skill');
		});
		Game.Objects['Mr. Trusty'].sellFunction=function()
		{
			Game.Win('Just wrong');
			if (this.amount==0)
			{
				Game.Lock('Elder Pledge');
				Game.pledgeT=0;
			}
		};

		new Game.Object('Farm','farm|farms|harvested','Grows keyboard plants from mouse seeds.','farm','farmIcon','farmBackground',500,function(){
			return Game.ComputeCps(2,Game.Has('Cheap hoes')*0.5,Game.Has('Fertilizer')+Game.Has('Keyboard trees')+Game.Has('Genetically-modified keyboards'));
		},Game.NewDrawFunction(0,16,16,64,2,32),function(){
			if (this.amount>=1) Game.Unlock(['Cheap hoes','Fertilizer']);if (this.amount>=10) Game.Unlock('Keyboard trees');if (this.amount>=50) Game.Unlock('Genetically-modified keyboards');
			if (this.amount>=Game.SpecialGrandmaUnlock && Game.Objects['Mr. Trusty'].amount>0) Game.Unlock('Farmer Mr. Trustys');
			if (this.amount>=1) Game.Win('My first farm');if (this.amount>=50) Game.Win('Reap what you sow');if (this.amount>=100) Game.Win('Farm ill');
		});

		new Game.Object('Factory','factory|factories|mass-produced','Produces large quantities of Joe\'s Juice to keep Mr. Trusty working.', 'factory', 'factoryIcon', 'factoryBackground', 3000, function(){
			return Game.ComputeCps(10,Game.Has('Sturdier Propel bottles')*4,Game.Has('Joe Brett labor')+Game.Has('Sweatshop')+Game.Has('Radium reactors'));
		},Game.NewDrawFunction(0,32,2,64,1,-22),function(){
			if (this.amount>=1) Game.Unlock(['Sturdier Propel bottles','Joe Brett labor']);if (this.amount>=10) Game.Unlock('Sweatshop');if (this.amount>=50) Game.Unlock('Radium reactors');
			if (this.amount>=Game.SpecialGrandmaUnlock && Game.Objects['Mr. Trusty'].amount>0) Game.Unlock('Worker Mr. Trustys');
			if (this.amount>=1) Game.Win('Production chain');if (this.amount>=50) Game.Win('Industrial revolution');if (this.amount>=100) Game.Win('Global warming');
		});

		new Game.Object('Mine','mine|mines|mined','Mr. Trusty\'s songs cause an avalanche of computers.','mine','mineIcon','mineBackground',10000,function(){
			return Game.ComputeCps(40,Game.Has('Beautiful voice')*10,Game.Has('Mega-mic')+Game.Has('Ultra-mic')+Game.Has('Ultimadrill'));
		},Game.NewDrawFunction(0,16,16,64,2,24),function(){
			if (this.amount>=1) Game.Unlock(['Beautiful voice','Mega-mic']);if (this.amount>=10) Game.Unlock('Ultra-mic');if (this.amount>=50) Game.Unlock('Ultimadrill');
			if (this.amount>=Game.SpecialGrandmaUnlock && Game.Objects['Mr. Trusty'].amount>0) Game.Unlock('Miner Mr. Trustys');
			if (this.amount>=1) Game.Win('You know the drill');if (this.amount>=50) Game.Win('Excavation site');if (this.amount>=100) Game.Win('Hollow the planet');
		});

		new Game.Object('Shipment','shipment|shipments|shipped','Brings in fresh mouses from the Mr. Trusty\'s home planet.','shipment','shipmentIcon','shipmentBackground',40000,function(){
			return Game.ComputeCps(100,Game.Has('Vanilla nebulae')*30,Game.Has('Wormholes')+Game.Has('Frequent flyer')+Game.Has('Warp drive'));
		},Game.NewDrawFunction(0,16,16,64),function(){
			if (this.amount>=1) Game.Unlock(['Vanilla nebulae','Wormholes']);if (this.amount>=10) Game.Unlock('Frequent flyer');if (this.amount>=50) Game.Unlock('Warp drive');
			if (this.amount>=Game.SpecialGrandmaUnlock && Game.Objects['Mr. Trusty'].amount>0) Game.Unlock('Cosmic Mr. Trustys');
			if (this.amount>=1) Game.Win('Expedition');if (this.amount>=50) Game.Win('Galactic highway');if (this.amount>=100) Game.Win('Far far away');
		});

		new Game.Object('Alchemy lab','alchemy lab|alchemy labs|transmuted','Turns gold into computers!','alchemylab','alchemylabIcon','alchemylabBackground',200000,function(){
			return Game.ComputeCps(400,Game.Has('Antimony')*100,Game.Has('Essence of computers')+Game.Has('True C++')+Game.Has('Ambrosia'));
		},Game.NewDrawFunction(0,16,16,64,2,16),function(){
			if (this.amount>=1) Game.Unlock(['Antimony','Essence of computers']);if (this.amount>=10) Game.Unlock('True C++');if (this.amount>=50) Game.Unlock('Ambrosia');
			if (this.amount>=Game.SpecialGrandmaUnlock && Game.Objects['Mr. Trusty'].amount>0) Game.Unlock('Transmuted Mr. Trustys');
			if (this.amount>=1) Game.Win('Transmutation');if (this.amount>=50) Game.Win('Transmogrification');if (this.amount>=100) Game.Win('Gold member');
		});

		new Game.Object('Portal','portal|portals|retrieved','Opens a door to the Trustyverse.','portal','portalIcon','portalBackground',1666666,function(){
			return Game.ComputeCps(6666,Game.Has('Ancient tablet')*1666,Game.Has('Insane oatling workers')+Game.Has('Soul bond')+Game.Has('Sanity dance'));
		},Game.NewDrawFunction(0,32,32,64,2),function(){
			if (this.amount>=1) Game.Unlock(['Ancient tablet','Insane oatling workers']);if (this.amount>=10) Game.Unlock('Soul bond');if (this.amount>=50) Game.Unlock('Sanity dance');
			if (this.amount>=Game.SpecialGrandmaUnlock && Game.Objects['Mr. Trusty'].amount>0) Game.Unlock('Altered Mr. Trustys');
			if (this.amount>=1) Game.Win('A whole new world');if (this.amount>=50) Game.Win('Now you\'re thinking');if (this.amount>=100) Game.Win('Dimensional shift');
		});
		new Game.Object('Time machine','time machine|time machines|recovered','Brings Mr. Trusty from the past, before he was even a teacher.','timemachine','timemachineIcon','timemachineBackground',123456789,function(){
			return Game.ComputeCps(98765,Game.Has('Flux capacitors')*9876,Game.Has('Time paradox resolver')+Game.Has('Quantum conundrum')+Game.Has('Causality enforcer'));
		},Game.NewDrawFunction(0,32,32,64,1),function(){
			if (this.amount>=1) Game.Unlock(['Flux capacitors','Time paradox resolver']);if (this.amount>=10) Game.Unlock('Quantum conundrum');if (this.amount>=50) Game.Unlock('Causality enforcer');
			if (this.amount>=Game.SpecialGrandmaUnlock && Game.Objects['Mr. Trusty'].amount>0) Game.Unlock('Mr. Trusty\'s Grandpa');
			if (this.amount>=1) Game.Win('Time warp');if (this.amount>=50) Game.Win('Alternate timeline');if (this.amount>=100) Game.Win('Rewriting history');
		});
		new Game.Object('Super Computer','Super Computer|Super Computers|computed','Finds BitCoin and exchanges it for more computers','superComputer','SuperComputerIcon','SuperComputerBackground',3999999999,function(){
			return Game.ComputeCps(999999,Game.Has('Gold plated mouse')*99999,Game.Has('#include')+Game.Has('APSTRING')+Game.Has('int main()'));
		},Game.NewDrawFunction(0,0,64,64,1),function(){
			if (this.amount>=1) Game.Unlock(['Gold plated mouse','#include']);if (this.amount>=10) Game.Unlock('APSTRING');if (this.amount>=50) Game.Unlock('int main()');
			if (this.amount>=Game.SpecialGrandmaUnlock && Game.Objects['Mr. Trusty'].amount>0) Game.Unlock('AntiMr. Trustys');
			if (this.amount>=1) Game.Win('<iostream>');if (this.amount>=50) Game.Win('<iomanip>');if (this.amount>=100) Game.Win('using namespace std;');
		});
		new Game.Object('TrustyMan','TrustyMan|TrustyMen|clicked','Uses his computer magic to control the game.','antimattercondenser','antimattercondenserIcon','antimattercondenserBackground',10000000000,function(){
			return Game.ComputeCps(181818181,Game.Has('Platinum plated mouse')*9999999,Game.Has('java.import')+Game.Has('Scanner')+Game.Has('public static void'));
		},Game.NewDrawFunction(0,0,64,64,1),function() {
		if (this.amount>=1) Game.Unlock(['Platinum plated mouse','java.import']);if (this.amount>=10) Game.Unlock('Scanner');if (this.amount>=50) Game.Unlock('public static void');
			if (this.amount>=Game.SpecialGrandmaUnlock && Game.Objects['Mr. Trusty'].amount>0) Game.Unlock('Super Mr. Trustys');
			if (this.amount>=1) Game.Win('String args[]');if (this.amount>=50) Game.Win('System.out');if (this.amount>=100) Game.Win('System.in');
		});
		for(var i=0; i < Game.Object.length; i++){
			objectNameList[i] = Game.Object.name[i];
		}
		/*=====================================================================================
		UPGRADES
		=======================================================================================*/
		Game.upgradesToRebuild=1;
		Game.Upgrades=[];
		Game.UpgradesById=[];
		Game.UpgradesN=0;
		Game.UpgradesInStore=[];
		Game.UpgradesOwned=0;
		Game.Upgrade=function(name,desc,price,icon,buyFunction)
		{
			this.id=Game.UpgradesN;
			this.name=name;
			this.desc=desc;
			this.basePrice=price;
			this.icon=icon;
			this.buyFunction=buyFunction;
			/*this.unlockFunction=unlockFunction;
			this.unlocked=(this.unlockFunction?0:1);*/
			this.unlocked=0;
			this.bought=0;
			this.hide=0;//0=show, 3=hide (1-2 : I have no idea)
			this.order=this.id;
			if (order) this.order=order+this.id*0.001;
			this.type='';
			if (type) this.type=type;
			this.power=0;
			if (power) this.power=power;

			this.buy=function()
			{
				var cancelPurchase=0;
				if (this.clickFunction) cancelPurchase=!this.clickFunction();
				if (!cancelPurchase)
				{
					var price=this.basePrice;
					if (Game.computers>=price && !this.bought)
					{
						Game.Spend(price);
						this.bought=1;
						if (this.buyFunction) this.buyFunction();
						Game.upgradesToRebuild=1;
						Game.recalculateGains=1;
						Game.UpgradesOwned++;
					}
				}
			}

			this.toggle=function()//cheating only
			{
				if (!this.bought)
				{
					this.bought=1;
					if (this.buyFunction) this.buyFunction();
					Game.upgradesToRebuild=1;
					Game.recalculateGains=1;
					Game.UpgradesOwned++;
				}
				else
				{
					this.bought=0;
					Game.upgradesToRebuild=1;
					Game.recalculateGains=1;
					Game.UpgradesOwned--;
				}
				Game.UpdateMenu();
			}

			Game.Upgrades[this.name]=this;
			Game.UpgradesById[this.id]=this;
			Game.UpgradesN++;
			return this;
		}

		Game.Unlock=function(what)
		{
			if (typeof what==='string')
			{
				if (Game.Upgrades[what])
				{
					if (Game.Upgrades[what].unlocked==0)
					{
						Game.Upgrades[what].unlocked=1;
						Game.upgradesToRebuild=1;
						Game.recalculateGains=1;
					}
				}
			}
			else {for (var i in what) {Game.Unlock(what[i]);}}
		}
		Game.Lock=function(what)
		{
			if (typeof what==='string')
			{
				if (Game.Upgrades[what])
				{
					Game.Upgrades[what].unlocked=0;
					Game.Upgrades[what].bought=0;
					Game.upgradesToRebuild=1;
					if (Game.Upgrades[what].bought==1)
					{
						Game.UpgradesOwned--;
					}
					Game.recalculateGains=1;
				}
			}
			else {for (var i in what) {Game.Lock(what[i]);}}
		}

		Game.Has=function(what)
		{
			return (Game.Upgrades[what]?Game.Upgrades[what].bought:0);
		}

		Game.RebuildUpgrades=function()//recalculate the upgrades you can buy
		{
			Game.upgradesToRebuild=0;
			var list=[];
			for (var i in Game.Upgrades)
			{
				var me=Game.Upgrades[i];
				if (!me.bought)
				{
					if (me.unlocked) list.push(me);
				}
			}

			var sortMap=function(a,b)
			{
				if (a.basePrice>b.basePrice) return 1;
				else if (a.basePrice<b.basePrice) return -1;
				else return 0;
			}
			list.sort(sortMap);

			Game.UpgradesInStore=[];
			for (var i in list)
			{
				Game.UpgradesInStore.push(list[i]);
			}
			var str='';
			for (var i in Game.UpgradesInStore)
			{
				//if (!Game.UpgradesInStore[i]) break;
				var me=Game.UpgradesInStore[i];
				str+='<div class="crate upgrade" '+Game.getTooltip(
				//'<b>'+me.name+'</b>'+me.desc
				'<div style="min-width:200px;"><div style="float:right;"><span class="price">'+Beautify(Math.round(me.basePrice))+'</span></div><small>[Upgrade]</small><div class="name">'+me.name+'</div><div class="description">'+me.desc+'</div></div>'
				,0,16,'bottom-right')+' onclick="Game.UpgradesById['+me.id+'].buy();" id="upgrade'+i+'" style="background-position:'+(-me.icon[0]*48+6)+'px '+(-me.icon[1]*48+6)+'px;"></div>';
			}
			l('upgrades').innerHTML=str;
		}

		var tier1=10;
		var tier2=100;
		var tier3=1000;
		var tier4=10000;

		var type='';
		var power=0;

		//define upgrades
		//WARNING : do NOT add new upgrades in between, this breaks the saves. Add them at the end !
		var order=100;//this is used to set the order in which the items are listed
		new Game.Upgrade('Reinforced index finger','The mouse gains <b>+1</b> computer per click.<br>Cursors gain <b>+0.1</b> base CpS.<q>prod prod</q>',100,[0,0]);
		new Game.Upgrade('Carpal tunnel prevention cream','The mouse and cursors are <b>twice</b> as efficient.',400,[0,0]);
		new Game.Upgrade('Ambidextrous','The mouse and cursors are <b>twice</b> as efficient.<q>Look ma, both hands!</q>',10000,[0,6]);
		new Game.Upgrade('Thousand fingers','The mouse and cursors gain <b>+0.1</b> computers for each non-cursor object owned.<q>clickity</q>',500000,[0,6]);
		new Game.Upgrade('Million fingers','The mouse and cursors gain <b>+0.5</b> computers for each non-cursor object owned.<q>clickityclickity</q>',50000000,[1,6]);
		new Game.Upgrade('Billion fingers','The mouse and cursors gain <b>+2</b> computers for each non-cursor object owned.<q>clickityclickityclickity</q>',500000000,[2,6]);
		new Game.Upgrade('Trillion fingers','The mouse and cursors gain <b>+10</b> computers for each non-cursor object owned.<q>clickityclickityclickityclickity</q>',5000000000,[3,6]);

		order=200;
		new Game.Upgrade('Forwards from Mr. Trusty','Mr. Trusty\'s gain <b>+0.3</b> base CpS.<q>RE:RE:thought you\'d get a kick out of this ;))</q>',Game.Objects['Mr. Trusty'].basePrice*tier1,[1,0]);
		new Game.Upgrade('Steel-plated mice','Mr. Trusty\'s are <b>twice</b> as efficient.',Game.Objects['Mr. Trusty'].basePrice*tier2,[1,0]);
		new Game.Upgrade('Lubricated dentures','Mr. Trustys are <b>twice</b> as efficient.<q>Squish</q>',Game.Objects['Mr. Trusty'].basePrice*tier3,[1,1]);

		order=300;
		new Game.Upgrade('Cheap hoes','Farms gain <b>+0.5</b> base CpS.',Game.Objects['Farm'].basePrice*tier1,[2,0]);
		new Game.Upgrade('Fertilizer','Farms are <b>twice</b> as efficient.<q>It\'s chocolate, I swear.</q>',Game.Objects['Farm'].basePrice*tier2,[2,0]);
		new Game.Upgrade('Keyboard trees','Farms are <b>twice</b> as efficient.<q>A relative of the breadfruit.</q>',Game.Objects['Farm'].basePrice*tier3,[2,1]);

		order=400;
		new Game.Upgrade('Sturdier Propel bottles','Factories gain <b>+4</b> base CpS.',Game.Objects['Factory'].basePrice*tier1,[4,0]);
		new Game.Upgrade('Joe Brett labor','Factories are <b>twice</b> as efficient.<q>Cheaper, healthier workforce - and so much more receptive to whipping!</q>',Game.Objects['Factory'].basePrice*tier2,[4,0]);
		new Game.Upgrade('Sweatshop','Factories are <b>twice</b> as efficient.<q>Slackers will be terminated.</q>',Game.Objects['Factory'].basePrice*tier3,[4,1]);

		order=500;
		new Game.Upgrade('Beautiful voice','Mines gain <b>+10</b> base CpS.<q>Old Susan was a funny old man.</q>',Game.Objects['Mine'].basePrice*tier1,[3,0]);
		new Game.Upgrade('Mega-mic','Mines are <b>twice</b> as efficient.',Game.Objects['Mine'].basePrice*tier2,[3,0]);
		new Game.Upgrade('Ultra-mic','Mines are <b>twice</b> as efficient.',Game.Objects['Mine'].basePrice*tier3,[3,1]);

		order=600;
		new Game.Upgrade('Vanilla nebulae','Shipments gain <b>+30</b> base CpS.',Game.Objects['Shipment'].basePrice*tier1,[5,0]);
		new Game.Upgrade('Wormholes','Shipments are <b>twice</b> as efficient.<q>By using these as shortcuts, your ships can travel much faster.</q>',Game.Objects['Shipment'].basePrice*tier2,[5,0]);
		new Game.Upgrade('Frequent flyer','Shipments are <b>twice</b> as efficient.<q>Come back soon!</q>',Game.Objects['Shipment'].basePrice*tier3,[5,1]);

		order=700;
		new Game.Upgrade('Antimony','Alchemy labs gain <b>+100</b> base CpS.<q>Actually worth a lot of mony.</q>',Game.Objects['Alchemy lab'].basePrice*tier1,[6,0]);
		new Game.Upgrade('Essence of computers','Alchemy labs are <b>twice</b> as efficient.<q>Extracted through the 5 ancient steps of alchemical baking.</q>',Game.Objects['Alchemy lab'].basePrice*tier2,[6,0]);
		new Game.Upgrade('True C++','Alchemy labs are <b>twice</b> as efficient.<q>The purest form of code.</q>',Game.Objects['Alchemy lab'].basePrice*tier3,[6,1]);

		order=800;
		new Game.Upgrade('Ancient tablet','Portals gain <b>+1,666</b> base CpS.<q>A strange slab of peanut brittle, holding an ancient Trusty skill. Neat!</q>',Game.Objects['Portal'].basePrice*tier1,[7,0]);
		new Game.Upgrade('Insane oatling workers','Portals are <b>twice</b> as efficient.<q>ARISE, MY MINIONS!</q>',Game.Objects['Portal'].basePrice*tier2,[7,0]);
		new Game.Upgrade('Soul bond','Portals are <b>twice</b> as efficient.<q>So I just sign up and get a computer? Sure, whatever!</q>',Game.Objects['Portal'].basePrice*tier3,[7,1]);

		order=900;
		new Game.Upgrade('Flux capacitors','Time machines gain <b>+9,876</b> base CpS.<q>Bake to the future.</q>',1234567890,[8,0]);
		new Game.Upgrade('Time paradox resolver','Time machines are <b>twice</b> as efficient.<q>No more screwing with Mr. Trusty!</q>',9876543210,[8,0]);
		new Game.Upgrade('Quantum conundrum','Time machines are <b>twice</b> as efficient.<q>It\'s full of stars!</q>',98765456789,[8,1]);

		order=20000;
		new Game.Upgrade('Kitten helpers','You gain <b>more CpS</b> the more milk you have.<q>meow may I help you</q>',9000000,[1,7]);
		new Game.Upgrade('Kitten workers','You gain <b>more CpS</b> the more milk you have.<q>meow meow meow meow</q>',9000000000,[2,7]);

		order=10000;
		type='computer';power=5;
		new Game.Upgrade('Microsoft support','Computer production multiplier <b>+5%</b>.<q>Open Windows. Fresh air will help.</q>',99999999,[0,3]);
		new Game.Upgrade('Increased WiFi Connection','Computer production multiplier <b>+5%</b>.',99999999,[1,3]);
		new Game.Upgrade('Apple Support','Computer production multiplier <b>+5%</b>.<q>Meh.</q>',99999999,[2,3]);
		new Game.Upgrade('Video Research','Computer production multiplier <b>+5%</b>.<q>Hello, YouTube!</q>',999999999,[3,3]);
		new Game.Upgrade('Internet Explorer','Computer production multiplier <b>+5%</b>.<q>Install a taskbar? Why not!</q>',999999999,[5,3]);
		new Game.Upgrade('FireFox','Computer production multiplier <b>+5%</b><q>So much faster</q>',999999999,[6,3]);
		power=10;new Game.Upgrade('Google Chrome','Computer production multiplier <b>+10%</b>.<q>Quite an upgrade</q>',99999999999,[4,3]);
		power=5;new Game.Upgrade('PC Gaming','Computer production multiplier <b>+5%</b>.<q>Let off some Steam.</q>',99999999,[13,3]);
		power=10;new Game.Upgrade('iTunes','Computer production multiplier <b>+10%</b>.<q>Relaxation tunes.</q>',99999999999,[1,4]);
		new Game.Upgrade('Folders','Computer production multiplier <b>+10%</b>.<q>Keeping everything organized.</q>',99999999999,[2,4]);
		type='';power=0;

		order=100;
		new Game.Upgrade('Quadrillion fingers','The mouse and cursors gain <b>+20</b> computers for each non-cursor object owned.<q>clickityclickityclickityclickityclick</q>',50000000000,[3,6]);

		order=200;new Game.Upgrade('Joe\'s Juice','Mr. Trusty is <b>twice</b> as efficient.<q>Gets me going.</q>',Game.Objects['Mr. Trusty'].basePrice*tier4,[1,2]);
		order=300;new Game.Upgrade('Genetically-modified keyboards','Farms are <b>twice</b> as efficient.<q>All-natural mutations.</q>',Game.Objects['Farm'].basePrice*tier4,[2,2]);
		order=400;new Game.Upgrade('Radium reactors','Factories are <b>twice</b> as efficient.<q>Gives your computers a healthy glow.</q>',Game.Objects['Factory'].basePrice*tier4,[4,2]);
		order=500;new Game.Upgrade('Ultimadrill','Mines are <b>twice</b> as efficient.<q>Pierce the heavens, etc.</q>',Game.Objects['Mine'].basePrice*tier4,[3,2]);
		order=600;new Game.Upgrade('Warp drive','Shipments are <b>twice</b> as efficient.',Game.Objects['Shipment'].basePrice*tier4,[5,2]);
		order=700;new Game.Upgrade('Ambrosia','Alchemy labs are <b>twice</b> as efficient.',Game.Objects['Alchemy lab'].basePrice*tier4,[6,2]);
		order=800;new Game.Upgrade('Sanity dance','Portals are <b>twice</b> as efficient.<q>We can change if we want to.<br>We can leave our brains behind.</q>',Game.Objects['Portal'].basePrice*tier4,[7,2]);
		order=900;new Game.Upgrade('Causality enforcer','Time machines are <b>twice</b> as efficient.<q>What happened, happened.</q>',1234567890000,[8,2]);

		order=5000;
		new Game.Upgrade('Lucky day','Golden computers appear <b>twice as often</b> and last <b>twice as long</b>.',777777777,[10,1]);
		new Game.Upgrade('Serendipity','Golden computers appear <b>twice as often</b> and last <b>twice as long</b>.',77777777777,[10,1]);

		order=20000;
		new Game.Upgrade('Kitten engineers','You gain <b>more CpS</b> the more milk you have.<q>meow meow meow meow, sir</q>',9000000000000,[3,7]);

		order=10000;
		type='computer';power=15;
		new Game.Upgrade('Microsoft Word','Computer production multiplier <b>+15%</b>.',999999999999,[3,4]);
		new Game.Upgrade('Microsoft Excel','Computer production multiplier <b>+15%</b>.',999999999999,[4,4]);
		new Game.Upgrade('Microsoft PowerPoint','Computer production multiplier <b>+15%</b>.<q>They have their uses.</q>',9999999999999,[5,4]);
		type='';power=0;

		order=250;
		new Game.Upgrade('Farmer Mr. Trustys','Mr. Trusty\'s are <b>twice</b> as efficient.',Game.Objects['Farm'].basePrice*tier2,[1,0],function(){Game.Objects['Mr. Trusty'].drawFunction();});
		new Game.Upgrade('Worker Mr. Trustys','Mr. Trusty\'s are <b>twice</b> as efficient.',Game.Objects['Factory'].basePrice*tier2,[1,0],function(){Game.Objects['Mr. Trusty'].drawFunction();});
		new Game.Upgrade('Miner Mr. Trustys','Mr. Trusty\'s are <b>twice</b> as efficient.',Game.Objects['Mine'].basePrice*tier2,[1,0],function(){Game.Objects['Mr. Trusty'].drawFunction();});
		new Game.Upgrade('Cosmic Mr. Trustys','Mr. Trusty\'s are <b>twice</b> as efficient.',Game.Objects['Shipment'].basePrice*tier2,[1,0],function(){Game.Objects['Mr. Trusty'].drawFunction();});
		new Game.Upgrade('Transmuted Mr. Trustys','Mr. Trusty\'s are <b>twice</b> as efficient.',Game.Objects['Alchemy lab'].basePrice*tier2,[1,0],function(){Game.Objects['Mr. Trusty'].drawFunction();});
		new Game.Upgrade('Altered Mr. Trustys','Mr. Trusty\'s are <b>twice</b> as efficient.',Game.Objects['Portal'].basePrice*tier2,[1,0],function(){Game.Objects['Mr. Trusty'].drawFunction();});
		new Game.Upgrade('Super Mr. Trustys','Mr. Trusty\'s are <b>twice</b> as efficient.',Game.Objects['Super Computer'].basePrice*tier2,[1,0],function(){Game.Objects['Mr. Trusty'].drawFunction();});
		new Game.Upgrade('Mr. Trusty\'s Grandpa','Mr. Trusty\'s are <b>twice</b> as efficient.',Game.Objects['Time machine'].basePrice*tier2,[1,0],function(){Game.Objects['Mr. Trusty'].drawFunction();});

		order=15000;
		Game.baseResearchTime=Game.fps*60*30;
		Game.SetResearch=function(what,time)
		{
			if (Game.Upgrades[what])
			{
				Game.researchT=Game.Has('Ultrascience')?Game.fps*5:Game.baseResearchTime;
				Game.nextResearch=Game.Upgrades[what].id;
				Game.Popup('Research has begun.');
			}
		}

		new Game.Upgrade('Opera house/Computer lab','Mr. Trusty\'s computer lab and leisure club.<br>Mr. Trusty as <b>4 times</b> as efficient.<br><b>Regularly unlocks new upgrades</b>.',100000000000,[11,9],function(){Game.SetResearch('Specialized chocolate chips');});
		new Game.Upgrade('Specialized chocolate chips','[Research]<br>Computer production multiplier <b>+1%</b>.<q>Computer-designed chocolate chips. Computer chips, if you will.</q>',10000000000,[0,9],function(){Game.SetResearch('Designer cocoa beans');});
		new Game.Upgrade('Designer cocoa beans','[Research]<br>Computer production multiplier <b>+2%</b>.<q>Now more aerodynamic than ever!</q>',20000000000,[1,9],function(){Game.SetResearch('Ritual rolling pins');});
		new Game.Upgrade('Ritual rolling pins','[Research]<br>Grandmas are <b>twice</b> as efficient.<q>The result of years of scientific research!</q>',40000000000,[2,9],function(){Game.SetResearch('Underworld ovens');});
		new Game.Upgrade('Underworld ovens','[Research]<br>Computer production multiplier <b>+3%</b>.<q>Powered by science, of course!</q>',80000000000,[3,9],function(){Game.SetResearch('One mind');});
		new Game.Upgrade('One mind','[Research]<br>Each grandma gains <b>+1 base CpS for each 50 Mr. Trustys</b>.<div class="warning">Note : the grandmothers are growing restless. Do not encourage them.</div><q>We are one. We are many.</q>',160000000000,[4,9],function(){Game.elderWrath=1;Game.SetResearch('Exotic nuts');});
		Game.Upgrades['One mind'].clickFunction=function(){return confirm('Warning : purchasing this will have unexpected, and potentially undesirable results!\nIt\'s all downhill from here. You have been warned!\nPurchase anyway?');};
		new Game.Upgrade('Exotic nuts','[Research]<br>Computer production multiplier <b>+4%</b>.<q>You\'ll go crazy over these!</q>',320000000000,[5,9],function(){Game.SetResearch('Communal brainsweep');});
		new Game.Upgrade('Communal brainsweep','[Research]<br>Each grandma gains another <b>+1 base CpS for each 50 Mr. Trustys</b>.<div class="warning">Note : proceeding any further in scientific research may have unexpected results. You have been warned.</div><q>We fuse. We merge. We grow.</q>',640000000000,[6,9],function(){Game.elderWrath=2;Game.SetResearch('Arcane sugar');});
		new Game.Upgrade('Arcane sugar','[Research]<br>Computer production multiplier <b>+5%</b>.<q>Tastes like insects, ligaments, and molasses.</q>',1280000000000,[7,9],function(){Game.SetResearch('Elder Pact');});
		new Game.Upgrade('Elder Pact','[Research]<br>Each grandma gains <b>+1 base CpS for each 20 portals</b>.<div class="warning">Note : this is a bad idea.</div><q>squirm crawl slither writhe<br>today we rise</q>',2560000000000,[8,9],function(){Game.elderWrath=3;});
		new Game.Upgrade('Elder Pledge','[Repeatable]<br>Contains the wrath of the elders, at least for a while.',1,[9,9],function()
		{
			Game.elderWrath=0;
			Game.pledges++;
			Game.pledgeT=Game.fps*60*(Game.Has('Sacrificial keyboards')?60:30);
			Game.Upgrades['Elder Pledge'].basePrice=Math.pow(8,Math.min(Game.pledges+2,13));
			Game.Unlock('Elder Covenant');
		});
		Game.Upgrades['Elder Pledge'].hide=3;

		order=150;
		new Game.Upgrade('Plastic mouse','Clicking gains <b>+1% of your CpS</b>.',50000,[11,0]);
		new Game.Upgrade('Iron mouse','Clicking gains <b>+1% of your CpS</b>.',5000000,[11,0]);
		new Game.Upgrade('Titanium mouse','Clicking gains <b>+1% of your CpS</b>.',500000000,[11,1]);
		new Game.Upgrade('Adamantium mouse','Clicking gains <b>+1% of your CpS</b>.',50000000000,[11,2]);

		order=40000;
		new Game.Upgrade('Ultrascience','Research takes only <b>5 seconds</b>.',7,[9,2]);//debug purposes only
		Game.Upgrades['Ultrascience'].hide=3;

		order=10000;
		type='computer';power=15;
		new Game.Upgrade('Eclipse','Computer production multiplier <b>+15%</b>.<q>Making all this possible.</q>',9999999999999,[0,4]);
		type='';power=0;

		order=100;
		new Game.Upgrade('Quintillion fingers','The mouse and cursors gain <b>+100</b> computers for each non-cursor object owned.<q>man, just go click click click click click, it\'s real easy, man.</q>',50000000000000,[3,6]);

		order=40000;
		new Game.Upgrade('Gold hoard','Golden computers appear <b>really often</b>.',7,[10,1]);//debug purposes only
		Game.Upgrades['Gold hoard'].hide=3;

		order=15000;
		new Game.Upgrade('Elder Covenant','[Switch]<br>Puts a permanent end to the elders\' wrath, at the price of 5% of your CpS.',6666666666666,[8,9],function()
		{
			Game.pledgeT=0;
			Game.Lock('Revoke Elder Covenant');
			Game.Unlock('Revoke Elder Covenant');
			Game.Lock('Elder Pledge');
			Game.Win('Elder calm');
		});
		Game.Upgrades['Elder Covenant'].hide=3;

		new Game.Upgrade('Revoke Elder Covenant','[Switch]<br>You will get 5% of your CpS back, but the grandmatriarchs will return.',6666666666,[8,9],function()
		{
			Game.Lock('Elder Covenant');
			Game.Unlock('Elder Covenant');
		});
		Game.Upgrades['Revoke Elder Covenant'].hide=3;

		order=5000;
		new Game.Upgrade('Get lucky','Golden computer effects last <b>twice as long</b>.<q>You\'ve been up all night, haven\'t you?</q>',77777777777777,[10,1]);

		order=15000;
		new Game.Upgrade('Sacrificial keyboards','Elder pledge last <b>twice</b> as long.',2888888888888,[2,9]);

		order=10000;
		type='computer';power=15;
		new Game.Upgrade('Python','Computer production multiplier <b>+15%</b>.<q>If it ain\'t dutch, it ain\'t much.</q>',99999999999999,[7,4]);
		new Game.Upgrade('C++','Computer production multiplier <b>+15%</b>.',99999999999999,[8,4]);
		new Game.Upgrade('Java','Computer production multiplier <b>+15%</b>.<q>Powers all.</q>',99999999999999,[6,4]);
		type='';power=0;

		order=40000;
		new Game.Upgrade('Neuromancy','Can toggle upgrades on and off at will in the stats menu.',7,[4,9]);//debug purposes only
		Game.Upgrades['Neuromancy'].hide=3;

		order=10000;
		type='computer';power=15;
		new Game.Upgrade('Photoshop','Computer production multiplier <b>+15%</b>.<q>Essential.</q>',99999999999999,[9,4]);
		new Game.Upgrade('Facebook','Computer production multiplier <b>+15%</b>.',99999999999999,[10,4]);
		new Game.Upgrade('Twitter','Computer production multiplier <b>+15%</b>.',99999999999999,[11,4]);
		new Game.Upgrade('Wolfram Alpha','Computer production multiplier <b>+15%</b>.<q>Enter what you want to <b>calculate</b> or <b>know about</b>:</q>',99999999999999,[12,4]);
		new Game.Upgrade('Wikipedia','Computer production multiplier <b>+15%</b>.<q>The Free Encyclopedia that anyone can edit</q>',99999999999999,[13,4]);
		new Game.Upgrade('NetClassroom','Computer production multiplier <b>+15%</b>.',99999999999999,[14,4]);
		type='Google';power=20;
		new Game.Upgrade('G','Computer production multiplier <b>+20%</b>.',199999999999999,[7,3]);
		type='';power=0;


		order=1000;
		new Game.Upgrade('Gold plated mouse','Trustyman gains <b>+99,999</b> base CpS.',Game.Objects['TrustyMan'].basePrice*tier1,[13,0]);
		new Game.Upgrade('#include','Trustyman is <b>twice</b> as efficient.',Game.Objects['TrustyMan'].basePrice*tier2,[13,0]);
		new Game.Upgrade('APSTRING','Trustyman is <b>twice</b> as efficient.<q>How singular!</q>',Game.Objects['TrustyMan'].basePrice*tier3,[13,1]);
		new Game.Upgrade('int main()','Trustyman is <b>twice</b> as efficient.<q>And that\'s how it all began.</q>',Game.Objects['TrustyMan'].basePrice*tier4,[13,2]);

		order=250;
		new Game.Upgrade('AntiMr. Trustys','Mr. Trustys are <b>twice</b> as efficient.',Game.Objects['TrustyMan'].basePrice*tier2,[1,0],function(){Game.Objects['Mr. Trusty'].drawFunction();});

		order=10000;
		type='Google';power=20;
		new Game.Upgrade('Red o','Computer production multiplier <b>+20%</b>.',199999999999999,[8,3]);
		new Game.Upgrade('Yellow o','Computer production multiplier <b>+20%</b>.',199999999999999,[9,3]);
		new Game.Upgrade('g','Computer production multiplier <b>+20%</b>.',199999999999999,[10,3]);
		new Game.Upgrade('l','Computer production multiplier <b>+20%</b>.',199999999999999,[11,3]);
		new Game.Upgrade('e','Computer production multiplier <b>+20%</b>.<q>120% completion</q>',199999999999999,[12,3]);
		type='';power=0;

		order=20000;
		new Game.Upgrade('Kitten overseers','You gain <b>more CpS</b> the more milk you have.<q>my purrpose is to serve you, sir</q>',900000000000000,[8,7]);

		order=1;
		type='Super';power=100;
		new Game.Upgrade('Mr. Trusty\'s wrath','Computer production multiplier <b>+100%</b>.',12345678987654321,[14,0]);
		new Game.Upgrade('Platinum plated mouse','Super computers gain <b>+99,999,999</b> base CpS.',Game.Objects['Super Computer'].basePrice*tier1, [12,1]);
		new Game.Upgrade('java.import','Super Computers are <b>twice</b> as efficient.',Game.Objects['Super Computer'].basePrice*tier2,[12,1]);
		new Game.Upgrade('Scanner','Super Computers are <b>twice</b> as efficient.<q>Faster processing!</q>',Game.Objects['Super Computer'].basePrice*tier3,[13,1]);
		new Game.Upgrade('public static void','Super Computers are <b>twice</b> as efficient.<q>Rebooting helps.</q>',Game.Objects['Super Computer'].basePrice*tier4,[13,2]);
		/*
		new Game.Upgrade('Plain milk','Unlocks <b>plain milk</b>, available in the menu.',120000000000,[4,8]);
		new Game.Upgrade('Chocolate milk','Unlocks <b>chocolate milk</b>, available in the menu.',120000000000,[5,8]);
		new Game.Upgrade('Raspberry milk','Unlocks <b>raspberry milk</b>, available in the menu.',120000000000,[6,8]);
		new Game.Upgrade('Ain\'t got milk','Unlocks <b>no milk please</b>, available in the menu.',120000000000,[0,8]);

		new Game.Upgrade('Blue background','Unlocks the <b>blue background</b>, available in the menu.',120000000000,[0,9]);
		new Game.Upgrade('Red background','Unlocks the <b>red background</b>, available in the menu.',120000000000,[1,9]);
		new Game.Upgrade('White background','Unlocks the <b>white background</b>, available in the menu.',120000000000,[2,9]);
		new Game.Upgrade('Black background','Unlocks the <b>black background</b>, available in the menu.',120000000000,[3,9]);
		new Game.Upgrade('Mr. Trusty\'s wrath','Computer production multiplier <b>+100%</b>.', 1234567890987654321,[0,0]);
		*/


		/*=====================================================================================
		ACHIEVEMENTS
		=======================================================================================*/
		Game.Achievements=[];
		Game.AchievementsById=[];
		Game.AchievementsN=0;
		Game.AchievementsOwned=0;
		Game.Achievement=function(name,desc,icon,hide)
		{
			this.id=Game.AchievementsN;
			this.name=name;
			this.desc=desc;
			this.icon=icon;
			this.won=0;
			this.disabled=0;
			this.hide=hide||0;//hide levels : 0=show, 1=hide description, 2=hide, 3=secret (doesn't count toward achievement total)
			this.order=this.id;
			if (order) this.order=order+this.id*0.001;

			Game.Achievements[this.name]=this;
			Game.AchievementsById[this.id]=this;
			Game.AchievementsN++;
			return this;
		}

		Game.Win=function(what)
		{
			if (typeof what==='string')
			{
				if (Game.Achievements[what])
				{
					if (Game.Achievements[what].won==0)
					{
						Game.Achievements[what].won=1;
						Game.Popup('Achievement unlocked :<br>'+Game.Achievements[what].name+'<br> ');
						if (Game.Achievements[what].hide!=3) Game.AchievementsOwned++;
						Game.recalculateGains=1;
					}
				}
			}
			else {for (var i in what) {Game.Win(what[i]);}}
		}

		Game.HasAchiev=function(what)
		{
			return (Game.Achievements[what]?Game.Achievements[what].won:0);
		}

		//define achievements
		//WARNING : do NOT add new achievements in between, this breaks the saves. Add them at the end !

		var order=100;//this is used to set the order in which the items are listed
		//new Game.Achievement('name','description',[0,0]);
		Game.moneyAchievs=[
		'Wake and bake',				1,
		'Making some dough',			100,
		'So baked right now',			1000,
		'Fledgling company',			10000,
		'Affluent company',				100000,
		'World-famous company',			1000000,
		'Cosmic company',				10000000,
		'Galactic company',				100000000,
		'Universal company', 			1000000000,
		'Timeless company', 			5000000000,
		'Infinite company', 			10000000000,
		'Immortal company', 			50000000000,
		'You can stop now', 			100000000000,
		'Computers all the way down', 	500000000000,
		'Overdose', 					1000000000000,
		'How?',							10000000000000
		];
		for (var i=0;i<Game.moneyAchievs.length/2;i++)
		{
			var pic=[Math.min(10,i),5];
			if (i==15) pic=[11,5];
			new Game.Achievement(Game.moneyAchievs[i*2],'Make <b>'+Beautify(Game.moneyAchievs[i*2+1])+'</b> computer'+(Game.moneyAchievs[i*2+1]==1?'':'s')+'.',pic,2);
		}

		order=200;
		Game.cpsAchievs=[
		'Casual computing',				1,
		'Hardcore computing',			10,
		'Steady tasty stream',			100,
		'Computer monster',				1000,
		'Mass producer',				10000,
		'Computer vortex',				100000,
		'Computer pulsar',				1000000,
		'Computer quasar',				10000000,
		'A world filled with computers',100000000,
		'Let\'s never work again',		1000000000
		];
		for (var i=0;i<Game.cpsAchievs.length/2;i++)
		{
			var pic=[i,5];
			new Game.Achievement(Game.cpsAchievs[i*2],'Bake <b>'+Beautify(Game.cpsAchievs[i*2+1])+'</b> computer'+(Game.cpsAchievs[i*2+1]==1?'':'s')+' per second.',pic,2);
		}

		order=30000;
		new Game.Achievement('Sacrifice','Reset your game with <b>1 million</b> computers baked.<q>Easy come, easy go.</q>',[11,6],2);
		new Game.Achievement('Oblivion','Reset your game with <b>1 billion</b> computers baked.<q>Back to square one.</q>',[11,6],2);
		new Game.Achievement('From scratch','Reset your game with <b>1 trillion</b> computer baked.<q>It\'s been fun.</q>',[11,6],2);

		order=31000;
		new Game.Achievement('Neverclick','Make <b>1 million</b> computers by only having clicked <b>15 times</b>.',[12,0],3);
		order=1000;
		new Game.Achievement('Clicktastic','Make <b>1,000</b> computers from clicking.',[11,0]);
		new Game.Achievement('Clickathlon','Make <b>100,000</b> computers from clicking.',[11,1]);
		new Game.Achievement('Clickolympics','Make <b>10,000,000</b> computers from clicking.',[11,1]);
		new Game.Achievement('Clickorama','Make <b>1,000,000,000</b> computers from clicking.',[11,2]);

		order=1050;
		new Game.Achievement('Click','Have <b>1</b> cursor.',[0,0]);
		new Game.Achievement('Double-click','Have <b>2</b> cursors.',[0,6]);
		new Game.Achievement('Mouse wheel','Have <b>50</b> cursors.',[1,6]);
		new Game.Achievement('Of Mice and Men','Have <b>100</b> cursors.',[2,6]);
		new Game.Achievement('The Digital','Have <b>200</b> cursors.',[3,6]);

		order=1100;
		new Game.Achievement('Just wrong','Sell Mr. Trusty.<q>I thought you loved me.</q>',[1,0],2);
		new Game.Achievement('Mr. Trusty\'s praise','Have <b>1</b> Mr. Trusty.',[1,0]);
		new Game.Achievement('Sloppy codes','Have <b>50</b> Mr. Trustys.',[1,1]);
		new Game.Achievement('Mr. Trusty\'s room','Have <b>100</b> Mr. Trustys.',[1,2]);
		new Game.Achievement('Mr. Trusty\'s skill','Have <b>1000</b> Mr. Trustys.',[14,0]);

		order=1200;
		new Game.Achievement('My first farm','Have <b>1</b> farm.',[2,0]);
		new Game.Achievement('Reap what you sow','Have <b>50</b> farms.',[2,1]);
		new Game.Achievement('Farm ill','Have <b>100</b> farms.',[2,2]);

		order=1300;
		new Game.Achievement('Production chain','Have <b>1</b> factory.',[4,0]);
		new Game.Achievement('Industrial revolution','Have <b>50</b> factories.',[4,1]);
		new Game.Achievement('Global warming','Have <b>100</b> factories.',[4,2]);

		order=1400;
		new Game.Achievement('You know the drill','Have <b>1</b> mine.',[3,0]);
		new Game.Achievement('Excavation site','Have <b>50</b> mines.',[3,1]);
		new Game.Achievement('Hollow the planet','Have <b>100</b> mines.',[3,2]);

		order=1500;
		new Game.Achievement('Expedition','Have <b>1</b> shipment.',[5,0]);
		new Game.Achievement('Galactic highway','Have <b>50</b> shipments.',[5,1]);
		new Game.Achievement('Far far away','Have <b>100</b> shipments.',[5,2]);

		order=1600;
		new Game.Achievement('Transmutation','Have <b>1</b> alchemy lab.',[6,0]);
		new Game.Achievement('Transmogrification','Have <b>50</b> alchemy labs.',[6,1]);
		new Game.Achievement('Gold member','Have <b>100</b> alchemy labs.',[6,2]);

		order=1700;
		new Game.Achievement('A whole new world','Have <b>1</b> portal.',[7,0]);
		new Game.Achievement('Now you\'re thinking','Have <b>50</b> portals.',[7,1]);
		new Game.Achievement('Dimensional shift','Have <b>100</b> portals.',[7,2]);

		order=1800;
		new Game.Achievement('Time warp','Have <b>1</b> time machine.',[8,0]);
		new Game.Achievement('Alternate timeline','Have <b>50</b> time machines.',[8,1]);
		new Game.Achievement('Rewriting history','Have <b>100</b> time machines.',[8,2]);

		order=7000;
		new Game.Achievement('One with everything','Have <b>at least 1</b> of every building.',[4,6],2);
		new Game.Achievement('Mathematician','Have at least <b>1 time machine, 2 portals, 4 alchemy labs, 8 shipments</b> and so on (128 max).',[7,6],2);
		new Game.Achievement('Base 10','Have at least <b>10 time machines, 20 portals, 30 alchemy labs, 40 shipments</b> and so on.',[8,6],2);

		order=10000;
		new Game.Achievement('Golden computer','Click a <b>golden computers</b>.',[10,1],1);
		new Game.Achievement('Lucky computer','Click <b>7 golden computers</b>.',[10,1],1);
		new Game.Achievement('A stroke of luck','Click <b>27 golden computers</b>.',[10,1],1);

		order=30200;
		new Game.Achievement('Cheated computers work awful','Hack in some computers.',[10,6],3);
		order=30001;
		new Game.Achievement('Uncanny clicker','Click really, really fast.<q>Well I\'ll be!</q>',[12,0],2);

		order=5000;
		new Game.Achievement('Builder','Own <b>100</b> buildings.',[4,6],1);
		new Game.Achievement('Architect','Own <b>400</b> buildings.',[5,6],1);
		order=6000;
		new Game.Achievement('Enhancer','Purchase <b>20</b> upgrades.',[9,0],1);
		new Game.Achievement('Augmenter','Purchase <b>50</b> upgrades.',[9,1],1);

		order=11000;
		new Game.Achievement('Dunk-tank','Dunk Mr. Trusty.<q>You did it!</q>',[4,7],2);

		order=10000;
		new Game.Achievement('Fortune','Click <b>77 golden computerss</b>.<q>You should really go to bed.</q>',[10,1],1);
		order=31000;
		new Game.Achievement('True Neverclick','Make <b>1 million</b> computers with <b>no</b> computer clicks.<q>This kinda defeats the whole purpose, doesn\'t it?</q>',[12,0],3);

		order=20000;
		new Game.Achievement('Elder nap','Appease Mr. Trusty at least <b>once</b>.<q>we<br>are<br>eternal</q>',[8,9],2);
		new Game.Achievement('Elder slumber','Appease Mr. Trusty at least <b>5 times</b>.<q>our mind<br>outlives<br>the universe</q>',[8,9],2);

		order=1100;
		new Game.Achievement('Elder','Own every Mr. Trusty type.',[1,0],2);

		order=20000;
		new Game.Achievement('Elder calm','Declare a covenant with the grandmatriarchs.<q>we<br>have<br>fed</q>',[8,9],2);

		order=5000;
		new Game.Achievement('Engineer','Own <b>800</b> buildings.',[6,6],1);

		order=10000;
		new Game.Achievement('Leprechaun','Click <b>777 golden computers</b>.',[10,1],1);
		new Game.Achievement('Black cat\'s paw','Click <b>7777 golden computers</b>.',[10,1],3);

		order=30000;
		new Game.Achievement('Nihilism','Reset your game with <b>1 quadrillion</b> computers made.<q>There are many things<br>that need to be erased</q>',[11,6],2);
		//new Game.Achievement('Galactus\' Reprimand','Reset your game with <b>1 quintillion</b> coo- okay no I'm yanking your chain

		order=1900;
		new Game.Achievement('<iostream>','Have <b>1</b> Trustyman.',[13,0]);
		new Game.Achievement('<iomanip>','Have <b>50</b> Trustymen.',[13,1]);
		new Game.Achievement('using namespace std;','Have <b>100</b> Trustymen.',[13,2]);

		order=2000;
		new Game.Achievement('String args[]','Have <b>1</b> Super Computer.',[12,1]);
		new Game.Achievement('System.out','Have <b>50</b> Super Computers.',[13,1]);
		new Game.Achievement('System.in','Have <b>100</b> Super Computers.',[13,2]);

		order=6000;
		new Game.Achievement('Upgrader','Purchase <b>100</b> upgrades.',[9,2],1);

		order=7000;
		new Game.Achievement('Centennial','Have at least <b>100 of everything</b>.',[9,6],2);


		Game.RuinTheFun=function()
		{
			for (var i in Game.Upgrades)
			{
				Game.Unlock(Game.Upgrades[i].name);

				Game.Upgrades[i].bought++;
				if (Game.Upgrades[i].buyFunction) Game.Upgrades[i].buyFunction();
			}
			for (var i in Game.Achievements)
			{
				Game.Win(Game.Achievements[i].name);
			}
			Game.Earn(999999999999999999);


			Game.upgradesToRebuild=1;
			Game.recalculateGains=1;

		}
		Game.Music=function(volume) {
			play("img/doomsday.mp3", volume); }


		/*=====================================================================================
		GRANDMAPOCALYPSE
		=======================================================================================*//** BEGIN EDIT **/
		Game.UpdateGrandmapocalypse=function()
		{
			if (Game.Has('Elder Covenant') || Game.Objects['Mr. Trusty'].amount==0) Game.elderWrath=0;
			else if (Game.pledgeT>0)//if the pledge is active, lower it
			{
				Game.pledgeT--;
				if (Game.pledgeT==0)//did we reach 0? make the pledge purchasable again
				{
					Game.Lock('Elder Pledge');
					Game.Unlock('Elder Pledge');
					Game.elderWrath=1;
				}
			}
			else
			{
				if (Game.Has('One mind') && Game.elderWrath==0)
				{
					Game.elderWrath=1;
				}
				if (Math.random()<0.001 && Game.elderWrath<Game.Has('One mind')+Game.Has('Communal brainsweep')+Game.Has('Elder Pact'))
				{
					Game.elderWrath++;//have we already pledged? make the elder wrath shift between different stages
				}
				if (Game.Has('Elder Pact') && Game.Upgrades['Elder Pledge'].unlocked==0)
				{
					Game.Lock('Elder Pledge');
					Game.Unlock('Elder Pledge');
				}
			}
			Game.elderWrathD+=((Game.elderWrath+1)-Game.elderWrathD)*0.001;//slowly fade to the target wrath state
		}

		Game.DrawGrandmapocalypse=function()
		{
			Game.defaultBg='bgBlue';
			if(Game.prefs.christmas) Game.defaultBg='bgChristmas';
			if(!Game.prefs.christmas) Game.defaultBg='bgBlue';
			//handle background
			if (Math.abs((Game.elderWrath+1)-Game.elderWrathD)>0.1)
			{
				if (Game.elderWrathD<1)
				{
					Game.bgR=0;
					if (Game.bg!=Game.defaultBg || Game.bgFade!=Game.defaultBg)
					{
						Game.bg=Game.defaultBg;
						Game.bgFade=Game.defaultBg;
						l('backgroundLayer1').style.background='url(img/'+Game.bg+'.jpg)';
						l('backgroundLayer2').style.background='url(img/'+Game.bgFade+'.jpg)';
						l('backgroundLayer1').style.backgroundSize='auto';
						l('backgroundLayer2').style.backgroundSize='auto';
					}
				}
				else if (Game.elderWrathD>=1 && Game.elderWrathD<2)
				{
					Game.bgR=(Game.elderWrathD-1)/1;
					if (Game.bg!=Game.defaultBg || Game.bgFade!='Mr. Trustys1')
					{
						Game.bg=Game.defaultBg;
						Game.bgFade='Mr. Trustys1';
						l('backgroundLayer1').style.background='url(img/'+Game.bg+'.jpg)';
						l('backgroundLayer2').style.background='url(img/'+Game.bgFade+'.jpg)';
						l('backgroundLayer1').style.backgroundSize='auto';
						l('backgroundLayer2').style.backgroundSize='512px';
					}
				}
				else if (Game.elderWrathD>=2 && Game.elderWrathD<3)
				{
					Game.bgR=(Game.elderWrathD-2)/1;
					if (Game.bg!='Mr. Trustys1' || Game.bgFade!='Mr. Trustys2')
					{
						Game.bg='Mr. Trustys1';
						Game.bgFade='Mr. Trustys2';
						l('backgroundLayer1').style.background='url(img/'+Game.bg+'.jpg)';
						l('backgroundLayer2').style.background='url(img/'+Game.bgFade+'.jpg)';
						l('backgroundLayer1').style.backgroundSize='512px';
						l('backgroundLayer2').style.backgroundSize='512px';
					}
				}
				else if (Game.elderWrathD>=3 && Game.elderWrathD<4)
				{
					Game.bgR=(Game.elderWrathD-3)/1;
					if (Game.bg!='Mr. Trustys2' || Game.bgFade!='Mr. Trustys3')
					{
						Game.bg='Mr. Trustys2';
						Game.bgFade='Mr. Trustys3';
						l('backgroundLayer1').style.background='url(img/'+Game.bg+'.jpg)';
						l('backgroundLayer2').style.background='url(img/'+Game.bgFade+'.jpg)';
						l('backgroundLayer1').style.backgroundSize='512px';
						l('backgroundLayer2').style.backgroundSize='512px';
					}
				}
				Game.bgRd+=(Game.bgR-Game.bgRd)*0.5;
				l('backgroundLayer2').style.opacity=Game.bgR;
				//why are these so slow (maybe replaceable with a large canvas)
				/*var x=Math.sin(Game.T*0.2)*Math.random()*8;
				var y=Math.sin(Game.T*0.2)*Math.random()*8;
				l('backgroundLayer1').style.backgroundPosition=Math.floor(x)+'px '+Math.floor(y)+'px';
				l('backgroundLayer2').style.backgroundPosition=Math.floor(x)+'px '+Math.floor(y)+'px';*/
			}
		};


		/*=====================================================================================
		DUNGEONS (unfinished)
		=======================================================================================*/

		LaunchDungeons();

		/*=====================================================================================
		INITIALIZATION END; GAME READY TO LAUNCH
		=======================================================================================*/

		Game.LoadSave();

		Game.ready=1;
		l('javascriptError').innerHTML='';
		l('javascriptError').style.display='none';
		Game.Loop();
	}

	/*=====================================================================================
	LOGIC
	=======================================================================================*/
	Game.Logic=function()
	{
		var start = 0
		Game.UpdateGrandmapocalypse();
		//handle milk and milk accessories
		Game.milkProgress=Game.AchievementsOwned/25;
		if (Game.milkProgress>=0.5) Game.Unlock('Kitten helpers');
		if (Game.milkProgress>=1) Game.Unlock('Kitten workers');
		if (Game.milkProgress>=2) Game.Unlock('Kitten engineers');
		if (Game.milkProgress>=3) Game.Unlock('Kitten overseers');
		Game.milkH=Math.min(1,Game.milkProgress)*0.35;
		Game.milkHd+=(Game.milkH-Game.milkHd)*0.02;
		var audie = document.getElementById("myAudio");

		if (Game.autoclickerDetected>0) Game.autoclickerDetected--;
		//handle research
		if (Game.researchT>0)
		{
			Game.researchT--;
		}
		if (Game.researchT==0 && Game.nextResearch)
		{
			Game.Unlock(Game.UpgradesById[Game.nextResearch].name);
			Game.Popup('Researched : '+Game.UpgradesById[Game.nextResearch].name);
			Game.nextResearch=0;
			Game.researchT=-1;
		}

		//handle computers
		if (Game.recalculateGains) Game.CalculateGains();;
		Game.Earn(Game.computersPs/Game.fps);//add computers per second
		//var cps=Game.computersPs+Game.computers*0.01;//exponential computers
		//Game.Earn(cps/Game.fps);//add computers per second

		for (var i in Game.Objects)
		{
			var me=Game.Objects[i];
			me.totalComputers+=me.storedTotalCps/Game.fps;
		}
		if (Game.computers && Game.T%Math.ceil(Game.fps/Math.min(10,Game.computersPs))==0 && Game.prefs.numbers) Game.computerParticleAdd();//computer shower
		if (Game.frenzy>0)
		{
			Game.frenzy--;
			if (Game.frenzy==0) Game.recalculateGains=1;
		}
		if (Game.clickFrenzy>0)
		{
			Game.clickFrenzy--;
			if (Game.clickFrenzy==0) Game.recalculateGains=1;
		}
		if (Game.T%(Game.fps*5)==0 && Game.ObjectsById.length>0)//check some achievements and upgrades
		{
			//if (Game.Has('Arcane sugar') && !Game.Has('Elder Pact')) Game.Unlock('Elder Pact');//temporary fix for something stupid I've done

			//if (Game.Objects['Factory'].amount>=50 && Game.Objects['Factory'].specialUnlocked==0) {Game.Objects['Factory'].unlockSpecial();Game.Popup('You have unlocked the factory dungeons!');}
			if (isNaN(Game.computers)) {Game.computers=0;Game.computersEarned=0;Game.recalculateGains=1;}

			if (Game.Objects['Mr. Trusty'].amount>=50)Game.Unlock('Mr. Trusty\'s wrath');
			if (Game.computersEarned>=9999999) Game.Unlock(['Microsoft support','Increased WiFi Connection','Apple Support','Internet Explorer']);
			if (Game.computersEarned>=99999999) Game.Unlock(['Video Research','Google Chrome','FireFox']);
			if (Game.computersEarned>=999999999) Game.Unlock(['PC Gaming','iTunes','Folders']);
			if (Game.computersEarned>=9999999999) Game.Unlock(['Microsoft Word','Microsoft Excel']);
			if (Game.computersEarned>=99999999999) Game.Unlock(['Eclipse','Microsoft PowerPoint']);
			if (Game.computersEarned>=999999999999) Game.Unlock(['Java','Python','C++']);
			if (Game.computersEarned>=999999999999 && Game.Has('Java') && Game.Has('Python') && Game.Has('C++'))
			{
				Game.Unlock('Photoshop');
				if (Game.Has('Photoshop')) Game.Unlock('Facebook');
				if (Game.Has('Facebook')) Game.Unlock('Twitter');
				if (Game.Has('Twitter')) Game.Unlock('Wolfram Alpha');
				if (Game.Has('Wolfram Alpha')) Game.Unlock('Wikipedia');
				if (Game.Has('Wikipedia')) Game.Unlock('NetClassroom');
				if (Game.Has('NetClassroom')) Game.Unlock('G');
			}
			if (Game.computersEarned>=9999999999999) Game.Unlock(['Red o','Yellow o','g','l','e']);

			for (var i=0;i<Game.moneyAchievs.length/2;i++)
			{
				if (Game.computersEarned>=Game.moneyAchievs[i*2+1]) Game.Win(Game.moneyAchievs[i*2]);
			}
			var buildingsOwned=0;
			var oneOfEach=1;
			var mathematician=1;
			var base10=1;
			var centennial=1;
			for (var i in Game.Objects)
			{
				buildingsOwned+=Game.Objects[i].amount;
				if (!Game.HasAchiev('One with everything')) {if (Game.Objects[i].amount==0) oneOfEach=0;}
				if (!Game.HasAchiev('Mathematician')) {if (Game.Objects[i].amount<Math.min(128,Math.pow(2,(Game.ObjectsById.length-Game.Objects[i].id)-1))) mathematician=0;}
				if (!Game.HasAchiev('Base 10')) {if (Game.Objects[i].amount<(Game.ObjectsById.length-Game.Objects[i].id)*10) base10=0;}
				if (!Game.HasAchiev('Centennial')) {if (Game.Objects[i].amount<100) centennial=0;}
			}
			if (oneOfEach==1) Game.Win('One with everything');
			if (mathematician==1) Game.Win('Mathematician');
			if (base10==1) Game.Win('Base 10');
			if (centennial==1) Game.Win('Centennial');
			if (Game.computersEarned>=1000000 && Game.computerClicks<=15) Game.Win('Neverclick');
			if (Game.computersEarned>=1000000 && Game.computerClicks<=0) Game.Win('True Neverclick');
			if (Game.handmadeComputers>=1000) {Game.Win('Clicktastic');Game.Unlock('Plastic mouse');}
			if (Game.handmadeComputers>=100000) {Game.Win('Clickathlon');Game.Unlock('Iron mouse');}
			if (Game.handmadeComputers>=10000000) {Game.Win('Clickolympics');Game.Unlock('Titanium mouse');}
			if (Game.handmadeComputers>=1000000000) {Game.Win('Clickorama');Game.Unlock('Adamantium mouse');}
			if (Game.computersEarned<Game.computers) Game.Win('Cheated computers work awful');

			if (buildingsOwned>=100) Game.Win('Builder');
			if (buildingsOwned>=400) Game.Win('Architect');
			if (buildingsOwned>=800) Game.Win('Engineer');
			if (Game.UpgradesOwned>=20) Game.Win('Enhancer');
			if (Game.UpgradesOwned>=50) Game.Win('Augmenter');
			if (Game.UpgradesOwned>=100) Game.Win('Upgrader');

			if (!Game.HasAchiev('Elder') && Game.Has('Farmer Mr. Trustys') && Game.Has('Worker Mr. Trustys') && Game.Has('Miner Mr. Trustys') && Game.Has('Cosmic Mr. Trustys') && Game.Has('Transmuted Mr. Trustys') && Game.Has('Altered Mr. Trustys') && Game.Has('Mr. Trusty\'s Grandma')) Game.Win('Elder');
			if (Game.Objects['Mr. Trusty'].amount>=6 && !Game.Has('Opera house/Computer lab') && Game.HasAchiev('Elder')) Game.Unlock('Opera house/Computer lab');
			if (Game.pledges>0) Game.Win('Elder nap');
			if (Game.pledges>=5) Game.Win('Elder slumber');
			if (Game.pledges>=10) Game.Unlock('Sacrificial keyboards');

			if (!Game.HasAchiev('Dunk-tank') && l('bigComputer').getBoundingClientRect().bottom>l('milk').getBoundingClientRect().top+16 && Game.milkProgress>0.1) Game.Win('Dunk-tank');
		}

		Game.computersd+=(Game.computers-Game.computersd)*0.3;

		if (Game.storeToRebuild) Game.RebuildStore();
		if (Game.upgradesToRebuild) Game.RebuildUpgrades();

		if (Game.T%(Game.fps)==0) document.title=Beautify(Game.computers)+' '+(Game.computers==1?'computer':'computers')+' - Trusty Clicker';

		Game.TickerAge--;
		if (Game.TickerAge<=0 || Game.Ticker=='') Game.getNewTicker();

		var veilLimit=0;//10;
		if (Game.veil==1 && Game.computersEarned>=veilLimit) Game.veilOff();
		else if (Game.veil==0 && Game.computersEarned<veilLimit) Game.veilOn();

		Game.goldenComputer.update();

		if (Game.T%(Game.fps*60)==0 && Game.T>Game.fps*10 && Game.prefs.autosave) Game.WriteSave();
		if (Game.T%(Game.fps*60*30)==0 && Game.T>Game.fps*10 && Game.prefs.autoupdate) Game.CheckUpdates();

		Game.T++;
		start++;
	}

	/*=====================================================================================
	DRAW
	=======================================================================================*/
	Game.Draw=function()
	{
		if (Math.floor(Game.T%Game.fps/4)==0) Game.DrawGrandmapocalypse();

		//handle milk and milk accessories
		if (Game.prefs.milk)
		{
			var x=Math.floor((Game.T*2+Math.sin(Game.T*0.1)*2+Math.sin(Game.T*0.03)*2-(Game.milkH-Game.milkHd)*2000)%480);
			var y=0;
			var m1=l('milkLayer1');
			var m2=l('milkLayer2');
			m1.style.backgroundPosition=x+'px '+y+'px';
			m2.style.backgroundPosition=x+'px '+y+'px';
			l('milk').style.height=(Game.milkHd*100)+'%';
			var m1o=1;
			var m2o=0;
			var m1i='milkWave';
			var m2i='chocolateMilkWave';
			if (Game.milkProgress<1) {m1o=1;m1i='milkWave';m2i='chocolateMilkWave';}
			else if (Game.milkProgress<2) {m1o=1-(Game.milkProgress-1);m1i='milkWave';m2i='chocolateMilkWave';}
			else if (Game.milkProgress<3) {m1o=1-(Game.milkProgress-2);m1i='chocolateMilkWave';m2i='raspberryWave';}
			else {m1o=1;m1i='raspberryWave';m2i='raspberryWave';}
			m2o=1-m1o;
			if (m1.style.backgroundImage!='url(img/'+m1i+'.png') m1.style.backgroundImage='url(img/'+m1i+'.png)';
			if (m2.style.backgroundImage!='url(img/'+m2i+'.png') m2.style.backgroundImage='url(img/'+m2i+'.png)';
			m1.style.opacity=m1o;
			m2.style.opacity=m2o;
		}

		if (Game.prefs.particles)
		{
			//shine
			var r=Math.floor((Game.T*0.5)%360);
			var me=l('computerShine');
			me.style.transform='rotate('+r+'deg)';
			me.style.mozTransform='rotate('+r+'deg)';
			me.style.webkitTransform='rotate('+r+'deg)';
			me.style.msTransform='rotate('+r+'deg)';
			me.style.oTransform='rotate('+r+'deg)';

			//cursors
			var r=((-Game.T*0.05)%360);
			var me=l('computerCursors');
			me.style.transform='rotate('+r+'deg)';
			me.style.mozTransform='rotate('+r+'deg)';
			me.style.webkitTransform='rotate('+r+'deg)';
			me.style.msTransform='rotate('+r+'deg)';
			me.style.oTransform='rotate('+r+'deg)';
		}


		//handle cursors

		if (Game.prefs.particles)
		{
			var amount=Game.Objects['Cursor'].amount;
			for (var i=0;i<amount;i++)
			{
				var me=l('cursor'+i);
				/*
				var w=132;
				w+=Math.pow(Math.sin(((Game.T*0.05+(i/amount)*Game.fps)%Game.fps)/Game.fps*Math.PI*3),2)*15+5;
				var x=Math.floor(Math.sin((i/amount)*Math.PI*2)*w)-16;
				var y=Math.floor(Math.cos((i/amount)*Math.PI*2)*w)-16;
				*/
				var n=Math.floor(i/50);
				var a=((i+0.5*n)%50)/50;
				var w=0;
				w=(Math.sin(Game.T*0.025+(((i+n*12)%25)/25)*Math.PI*2));
				if (w>0.997) w=1.5;
				else if (w>0.994) w=0.5;
				else w=0;
				w*=-4;
				//w+=Math.pow(Math.sin(((Game.T*0.05+(i/amount)*Game.fps)%Game.fps)/Game.fps*Math.PI*3),2)*15+5;

				var x=(Math.sin(a*Math.PI*2)*(140+n*16+w))-16;
				var y=(Math.cos(a*Math.PI*2)*(140+n*16+w))-16;
				var r=Math.floor(-(a)*360);
				me.style.left=x+'px';
				me.style.top=y+'px';
			}
		}
		//handle computers
		if (Game.prefs.particles)
		{
			if (Game.elderWrathD<=1.5)
			{
				if (Game.computersPs>=1000) l('computerShower').style.backgroundImage='url(img/computerShower3.png)';
				else if (Game.computersPs>=500) l('computerShower').style.backgroundImage='url(img/computerShower2.png)';
				else if (Game.computersPs>=50) l('computerShower').style.backgroundImage='url(img/computerShower1.png)';
				else l('computerShower').style.backgroundImage='none';
				l('computerShower').style.backgroundPosition='0px '+(Math.floor(Game.T*2)%512)+'px';
			}
			if (Game.elderWrathD>=1 && Game.elderWrathD<1.5) l('computerShower').style.opacity=1-((Game.elderWrathD-1)/0.5);
		}

		var unit=(Math.round(Game.computersd)==1?' computer':' computers');
		if (Math.round(Game.computersd).toString().length>11) unit='<br>computers';
		l('computers').innerHTML=Beautify(Math.round(Game.computersd))+unit+'<div style="font-size:50%;">per second : '+Beautify(Game.computersPs,1)+'</div>';//display computer amount

		/*
		var el=l('bigComputer');
		var s=Math.pow(Math.min(1,Game.computers/100000),0.5)*1+0.5;
		el.style.transform='scale('+s+')';
		el.style.mozTransform='scale('+s+')';
		el.style.webkitTransform='scale('+s+')';
		el.style.msTransform='scale('+s+')';
		el.style.oTransform='scale('+s+')';
		*/

		Game.TickerDraw();

		for (var i in Game.Objects)
		{
			var me=Game.Objects[i];

			//make products full-opacity if we can buy them
			if (Game.computers>=me.price) l('product'+me.id).className='product enabled'; else l('product'+me.id).className='product disabled';

			//update object info
			if (l('rowInfo'+me.id) && Game.T%5==0) l('rowInfoContent'+me.id).innerHTML='&bull; '+me.amount+' '+(me.amount==1?me.single:me.plural)+'<br>&bull; producing '+Beautify(me.storedTotalCps,1)+' '+(me.storedTotalCps==1?'computer':'computers')+' per second<br>&bull; total : '+Beautify(me.totalComputers)+' '+(Math.floor(me.totalComputers)==1?'computer':'computers')+' '+me.actionName;
		}

		//make upgrades full-opacity if we can buy them
		for (var i in Game.UpgradesInStore)
		{
			var me=Game.UpgradesInStore[i];
			if (Game.computers>=me.basePrice) l('upgrade'+i).className='crate upgrade enabled'; else l('upgrade'+i).className='crate upgrade disabled';
		}

		if (Math.floor(Game.T%Game.fps/2)==0) Game.UpdateMenu();

		Game.computerParticlesUpdate();
		Game.computerNumbersUpdate();
		Game.particlesUpdate();
	}

	/*=====================================================================================
	MAIN LOOP
	=======================================================================================*/
	Game.Loop=function()
	{
		//update game logic !
		Game.catchupLogic=0;
		Game.Logic();
		Game.catchupLogic=1;
		//latency compensator
		Game.accumulatedDelay+=((new Date().getTime()-Game.time)-1000/Game.fps);
		Game.accumulatedDelay=Math.min(Game.accumulatedDelay,1000*5);//don't compensate over 5 seconds; if you do, something's probably very wrong
		Game.time=new Date().getTime();
		while (Game.accumulatedDelay>0)
		{
			Game.Logic();
			Game.accumulatedDelay-=1000/Game.fps;//as long as we're detecting latency (slower than target fps), execute logic (this makes drawing slower but makes the logic behave closer to correct target fps)
		}
		Game.catchupLogic=0;
		Game.Draw();

		setTimeout(Game.Loop,1000/Game.fps);
	}
}


/*=====================================================================================
LAUNCH THIS THING
=======================================================================================*/
Game.Launch();

window.onload=function()
{
	if (!Game.ready) Game.Init();
};
