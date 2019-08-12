-- phpMyAdmin SQL Dump
-- version 4.7.4
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1
-- Tiempo de generación: 07-08-2019 a las 01:13:25
-- Versión del servidor: 10.1.30-MariaDB
-- Versión de PHP: 7.0.27

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET AUTOCOMMIT = 0;
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de datos: `geeunicah`
--

DELIMITER $$
--
-- Procedimientos
--
CREATE DEFINER=`root`@`localhost` PROCEDURE `guardarAlumno` (IN `pcuenta` VARCHAR(13), IN `pnombre` VARCHAR(80))  NO SQL
BEGIN
SET @Numero = (SELECT COUNT(*) FROM `tabla_alumnos` WHERE `numeroCuenta` = pcuenta);

IF @Numero > 0 THEN
UPDATE `tabla_alumnos` SET `nombreCompleto`= pnombre, `estado`='1' WHERE `numeroCuenta`=pcuenta;
ELSE
INSERT INTO `tabla_alumnos`( `numeroCuenta`, `nombreCompleto`) VALUES (pcuenta,pnombre);
END IF;
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `guardarAsesoria` (IN `pCodigoClase` VARCHAR(10), IN `pCodigoAlumno` VARCHAR(13))  NO SQL
BEGIN
SET @Numero = (SELECT COUNT(*) FROM `tabla_detalle_asesoria_clase` WHERE `codigoClase` = pCodigoClase AND `numeroCuenta` = pCodigoAlumno);

IF @Numero < 1 THEN
INSERT INTO `tabla_detalle_asesoria_clase`(`codigoClase`, `numeroCuenta`) VALUES(pCodigoClase, pCodigoAlumno);
END IF;
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `guardarHorario` (IN `pCodigoClase` VARCHAR(10), IN `pHoraInicio` TIME, IN `pHoraFinal` TIME)  NO SQL
BEGIN
SET @Numero = (SELECT COUNT(*) FROM `tabla_oferta_clase` WHERE `idClase` = pCodigoClase);

IF @Numero > 0 THEN
UPDATE `tabla_oferta_clase` SET `horaInicio`= pHoraInicio, `horaFinal`= pHoraFinal WHERE `idClase`=pCodigoClase;
ELSE
INSERT INTO `tabla_oferta_clase`( `idClase`, `horaInicio`, `horaFinal`) VALUES (pCodigoClase,pHoraInicio,pHoraFinal);
END IF;
END$$

DELIMITER ;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `login`
--

