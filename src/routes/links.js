//Importamos Express
const express = require('express');

//Importamos de Express la propiedad de enrutamiento (ROUTE)
const router = express.Router();

//importamos el objeto que contiene los datos de la base
const pool = require('../database');

//ruta del logeo
router.get('/login', (req, res) => {
    //resderizado del la vista de logeo
    res.render('links/login');
});

router.get('/menu', (req, res) => {
    res.render('links/menu');
});

router.get('/horaClase', async (req, res) => {
    //Ejecutamos la consulta a la base de datos
    const clases = await pool.query('SELECT `id_clase`, `nombreClase` FROM `tabla_clases`');
    res.render('links/horaClase',{ clases });
});

router.get('/alumnos', (req, res) => {
    res.render('links/alumnos');
});

router.get('/asesoria', async (req, res) => {

    const clases = await pool.query('SELECT `id_clase`, `nombreClase` FROM `tabla_clases`');
    const alumnos = await pool.query('SELECT `numeroCuenta`, `nombreCompleto` FROM `tabla_alumnos`');
    
    res.render('links/asesoria', { clases, alumnos });

});

router.get('/matricula', async (req, res) => {

    const clases = await pool.query('SELECT `idOfertaClase`, tabla_oferta_clase.`idClase`, tabla_clases.nombreClase, `horaInicio`, `horaFinal` FROM `tabla_oferta_clase` INNER JOIN tabla_clases oN tabla_clases.id_clase = tabla_oferta_clase.idClase ORDER BY tabla_clases.nombreClase');
    const alumnos = await pool.query('SELECT `numeroCuenta`, `nombreCompleto` FROM `tabla_alumnos`');
    
    res.render('links/matricula', { clases, alumnos });

});

router.get('/alumnos', (req, res) => {
    res.render('links/alumnos');
});

router.get('/listadoAlumnos', async (req, res) => {
    const links = await pool.query('SELECT `numeroCuenta`, `nombreCompleto`, `estado` FROM `tabla_alumnos` WHERE `estado` = 1');
    res.render('links/listAlu', { links });
});

router.get('/listadoClases', async (req, res) => {
    const links = await pool.query('SELECT `id_clase`, `nombreClase` FROM `tabla_clases`');
    res.render('links/listCla', { links });
});

router.get('/listadoClasesOfertadas', async (req, res) => {
    const links = await pool.query('SELECT `idOfertaClase`, tabla_oferta_clase.`idClase`, tabla_clases.nombreClase, `horaInicio`, `horaFinal`, (SELECT COUNT(*) FROM tabla_detalle_matricula_alumno WHERE tabla_detalle_matricula_alumno.idOfertaClase = tabla_oferta_clase.idOfertaClase) as numero FROM `tabla_oferta_clase` INNER JOIN tabla_clases ON tabla_clases.id_clase = tabla_oferta_clase.idClase');
    res.render('links/listOfertadas', { links });
});

router.get('/listadoClasesAsesoradas', async (req, res) => {
    const links = await pool.query('SELECT `codigoClase`, tabla_clases.nombreClase, COUNT(`numeroCuenta`) as numeroAlumnos, CASE WHEN (SELECT COUNT(*) FROM tabla_oferta_clase WHERE tabla_oferta_clase.idClase = `codigoClase`) > 0 THEN "SI" ELSE "NO" END as Ofetada FROM `tabla_detalle_asesoria_clase` INNER JOIN tabla_clases ON tabla_clases.id_clase = tabla_detalle_asesoria_clase.codigoClase GROUP BY codigoClase');
    res.render('links/listAsesoradas', { links });
});

router.post('/verificarLogin', async (req, res) => {
    
    const { name, pass} = req.body; 
    const newLink = {
        name,
        pass
    };
    const links = await pool.query('SELECT COUNT(*) AS numero FROM `login` WHERE `user` = ? AND `password`= ?', [name, pass]);
    links.forEach((links) => {
        //verificamos que el usuario existe y tenga su contraseña escrita de manera correcta
        if (links.numero == 0) {
            //Muestra un mensaje de error
            req.flash('success', 'Usuario o contraseña incorrecta');
            //redirecciona a la vista "login"
            res.redirect('/links/login');
        }else{
            res.redirect('/links/menu');
        }
      });
});

