# Cómo un curso referencia una fuente de Biblioteca

## La convención (ya existía, aquí quedó documentada y reforzada)

1. En `mecanica-social-biblioteca/catalogo/fuentes/<id>.md`, el campo `modulos` de una
   ficha lista los slugs de carpeta de curso a los que pertenece esa fuente, ej.:
   ```yaml
   modulos: [01-democracia-ciudadania, 03-estado-instituciones]
   ```
2. `sincronizar_bibliografia.js` (en la raíz de este repo) lee
   `../mecanica-social-biblioteca/site/catalogo.json` (asume que ambos repos están
   clonados uno al lado del otro) y, por cada curso mencionado en algún `modulos`,
   genera automáticamente la sección superior de `cursos/<slug>/Bibliografia.md`.
3. **Nunca edites a mano la sección de arriba del archivo** (entre el título y el
   marcador `<!-- FIN-SINCRONIZADO -->`) — se sobrescribe cada vez que se corre el
   script. Cualquier contenido propio (análisis, bibliografía adicional no catalogada
   en Biblioteca, notas del docente) va **debajo** de ese marcador, y el script nunca
   lo toca.

## Cuándo correr el script

Por ahora es manual: después de aprobar una fuente nueva en Biblioteca (o cambiar sus
`modulos`), alguien con acceso a ambos repos clonados localmente corre:
```
node sincronizar_bibliografia.js
```
desde la raíz de `mecanica-social-escuela`, revisa los cambios con `git diff`, y los
sube. Automatizarlo con un GitHub Action (que se dispare cuando cambie
`mecanica-social-biblioteca/site/catalogo.json`) es una mejora natural para una fase
posterior, no urgente.

## Por qué el marcador existe

La primera versión del script sobrescribía el archivo completo sin distinguir entre lo
generado y lo escrito a mano. Eso significaba que si algún día una fuente etiquetaba un
curso que ya tenía bibliografía académica curada (como pasa hoy con el curso
`02-historia-politica-chile`), esa curación se habría borrado sin aviso al correr el
script. El marcador existe específicamente para que eso no pueda volver a pasar.
