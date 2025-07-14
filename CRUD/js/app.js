import datos from "../data/data.json" with { type: "json" };
// console.log(datos);
import { GiftCard } from "./clases.js";

const dataTable = document.querySelector("#data-table");
const myModal = document.getElementById("modal-gift");

let idGiftUpdate = null;

// transicion pal modal
myModal.style.transition = "all 0.2s ease";
myModal.style.opacity = 0;
myModal.style.display = "none";

myModal.show = function() {
    this.style.display = "block";
    setTimeout(() => {
        this.style.opacity = 1;
    }, 10);
    document.body.classList.add("modal-open");
};

myModal.hide = function() {
    this.style.opacity = 0;
    this.addEventListener("transitionend", function handler() {
        myModal.style.display = "none";
        document.body.classList.remove("modal-open");
        myModal.removeEventListener("transitionend", handler);
    });
};

window.mostrarModal = (id) => {
    idGiftUpdate = id;
    let index = datos.findIndex((item) => item.id === idGiftUpdate);
    // console.log(id);
    document.querySelector("#edit-gift").value = datos[index].gift;
    document.querySelector("#edit-tipo").value = datos[index].tipo;
    document.querySelector("#edit-tiempo").value = datos[index].tiempo || "";
    document.querySelector("#edit-precio").value = datos[index].precio || 0;
    document.querySelector("#edit-imagen").value = datos[index].imagen || "";

    // Habilita el campo antes de actualizarlo
    document.querySelector("#edit-tiempo").disabled = false;

    if(document.querySelector("#edit-tipo").value === "Compra") {
        document.querySelector("#edit-tiempo").disabled = true;
    }

    // Detecta cambios instantáneos en el select para habilitar/deshabilitar
    document.querySelector("#edit-tipo").addEventListener("change", function() {
        document.querySelector("#edit-tiempo").disabled = false;
        if(this.value === "Compra") {
            document.querySelector("#edit-tiempo").disabled = true;
            document.querySelector("#edit-tiempo").value = "";
        }
    });

    myModal.show();
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

window.ocultarModal = () => {
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
        const celdas = `<td>${item.gift}</td>
            <td>${item.tipo}</td>
            <td>${item.tiempo}</td>
            <td>${precioFormateado}</td>
            <td><img src="../media/edit.png" alt="edit-button" onclick="mostrarModal(${item.id})"></td>
            <td><img src="../media/delete.png" alt="delete-button" onclick="eliminarGiftCard(${item.id})"></td>  
        `;
        fila.innerHTML = celdas;
        dataTable.appendChild(fila);
    });
}

const agregarGiftCard = (event) => {
    event.preventDefault();

    let id = datos.length + 1;
    let gift = document.querySelector("#gift").value;
    let tipo = document.querySelector("#tipo").value;
    let tiempo = document.querySelector("#tiempo").value;
    let precio = parseFloat(document.querySelector("#precio").value);
    let imagen = document.querySelector("#imagen").value;

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

window.editarGiftCard = (id) => {}


cargarTabla();

document.querySelector("#crud-form").addEventListener("submit", agregarGiftCard);
document.querySelector("#formModal").addEventListener("submit", giftUpdate)
