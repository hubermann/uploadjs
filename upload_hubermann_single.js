function notificar(tipo, mensaje) {
    mensajes_div = document.getElementById("notificacion_main");
    mensajes_div.innerHTML = mensaje;
    mensajes_div.setAttribute("class", tipo);
    //hide msg
    setTimeout(function () {
        mensajes_div.innerHTML = "";
        mensajes_div.setAttribute("class", "none");
    }, 3000);
}

function build_thumbnails() {
    console.log('haciendo thumbnail main');

    listadoArray = get_listado();
    	

    	for(i=0; i < listadoArray.length; i++){
    		imagen = localStorage.getItem(listadoArray[i]);
    		
    		divpreview = document.getElementById(listadoArray[i]);
    			
    		divpreview.innerHTML = "<img src=\"http://enlobos:8888/images-comercios/"+imagen+"\" width=\"150\" alt=\"\" /><input type=\"hidden\" value=\""+imagen+"\" name=\"imagen[]\" /></div>";
    	}

}

//traer listado de imagenes
function get_listado() {
	var listadoArray = localStorage.getItem("listadoArray");
	if(!listadoArray){
		listadoArray =[]; //si no existe el array de imagenes aun, lo creo.
		localStorage.setItem("listadoArray",JSON.stringify(listadoArray));
	}else{
		listadoArray = JSON.parse(listadoArray);
	}
	return listadoArray;
}

function upload_ajax(input, idpreview){

var archivos = document.getElementById(""+input+"");

var archivo = archivos.files;


if (window.XMLHttpRequest) {
        var Req = new XMLHttpRequest();
    } else if (window.ActiveXObject) {
        var Req = new ActiveXObject("Microsoft.XMLHTTP");
    }

    var data = new FormData();


    data.append('adjunto',archivos.files[0]);
   
    
    //Pasándole la url a la que haremos la petición
    Req.open("POST", "upload_ajax", true);



    Req.onload = function (Event) {

        if (Req.status == 200) {
     
		var output = JSON.parse(Req.responseText);


            if (typeof output == "object") {

                if (output.status === "OK") {
                	listadoArray = get_listado();
				
					var current_date = new Date();
					var key = "preview"+idpreview;
					var value = output.archivo;
					localStorage.setItem(key, value);
					//guardo el key de imagen en el array de IDs
					listadoArray.push(key);
					localStorage.setItem("listadoArray",JSON.stringify(listadoArray));

               
                    build_preview(idpreview,output.archivo);

                } else {
                    // Response is HTML
                    notificar("error", "Error en archivo! ");
                }




            } else {
                //si recibo error, aqui lo notifico.
                notificar_main("error", "Error! " + output.status);
            }



        } else {
            console.log(Req.status); //Vemos que paso. 
        }
    };

    //Enviamos la petición 
    Req.send(data);
   
}


function build_preview(idpreview, nombreFile){

var div = document.getElementById("preview"+idpreview);
div.innerHTML = "<input type=\"hidden\" name=\"imagen[]\" value=\""+nombreFile+"\" /> <img src=\"http://enlobos:8888/images-comercios/tn_"+nombreFile+"\" alt=\"\" width=\"150\"/>";
nombreFile="";
}