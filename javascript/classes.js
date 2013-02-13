/**
 * Crea una instància d'un jugador del set i mig 
 *
 * @constructor
 * @this {Jugador}
 * @param {string} nom_ El nom que volem per a l jugador.
 */
function Jugador(nom_){
	var nom=nom_;
	var tipus="NORMAL"; //NORMAL o BANCA
	var mode_joc="MANUAL"; //MANUAL o AUTOMATIC
	var jugades=new Array(); //Màxim 4 jugades obertes
	var jugada_actual=0; //Manté una referència a la jugada actual	
	
	 /**@public*/
	this.getNom=function(){
		return nom;	
	}
	 /**@public*/
	this.setTipus=function(tipus_){
		tipus=tipus_;
	}
	 /**@public*/
	this.getTipus=function(){
		return tipus;	
	}
	 /**@public*/
	this.setModeJoc=function(modejoc_){
		mode_joc=modejoc_;
	}
	 /**@public*/
	this.getModeJoc=function(){
		return mode_joc;
	}
	
	/**@public*/
	this.getJugadaActual=function(){
		return this.getJugada(jugada_actual);
	}
	
	/**@public*/
	this.getIndexJugadaActual=function(){
		return jugada_actual;
	}
	
	/**@public*/
	this.getNumJugades=function(){
		return jugades.length;
	}
	
	 /**@public*/
	this.afegir_carta_a_jugada_actual=function(carta_){
		if(jugades.length==0) jugades[0]=new Jugada(carta_,this);
		else jugades[jugada_actual].afegir_carta(carta_);
		pintarPuntuacio(this);
	}
	
	/**
 	* Obtenim una instancia jugada d'un jugador a partir s'un index  
 	*
 	* @param {number} index Quina jugada volem
 	* @throws {IndexOutOfBoundaries} Si intentem accedir a una jugada que no existeix 
 	* @returns {Jugada} Retorna una instancia jugada
 	*/
	this.getJugada= function(index){
		if (typeof jugades[index] == 'undefined')
        		throw new Error("out of bounds baby");
		else
			return jugades[index];
	}
		
	/**
	 * Averigua Si hi ha alguna jugada vàlida. De estar totes tancades i cap vàlida, la banca no juga, guanya directament	
	 *
	 * @public
	 */
	this.hiHaAlgunaJugadaValida=function() {
		var valida_=false;
		if (!this.estaJugant()){
			
			for (var i=0;i<jugades.length;i++){
				valida_=jugades[i].esValida();				
				if (valida_) break;
			}
		}
		return valida_;
	}
	
	
	/**
	 * Averigua Si hi ha alguna jugada oberta i retornem true, en cas contrari false	
	 *
	 * @public
	 */
	
	this.estaJugant=function(){
		var jugant_=false;
		for (var i=0;i<jugades.length;i++){
			tancada_=jugades[i].estaTancada()
			if (tancada_==false) jugant_=true;
			if (jugant_) break;
		}
		return jugant_;	
	}
	
	this.netejarJugades=function(){
		jugada_actual=0;
		jugades=new Array();
		$("div#tapet").empty();
		/*if (this.tipus=="NORMAL")
			$("div.jugador_").remove();
		else
			$("div#banca_jugada").remove();*/
	}
	
	/**
	 * TODO: Cal que siga private
	 *
	 * @private
	 */
	this.changeJugadaActual=function(){
		if (jugada_actual+1 <= jugades.length-1) jugada_actual+=1;
	}
	
	/**
	 * Sols podrem crear una nova jugada si és compleixen les condicions per obrir nova jugada. Com a màxim un jugador solament pot obrir 4 jugades
	 *
	 * @param {Carta} carta_ 1ra carta que afegirem a la nova jugada.
	 * @public
	 */
	this.afegirJugada=function(carta_){	
	
	  //Si la carta que hem extret és 0.5 o 1 i hi ha almenys una jugada i menys de 4 i en l'ultima jugada hi ha solament una carta i aquesta es 0.5 o 1 Aleshores obrim jugada
	  if (carta_.getPuntuacio()<=1 && jugades.length>=1 && jugades.length<4 && jugades[0].getNumCartes()==1 && jugades[jugades.length-1].getNumCartes()==1 && (jugades[jugades.length-1].getCarta(0).getPuntuacio()==0.5 || jugades[jugades.length-1].getCarta(0).getPuntuacio()==1)){
		jugades[jugades.length]=new Jugada(carta_,this);
	  //Si no es compleixen les condicions anteriors el que fem es afegir la carta a la jugada actual
	  }else{
	    	this.afegir_carta_a_jugada_actual(carta_);
	  	throw new Error("Sols podem obrir com a màxim 4 jugades i tan sols si la 1ra carta és un 0,5 o un 1 tindrem opció a obrir");
	  }
			
	}
	this.esPosibleObrir=function(carta_){
		 //Si la carta que hem extret és 0.5 o 1 i hi ha almenys una jugada i menys de 4 i 
		//en l'ultima jugada hi ha solament una carta i aquesta es 0.5 o 1 Aleshores obrim jugada
		if (carta_.getPuntuacio()<=1 && jugades.length>=1 && jugades.length<4 && jugades[0].getNumCartes()==1 && jugades[jugades.length-1].getNumCartes()==1 && jugades[jugades.length-1].getCarta(0).getPuntuacio()<=1 ){
			return true;
	  	//Si no es compleixen les condicions anteriors el que fem es afegir la carta a la jugada actual
	  	}else{
			return false;	
	  	}	
	}
}//End Jugador



