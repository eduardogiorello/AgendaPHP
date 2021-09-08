const formularioContactos = document.querySelector('#contacto'),
    listadoContactos = document.querySelector('#listado-contactos tbody'),
    inputBuscador = document.querySelector('#buscar');

eventListener();
function eventListener() {
    //cuando el formulario de editar o crear se ejecuta
    formularioContactos.addEventListener('submit', leerFormulario);
    if (listadoContactos) {
        //listener para eliminar contacto
        listadoContactos.addEventListener('click', eliminarContacto);
    }
    if (inputBuscador) {
        inputBuscador.addEventListener('input', buscarContactos);
    }

    //contador
    numeroContactos();
}
function leerFormulario(e) {
    e.preventDefault();

    //leer los datos de los input
    let nombre = document.querySelector('#nombre').value,
        empresa = document.querySelector('#empresa').value,
        telefono = document.querySelector('#telefono').value,
        accion = document.querySelector('#accion').value;

    //valida que los campos no esten vacios
    if (nombre == '' || empresa == '' || telefono == '') {
        //2 parametros, texto y clase
        mostrarNotificacion('Todos los campos son obligatorios', 'error'); //lamo a la funcios de abajo
    } else {
        //pasa la vadilacion crea llamado a ajax
        let infoContacto = new FormData(); //toma los datos de los input
        infoContacto.append('nombre', nombre);
        infoContacto.append('empresa', empresa);
        infoContacto.append('telefono', telefono);
        infoContacto.append('accion', accion);
        //console.log(...infoContacto);//los ... crean una copia del obj
        if (accion == 'crear') {
            //creamos un nuevo contacto
            // console.log(...infoContacto);
            insertarBD(infoContacto);
        } else {
            //editar el contacto
            //leer el id
            const idRegistro = document.querySelector('#id').value;
            infoContacto.append('id', idRegistro);
            actualizarRegistro(infoContacto);

        }

    }


}
//insertar en la bd via ajax
function insertarBD(datos) {
    //llamado a ajax

    //crear el objeto
    const xhr = new XMLHttpRequest();
    //abrir la conexion
    xhr.open('POST', 'inc/modelos/modelo-contactos.php', true);

    // pasar los datos
    xhr.onload = function(){
        if (this.status === 200) {
            // console.log(JSON.parse(xhr.responseText));
            // leemos la respuesta de PHP
            const respuesta = JSON.parse(xhr.responseText);

            //inserta en la tabla
            const nuevoContacto = document.createElement('tr');

            nuevoContacto.innerHTML = `
                <td>${respuesta.datos.nombre}</td>
                <td>${respuesta.datos.empresa}</td>
                <td>${respuesta.datos.telefono}</td>
            `;

            // crear contenedor para los botones
            const contenedorAcciones = document.createElement('td');

            // crear el icono de Editar
            const iconoEditar = document.createElement('i');
            iconoEditar.classList.add('fas', 'fa-pen-square');

            // crea el enlace para editar
            const btnEditar = document.createElement('a');
            btnEditar.appendChild(iconoEditar);
            btnEditar.href = `editar.php?id=${respuesta.datos.id_insertado}`;
            btnEditar.classList.add('btn', 'btn-editar');

            // agregarlo al padre
            contenedorAcciones.appendChild(btnEditar);

            // crear el icono de eliminar
            const iconoEliminar = document.createElement('i');
            iconoEliminar.classList.add('fas', 'fa-trash');

            // crear el boton de eliminar
            const btnEliminar = document.createElement('button');
            btnEliminar.appendChild(iconoEliminar);
            btnEliminar.setAttribute('data-id', respuesta.datos.id_insertado);
            btnEliminar.classList.add('btn', 'btn-borrar');

            // agregarlo al padre
            contenedorAcciones.appendChild(btnEliminar);

            // Agregarlo al tr
            nuevoContacto.appendChild(contenedorAcciones);

            // agregarlo con los contactos
            listadoContactos.appendChild(nuevoContacto);


            //resetear formulario
            document.querySelector('form').reset();

            //mostrar notificacion
            mostrarNotificacion('Contacto Creado...', 'correcto');

            //contador
            numeroContactos();
        }

    }

    //enviar los datos
    xhr.send(datos);
}

