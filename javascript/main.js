$(document).ready(function(){

	//Crear JUGADOR 1
	jugador1=new Jugador("Pere");

	//Crear JUGADOR banca
	banca= new Jugador("Usura");
	banca.setTipus("BANCA");
	banca.setModeJoc("AUTOMATIC");
	
	//Creem la baralla de cartes
	var baralla_ = new Baralla();
	//Nova ronda
	//Netegem tapet
	function nova_ronda(){
		jugador1.netejarJugades();
		banca.netejarJugades();
		//Barallar Cartes (Array amb elements CARTA)
		baralla_.iniciarBaralla();		
		baralla_.barallar();
		
		jugador1.afegir_carta_a_jugada_actual(baralla_.agarraCarta());		
		banca.afegir_carta_a_jugada_actual(baralla_.agarraCarta());			
		
	}//Fi declaració nova_ronda()

	nova_ronda();
	$("#tancar_jugada").click( function(){
		jugador1.getJugadaActual().tancarJugada();
		//Si el jugador ja ha acabat de jugar i ara és el torn de la banca
		if(jugador1.estaJugant()==false){
			  		if (jugador1.hiHaAlgunaJugadaValida()){
						
						banca.getJugada(0).getCarta(0).setOculta(false);
						pintarCarta(banca.getJugada(0).getCarta(0), 1,0,"BANCA");
			  			
			  			jugaBanca();
			  			
			  		}else{
			  			banca.getJugada(0).tancarJugada();
			  			alert("La banca guanya directament");
			  		}
			  		//nova_ronda();
		}
	});
	
	
	$("#btnAgarraCarta").click( function(){
		if (jugador1.getJugadaActual().esValida() && !jugador1.getJugadaActual().estaTancada()){
			var carta_aux=baralla_.agarraCarta();
			if (jugador1.esPosibleObrir(carta_aux)) {
			
				obrimJugada(carta_aux);
				/*if (obrimJugada()){
					//alert("MERDA Obrim");
					jugador1.afegirJugada(carta_aux);
				}else{
					//alert("no obrim");
					jugador1.afegir_carta_a_jugada_actual(carta_aux);
				}*/
			}else{
				jugador1.afegir_carta_a_jugada_actual(carta_aux);
			}
			
			if(jugador1.estaJugant()==false){
					if (jugador1.hiHaAlgunaJugadaValida()){
						banca.getJugada(0).getCarta(0).setOculta(false);
						pintarCarta(banca.getJugada(0).getCarta(0), 1,0,"BANCA");
			  			jugaBanca();
			  			
			  		}else{
			  			banca.getJugada(0).tancarJugada();
			  			alert("La banca guanya directament");
			  		}
			  		
			  }
			
		}else{
		
			if (! banca.estaJugant()) nova_ronda();
		}

	});
	
	
	$(document).on('mouseover','.carta_meua_oculta',			
  		function (e) {
  			var raw_id_carta=$(this).attr('id');
  			var ids_carta=raw_id_carta.split('_');
  			var carta=jugador1.getJugada(ids_carta[1]).getCarta(ids_carta[2]);
    		$(this).children(":first").attr('src','images/baralla/'+carta.getPal()+'/'+carta.getPal()+'_'+carta.getNom()+'.jpg');
    		
  		}
  	);
  	
  	$(document).on('mouseleave','.carta_meua_oculta',
  		function (e) {
  			var raw_id_carta=$(this).attr('id');
  			var ids_carta=raw_id_carta.split('_');
  			var carta=jugador1.getJugada(ids_carta[1]).getCarta(ids_carta[2]);
  			//alert("bobo");
    		if (carta.getIsOculta())
    			$(this).children(":first").attr('src','images/baralla/revers_small.jpg');
    	
  		}
	);
	
	
	$(document).on('dblclick','.carta_meua_oculta',function(event){
  			var raw_id_carta=$(this).attr('id');
  			var ids_carta=raw_id_carta.split('_');
  			var carta=jugador1.getJugada(ids_carta[1]).getCarta(ids_carta[2]);
    		$(this).attr("class","carta_meua");
    		$(this).children(":first").attr('src','images/baralla/'+carta.getPal()+'/'+carta.getPal()+'_'+carta.getNom()+'.jpg');
			carta.setOculta(false);
	});
	
	$(document).on('dblclick','.carta_meua',function(event){
  			var raw_id_carta=$(this).attr('id');
  			var ids_carta=raw_id_carta.split('_');
  			var carta=jugador1.getJugada(ids_carta[1]).getCarta(ids_carta[2]);
    		$(this).attr("class","carta_meua_oculta");
    		$(this).children(":first").attr('src','images/baralla/revers_small.jpg');
    		alert("Rrrrr");
			carta.setOculta(true);
	});
		
	function jugaBanca(){
	     var continua=false;
		if (banca.getJugadaActual().getPuntuacioJugada()<5.5){
			banca.afegir_carta_a_jugada_actual(baralla_.agarraCarta());
			setTimeout( function() { jugaBanca( ); }, 2500 );		
		}else{
			continua=true;
		}
		
		if (continua){
			if (banca.getJugadaActual().esValida()){
				banca.getJugadaActual().tancarJugada();
				//alert("procediriem a contar");
				contarPunts();
			}else{
				//alert("guanya jugador");
				contarPunts();
			}
		}
	}
	
	function contarPunts(){
		//alert("procediriem a contar ");
		
		if (!banca.estaJugant()){
			//alert("procediriem a contar");
			var punts_banca	=banca.getJugadaActual().getPuntuacioJugada();
			if (!banca.getJugadaActual().esValida()) punts_banca=0;
			for (var i=0;i<jugador1.getNumJugades();i++){
				if (jugador1.getJugada(i).esValida() && jugador1.getJugada(i).estaTancada()){
					if (jugador1.getJugada(i).getPuntuacioJugada()>punts_banca){
						pintarWin(i,jugador1.getTipus());
					}else{
						invalidarJugada(i,jugador1.getTipus());
					}
				}
			}
		}
	}
	
});
