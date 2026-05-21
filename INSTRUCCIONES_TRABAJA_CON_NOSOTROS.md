# Guía: Gestión de Ofertas Laborales - "Trabaja con Nosotros"

## 📋 Resumen de cambios

Se ha refactorizado completamente el sistema de "Trabaja con Nosotros" para ser completamente dinámico y administrable desde el panel de admin. Ahora puedes:

✅ Crear ofertas de trabajo con título y descripción  
✅ Adjuntar archivos/folletos a cada oferta (PDF, DOC, JPG, etc.)  
✅ Reordenar las ofertas dinámicamente  
✅ Activar/desactivar ofertas  
✅ Vista previa de cada oferta  

## 🗄️ Base de Datos

Se ha creado una nueva tabla en Supabase:

```sql
job_postings
├── id (identificador único)
├── title (título de la oferta - requerido)
├── description (descripción detallada - opcional)
├── file_url (URL del archivo adjunto)
├── file_name (nombre del archivo original)
├── order_index (orden de visualización)
├── is_active (si está visible en el modal)
├── created_at (fecha de creación)
└── updated_at (fecha de actualización)
```

## 📱 Cómo usar en Admin

### 1. Acceder al Panel de Administración
- Inicia sesión en el panel admin
- En el dashboard, busca **"Gestión de Ofertas Laborales"**

### 2. Crear una Nueva Oferta
1. Haz clic en el botón **"+ Nueva Oferta"**
2. Completa los campos:
   - **Título de la Oferta** *(requerido)*: Ej: "Se busca Profesor de Educación General Básica con mención en Matemáticas"
   - **Descripción** *(opcional)*: Detalles adicionales de la oferta
   - **Archivo o Folleto**: Sube un PDF, documento o imagen con los detalles
   - **Activa**: Marca la casilla para que sea visible en el modal público

3. Haz clic en **"Guardar"**

### 3. Editar una Oferta Existente
1. En la tabla de ofertas, haz clic en el icono ✏️ (editar)
2. Modifica los campos que necesites
3. Para cambiar el archivo, haz clic en "Reemplazar"
4. Guarda los cambios

### 4. Reordenar Ofertas
- En la columna "Acciones", usa las flechas ↑ ↓ para subir o bajar ofertas
- El orden aparecerá así en el modal público

### 5. Ver Previa
- Haz clic en el icono 👁️ (ver) para ver cómo se mostrará la oferta

### 6. Eliminar una Oferta
- Haz clic en el icono 🗑️ (basura) y confirma

## 👥 Experiencia del Usuario

### En la web pública:
1. El usuario clickea el botón **"Trabaja con Nosotros"** en el footer
2. Se abre un modal que muestra todas las ofertas activas
3. Cada oferta aparece como un botón/tarjeta clickeable
4. Al clickear una oferta:
   - Se abre un modal de detalle
   - Muestra título, descripción y archivo
   - Hay un botón para descargar el folleto
   - Muestra el email para enviar CV

## 📝 Ejemplos de Uso

### Ejemplo 1: Oferta con Folleto
- **Título**: Se busca Profesor de Matemáticas
- **Descripción**: Educación General Básica, experiencia en didáctica digital
- **Archivo**: folleto-matematicas-2026.pdf
- **Activa**: ✓

### Ejemplo 2: Oferta con Imagen
- **Título**: Auxiliar de Biblioteca
- **Descripción**: Apoyo en catalogación y atención a estudiantes
- **Archivo**: auxiliar-biblioteca.jpg
- **Activa**: ✓

## 🔗 Estructuras de Archivos

### Almacenamiento
- Los archivos se guardan en Supabase Storage en el bucket: `institutional-documents`
- Las URLs son públicas para que cualquiera pueda acceder

### Tipos de archivo soportados
- PDF: .pdf
- Documentos: .doc, .docx
- Imágenes: .jpg, .jpeg, .png, .gif
- Hojas de cálculo: .xls, .xlsx

## ⚠️ Notas Importantes

1. **El campo "Título" es requerido** - sin título no puedes guardar
2. **Los archivos deben ser menores a 10MB** (límite de Supabase)
3. **Si desactivas una oferta**, dejará de aparecer en el modal pero se conservará en la base de datos
4. **Si eliminas una oferta**, se borrará permanentemente junto con su archivo
5. **El email de contacto** es configurable en el código (actualmente: postulaciones@csfr.cl)

## 🔧 Cambios Técnicos Realizados

### Nuevos Archivos
- `supabase/migrations/create_job_postings.sql` - Tabla de base de datos
- `src/components/TrabajaConNosotrosManagement.tsx` - Panel de administración

### Archivos Modificados
- `src/components/TrabajaConNosotrosModal.tsx` - Refactorizado con carga dinámica
- `src/components/AdminDashboard.tsx` - Agregada opción en menú
- `src/App.tsx` - Agregada ruta de navegación
- `src/lib/supabase.ts` - Agregada interfaz `JobPosting`

## 📞 Contacto para Consultas

Para agregar, editar o eliminar ofertas:
- Accede al panel admin → Gestión de Ofertas Laborales
- El sistema es completamente autodidáctico e intuitivo
