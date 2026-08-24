/* ==========================================================================
   Relaxonus Product Page — interactions
   Implemented from the Claude Design source: "Relaxonus Product Page.dc.html"

   The page is fully readable without JavaScript; everything below is
   progressive enhancement layered on top of the static markup.
   ========================================================================== */

(function () {
  'use strict';

  /* ------------------------------- Product data ---------------------------- */

  var SET_TINT = 'linear-gradient(90deg,#DCE9F7 50%,#F7DEE7 50%)';

  var VARIANTS = {
    blue: { name: 'Blue',            tint: '#DCE9F7', qty: 1 },
    pink: { name: 'Pink',            tint: '#F7DEE7', qty: 1 },
    set:  { name: 'Blue + Pink Set', tint: SET_TINT,  qty: 2 }
  };

  var PRODUCT_NAME = 'Relaxonus Neck Massager';
  var ADDED_MS = 1600;
  var STICKY_OFFSET = 40;

  /* --------------------------------- State --------------------------------- */

  var state = {
    variant: 'blue',
    img: 0,
    added: false,
    cart: 0,
    sticky: false
  };

  var addedTimer = null;

  /* --------------------------------- Nodes --------------------------------- */

  var $  = function (sel, root) { return (root || document).querySelector(sel); };
  var $$ = function (sel, root) {
    return Array.prototype.slice.call((root || document).querySelectorAll(sel));
  };

  var hero         = $('[data-hero]');
  var galleryMain  = $('[data-gallery-main]');
  var galleryLabel = $('[data-gallery-label]');
  var thumbs       = $$('[data-img]');
  var variantGroup = $('[data-variant-group]');
  var variantBtns  = variantGroup ? $$('[data-variant]', variantGroup) : [];
  var ctaBtns      = $$('[data-cta]');
  var addBtns      = $$('[data-add-to-cart]');
  var chooseBtns   = $$('[data-choose]');
  var cartBadge    = $('[data-cart-badge]');
  var cartStatus   = $('[data-cart-status]');
  var stickyBar    = $('[data-sticky-bar]');
  var stickyThumb  = $('[data-sticky-thumb]');
  var stickyTitle  = $('[data-sticky-title]');
  var faqRoot      = $('[data-faq]');

  /* ------------------------------ Gallery labels --------------------------- */
  /* Placeholder captions stand in until real photography is dropped in. */

  function galleryLabels(variantKey) {
    if (variantKey === 'set') {
      return [
        '[ BLUE + PINK SET IMAGE ]',
        '[ SET IN USE ]',
        '[ SET CLOSE-UP ]',
        '[ SET DETAIL ]',
        '[ BLUE + PINK SET IMAGE ]'
      ];
    }
    var up = VARIANTS[variantKey].name.toUpperCase();
    return [
      '[ ' + up + ' PRODUCT IMAGE ]',
      '[ ' + up + ' IN USE ]',
      '[ ' + up + ' CLOSE-UP ]',
      '[ ' + up + ' DETAIL ]',
      '[ BLUE + PINK SET IMAGE ]'
    ];
  }

  /* --------------------------------- Render -------------------------------- */

  function render() {
    var variant = VARIANTS[state.variant];

    /* Gallery: the fifth frame always shows the two-tone set. */
    if (galleryMain) {
      galleryMain.style.background = state.img === 4 ? SET_TINT : variant.tint;
    }
    if (galleryLabel) {
      galleryLabel.textContent = galleryLabels(state.variant)[state.img];
    }

    thumbs.forEach(function (btn) {
      var index = Number(btn.dataset.img);
      var active = index === state.img;
      btn.classList.toggle('is-active', active);
      btn.setAttribute('aria-pressed', active ? 'true' : 'false');
      /* Thumb 5 is the fixed set swatch and keeps its CSS background. */
      if (index !== 4) btn.style.background = variant.tint;
    });

    /* Variant picker */
    variantBtns.forEach(function (btn) {
      var active = btn.dataset.variant === state.variant;
      btn.classList.toggle('is-active', active);
      btn.setAttribute('aria-checked', active ? 'true' : 'false');
      btn.tabIndex = active ? 0 : -1;
    });

    /* Call to action */
    var label = state.added ? 'ADDED ✓' : 'ADD TO CART';
    ctaBtns.forEach(function (btn) { btn.textContent = label; });

    /* Cart badge */
    if (cartBadge) {
      cartBadge.textContent = String(state.cart);
      cartBadge.hidden = state.cart === 0;
    }

    /* Sticky bar */
    if (stickyThumb) stickyThumb.style.background = variant.tint;
    if (stickyTitle) stickyTitle.textContent = variant.name + ' • ' + PRODUCT_NAME;
    if (stickyBar) stickyBar.hidden = !state.sticky;
  }

  /* -------------------------------- Actions -------------------------------- */

  function pickVariant(key) {
    if (!VARIANTS[key] || key === state.variant) return;
    state.variant = key;
    /* The set has its own hero frame; single colours reset to the first. */
    state.img = key === 'set' ? 4 : 0;
    render();
  }

  function pickImage(index) {
    if (index === state.img) return;
    state.img = index;
    render();
  }

  function addToCart() {
    var variant = VARIANTS[state.variant];
    state.cart += variant.qty;
    state.added = true;
    render();

    if (cartStatus) {
      cartStatus.textContent =
        variant.name + ' added to cart. ' + state.cart +
        (state.cart === 1 ? ' item' : ' items') + ' in cart.';
    }

    clearTimeout(addedTimer);
    addedTimer = setTimeout(function () {
      state.added = false;
      render();
    }, ADDED_MS);
  }

  function scrollToTop() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  /* --------------------------------- Events -------------------------------- */

  thumbs.forEach(function (btn) {
    btn.addEventListener('click', function () {
      pickImage(Number(btn.dataset.img));
    });
  });

  variantBtns.forEach(function (btn) {
    btn.addEventListener('click', function () {
      pickVariant(btn.dataset.variant);
    });
  });

  /* Arrow-key navigation so the radiogroup behaves like a real one. */
  if (variantGroup) {
    variantGroup.addEventListener('keydown', function (event) {
      var keys = ['ArrowRight', 'ArrowDown', 'ArrowLeft', 'ArrowUp'];
      if (keys.indexOf(event.key) === -1) return;

      var current = variantBtns.indexOf(document.activeElement);
      if (current === -1) return;

      event.preventDefault();
      var forward = event.key === 'ArrowRight' || event.key === 'ArrowDown';
      var next = (current + (forward ? 1 : -1) + variantBtns.length) % variantBtns.length;

      pickVariant(variantBtns[next].dataset.variant);
      variantBtns[next].focus();
    });
  }

  addBtns.forEach(function (btn) {
    btn.addEventListener('click', addToCart);
  });

  chooseBtns.forEach(function (btn) {
    btn.addEventListener('click', function () {
      pickVariant(btn.dataset.choose);
      scrollToTop();
    });
  });

  /* ---------------------------------- FAQ ---------------------------------- */
  /* Single-open accordion. Heights are measured rather than hard-coded so an
     answer of any length opens fully. */

  if (faqRoot) {
    var questions = $$('.faq-q', faqRoot);

    var panelFor = function (button) {
      return document.getElementById(button.getAttribute('aria-controls'));
    };

    var setOpen = function (button, open) {
      var panel = panelFor(button);
      if (!panel) return;
      button.setAttribute('aria-expanded', open ? 'true' : 'false');
      panel.classList.toggle('is-open', open);
      panel.style.maxHeight = open ? panel.scrollHeight + 'px' : '0px';
    };

    questions.forEach(function (button) {
      /* Sync the markup's initial open state with a measured height. */
      setOpen(button, button.getAttribute('aria-expanded') === 'true');

      button.addEventListener('click', function () {
        var isOpen = button.getAttribute('aria-expanded') === 'true';
        questions.forEach(function (other) { setOpen(other, false); });
        if (!isOpen) setOpen(button, true);
      });
    });

    /* Re-measure the open panel when reflow changes its height. */
    var remeasure = function () {
      questions.forEach(function (button) {
        if (button.getAttribute('aria-expanded') !== 'true') return;
        var panel = panelFor(button);
        if (panel) panel.style.maxHeight = panel.scrollHeight + 'px';
      });
    };
    window.addEventListener('resize', remeasure);
    if (document.fonts && document.fonts.ready) {
      document.fonts.ready.then(remeasure);
    }
  }

  /* ------------------------------- Sticky bar ------------------------------ */
  /* Revealed once the buy box has scrolled past the top of the viewport. */

  if (hero && stickyBar) {
    var ticking = false;

    var evaluate = function () {
      ticking = false;
      var past = hero.getBoundingClientRect().bottom < STICKY_OFFSET;
      if (past === state.sticky) return;
      state.sticky = past;
      render();
    };

    var onScroll = function () {
      if (ticking) return;
      ticking = true;
      window.requestAnimationFrame(evaluate);
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    evaluate();
  }

  /* --------------------------------- Start --------------------------------- */

  render();
})();