/**
 * Crea una instància de Jugada. Una jugada està composada per un conjunt de cartes
 *
 * @constructor
 * @this {Jugaa}
 * @param {Carta} carta_ Primera carta que afegirem a la jugada.
 * @param {Jugador} jugador_ Referència al jugador al que pertany la jugada.
 */
function Jugada(carta_,jugador_){
	var jugador=jugador_;
	var cartes=new Array();
	
	//La primera carta de les jugades obertes la destapem
	if (jugador_.getNumJugades()>=1 && jugador_.getTipus()=="NORMAL") {
		carta_.setOculta(false);
		jugador_.getJugada(0).getCarta(0).setOculta(false);
		pintarCarta(jugador_.getJugada(0).getCarta(0),1,0,"NORMAL");
		
	//La primera carta de la 1ra jugada la repartim oculta
	}else{
		carta_.setOculta(true);
	}
	cartes[0]=carta_;
	//alert(jugador.getNom()+" "+jugador.getTipus()+" "+jugador.getNumJugades());
	pintarJugada(jugador.getNom(),jugador.getTipus(),jugador.getNumJugades());			 
	pintarCarta(carta_,jugador.getNumJugades()+1,0,jugador.getTipus());
	
	
	var valida=true;
	var tancada=false;
	//console.log(carta_);
	var puntuacio=carta_.getPuntuacio();
	var quants_asos = 0;
	
	if (carta_.getNom()=="1") quants_asos=1;
	
	this.afegir_carta=function(carta_){
		console.log(carta_);
		if (valida){
			cartes[cartes.length]=carta_;
			if (carta_.getNom()=="1") quants_asos+=1;
			puntuacio+=carta_.getPuntuacio();
			
			//Pintem abans de descobrir si la jugada és vàlida o no 
			var ja=jugador.getIndexJugadaActual();			
			if (!this.hiHaAlgunaCartaOculta() && jugador_.getTipus()=="NORMAL") carta_.setOculta(true); 
			pintarCarta(carta_,ja+1,cartes.length-1,jugador.getTipus());
			
			valida=this.checkValidesa();
			if (!valida) {				
				
				this.tancarJugada();
				//carta_.setOculta(false);
				//pintarCarta(carta_,ja+1,cartes.length-1,jugador.getTipus());
			}else if(puntuacio==7.5){
				//Si tenim un 7.5 tanquem la jugada
				this.tancarJugada();			
			}
			
			
			
		}else{
			throw new Error("JugadaInvalida");
		}
	}
	
	this.getNumCartes=function(){
		return cartes.length;	
	}

	/**
 	* Obtenim una instancia carta d'una jugada a partir d'un index  
 	*
 	* @param {number} index Quina carta volem
 	* @throws {IndexOutOfBoundaries} Si intentem accedir a una jugada que no existeix 
 	* @returns {Carta} Retorna una instancia Carta
 	*/
	this.getCarta=function(index){
		if (typeof cartes[index] == 'undefined')
        		throw new Error("out of bounds baby");
		else
			return cartes[index];
	}	
	
	this.tancarJugada=function(){
		tancada=true;
		
		if (!valida){
			//alert("PAra El carro "+valida);
			invalidarJugada(jugador.getIndexJugadaActual(),jugador.getTipus());		 
		}
		
		jugador.changeJugadaActual();
		//PAssar a pintar.js
		$("#tancar_jugada").css("left",50+jugador.getIndexJugadaActual()*170);
	}
	this.esValida=function(){
		return valida;
	}
	this.estaTancada=function(){
		return tancada;
	}
	
	this.hiHaAlgunaCartaOculta=function(){
		var hiha=false;
		for (var i=0;i<cartes.length;i++){
			if (cartes[i].getIsOculta()) {
				hiha=true;
				break;
			}			
		}
		return hiha;
	}
	this.checkValidesa=function(){
		if (puntuacio>7.5 && quants_asos==0){
			return false;
		}
		if (puntuacio<=7.5){
			return true;
		}		
		if (puntuacio>7.5 && quants_asos>0){		
			var provable=false;
			for (var i=0;i<quants_asos;i++){
				puntuacio=puntuacio-0.5;
				console.log("MERDA "+quants_asos);
				if (puntuacio <=7.5){
					provable=true;					
				}
				if (provable) break;
			}
			return provable;
			
		}
		
	}
	this.getPuntuacioJugada=function(){
		return puntuacio;
	}
}//END class Jugada

