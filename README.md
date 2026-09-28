# Lúmina: paletas de sombras

Proyecto del **primer parcial** de *Desarrollo de Aplicaciones Web y Sistemas Operativos* (193308), Universidad Francisco de Paula Santander Ocaña.

**Estudiante:** Nashely Turizo Villareal (código 0192761)
**Docente:** José Barbosa

## Descripción

Página de una tienda ficticia de maquillaje, con diseño minimalista inspirado en Apple. Su objetivo es demostrar la **componentización**: una tarjeta de producto (`<tarjeta-producto>`) construida como **Web Component nativo** (HTML + CSS + JavaScript vanilla, sin frameworks) y reutilizada seis veces con datos distintos.

## Estructura del proyecto

```
.
├── index.html
├── README.md
├── css/
│   └── styles.css
├── js/
│   ├── tarjeta-producto.js   Web Component
│   └── main.js               Bolsa de compras y diálogos
└── assets/
    └── img/                  Imágenes SVG de las paletas
```



## El componente `<tarjeta-producto>`

### Props (atributos)

| Atributo      | Descripción                               | Ejemplo                       |
|---------------|-------------------------------------------|-------------------------------|
| `sku`         | Identificador del producto                | `LUM-001`                     |
| `imagen`      | Ruta de la imagen                         | `assets/img/amanecer.svg`     |
| `titulo`      | Nombre del producto                       | `Amanecer`                    |
| `descripcion` | Texto descriptivo corto                   | `Doce tonos cálidos...`       |
| `precio`      | Valor en pesos colombianos, sin puntos    | `89000`                       |

### Eventos

| Evento            | Se emite cuando...                    | `detail`                                          |
|-------------------|---------------------------------------|---------------------------------------------------|
| `agregar-carrito` | se pulsa *Agregar a la bolsa*         | `{ sku, titulo, precio }`                         |
| `ver-detalle`     | se pulsa *Ver detalles*               | `{ sku, titulo, descripcion, imagen, precio }`    |

### Uso

```html
<script src="js/tarjeta-producto.js" defer></script>

<tarjeta-producto
  sku="LUM-001"
  imagen="assets/img/amanecer.svg"
  titulo="Amanecer"
  descripcion="Doce tonos cálidos entre durazno y terracota."
  precio="89000">
</tarjeta-producto>

<script>
  document.addEventListener('agregar-carrito', (e) => console.log(e.detail));
</script>
```
## Tecnologías

HTML5, CSS3 (variables, grid, `backdrop-filter`), JavaScript ES6+ (Custom Elements, Shadow DOM, `<dialog>`).