//editar
function actualizarRegistro(datos) {
    //ajax
    //crear objeto
    const xhr = new XMLHttpRequest();
    //abrir conexion
    xhr.open('POST', 'inc/modelos/modelo-contactos.php', true);
    //leer respuesta
    xhr.onload = function () {
        if (this.status === 200) {
            console.log(xhr.responseText);
            const resultado = JSON.parse(xhr.responseText);
            if (resultado.respuesta === 'correcto') {
                mostrarNotificacion('Contacto editado', 'correcto');
                //contador
                numeroContactos();
            } else {
                mostrarNotificacion('Hubo un error', 'error');
            }
        }
        //Despues de tres segundos redirecionar
        setTimeout(() => {
            window.location.href = 'index.php';
        }, 3000);
    }
    //enviar datos
    xhr.send(datos);

}


//funcion eliminar contacto
function eliminarContacto(e) {
    //sube al elemento padre y pregunta si tiene la clase btn-borrar
    if (e.target.parentElement.classList.contains('btn-borrar')) {
        //tomar id del elemento
        const id = e.target.parentElement.getAttribute('data-id');
        const respuesta = confirm('¿Estas seguro de borrar?...');
        if (respuesta) {
            //llamado a ajax
            //crear el objeto
            const xhr = new XMLHttpRequest();
            //abrir conexion
            xhr.open('GET', `inc/modelos/modelo-contactos.php?id=${id}&accion=borrar`, true);
            //leer respuesta
            xhr.onload = function(){
                if (this.status === 200) {
                    const resultado = JSON.parse(xhr.responseText);
                    // console.log(resultado);
                    if (resultado.respuesta === 'correcto') {

                        console.log(e.target.parentElement.parentElement.parentElement);
                        e.target.parentElement.parentElement.parentElement.remove();
                        mostrarNotificacion('Eliminado', 'correcto');
                        //contador
                        numeroContactos();
                    } else {
                        mostrarNotificacion('Hubo un error...', 'error');
                    }
                }
            }
            //enviar
            xhr.send();
        }
    }
}

//buscador
function buscarContactos(e) {
    const expresion = new RegExp(e.target.value, "i"),//la i es para ignorar mayusculas o minusculas
        registros = document.querySelectorAll('tbody tr');

    registros.forEach(registro => {
        registro.style.display = 'none';//pone todos los registros con dsplay none al escribir
        //childNodes[1] es solo el campo nombre para buscar en empresa o tel se cambia a 2 0 3
        if (registro.childNodes[1].textContent.replace(/\s/g, " ").search(expresion) != -1) {
            //lo q esta en replace es para tomar el espacio en blanco entre dos nombres
            registro.style.display = 'table-row';
        }
    });
    //contador
    numeroContactos();
}
//muestra el numero de contactos
function numeroContactos(){ 
    const totalContactos = document.querySelectorAll('tbody tr'),
        contenedorNumero = document.querySelector('.total-contactos span');

    let total = 0;
    totalContactos.forEach(contacto =>{
        if(contacto.style.display === '' || contacto.style.display === 'table-row'){
            total++;
        }
    });
    console.log(total);
    contenedorNumero.textContent = total+' ';
    
}

// notificacion en pantalla 

function mostrarNotificacion(mensaje, clase) {
    // agregar la estructura que sostendra el contendio
    const notificacion = document.createElement('div');
    // dar una clase
    notificacion.classList.add(clase, 'notificacion', 'sombra');
    // dar contenido
    notificacion.textContent = mensaje;

    // formulario

    formularioContactos.insertBefore(notificacion, document.querySelector('form legend'));

    // ocultar y mostrar la notificacion

    setTimeout(() => {
        //agregara una clase que dira visible
        notificacion.classList.add('visible');

        setTimeout(() => {
            notificacion.classList.remove('visible');

            /* para eliminar el obeto del DOM */
            setTimeout(() => {
                notificacion.remove();
            }, 500);
        }, 3000);


    }, 100);
}