router.post('/guardarAlumno', async (req, res) => {
    
    const { txtCuentaNuevoAlumno, txtNombreNombreAlumno} = req.body; 
    const newLink = {
        txtCuentaNuevoAlumno,
        txtNombreNombreAlumno
    };
    
    const links = await pool.query('SELECT COUNT(*) AS numero FROM `tabla_alumnos` WHERE `numeroCuenta` = ?', [txtCuentaNuevoAlumno]);
    links.forEach( async (links)  => {
     if (links.numero == 0) {
        await pool.query('INSERT INTO `tabla_alumnos`(`numeroCuenta`, `nombreCompleto`) VALUES (?,?)', [txtCuentaNuevoAlumno, txtNombreNombreAlumno]);
        req.flash('success', 'Alumno registrado correctamente');
        res.redirect('/links/listadoAlumnos');
    }else{
        req.flash('success', 'Ya existe un alumno con el mismo numero de cuenta');
        res.redirect('/links/alumnos');
        
    }
})

});

router.post('/guardarOferta', async (req, res) => {
    
    const { txtClaseAseso, txthoraInicio, txthoraFinal} = req.body; 
    const newLink = {
        txtClaseAseso,
        txthoraInicio,
        txthoraFinal
    };
    await pool.query('INSERT INTO `tabla_oferta_clase`(`idClase`, `horaInicio`, `horaFinal`) VALUES (?,?,?)', [txtClaseAseso, txthoraInicio,txthoraFinal]);
    req.flash('success', 'Oferta agregada correctamente');
    res.redirect('/links/listadoClasesOfertadas');

});

router.get('/eliminarAlumno/:numeroCuenta', async (req, res) => {
    const { numeroCuenta } = req.params;
    await pool.query('DELETE FROM `tabla_alumnos` WHERE `numeroCuenta` = ?', [numeroCuenta]);
    req.flash('success', 'Alumno eliminado correctamente');
    res.redirect('/links/listadoAlumnos');

});

router.get('/editarAlumno/:numeroCuenta', async (req, res) => {
    const { numeroCuenta } = req.params;
    const links = await pool.query('SELECT * FROM `tabla_alumnos` WHERE `numeroCuenta` = ?', [numeroCuenta]);
   
    res.render('links/alumnosEditar', {link: links[0]});
});

router.post('/editarAlumno', async (req, res) => {
    const { txtCuentaNuevoAlumno, txtNombreNombreAlumno} = req.body; 
    const newLink = {
        txtCuentaNuevoAlumno,
        txtNombreNombreAlumno
    };
    await pool.query('UPDATE `tabla_alumnos` SET `nombreCompleto`= ? WHERE `numeroCuenta`= ?', [txtNombreNombreAlumno, txtCuentaNuevoAlumno]);
    req.flash('success', 'Alumno editado correctamente');
    res.redirect('/links/listadoAlumnos');
});

router.get('/editarOferta/:idOfertaClase', async (req, res) => {
    const { idOfertaClase } = req.params;
    const links = await pool.query('SELECT `idOfertaClase`, tabla_oferta_clase.`idClase`, tabla_clases.nombreClase, `horaInicio`, `horaFinal`, `estado` FROM `tabla_oferta_clase` INNER JOIN tabla_clases ON tabla_clases.id_clase = tabla_oferta_clase.idClase WHERE `idOfertaClase` = ?', [idOfertaClase]);
    res.render('links/horaClaseEditar', {link: links[0]});
});

