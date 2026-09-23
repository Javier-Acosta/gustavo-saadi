# OpenSpec MVP: Sitio politico administrable

## 1. Resumen

**Nombre del producto:** Sitio politico administrable para candidato  
**Proyecto:** Gustavo Saadi / candidato politico  
**Tipo:** Aplicacion web publica con panel de administracion  
**Estado:** Propuesta MVP  
**Version:** 0.1  
**Fecha:** 2026-09-22

El MVP consiste en una pagina web simple para un candidato politico, con una portada publica orientada a comunicacion de campana y un panel administrador para gestionar contenido basico sin depender de cambios de codigo.

## 2. Objetivo

Crear una presencia digital inicial que permita:

- Presentar al candidato con identidad visual propia.
- Mostrar un video principal de campana en el banner.
- Publicar videos externos desde YouTube.
- Publicar noticias o novedades de campana.
- Configurar redes sociales y contenido del pie de pagina.
- Desplegar la aplicacion en Dokploy mediante Docker.

## 3. Alcance Del MVP

### Incluido

- Pagina publica responsive.
- Banner principal con video configurable.
- Seccion de galeria de videos con enlaces de YouTube.
- Seccion de noticias.
- Pie de pagina con redes sociales y reel.
- Panel administrador basico.
- Persistencia inicial en `localStorage`.
- Dockerfile para despliegue en Dokploy.

### No Incluido

- Login real de administrador.
- Base de datos persistente en servidor.
- Carga de archivos a storage externo.
- Roles y permisos.
- Editor enriquecido de noticias.
- Analiticas, SEO avanzado o integracion con CRM.
- Moderacion o aprobacion de contenido.

## 4. Usuarios

### Visitante

Persona interesada en conocer al candidato, ver videos, leer novedades y acceder a sus redes sociales.

### Administrador

Miembro del equipo de campana que necesita actualizar contenido basico del sitio sin editar codigo.

## 5. Experiencia Publica

### Home

La pagina publica debe mostrar:

- Logo o iniciales del candidato.
- Nombre del candidato.
- Slogan o frase principal.
- Banner visual con video corto si esta configurado.
- Navegacion hacia videos, noticias y redes.
- Acceso visible al panel administrador durante etapa MVP.

### Galeria De Videos

La galeria debe permitir mostrar videos embebidos desde YouTube.

Cada video debe incluir:

- Titulo.
- URL de YouTube.
- Reproductor embebido.

### Noticias

La seccion de noticias debe mostrar tarjetas con:

- Fecha.
- Titulo.
- Resumen.

### Pie De Pagina

El footer debe mostrar:

- Nombre del candidato.
- Slogan.
- Links a redes sociales.
- Logo o sigla por red social.
- Reel o video corto configurable.

## 6. Panel Administrador

El panel administrador debe permitir configurar:

- Nombre del candidato.
- Slogan.
- URL del logo.
- URL del video principal.
- Carga local de video principal para previsualizacion y guardado MVP.
- Lista de videos de YouTube.
- Lista de noticias.
- URL del reel de pie de pagina.
- Carga local de reel para previsualizacion y guardado MVP.
- Lista de redes sociales.

## 7. Requisitos Funcionales

### RF-001: Configurar identidad

El administrador puede editar nombre, slogan y logo del candidato.

**Criterios de aceptacion:**

- Al guardar, los cambios se reflejan en la pagina publica.
- Si no hay logo, se muestra una marca alternativa con iniciales.

### RF-002: Configurar banner con video

El administrador puede definir un video principal por URL o subir un archivo local compatible con navegador.

**Criterios de aceptacion:**

- La pagina publica reproduce el video en loop, sin sonido y como fondo del banner.
- Si no hay video, se muestra un fondo visual alternativo.

### RF-003: Gestionar galeria de YouTube

El administrador puede agregar videos con titulo y URL de YouTube.

**Criterios de aceptacion:**

- Las URLs de `youtube.com/watch?v=` y `youtu.be/` se convierten en embeds.
- Cada video se muestra en una tarjeta responsive.

### RF-004: Gestionar noticias

El administrador puede agregar noticias con titulo, fecha y resumen.

**Criterios de aceptacion:**

- Las noticias se muestran en la seccion publica.
- La informacion se conserva despues de guardar y recargar el navegador.

### RF-005: Gestionar footer y redes

El administrador puede configurar redes sociales y reel de pie de pagina.

**Criterios de aceptacion:**

- Cada red social muestra nombre, link y sigla/logo.
- Los links abren en una nueva pestana.
- El reel se muestra si esta configurado.

### RF-006: Despliegue Docker

La aplicacion debe poder construirse desde un `Dockerfile` en la raiz del repositorio.

**Criterios de aceptacion:**

- Dokploy detecta el `Dockerfile`.
- La imagen instala dependencias con `npm ci`.
- La imagen ejecuta `npm run build`.
- La aplicacion arranca con `npm start` en puerto `3000`.

## 8. Requisitos No Funcionales

- **Responsive:** debe funcionar en mobile, tablet y desktop.
- **Performance MVP:** la pagina debe cargar sin dependencias pesadas innecesarias.
- **Mantenibilidad:** el codigo debe mantenerse simple y organizado por rutas de Next.js.
- **Portabilidad:** debe desplegarse en Dokploy usando Docker.
- **Accesibilidad basica:** textos legibles, contraste suficiente y estructura semantica.

## 9. Restricciones Tecnicas

- Framework: Next.js.
- Lenguaje: TypeScript.
- Estilos: Tailwind CSS.
- Persistencia MVP: `localStorage`.
- Deploy: Docker en Dokploy.
- Puerto esperado: `3000`.

## 10. Riesgos

| Riesgo | Impacto | Mitigacion MVP |
| --- | --- | --- |
| `localStorage` no comparte datos entre dispositivos | Alto | Migrar a base de datos en siguiente fase |
| Videos subidos como data URL pueden ser pesados | Medio | Recomendar clips cortos y luego usar storage |
| Panel admin sin login | Alto | Mantener como MVP privado y agregar autenticacion |
| Cambios no versionados desde admin | Medio | Agregar backend con auditoria en fase 2 |

## 11. Roadmap Posterior Al MVP

### Fase 2: Persistencia Real

- Base de datos para configuracion, noticias y videos.
- Storage para videos e imagenes.
- API interna para CRUD.

### Fase 3: Seguridad

- Login de administrador.
- Roles basicos.
- Proteccion de ruta `/admin`.

### Fase 4: Comunicacion Avanzada

- SEO por noticia.
- Paginas individuales de noticias.
- Integracion con formulario de contacto.
- Integracion con analiticas.

### Fase 5: Operacion De Campana

- Calendario de eventos.
- Descarga de material de prensa.
- Integracion con WhatsApp o newsletter.
- Panel de metricas.

## 12. Definicion De Hecho

El MVP se considera terminado cuando:

- La pagina publica renderiza sin errores.
- El panel admin permite editar y guardar la configuracion basica.
- Los cambios se reflejan en la home.
- `npm run lint` pasa sin errores.
- `npm run build` pasa sin errores.
- El repositorio contiene `Dockerfile`.
- Dokploy puede iniciar el build desde la raiz del repo.

## 13. Estado Actual

Implementado en el repositorio:

- Home publica.
- Panel administrador MVP.
- Persistencia en navegador.
- Dockerfile para Dokploy.
- `.dockerignore`.

Pendiente recomendado:

- Autenticacion del panel.
- Persistencia en base de datos.
- Upload real de archivos.
- Edicion/eliminacion de items en listas.
- Validacion formal de URLs y campos requeridos.
