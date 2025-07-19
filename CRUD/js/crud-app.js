import datos from "../data/data.json" with { type: "json" };
// console.log(datos);
import { GiftCard } from "./clases.js";

const dataTable = document.querySelector("#data-table");
const myModal = document.getElementById("modal-gift");

let idGiftUpdate = null; // Variable para almacenar el ID de la gift card a actualizar
let tiempo = null; // Variable para almacenar el tiempo de la gift card

myModal.show = function() {
    this.classList.add("backdrop-opacity-[1]", "visible"); // Se ve con transición
    document.body.classList.add("overflow-hidden");
};

myModal.hide = function() {
    // limpiar idGiftUpdate
    idGiftUpdate = null;
    this.classList.remove("show"); // Se oculta con transición
    document.body.classList.remove("modal-open");
};

window.ocultarModal = () => {
    myModal.hide();
}

window.mostrarModal = (id) => {
    idGiftUpdate = id;
    let index = datos.findIndex((item) => item.id === idGiftUpdate);
    
    document.querySelector("#edit-gift").value = datos[index].gift;
    document.querySelector("#edit-tipo").value = datos[index].tipo;
    document.querySelector("#edit-tiempo").value = datos[index].tiempo;
    document.querySelector("#edit-precio").value = datos[index].precio;
    document.querySelector("#edit-imagen").value = datos[index].imagen;

    checkTipo();
    myModal.show();
}

function aplicarBordesRedondeados() {
    const tbody = document.querySelector(".crud-table tbody");
    const filas = tbody.querySelectorAll("tr");

    // Limpiar clases anteriores
    filas.forEach((fila) => {
        const celdas = fila.querySelectorAll("td");
        if (celdas.length > 0) {
        celdas[0].classList.remove("rounded-bl-lg");
        celdas[celdas.length - 1].classList.remove("rounded-br-lg");
        }
    });

    // Aplicar a la última fila (si existe)
    const ultimaFila = filas[filas.length - 1];
    if (ultimaFila) {
        const celdas = ultimaFila.querySelectorAll("td");
        if (celdas.length > 0) {
        celdas[0].classList.add("rounded-bl-lg");
        celdas[celdas.length - 1].classList.add("rounded-br-lg");
        //dale una checadita luego a esto, se puede mejorar
        celdas.forEach((celda) => {
            celda.classList.remove("border-b", "border-b-white");
        });
        }
    }

    //   verificar si existen elementos en la tabla
    const tabla = document.querySelector(".crud-table");
    if (tbody.children.length === 0) {
        tabla.classList.add("hidden");
    } else {
        tabla.classList.remove("hidden");
    }
}


const checkTipo = (modal) => {
    // Habilita el campo antes de actualizarlo
    if (modal) {
        // Si el tipo es "Compra", deshabilita el campo de tiempo y lo limpia
        document.querySelector("#edit-tiempo").disabled = false;

        if (document.querySelector("#edit-tipo").value === "Compra") {
            tiempo = document.querySelector("#edit-tiempo").value;
            document.querySelector("#edit-tiempo").disabled = true;
            document.querySelector("#edit-tiempo").value = "";
        } else {
            if (tiempo !== null) {
                document.querySelector("#edit-tiempo").value = tiempo;
                tiempo = null;
            }
        }
    } else if (!modal) {
        document.querySelector("#tiempo").disabled = false;
        document.querySelector("#tiempo").classList.remove("bg-gray-600", "text-gray-800");
        document.querySelector("#tiempo").classList.add("bg-white", "text-black", "border", "border-solid", "border-white");

        if (document.querySelector("#tipo").value === "Compra") {
            tiempo = document.querySelector("#tiempo").value;
            document.querySelector("#tiempo").disabled = true;
            document.querySelector("#tiempo").value = "";
            // ponerlo de color gris con tailwind playcdn
            document.querySelector("#tiempo").classList.remove("bg-white", "text-black", "border", "border-solid", "border-white");
            document.querySelector("#tiempo").classList.add("bg-gray-600", "text-gray-800");
        } else {
            if (tiempo !== null) {
                document.querySelector("#tiempo").value = tiempo;
                tiempo = null; //limpieza je
            }
        }
    }
}

