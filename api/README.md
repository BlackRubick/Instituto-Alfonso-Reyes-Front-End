# API del Instituto Superior de Estudios Profesionales Alfonso Reyes

Esta carpeta contiene la API construida con Node.js, Express y MySQL para la administración de usuarios del instituto.

La estructura contempla autenticación con JWT, control de acceso por roles y operaciones CRUD para usuarios con los campos:

- nombre
- apellido
- correo electrónico
- contraseña
- rol

Los roles contemplados en esta primera etapa son:

- admin
- profesor
- estudiante
- contador
- cobranza
- jefe
- director
- coordinadora
- asesor_academico
