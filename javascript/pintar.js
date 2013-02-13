/**
 * Funció pintarCarta. Encarregada de dibuixar pel navegador dins d'una jugada concreta una carta oculta o visible 
 * El posicionament de les capes on van les cartes és Absolut. 
 *
 * @param {Carta} carta L'objecte carta que anem a dibuixar.
 * @param {numeric} num_jugada Sobre quina jugada anem a dibuixar la carta.
 * @param {numeric} index Dins de la jugada quina posició ocupa la carta.
 * @param {string} tipus_jugador En funció de si el jugador és NORMAL o BANCA dibuixarem les cartes en una orientació diferent.
 */
function pintarCarta(carta, num_jugada, index,tipus_jugador){

	var capa_class="#meua_jugada"+num_jugada;
	var carta_class="carta_meua";
	var carta_id="NORMAL_"+(num_jugada-1)+"_"+index;
	var left_inc=index*20;
	var top_inc=index*40;
	if (tipus_jugador=="BANCA"){
		capa_class="#banca_jugada";
		left_inc=index*70;
		top_inc="0px";
		carta_class="carta_banca";
	}
	
	if (carta.getIsOculta()){			
			tipus_jugador=="NORMAL"?carta_class="carta_meua_oculta":carta_class="carta_banca_oculta";
			img_carta="images/baralla/revers_small.jpg";
	}else{					
			img_carta='images/baralla/'+carta.getPal()+'/'+carta.getPal()+'_'+carta.getNom()+'.jpg';
	}
	
	var $d = $("<div>");
		$d.addClass(carta_class)		
		 .attr('id',carta_id)
		 .appendTo(capa_class);
						  
		$("<img>").attr('width', '150px')		       	  
		  .attr('src', img_carta)
		  .appendTo($d)						  
		  .fadeOut('slow')						  
		  .fadeIn('slow');
						  
		$d.css("left",left_inc);
		$d.css("top",top_inc);
}

function pintarPuntuacio(jugador_){
	//console.log("PintarPuntuacio "+jugador_);
	if (jugador_.getTipus()=="NORMAL"){	
		$("#punts_jugador1").empty();
		for (var i=0; i<jugador_.getNumJugades();i++){
			$("#punts_jugador1").append(jugador_.getNom()+" Jugada "+(i+1)+" = "+jugador_.getJugada(i).getPuntuacioJugada()+"<br>");
		}
	}else{		
		$("#punts_banca").empty();
		//HARD WIRED
		if (!jugador1.estaJugant())
			$("#punts_banca").html("Banca "+jugador_.getNom()+" = "+jugador_.getJugadaActual().getPuntuacioJugada());
	}
	
}

function pintarJugada(jugador_nom,tipus_jugador,ultima_jugada){
	if (tipus_jugador === "NORMAL"){
		var $d2 = $("<div>");
		$d2.addClass("jugador_"+jugador_nom)		
		.attr('id', 'meua_jugada'+(ultima_jugada+1))	
		.appendTo("#tapet");
	}else{
		var $d2 = $("<div>");
		$d2.addClass("jugador_"+jugador_nom)		
		.attr('id', 'banca_jugada')	
		.appendTo("#tapet");	
	}
}

function obrimJugada(carta_aux2){

	 var $elmeudialeg=$( "#dialog-modal" ).dialog({
		autoOpen:false,
		resizable: false,
		height:140,
		modal: true,
		buttons: {
			"Obrir nova jugada": function() {
				//alert("Obrir carta="+carta_aux2.getPal());
				jugador1.afegirJugada(carta_aux2);
				$( this ).dialog( "close" );
				return true;
			},
			"Continuar amb la mateixa": function() {
				jugador1.afegir_carta_a_jugada_actual(carta_aux2);
				$( this ).dialog( "close" );
				return false;
			}
		}
	});
	return $elmeudialeg.dialog('open');
}

function invalidarJugada(index_jugada,tipus_jugador){
		var top="490px";
		var left="540px";
		if (tipus_jugador=="NORMAL"){
			top="170px";
			left=50+index_jugada*170;
		}
		var $d = $("<div>")
			.css('position','absolute')
		 	.css('z-index','5')
		 	.css('top', top)
		 	.css('left',left)
		 	.appendTo('#tapet');
						  
		$("<img>").attr('width', '150px')
			
	       	.attr('title', 'valida' )
		  	.attr('src', 'images/x.png' )
		  	.appendTo($d)						  
		  
}
function pintarWin(index_jugada,tipus_jugador){
		var top="490px";
		var left="540px";
		if (tipus_jugador=="NORMAL"){
			top="170px";
			left=50+index_jugada*170;
		}
		var $d = $("<div>")
			.css('position','absolute')
		 	.css('z-index','5')
		 	.css('top', top)
		 	.css('left',left)
		 	.appendTo('#tapet');
						  
		$("<img>").attr('width', '150px')
			
	       	.attr('title', 'valida' )
		  	.attr('src', 'images/check.png' )
		  	.appendTo($d)						  
}