router.post('/editarOferta', async (req, res) => {
    const { txtId, txtClase, txthoraInicio, txthoraFinal} = req.body; 
    const newLink = {
        txtId,
        txtClase,
        txthoraInicio,
        txthoraFinal
    };
    await pool.query('UPDATE `tabla_oferta_clase` SET `horaInicio`= ?,`horaFinal`= ? WHERE `idOfertaClase`= ?', [txthoraInicio, txthoraFinal, txtId]);
    req.flash('success', 'Oferta editada correctamente');
    res.redirect('/links/listadoClasesOfertadas');
});

router.get('/eliminarOferta/:idOfertaClase', async (req, res) => {
    const { idOfertaClase } = req.params;
    await pool.query('DELETE FROM `tabla_detalle_matricula_alumno` WHERE `idOfertaClase` = ?', [idOfertaClase]);
    await pool.query('DELETE FROM `tabla_oferta_clase` WHERE `idOfertaClase` = ?', [idOfertaClase]);
    req.flash('success', 'Oferta eliminada correctamente');
    res.redirect('/links/listadoClasesOfertadas');

});

router.post('/guardarAsesoriaAlumno', async (req, res) => {
    
    const { nombreClase, listadoAlumnos} = req.body; 
    const newLink = {
        nombreClase,
        listadoAlumnos
    };
    const links = await pool.query('SELECT COUNT(*) AS numero FROM `tabla_detalle_asesoria_clase` WHERE `codigoClase` = ? AND `numeroCuenta` = ?', [nombreClase, listadoAlumnos]);
    links.forEach( async (links)  => {
        if (links.numero == 0) {
            await pool.query('INSERT INTO `tabla_detalle_asesoria_clase`(`codigoClase`, `numeroCuenta`) VALUES (?,?)', [nombreClase, listadoAlumnos]);
            req.flash('success', 'Asesoria agregada correctamente');
            res.redirect('/links/Asesoria');
        }else{
            req.flash('success', 'Asesoria ya registrada anteriormente');
            res.redirect('/links/Asesoria');
        }
      });

});

router.get('/verListaClaseAlumnos/:codigoClase', async (req, res) => {
    const { codigoClase } = req.params;
    const clase = await pool.query('SELECT `id_clase`, `nombreClase` FROM `tabla_clases` WHERE `id_clase` = ?', [codigoClase]);
    const links = await pool.query('SELECT tabla_detalle_asesoria_clase.`codigoClase`, tabla_clases.nombreClase, tabla_alumnos.`numeroCuenta`, tabla_alumnos.nombreCompleto FROM `tabla_detalle_asesoria_clase` INNER JOIN tabla_alumnos ON tabla_alumnos.numeroCuenta = tabla_detalle_asesoria_clase.numeroCuenta INNER JOIN tabla_clases ON tabla_clases.id_clase = tabla_detalle_asesoria_clase.codigoClase WHERE tabla_detalle_asesoria_clase.codigoClase = ?', [codigoClase]);
    res.render('links/listAsesoriaAlumnos', { links, link: clase[0] });

});

router.post('/guardarMatriculaAlumno', async (req, res) => {
    
    const { nombreClase, listadoAlumnos} = req.body; 
    const newLink = {
        nombreClase,
        listadoAlumnos
    };
    const links = await pool.query('SELECT count(*) as numero FROM `tabla_detalle_matricula_alumno` WHERE `idOfertaClase`= ? AND `numeroCuenta`= ?', [nombreClase, listadoAlumnos]);
    console.log(links);
    links.forEach( async (links)  => {
        if (links.numero == 0) {
            await pool.query('INSERT INTO `tabla_detalle_matricula_alumno`(`idOfertaClase`, `numeroCuenta`) VALUES (?,?)', [nombreClase, listadoAlumnos]);
            req.flash('success', 'Matricula registrada correctamente');
            res.redirect('/links/Matricula');
        }else{
            req.flash('success', 'Matricula ya registrada anteriormente');
            res.redirect('/links/Matricula');
        }
      });

});

