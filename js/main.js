/**
 * main.js: lógica de la página.
 * Escucha los eventos personalizados que emite <tarjeta-producto>
 * (agregar-carrito y ver-detalle) y mantiene la bolsa de compras.
 */

const formatoPesos = new Intl.NumberFormat('es-CO', {
  style: 'currency',
  currency: 'COP',
  maximumFractionDigits: 0,
});

// Bolsa en memoria: sku -> { titulo, precio, cantidad }
const bolsa = new Map();

const $ = (selector) => document.querySelector(selector);

const dlgBolsa = $('#dlg-bolsa');
const dlgDetalle = $('#dlg-detalle');
const contador = $('#contador');
const aviso = $('#aviso');
let temporizadorAviso = null;
let productoEnDetalle = null;

/* ---------- Bolsa ---------- */

function agregarABolsa({ sku, titulo, precio }) {
  const item = bolsa.get(sku);
  if (item) {
    item.cantidad += 1;
  } else {
    bolsa.set(sku, { titulo, precio, cantidad: 1 });
  }
  actualizarBolsa();
  mostrarAviso(`${titulo} se agregó a la bolsa`);
}

function actualizarBolsa() {
  const lista = $('#bolsa-lista');
  lista.replaceChildren();

  let unidades = 0;
  let total = 0;

  for (const [, item] of bolsa) {
    unidades += item.cantidad;
    total += item.precio * item.cantidad;

    const li = document.createElement('li');
    li.className = 'bolsa__item';

    const nombre = document.createElement('span');
    nombre.className = 'bolsa__nombre';
    nombre.textContent = item.titulo;

    const cantidad = document.createElement('span');
    cantidad.className = 'bolsa__cantidad';
    cantidad.textContent = `Cantidad: ${item.cantidad}`;

    const importe = document.createElement('span');
    importe.className = 'bolsa__importe';
    importe.textContent = formatoPesos.format(item.precio * item.cantidad);

    li.append(nombre, cantidad, importe);
    lista.append(li);
  }

  contador.textContent = unidades;
  contador.hidden = unidades === 0;
  $('#bolsa-vacia').hidden = unidades > 0;
  $('#bolsa-pie').hidden = unidades === 0;
  $('#bolsa-total').textContent = formatoPesos.format(total);
}

/* ---------- Aviso ---------- */

function mostrarAviso(texto) {
  aviso.textContent = texto;
  aviso.classList.add('visible');
  clearTimeout(temporizadorAviso);
  temporizadorAviso = setTimeout(() => aviso.classList.remove('visible'), 2200);
}

/* ---------- Eventos del componente ---------- */

document.addEventListener('agregar-carrito', (e) => {
  agregarABolsa(e.detail);
});

document.addEventListener('ver-detalle', (e) => {
  const { sku, titulo, descripcion, imagen, precio } = e.detail;
  productoEnDetalle = { sku, titulo, precio };

  $('#detalle-imagen').src = imagen;
  $('#detalle-imagen').alt = `Paleta de sombras ${titulo}`;
  $('#detalle-titulo').textContent = titulo;
  $('#detalle-descripcion').textContent = descripcion;
  $('#detalle-precio').textContent = formatoPesos.format(precio);
  dlgDetalle.showModal();
});

/* ---------- Controles de la interfaz ---------- */

$('#btn-bolsa').addEventListener('click', () => dlgBolsa.showModal());

$('#btn-vaciar').addEventListener('click', () => {
  bolsa.clear();
  actualizarBolsa();
});

$('#detalle-agregar').addEventListener('click', () => {
  if (productoEnDetalle) agregarABolsa(productoEnDetalle);
  dlgDetalle.close();
});

// Botones "cerrar" y clic sobre el fondo oscuro cierran los diálogos.
for (const dlg of [dlgBolsa, dlgDetalle]) {
  dlg.querySelector('[data-cerrar]').addEventListener('click', () => dlg.close());
  dlg.addEventListener('click', (e) => {
    if (e.target === dlg) dlg.close();
  });
}

actualizarBolsa();
