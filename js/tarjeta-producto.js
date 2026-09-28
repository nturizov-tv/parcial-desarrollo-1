/**
 * <tarjeta-producto>: Web Component nativo (Custom Element + Shadow DOM)
 *
 * Props (atributos HTML):
 *   sku          Identificador del producto.
 *   imagen       Ruta de la imagen del producto.
 *   titulo       Nombre del producto.
 *   descripcion  Texto corto descriptivo.
 *   precio       Valor numérico en pesos colombianos (COP), sin puntos.
 *
 * Eventos personalizados (burbujean y cruzan el Shadow DOM):
 *   agregar-carrito   detail: { sku, titulo, precio }
 *   ver-detalle       detail: { sku, titulo, descripcion, imagen, precio }
 *
 * Personalización con variables CSS (heredan a través del Shadow DOM):
 *   --tp-fondo, --tp-texto, --tp-texto-suave, --tp-acento, --tp-radio
 */

const formatoCOP = new Intl.NumberFormat('es-CO', {
  style: 'currency',
  currency: 'COP',
  maximumFractionDigits: 0,
});

const plantilla = document.createElement('template');
plantilla.innerHTML = `
  <style>
    :host {
      display: flex;
      font-family: -apple-system, BlinkMacSystemFont, "SF Pro Text", "Helvetica Neue", Helvetica, Arial, sans-serif;
    }

    .tarjeta {
      flex: 1;
      display: flex;
      flex-direction: column;
      overflow: hidden;
      background: var(--tp-fondo, #ffffff);
      color: var(--tp-texto, #1d1d1f);
      border-radius: var(--tp-radio, 28px);
    }

    .imagen {
      aspect-ratio: 1 / 1;
      background: #f5f5f7;
    }

    .imagen img {
      display: block;
      width: 100%;
      height: 100%;
      object-fit: cover;
    }

    .contenido {
      flex: 1;
      display: flex;
      flex-direction: column;
      gap: 6px;
      padding: 24px 24px 28px;
    }

    .titulo {
      margin: 0;
      font-size: 1.3125rem;
      font-weight: 600;
      letter-spacing: -0.01em;
      line-height: 1.2;
    }

    .descripcion {
      margin: 0;
      font-size: 0.9375rem;
      line-height: 1.47;
      color: var(--tp-texto-suave, #6e6e73);
    }

    .precio {
      margin: 14px 0 0;
      font-size: 1.0625rem;
      font-weight: 600;
    }

    .acciones {
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      gap: 6px 18px;
      margin-top: auto;
      padding-top: 18px;
    }

    button {
      font: inherit;
      cursor: pointer;
      border: 0;
    }

    .agregar {
      padding: 10px 20px;
      border-radius: 980px;
      background: var(--tp-acento, #0071e3);
      color: #fff;
      font-size: 0.9375rem;
      transition: background-color 0.2s ease, transform 0.15s ease;
    }
    .agregar:hover { background: #0077ed; }
    .agregar:active { transform: scale(0.97); }
    .agregar.ok { background: #1d1d1f; }

    .detalle {
      padding: 6px 0;
      background: none;
      color: var(--tp-acento, #0071e3);
      font-size: 0.9375rem;
    }
    .detalle:hover { text-decoration: underline; }

    button:focus-visible {
      outline: 2px solid var(--tp-acento, #0071e3);
      outline-offset: 3px;
    }

    @media (max-width: 480px) {
      .contenido { padding: 20px 20px 24px; }
      .titulo { font-size: 1.1875rem; }
    }

    @media (prefers-reduced-motion: reduce) {
      .agregar { transition: none; }
    }
  </style>

  <article class="tarjeta">
    <div class="imagen"><img alt="" loading="lazy" /></div>
    <div class="contenido">
      <h3 class="titulo"></h3>
      <p class="descripcion"></p>
      <p class="precio"></p>
      <div class="acciones">
        <button type="button" class="agregar">Agregar a la bolsa</button>
        <button type="button" class="detalle">Ver detalles</button>
      </div>
    </div>
  </article>
`;

class TarjetaProducto extends HTMLElement {
  static get observedAttributes() {
    return ['imagen', 'titulo', 'descripcion', 'precio'];
  }

  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.shadowRoot.appendChild(plantilla.content.cloneNode(true));

    this._img = this.shadowRoot.querySelector('img');
    this._titulo = this.shadowRoot.querySelector('.titulo');
    this._descripcion = this.shadowRoot.querySelector('.descripcion');
    this._precio = this.shadowRoot.querySelector('.precio');
    this._btnAgregar = this.shadowRoot.querySelector('.agregar');
    this._btnDetalle = this.shadowRoot.querySelector('.detalle');
    this._temporizador = null;

    this._btnAgregar.addEventListener('click', () => this._agregar());
    this._btnDetalle.addEventListener('click', () => this._verDetalle());
  }

  connectedCallback() {
    this._pintar();
  }

  attributeChangedCallback() {
    this._pintar();
  }

  // Lee los atributos y actualiza la vista (textContent evita inyección de HTML).
  _pintar() {
    const titulo = this.getAttribute('titulo') || 'Producto';
    this._img.src = this.getAttribute('imagen') || '';
    this._img.alt = `Paleta de sombras ${titulo}`;
    this._titulo.textContent = titulo;
    this._descripcion.textContent = this.getAttribute('descripcion') || '';
    this._precio.textContent = formatoCOP.format(this._valorPrecio());
  }

  _valorPrecio() {
    const n = Number(this.getAttribute('precio'));
    return Number.isFinite(n) ? n : 0;
  }

  _agregar() {
    this.dispatchEvent(new CustomEvent('agregar-carrito', {
      bubbles: true,
      composed: true,
      detail: {
        sku: this.getAttribute('sku'),
        titulo: this.getAttribute('titulo'),
        precio: this._valorPrecio(),
      },
    }));

    // Confirmación visual breve en el propio botón.
    this._btnAgregar.textContent = 'Agregado';
    this._btnAgregar.classList.add('ok');
    clearTimeout(this._temporizador);
    this._temporizador = setTimeout(() => {
      this._btnAgregar.textContent = 'Agregar a la bolsa';
      this._btnAgregar.classList.remove('ok');
    }, 1400);
  }

  _verDetalle() {
    this.dispatchEvent(new CustomEvent('ver-detalle', {
      bubbles: true,
      composed: true,
      detail: {
        sku: this.getAttribute('sku'),
        titulo: this.getAttribute('titulo'),
        descripcion: this.getAttribute('descripcion'),
        imagen: this.getAttribute('imagen'),
        precio: this._valorPrecio(),
      },
    }));
  }
}

customElements.define('tarjeta-producto', TarjetaProducto);
