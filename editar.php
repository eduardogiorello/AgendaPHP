<?php
include_once 'inc/funciones/funciones.php';
include 'inc/layout/header.php';


$id = filter_var($_GET['id'], FILTER_VALIDATE_INT);


if (!$id) {
    die('No es valido'); //valida q por url no ingresen otra cosa
} else{
$resultado = obtenerContacto($id); //lamado a la funcion
$contacto = $resultado->fetch_assoc();
}
?>


<div class="contenedor-barra">
    <div class="contenedor barra">
        <a href="index.php" class="btn volver">Volver</a>
        <h1>Editar Contacto</h1>
    </div>
</div>

<div class="bg-amarillo contenedor sombra">
    <form action="" id="contacto" method="POST">
        <legend>Edite el Contacto</legend>

        <?php include 'inc/layout/formulario.php'; ?>

    </form>
</div>
<!--fin div amarillo-->

<?php
include 'inc/layout/footer.php';

?>