const giftUpdate = (event) => {
    event.preventDefault();
    
    let index = datos.findIndex((item) => item.id === idGiftUpdate);

    datos[index].gift = document.querySelector("#edit-gift").value;
    datos[index].tipo = document.querySelector("#edit-tipo").value;
    datos[index].tiempo = document.querySelector("#edit-tiempo").value;
    datos[index].precio = parseFloat(document.querySelector("#edit-precio").value);
    datos[index].imagen = document.querySelector("#edit-imagen").value;

    cargarTabla();
    
    myModal.hide();

}

const cargarTabla = () => {
    dataTable.innerHTML = ""; // Clear tabla antes de mapear

    datos.map((item) => {
        const fila = document.createElement("tr");
        if (item.tiempo === null || item.tiempo === undefined) {
            item.tiempo = "";
        }
        // Solo añade el $ si no lo tiene ya y si es un número
        let precioFormateado;
        if (typeof item.precio === "number") {
            precioFormateado = `$${item.precio}`;
        } else {
            precioFormateado = item.precio;
        }
        const celdas = `<td class="bg-[#0e0e0e] text-white bl-white border-b border-b-white p-[10px] text-left whitespace-nowrap overflow-hidden max-w-[150px] w-[100px] text-ellipsis">${item.gift}</td>
            <td class="bg-[#0e0e0e] text-white bl-white border-l border-l-white border-b border-b-white p-[10px] text-left whitespace-nowrap overflow-hidden ">${item.tipo}</td>
            <td class="bg-[#0e0e0e] text-white bl-white border-l border-l-white border-b border-b-white p-[10px] text-left whitespace-nowrap overflow-hidden ">${item.tiempo}</td>
            <td class="bg-[#0e0e0e] text-white bl-white border-l border-l-white border-b border-b-white p-[10px] text-left whitespace-nowrap overflow-hidden max-w-[100px] w-[100px] text-ellipsis">${precioFormateado}</td>
            <td class="bg-[#0e0e0e] text-white bl-white border-l border-l-white border-b border-b-white p-[10px] text-left whitespace-nowrap overflow-hidden "><img src="media/edit.png" alt="edit-button" onclick="mostrarModal(${item.id})" class="invert max-w-[30px] max-h-[30px] block mx-auto cursor-pointer"></td>
            <td class="bg-[#0e0e0e] text-white bl-white border-l border-l-white border-b border-b-white p-[10px] text-left whitespace-nowrap overflow-hidden "><img src="media/delete.png" alt="delete-button" onclick="eliminarGiftCard(${item.id})" class="invert max-w-[30px] max-h-[30px] block mx-auto cursor-pointer"></td>  
        `;
        fila.innerHTML = celdas;
        dataTable.appendChild(fila);
    });

    aplicarBordesRedondeados(); // Aplicar bordes redondeados a la última fila
}

const agregarGiftCard = (event) => {
    event.preventDefault();

    let id = datos.length + 1;
    let gift = document.querySelector("#gift").value;
    let tipo = document.querySelector("#tipo").value;
    let tiempo = document.querySelector("#tiempo").value;
    let precio = parseFloat(document.querySelector("#precio").value);
    let imagen = document.querySelector("#imagen").value;
    
    document.querySelector("#tiempo").disabled = false;
    document.querySelector("#tiempo").classList.remove("bg-gray-600", "text-gray-800");
    document.querySelector("#tiempo").classList.add("bg-white", "text-black", "border", "border-solid", "border-white");

    datos.push(new GiftCard(id, gift, tipo, tiempo, precio, imagen));
    document.querySelector("#crud-form").reset();
    cargarTabla();
}

window.eliminarGiftCard = (id) => {
    const index = datos.findIndex((item) => item.id === id);

    let validar = confirm(`¿Estás seguro de eliminar la Gift Card ${id}?`);

    if (validar) {
        datos.splice(index, 1);
        cargarTabla();
    }
}

cargarTabla();

document.querySelector("#crud-form").addEventListener("submit", agregarGiftCard);
document.querySelector("#formModal").addEventListener("submit", giftUpdate)
document.querySelector("#edit-tipo").addEventListener("change", () => checkTipo(true));
document.querySelector("#tipo").addEventListener("change", () => checkTipo(false));