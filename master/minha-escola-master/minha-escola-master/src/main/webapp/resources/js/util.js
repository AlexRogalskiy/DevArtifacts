function fecharIframePdf(id){
	$("#"+id).hide();
	$('html,body').animate({scrollTop: 0},'slow');
}

function scrollUp(){
	$('html,body').animate({scrollTop: 0},'slow');
}

function abrirIframePdf(id){
	$("#"+id).show();
}

function fecharDlg(widgetVar, args) {
	if(!args.validationFailed) {
		widgetVar.hide();
	}
	
}

function abrirDlg(widgetVar, args) {
	
	if(!args.validationFailed && !args.exception) {
		widgetVar.show();
	} else {
		scrollUp();
	}
}

function mascaraMutuario(o,f){
	
	v_obj=o;
	v_fun=f;
	setTimeout('execmascara()',1);
}

function execmascara(){
	v_obj.value=v_fun(v_obj);
}

function cpfCnpj(o){
	
	//Remove tudo o que não é dígito
	var v = o.value;
	v=v.replace(/\D/g,"");
	
	  x=getSelectionStart(o);
	  y = o.value.length;
	
	if (v.length <= 11) { //CPF

		//Coloca um ponto entre o terceiro e o quarto dígitos
		v=v.replace(/(\d{3})(\d)/,"$1.$2");

		//Coloca um ponto entre o terceiro e o quarto dígitos
		//de novo (para o segundo bloco de números)
		v=v.replace(/(\d{3})(\d)/,"$1.$2");

		//Coloca um hífen entre o terceiro e o quarto dígitos
		v=v.replace(/(\d{3})(\d{1,2})$/,"$1-$2");

	} else { //CNPJ

		//Coloca ponto entre o segundo e o terceiro dígitos
		v=v.replace(/^(\d{2})(\d)/,"$1.$2");

		//Coloca ponto entre o quinto e o sexto dígitos
		v=v.replace(/^(\d{2})\.(\d{3})(\d)/,"$1.$2.$3");

		//Coloca uma barra entre o oitavo e o nono dígitos
		v=v.replace(/\.(\d{3})(\d)/,".$1/$2");

		//Coloca um hífen depois do bloco de quatro dígitos
		v=v.replace(/(\d{4})(\d)/,"$1-$2");

	}
	 x = x + o.value.length - y;
	 setCaretTo(o,x);
	return v;

}

/**
 * @author Paulo Neto
 * 
 * Função utilitária pra verificar se a quantidade máxima de caracteres que o campo
 * recebe já foi atingida, se esta já foi atingida muda o focus para o próximo campo.
 * 
 * **/
function proximoCampo(campo) {
	
	campo.value = trimCampo(campo.value);
	
	 if (campo.value.length >= campo.maxLength) {
		  for (var i = 0; i < campo.form.length; i++) {
		   if (campo.form[i] == campo && campo.form[(i + 1)] && campo.form[(i + 1)].type != "hidden") {
			   campo.form[(i + 1)].focus();
		        break;
	   }
	  }
	 }
}

function trimCampo(value){return value.replace(/^\s+|\s+$/g, '');};

function getSelectionStart(o) {
    if (o.createTextRange) {
        var r = document.selection.createRange().duplicate();
        r.moveEnd('character', o.value.length);
        if (r.text == '') return o.value.length;
        return o.value.lastIndexOf(r.text);
    } else return o.selectionStart;
}


function setCaretTo(obj, pos) { 
    if(obj.createTextRange) { 
        /* Create a TextRange, set the internal pointer to
           a specified position and show the cursor at this
           position
        */ 
        var range = obj.createTextRange(); 
        range.move("character", pos); 
        range.select(); 
    } else if(obj.selectionStart) { 
        /* Gecko is a little bit shorter on that. Simply
           focus the element and set the selection to a
           specified position
        */ 
//        obj.focus(); 
        obj.setSelectionRange(pos, pos); 
    } 
}

function maskCpfCnpj (componente) {
	
	$(componente).keyup(function(e) {
		
		var v = $(componente).val();
		//if (e.keyCode == 8 || e.keyCode == 46){
			
		x=getSelectionStart(componente);
		y = v.length;
			
		v=v.replace(/\D/g,"");
		//}
		if (v.length <= 11) {
			//Coloca um ponto entre o terceiro e o quarto dígitos
			v=v.replace(/(\d{3})(\d)/,"$1.$2");
//
//			//Coloca um ponto entre o terceiro e o quarto dígitos
//			//de novo (para o segundo bloco de números)
			v=v.replace(/(\d{3})(\d)/,"$1.$2");
//
//			//Coloca um hífen entre o terceiro e o quarto dígitos
			v=v.replace(/(\d{3})(\d{1,2})$/,"$1-$2");
		} else {
			v=v.replace(/^(\d{2})(\d)/,"$1.$2");
//
//			//Coloca ponto entre o quinto e o sexto dígitos
			v=v.replace(/^(\d{2})\.(\d{3})(\d)/,"$1.$2.$3");
//
//			//Coloca uma barra entre o oitavo e o nono dígitos
			v=v.replace(/\.(\d{3})(\d)/,".$1/$2");
//
//			//Coloca um hífen depois do bloco de quatro dígitos
			v=v.replace(/(\d{4})(\d)/,"$1-$2");
		}
		x = x + v.length - y;
		setCaretTo(componente,x);
		$(componente).val(v);
		
	});
}

/**
 * @author Paulo Neto
 * 
 * Função utilitária que serve para colocar mascara de 8 ou 9 digitos em campos de telefone
 * **/
function telefone8ou9digitos(objeto){
	$(objeto)  
    .mask("(99) 9999-99999")  
        .live('focusout', function (event) {  
            var target, phone, element;  
            target = (event.currentTarget) ? event.currentTarget : event.srcElement;  
            phone = target.value.replace(/\D/g, '');  
            element = $(target);  
            element.unmask();  
            if(phone.length > 10) {  
                element.mask("(99) 99999-9999");  
            } else {  
                element.mask("(99) 9999-9999");  
            }  
        }); 
}

function limitaLinhas(obj, quantLinhas, caracteresPorLinha, idContador){

	var linhasRestantes = quantLinhas;
	var linhas = obj.value.split('\n');
	var linhasTotal = linhas.length;
	var quantCaracteres = 0;
	var count = 1;
	
	
	for (var i = 0; i < linhas.length; i++){
		//acrescentando o '\n' retirado no split
		if (i < (linhas.length - 1)){
            linhas[i] = linhas[i] + '\n';
        }
		
		linhasTotal = linhasTotal + Math.floor( (linhas[i].length)/ caracteresPorLinha);
	}
	
	for (var i = 0; i < linhas.length; i++){
		
		for (var j = 0; j <= linhas[i].length; j+=caracteresPorLinha  ){
			
			if (count <= quantLinhas) {
				count++;
				quantCaracteres = quantCaracteres + linhas[i].substr(j, caracteresPorLinha).length;
			}
		}
		
	}
	
	linhasRestantes = linhasRestantes - linhasTotal;
	
	if (linhasRestantes <= 0) {
		
		linhasRestantes = 0;
		obj.value = obj.value.substring(0, quantCaracteres);
	}
	
	document.getElementById(idContador).innerHTML = linhasRestantes + " linhas restantes";
	
}
 