router.get('/verListaClaseAlumnosMatriculadas/:idOfertaClase', async (req, res) => {
    const { idOfertaClase } = req.params;
    const clase = await pool.query('SELECT `idClase`, tabla_clases.nombreClase, `horaInicio`, `horaFinal` FROM `tabla_oferta_clase` INNER JOIN tabla_clases ON tabla_clases.id_clase = tabla_oferta_clase.idClase WHERE `idOfertaClase` = ?', [idOfertaClase]);
    const links = await pool.query('SELECT tabla_detalle_matricula_alumno.`idOfertaClase`, tabla_clases.id_clase, tabla_clases.nombreClase, tabla_detalle_matricula_alumno.`numeroCuenta`, tabla_alumnos.nombreCompleto FROM `tabla_detalle_matricula_alumno` INNER JOIN tabla_alumnos ON tabla_alumnos.numeroCuenta = tabla_detalle_matricula_alumno.numeroCuenta INNER JOIN tabla_oferta_clase ON tabla_oferta_clase.idOfertaClase = tabla_detalle_matricula_alumno.idOfertaClase INNER JOIN tabla_clases ON tabla_clases.id_clase = tabla_oferta_clase.idClase WHERE tabla_detalle_matricula_alumno.idOfertaClase = ?', [idOfertaClase]);
    res.render('links/listMatriculaAlumnos', { links, link: clase[0] });

});

// Mostrar los pagos hechos por los alumnos
router.get('/pagos', async (req, res) => {

    const links = await pool.query('SELECT tabla_detalle_matricula_alumno.`numeroCuenta`, tabla_alumnos.nombreCompleto, COUNT(`id_clase`) as clasesMatriculadas, CASE WHEN(SELECT COUNT(*) FROM tabla_pagos WHERE tabla_pagos.estado) = 1  THEN "PGD"  END as estado FROM`tabla_detalle_matricula_alumno` INNER JOIN tabla_pagos ON tabla_pagos.numeroCuenta = tabla_detalle_matricula_alumno.numeroCuenta INNER JOIN tabla_alumnos ON tabla_alumnos.numeroCuenta = tabla_detalle_matricula_alumno.numeroCuenta INNER JOIN tabla_oferta_clase ON tabla_oferta_clase.idOfertaClase = tabla_detalle_matricula_alumno.idOfertaClase INNER JOIN tabla_clases ON tabla_clases.id_clase = tabla_oferta_clase.idClase WHERE tabla_detalle_matricula_alumno.idOfertaClase GROUP BY numeroCuenta');
    res.render('links/listPagos', { links });
});

// Ver lista de clases matriculadas por el almno
router.get('/verListaClasesAlumno/:numeroCuenta', async (req, res) => {
    const { numeroCuenta } = req.params;
    const alumno = await pool.query('SELECT tabla_detalle_matricula_alumno.`numeroCuenta`, tabla_alumnos.nombreCompleto FROM `tabla_detalle_matricula_alumno` INNER JOIN tabla_alumnos ON tabla_alumnos.numeroCuenta = tabla_detalle_matricula_alumno.numeroCuenta WHERE tabla_detalle_matricula_alumno.numeroCuenta = ?', [numeroCuenta]);
    const links = await pool.query('SELECT tabla_clases.id_clase, tabla_clases.nombreClase, tabla_detalle_matricula_alumno.`numeroCuenta`, tabla_alumnos.nombreCompleto FROM`tabla_detalle_matricula_alumno` INNER JOIN tabla_alumnos ON tabla_alumnos.numeroCuenta = tabla_detalle_matricula_alumno.numeroCuenta INNER JOIN tabla_oferta_clase ON tabla_oferta_clase.idOfertaClase = tabla_detalle_matricula_alumno.idOfertaClase INNER JOIN tabla_clases ON tabla_clases.id_clase = tabla_oferta_clase.idClase WHERE tabla_detalle_matricula_alumno.numeroCuenta = ?', [numeroCuenta]);
    res.render('links/listClasesAlumnos', { links, link: alumno[0] });

    
});

router.get('/guardarPagoAlumno', async (req, res) => {

    // const links = await pool.query('');
    res.render('links/pagos');
});


module.exports = router;