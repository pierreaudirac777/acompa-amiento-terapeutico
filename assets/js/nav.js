// nav.js

document.addEventListener('DOMContentLoaded', () => {
  // =============================
  // 1. Botones "Leer más"
  // =============================
  document.querySelectorAll('.more-toggle').forEach(btn => {
    btn.addEventListener('click', () => {
      const sel = btn.getAttribute('data-target');
      const box = document.querySelector(sel);
      if (box) box.classList.toggle('is-open');
    });
  });

  // =============================
  // 2. Año en el footer
  // =============================
  const anio = document.getElementById('anio');
  if (anio) {
    anio.textContent = new Date().getFullYear();
  }

  // =============================
  // 3. Delegación de clics en el grid del blog
  // =============================
  const blogGrid = document.querySelector('main .blog-grid');
  if (blogGrid) {
    blogGrid.addEventListener('click', (e) => {
      const a = e.target.closest('a');
      if (!a || !blogGrid.contains(a)) return;
      // Aquí podrías añadir lógica extra si quisieras
    });
  }

  // =============================
  // 4. Validación de formulario de contacto
  // =============================
  const form = document.getElementById('contact-form');
  if (form) {
    const phoneInput    = document.getElementById('telefono');          // <input id="telefono">
    const phoneError    = document.getElementById('error-telefono');    // <p id="error-telefono">
    const countrySelect = document.getElementById('pais');              // <select id="pais">

    // Prefijos internacionales por país (coinciden con los value del <select id="pais">)
    const countryPrefixes = {
      mx: '+52',
      ar: '+54',
      co: '+57',
      gt: '+502',
      ve: '+58',
      pr: '+1',

      es: '+34',
      fr: '+33',
      de: '+49',
      it: '+39',
      uk: '+44',
      nl: '+31',
      pt: '+351',
      gr: '+30',
      se: '+46',
      no: '+47',
      fi: '+358',
      dk: '+45',
      be: '+32',
      at: '+43',

      al: '+355',
      by: '+375',
      ba: '+387',
      bg: '+359',
      cz: '+420',
      cy: '+357',
      hr: '+385',
      sk: '+421',
      si: '+386',
      ee: '+372',
      lv: '+371',
      lt: '+370',
      lu: '+352',
      md: '+373',
      mk: '+389',
      pl: '+48',
      ro: '+40',
      rs: '+381',
      me: '+382',
      ua: '+380',
      ru: '+7',

      ad: '+376',
      li: '+423',
      mt: '+356',
      mc: '+377',
      sm: '+378',

      uz: '+998'
    };

    // Regla internacional E.164:
    // + seguido de 9 a 15 dígitos en total
    const intlRegex = /^\+[1-9]\d{8,14}$/;

    function validarTelefono() {
      if (!phoneInput) return true;

      const raw       = phoneInput.value.trim();
      const sanitized = raw.replace(/\s+/g, '');

      // Campo vacío -> inválido (es required)
      if (!sanitized) {
        if (phoneError) {
          phoneError.textContent = 'Introduce tu número de teléfono en formato internacional.';
          phoneError.style.display = 'block';
        }
        phoneInput.setCustomValidity('Número requerido');
        return false;
      }

      const valido = intlRegex.test(sanitized);

      if (!valido) {
        if (phoneError) {
          phoneError.textContent =
            'Introduce un número internacional válido en formato +[código][número]. ' +
            'Por ejemplo: +34 XXXXXXX o +52 XXXXXXX.';
          phoneError.style.display = 'block';
        }
        phoneInput.setCustomValidity('Número internacional inválido');
        return false;
      }

      // Si todo OK, limpiamos errores
      if (phoneError) {
        phoneError.textContent = '';
        phoneError.style.display = 'none';
      }
      phoneInput.setCustomValidity('');
      return true;
    }

    // Autocompletar prefijo al cambiar de país
    if (countrySelect && phoneInput) {
      countrySelect.addEventListener('change', () => {
        const code   = countrySelect.value;
        const prefix = countryPrefixes[code];
        if (!prefix) return;

        const current = phoneInput.value.trim();

        // Si el campo está vacío o no empieza con '+', ponemos el prefijo
        if (!current || !current.startsWith('+')) {
          phoneInput.value = prefix;
        } else {
          // Si solo había un prefijo anterior (ej: +34), lo reemplazamos
          if (/^\+\d+$/.test(current)) {
            phoneInput.value = prefix;
          }
        }

        phoneInput.focus();
        phoneInput.setSelectionRange(phoneInput.value.length, phoneInput.value.length);
        validarTelefono(); // actualiza errores si los hubiera
      });
    }

    // Validar mientras escribe
    if (phoneInput) {
      phoneInput.addEventListener('input', validarTelefono);
    }

    // Validar al enviar
    form.addEventListener('submit', (e) => {
      const telOk = validarTelefono();
      if (!telOk) {
        e.preventDefault();
        // fuerza a que el navegador muestre el mensaje nativo
        phoneInput && phoneInput.reportValidity();
      }
    });
  } // <-- cierre del if (form)
});   // <-- cierre de document.addEventListener
