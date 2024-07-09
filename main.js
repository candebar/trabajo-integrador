
document.addEventListener('DOMContentLoaded', () => {
    const apiKey = "eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI5NzE1OThiMGI1NDY0OGVmNjMyZDc4NjBhNmUxZDk3MiIsIm5iZiI6MTcyMDU1OTE3OS43MDY1ODIsInN1YiI6IjY2OGRhMmVkZGZhMjJkMWQ1MDQ3NTgzYiIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.fMCbYVtq1fEdLEnJtJRguDcAtzy63X_T-6Xka8Klx24"
    const searchEndpoint = 'https://api.themoviedb.org/3/search/movie';
    const form = document.getElementById('dataForm');
    const dataList = document.getElementById('dataList');
    let datos = JSON.parse(localStorage.getItem('datos')) || [];

    function agregarDato(nombre, edad) {
        const dato = { nombre, edad };
        datos.push(dato);
        guardarDatos();
        mostrarDatos();
    }

    function eliminarDato(index) {
        datos.splice(index, 1);
        guardarDatos();
        mostrarDatos();
    }

    function editarDato(index, nombre, edad) {
        datos[index].nombre = nombre;
        datos[index].edad = edad;
        guardarDatos();
        mostrarDatos();
    }

    function guardarDatos() {
        localStorage.setItem('datos', JSON.stringify(datos));
    }

    function mostrarDatos() {
        dataList.innerHTML = '';
        datos.forEach((dato, index) => {
            const li = document.createElement('li');
            li.textContent = `${dato.nombre} - ${dato.edad}`;

            const botonEditar = document.createElement('button');
            botonEditar.textContent = 'Editar';
            botonEditar.addEventListener('click', (e) => {
                e.stopPropagation(); // Evita que se dispare el evento del li
                // Al hacer clic en editar, llenamos el formulario con los datos actuales
                form.name.value = dato.nombre;
                form.age.value = dato.edad;

                // Cambiamos el evento del formulario para editar el dato
                form.removeEventListener('submit', handleSubmitAgregar);
                form.addEventListener('submit', (e) => {
                    e.preventDefault();
                    const newNombre = form.name.value.trim();
                    const newEdad = form.age.value.trim();
                    if (newNombre && newEdad) {
                        editarDato(index, newNombre, newEdad);
                        form.reset();
                        // Restauramos el evento para agregar datos después de editar
                        form.removeEventListener('submit', handleSubmitEditar);
                        form.addEventListener('submit', handleSubmitAgregar);
                    } else {
                        alert('Por favor, complete todos los campos.');
                    }
                });
            });

            const botonEliminar = document.createElement('button');
            botonEliminar.textContent = 'Eliminar';
            botonEliminar.addEventListener('click', (e) => {
                e.stopPropagation(); // Evita que se dispare el evento del li
                eliminarDato(index);
            });

            li.appendChild(botonEditar);
            li.appendChild(botonEliminar);
            dataList.appendChild(li);

            // Añadir evento de click para mostrar alerta
            li.addEventListener('click', () => {
                mostrarAlerta(dato);
            });
        });
    }

    function mostrarAlerta(dato) {
        alert(`Nombre: ${dato.nombre}\nEdad: ${dato.edad}`);
    }

    function handleSubmitAgregar(e) {
        e.preventDefault();
        const nombre = form.name.value.trim();
        const edad = form.age.value.trim();
        if (nombre && edad) {
            agregarDato(nombre, edad);
            form.reset();
        } else {
            alert('Por favor, complete todos los campos.');
        }
    }

   

    // Evento inicial del formulario para agregar datos
    form.addEventListener('submit', handleSubmitAgregar);

    // Mostrar los datos al cargar la página por primera vez
    mostrarDatos();
});

// Función para obtener datos adicionales de una API externa (ejemplo con JSONPlaceholder)
async function obtenerDatosExternos() {
    try {
        const response = await fetch('https://www.themoviedb.org/movie');
        if (!response.ok) {
            throw new Error('Error al obtener los datos');
        }
        const datosExternos = await response.json();
        return datosExternos;
    } catch (error) {
        console.error('Error:', error.message);
        return [];
    }
}
// Modificar actualizarListaDatos para integrar los datos externos
async function actualizarListaDatos() {
    listaDatos.innerHTML = ''; // Limpiar la lista antes de actualizar

    // Obtener datos externos
    const datosExternos = await obtenerDatosExternos();

    // Mostrar datos locales
    datos.forEach((dato, index) => {
        const itemLista = document.createElement('li');
        itemLista.textContent =`${dato.nombre} ${dato.edad} años` ;

        // Botón para eliminar el dato
        const botonEliminar = document.createElement('button');
        botonEliminar.textContent = 'Eliminar';
        botonEliminar.classList.add('eliminar');
        botonEliminar.addEventListener('click', () => {
            datos.splice(index, 1); // Eliminar el dato del array
            actualizarListaDatos(); // Actualizar la lista en el DOM
            guardarDatosLocalmente(); // Actualizar almacenamiento local
        });

        itemLista.appendChild(botonEliminar);
        listaDatos.appendChild(itemLista);
    });

    // Mostrar datos externos
    datosExternos.forEach(dato => {
        const itemLista = document.createElement('li');
        itemLista.textContent =` ${dato.name} ${dato.email}`;

        listaDatos.appendChild(itemLista);
    });
}