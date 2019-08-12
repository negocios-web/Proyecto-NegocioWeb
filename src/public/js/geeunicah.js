$(document).ready(function(){
	$("#formulario-login").hide();
	// $("#btnAsignarHorarios").text("Asignar Horarios");
});
$(document).ready(function(){
	$("#formulario-matricula").hide();
	// $("#btnAsignarHorarios").text("Asignar Horarios");
});

$("#btnAsignarHorarios").click(function(){
	if($("#btnAsignarHorarios").text() == "Asignar Horarios")
	{
		$("#formulario-login").show();
		$("#btnAsignarHorarios").text("Cancelar");
	}
	else{
		$("#formulario-login").hide();
		$("#btnAsignarHorarios").text("Asignar Horarios");

	}
	
});

$("#clase").click(function(){
	if($("#clase").text() == "Asignar Alumnos")
	{
		$("#formulario-matricula").show(200);
	}
	else{
		$("#formulario-matricula").hide(200);
		$("#clase").text("Asignar Alumnos");

	}
	
});