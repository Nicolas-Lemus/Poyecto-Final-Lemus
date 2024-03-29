const talles = [40, 41, 42, 43, 44];
const productosTalles = document.querySelectorAll('.card');
const carrito = document.querySelector('.listado');
const contadorCarrito = document.querySelector('#valorCarrito');
const precioTotal = document.querySelector('#precioTotal');
let cantidadProductos = 0;
let carritoProductos = [];

//VERIFICAR LOCALSLORAGE
if (localStorage.getItem('carritoProductos')){
    carritoProductos = JSON.parse(localStorage.getItem('carritoProductos'));
    cantidadProductos = carritoProductos.reduce((total, producto) => total + producto.cantidad, 0);
    actualizarCarrito();
    actualizarPrecioTotal();
}

//GUARDAR PRODUCTOS EN LOCALSTORAGE
function guardarProductosEnLocalStorage() {
    localStorage.setItem('carritoProductos',JSON.stringify(carritoProductos));
    localStorage.setItem('cantidadProductos', cantidadProductos);
}

//ACTUALIZAR CARRITO
function actualizarCarrito() {
    carrito.innerHTML = '';
    let cantidadTotalProductos = 0;
    carritoProductos.forEach((producto, index) => {
        cantidadTotalProductos += producto.cantidad;
        const li = document.createElement('li');
        li.classList.add('producto-carrito');
        li.innerHTML = `
            <span class="cantidad">${producto.cantidad}</span>
            <img src="${producto.img}"class="imgCarrito">
            <span class="nombre">${producto.nombre}</span>
            <span class="talle">Talle ${producto.talle}</span>
            <span class="precio" data-id="${producto.id}">${producto.precio}</span>
            <button class="eliminar-producto" data-index="${index}">X</button>
        `;
        carrito.appendChild(li);
    });
    contadorCarrito.textContent = cantidadTotalProductos;
}

//ACTUALIZAR PRECIO TOTAL
function actualizarPrecioTotal() {
    let precioTotalCarrito = 0;
    const preciosProductos = document.querySelectorAll('.precio');
    preciosProductos.forEach(precioProducto => {
        const precioProductoNumerico = parseFloat(precioProducto.textContent.replace('Precio: $', ''));
        if (!isNaN(precioProductoNumerico)) {
            precioTotalCarrito += precioProductoNumerico;
        }
    });
    precioTotal.textContent  = `$${precioTotalCarrito.toFixed(2)}`;
}

//ELIMINAR PRODUCTOS DEL CARRITO
carrito.addEventListener('click', (event) => {
    if (event.target.classList.contains('eliminar-producto')) {
        const index = event.target.dataset.index;
        const producto = carritoProductos[index];
        if (producto.cantidad > 1) {
            producto.precio -= producto.precio / producto.cantidad;
            producto.cantidad--;
        } else {
            carritoProductos.splice(index, 1);
        }
        cantidadProductos--;
        guardarProductosEnLocalStorage();
        actualizarCarrito();
        actualizarPrecioTotal();
        Swal.fire({
            icon: "error",
            title: "Elemento Borrado",
            showConfirmButton: false,
            timer: 1500,
        });
    }
});

//confirmar compra con promise
const botonComprar = document.querySelector("#confirmarCompra");
botonComprar.addEventListener("click", () => {
    new Promise((resolve, reject) => {
    if (parseFloat(precioTotal.textContent.slice(1)) === 0) {
        reject(new Error("Tu Carrito esta vacio!"));
    } else {
        resolve();
    }
    })
    .then(() => {
        Swal.fire({
        icon: "info",
        title: "procesando",
        showConfirmButton: false,
        timer: 2500,
        });
        return new Promise((resolve) => {
            setTimeout(() => {
                carritoProductos = [];
                cantidadProductos = 0;
                actualizarCarrito();
                actualizarPrecioTotal();
                localStorage.removeItem("carritoProductos");
                localStorage.removeItem("cantidadProductos");
            resolve();
            }, 2000);
        });
    })
    .then(() => {
        Swal.fire({
            icon: "success",
            title: "Gracias por su compra",
            showConfirmButton: false,
            timer: 2000,
        });
    })
    .catch((error) => {
        Swal.fire({
            icon: "error",
            title: "Verificar!",
            text: error.message,
            timer: 3000,
        });
    });
});
//CERRAR SECCION
const finalizarSeccion =document.querySelector("#cerrarSeccion");
finalizarSeccion.addEventListener("click", ()=>{
    Swal.fire({
        title:'¡Seccion Finalizada con Exito!'+ '¡Gracias!',
        showClass: {
            popup: 'animate__animated animate__fadeInDown'
        },
        hideClass: {
            popup: 'animate__animated animate__fadeOutUp'
        }
    })
    .then(() => {
        window.location.href = "../index.html";
    });
});