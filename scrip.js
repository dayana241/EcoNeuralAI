document.addEventListener('DOMContentLoaded', function() {
    const buscadorForm = document.querySelector('.buscador');
    const buscadorInput = buscadorForm.querySelector('input[type="text"]');
    const resultadoBusqueda = document.createElement('div');
    resultadoBusqueda.id = 'resultado-busqueda';
    buscadorForm.appendChild(resultadoBusqueda);
  
    function normalizarTexto(texto) {
      return texto.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
    }
  
    buscadorForm.addEventListener('submit', function(event) {
      event.preventDefault();
      buscarYResaltar();
    });
  
    buscadorInput.addEventListener('input', function() {
      if (buscadorInput.value === '') {
        limpiarResultados();
      }
    });
  
    document.addEventListener('click', function(event) {
      if (!buscadorForm.contains(event.target)) {
        limpiarResultados();
        buscadorInput.value = ''; // Limpiar el campo de entrada
      }
    });
  
    function buscarYResaltar() {
      const terminoBusqueda = normalizarTexto(buscadorInput.value.toLowerCase());
  
      limpiarResultados();
  
      const elementos = document.querySelectorAll('body *');
      let primerResultado = null;
      let contadorResultados = 0;
  
      elementos.forEach(function(elemento) {
        if (elemento.childNodes.length > 0) {
          elemento.childNodes.forEach(function(node) {
            if (node.nodeType === 3) {
              let contenido = normalizarTexto(node.textContent.toLowerCase());
              let contenidoOriginal = node.textContent;
  
              if (contenido.includes(terminoBusqueda)) {
                let indice = contenido.indexOf(terminoBusqueda);
                let textoResaltado = contenidoOriginal.substring(indice, indice + terminoBusqueda.length);
  
                let nuevoContenido = contenidoOriginal.replace(
                  textoResaltado,
                  '<mark>' + textoResaltado + '</mark>'
                );
  
                let temp = document.createElement('span');
                temp.innerHTML = nuevoContenido;
                node.replaceWith(temp);
  
                if (!primerResultado) {
                  primerResultado = temp.querySelector('mark');
                }
                contadorResultados++;
              }
            }
          });
        }
      });
  
      if (primerResultado) {
        const rect = primerResultado.getBoundingClientRect();
        const elementoAltura = rect.height;
        const ventanaAltura = window.innerHeight;
        const desplazamiento = rect.top + window.pageYOffset - (ventanaAltura / 2) + (elementoAltura / 2);
  
        window.scrollTo({
          top: desplazamiento,
          behavior: 'smooth'
        });
      }
  
      resultadoBusqueda.textContent = `Se encontraron ${contadorResultados} resultados.`;
    }
  
    function limpiarResultados() {
      const marcasAnteriores = document.querySelectorAll('mark');
      marcasAnteriores.forEach(function(marca) {
        marca.outerHTML = marca.innerHTML;
      });
      resultadoBusqueda.textContent = '';
    }
  });