CREATE TABLE `login` (
  `user` varchar(20) COLLATE utf8_spanish_ci NOT NULL,
  `password` varchar(20) COLLATE utf8_spanish_ci NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_spanish_ci;

--
-- Volcado de datos para la tabla `login`
--

INSERT INTO `login` (`user`, `password`) VALUES
('Administrador', 'Administrador'),
('Juan', '12345');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `sessions`
--

CREATE TABLE `sessions` (
  `session_id` varchar(128) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  `expires` int(11) UNSIGNED NOT NULL,
  `data` text CHARACTER SET utf8mb4 COLLATE utf8mb4_bin
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Volcado de datos para la tabla `sessions`
--

INSERT INTO `sessions` (`session_id`, `expires`, `data`) VALUES
('a_XxFGvhr83s9VwWd7IbgVROBGjeiHtZ', 1565217529, '{\"cookie\":{\"originalMaxAge\":null,\"expires\":null,\"httpOnly\":true,\"path\":\"/\"},\"flash\":{}}');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `tabla_alumnos`
--

CREATE TABLE `tabla_alumnos` (
  `numeroCuenta` varchar(13) NOT NULL,
  `nombreCompleto` varchar(80) NOT NULL,
  `estado` tinyint(1) NOT NULL DEFAULT '1'
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Volcado de datos para la tabla `tabla_alumnos`
--

INSERT INTO `tabla_alumnos` (`numeroCuenta`, `nombreCompleto`, `estado`) VALUES
('1010101010101', 'Nicol Diaz', 1),
('1111111111111', 'Mario Carcamo', 1),
('2020202020202', 'Allan Claros2', 1),
('2222222222222', 'Maria del Carme', 1),
('3333333333333', 'Mario Cerrato', 1);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `tabla_clases`
--

CREATE TABLE `tabla_clases` (
  `id_clase` varchar(10) CHARACTER SET utf8 NOT NULL,
  `nombreClase` varchar(40) CHARACTER SET utf8 NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_spanish_ci;

--
-- Volcado de datos para la tabla `tabla_clases`
--

INSERT INTO `tabla_clases` (`id_clase`, `nombreClase`) VALUES
('AD101', 'ADMINISTRACION I'),
('AD104', 'GESTION DE LA CALIDAD TOTAL'),
('AD105', 'ECOLOGIA EMPRESARIAL'),
('AD201', 'ADMINISTRACION II'),
('AD202', 'RECURSOS HUMANOS'),
('AD207', 'PSICOLOGIA EMPRESARIAL'),
('AD208', 'GESTION DE EMPRESAS TURISTICAS'),
('AD302', 'METODOS Y TECNICAS'),
('AD308', 'NEGOCIACION INTERNACIONAL'),
('AD314', 'RELACIONES DE TRABAJO'),
('AD316', 'PROTECCION Y RIESGO EMPRESARIAL'),
('AD401', 'FORMULACION DE PROYECTOS'),
('AD402', 'PLANEACION Y DISEÑO DE CALIDAD'),
('AD403', 'COMPORTAMIENTO HUMANO'),
('AD504', 'SEMINARIO DE ADMINISTRACION'),
('AD532', 'PLANEACION ESTRATEGICA'),
('AD533', 'GESTION ESTRATEGICA DE AGROINDUSTRIAS'),
('AD535', 'GESTION ESTRATEGICA DE PROYECTOS'),
('AD536', 'GESTION DE PEQUEÑA Y MEDIANA EMPRESA'),
('AD537', 'GESTION ESTRATEGICA DE EMPRESAS'),
('AD633', 'GESTION ESTRATEGICA DE AGROINDUSTRIAS'),
('CE201', 'MICROECONOMIA'),
('CE304', 'MACROECONOMIA'),
('CR201', 'EL HOMBRE FRENTE A LA VIDA'),
('CR501', 'DOCTRINA SOCIAL DE LA IGLESIA'),
('CT201', 'CONTABILIDAD'),
('CT301', 'CONTABILIDAD II'),
('CT403', 'CONTABILIDAD ADMINISTRATIVA I'),
('CT501', 'CONTABILIDAD ADMINISTRATIVA II'),
('ES101', 'ESPAÑOL'),
('ES201', 'EXPRESION ORAL'),
('F1501', 'ETICA PROFESIONAL'),
('FI101', 'FILOSOFIA'),
('FI102', 'CIENCIA Y TECNOLOGIA'),
('FZ301', 'ADMINISTRACION FINANCIERA I'),
('FZ401', 'ADMINISTRACION FINANCIERA II'),
('FZ506', 'MERCADOS FINANCIEROS'),
('FZ510', 'ADMINISTRACION DE INSTITUCIONES'),
('FZ513', 'FINANZAS PUBLICAS'),
('HS101', 'HISTORIA DE HONDURAS'),
('IF101', 'INFORMATICA'),
('IF201', 'INFORMATICA'),
('LG201', 'LEGISLACION EMPRESARIAL'),
('MC201', 'MERCADOTECNIA I'),
('MC301', 'INVESTIGACION DE MAERCADOS I'),
('MC402', 'VENTAS'),
('MC410', 'PUBLICIDAD I'),
('MC412', 'COMERCIO INTERNACIONAL'),
('MC511', 'MERCADOTECNIA INTERNACIONAL'),
('MC512', 'NEGOCIOS ELECTRONICOS'),
('MT101', 'MATEMATICAS'),
('MT201', 'PRE-CALCULO'),
('MT202', 'ESTADISTICA I'),
('MT204', 'MATEMATICA FINANCIERA'),
('MT302', 'ESTADISTICA II'),
('MT304', 'CONTROL ESTADISTICO DEL CALIDAD'),
('PR301', 'INGENIERIA DE METODOS'),
('PR408', 'INVESTIGACION DE OPERACIONES'),
('PR501', 'ADMINISTRACION DE LA PRODUCCION'),
('SC101', 'SOCIOLOGIA');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `tabla_detalle_asesoria_clase`
--

CREATE TABLE `tabla_detalle_asesoria_clase` (
  `codigoClase` varchar(10) NOT NULL,
  `numeroCuenta` varchar(13) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Volcado de datos para la tabla `tabla_detalle_asesoria_clase`
--

INSERT INTO `tabla_detalle_asesoria_clase` (`codigoClase`, `numeroCuenta`) VALUES
('ES101', '1010101010101'),
('ES101', '1111111111111'),
('FI101', '1010101010101'),
('MT101', '1010101010101');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `tabla_detalle_matricula_alumno`
--

CREATE TABLE `tabla_detalle_matricula_alumno` (
  `idOfertaClase` int(11) NOT NULL,
  `numeroCuenta` varchar(13) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `tabla_oferta_clase`
--

CREATE TABLE `tabla_oferta_clase` (
  `idOfertaClase` int(11) NOT NULL,
  `idClase` varchar(10) NOT NULL,
  `horaInicio` time NOT NULL,
  `horaFinal` time NOT NULL,
  `estado` tinyint(1) NOT NULL DEFAULT '1'
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Volcado de datos para la tabla `tabla_oferta_clase`
--

INSERT INTO `tabla_oferta_clase` (`idOfertaClase`, `idClase`, `horaInicio`, `horaFinal`, `estado`) VALUES
(1, 'AD101', '12:00:00', '12:51:00', 0),
(3, 'CT201', '07:00:00', '07:50:00', 0);

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `login`
--
ALTER TABLE `login`
  ADD PRIMARY KEY (`user`);

--
-- Indices de la tabla `sessions`
--
ALTER TABLE `sessions`
  ADD PRIMARY KEY (`session_id`);

--
-- Indices de la tabla `tabla_alumnos`
--
ALTER TABLE `tabla_alumnos`
  ADD PRIMARY KEY (`numeroCuenta`);

--
-- Indices de la tabla `tabla_clases`
--
ALTER TABLE `tabla_clases`
  ADD PRIMARY KEY (`id_clase`);

--
-- Indices de la tabla `tabla_detalle_asesoria_clase`
--
ALTER TABLE `tabla_detalle_asesoria_clase`
  ADD PRIMARY KEY (`codigoClase`,`numeroCuenta`);

--
-- Indices de la tabla `tabla_detalle_matricula_alumno`
--
ALTER TABLE `tabla_detalle_matricula_alumno`
  ADD PRIMARY KEY (`idOfertaClase`,`numeroCuenta`);

--
-- Indices de la tabla `tabla_oferta_clase`
--
ALTER TABLE `tabla_oferta_clase`
  ADD PRIMARY KEY (`idOfertaClase`),
  ADD KEY `idClase` (`idClase`);

--
-- AUTO_INCREMENT de las tablas volcadas
--

--
-- AUTO_INCREMENT de la tabla `tabla_oferta_clase`
--
ALTER TABLE `tabla_oferta_clase`
  MODIFY `idOfertaClase` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- Restricciones para tablas volcadas
--

--
-- Filtros para la tabla `tabla_oferta_clase`
--
ALTER TABLE `tabla_oferta_clase`
  ADD CONSTRAINT `tabla_oferta_clase_ibfk_1` FOREIGN KEY (`idClase`) REFERENCES `tabla_clases` (`id_clase`) ON DELETE NO ACTION ON UPDATE NO ACTION;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