/**
 * Crea una instància de Baralla. Conté un array privat de 40 cartes de la baralla espanyola
 *
 * @constructor
 * @this {}
 */
function Baralla(){

	var baralla_priv=new Array();
	
	
	this.iniciarBaralla=function(){
		baralla_priv=[
		new Carta('1', 'bastos',1),
		new Carta('2', 'bastos',2),
		new Carta('3', 'bastos',3),
		new Carta('4', 'bastos',4),
		new Carta('5', 'bastos',5),
		new Carta('6', 'bastos',6),
		new Carta('7', 'bastos',7),
		new Carta('10', 'bastos',0.5),
		new Carta('11', 'bastos',0.5),
		new Carta('12', 'bastos',0.5),
		new Carta('1', 'espadas',1),
		new Carta('2', 'espadas',2),
		new Carta('3', 'espadas',3),
		new Carta('4', 'espadas',4),
		new Carta('5', 'espadas',5),
		new Carta('6', 'espadas',6),
		new Carta('7', 'espadas',7),
		new Carta('10', 'espadas',0.5),
		new Carta('11', 'espadas',0.5),
		new Carta('12', 'espadas',0.5),
		new Carta('1', 'copas',1),
		new Carta('2', 'copas',2),
		new Carta('3', 'copas',3),
		new Carta('4', 'copas',4),
		new Carta('5', 'copas',5),
		new Carta('6', 'copas',6),
		new Carta('7', 'copas',7),
		new Carta('10', 'copas',0.5),
		new Carta('11', 'copas',0.5),
		new Carta('12', 'copas',0.5),
		new Carta('1', 'oros',1),
		new Carta('2', 'oros',2),
		new Carta('3', 'oros',3),
		new Carta('4', 'oros',4),
		new Carta('5', 'oros',5),
		new Carta('6', 'oros',6),
		new Carta('7', 'oros',7),
		new Carta('10', 'oros',0.5),
		new Carta('11', 'oros',0.5),
		new Carta('12', 'oros',0.5)
	   ];
	}
	this.iniciarBaralla();
	//Retorna la baralla remenejada
	this.barallar=function(){ 
    		for(var j, x, i = baralla_priv.length; i; j = parseInt(Math.random() * i), x = baralla_priv[--i], baralla_priv[i] = baralla_priv[j], baralla_priv[j] = x);
	    	//return baralla;
	};
	
	this.agarraCarta=function(){
		var carta=baralla_priv.splice(0,1);
		console.log(carta[0]+" Ara baralla_priv.length="+baralla_priv.length);
		return carta[0];
	}
	
}//End class baralla

/**
 * Crea una instància de Baralla. Conté un array privat de 40 cartes de la baralla espanyola
 *
 * @constructor
 * @this {}
 * @param {String} nom Nom de la carta (número)
 * @param {String} pal Bastos,oros, copes o espases
 * @param {numero} valor Puntuació de la carta en el 7 i mig 
 */
function Carta(nom,pal,valor) {
		var nom = nom;
		var pal = pal;
		var valor = valor;
		var oculta=false;
		
		
		
		this.getPuntuacio=function(){
			return valor;
		}
		this.getPal=function(){
			return pal;
		}
		this.getNom=function(){
			return nom;
		}
		this.getIsOculta=function(){
			return oculta;
		}
		this.setOculta=function(oculta_){
			oculta=oculta_;
		}	
		
} //End class Carta
