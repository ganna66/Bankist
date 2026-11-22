'use strict';

///////////////////////////////////////
// Modal window

const modal = document.querySelector('.modal');
const overlay = document.querySelector('.overlay');
const btnCloseModal = document.querySelector('.btn--close-modal');
const btnsOpenModal = document.querySelectorAll('.btn--show-modal');
const nav = document.querySelector('.nav');

const openModal = function (e) {
  e.preventDefault();
  modal.classList.remove('hidden');
  overlay.classList.remove('hidden');
};

const closeModal = function () {
  modal.classList.add('hidden');
  overlay.classList.add('hidden');
};

btnsOpenModal.forEach(btn => btn.addEventListener('click', openModal));

btnCloseModal.addEventListener('click', closeModal);
overlay.addEventListener('click', closeModal);

document.addEventListener('keydown', function (e) {
  if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
    closeModal();
  }
});

const btnScrollTo = document.querySelector('.btn--scroll-to');
const section1 = document.querySelector('#section--1');
const header = document.querySelector('.header');

btnScrollTo.addEventListener('click', function (e) {
  // scrolling
  // console.log(document.documentElement.clientHeight);
  section1.scrollIntoView({ behavior: 'smooth' });
});

// event delegation
document.querySelector('.nav__links').addEventListener('click', function (e) {
  e.preventDefault();
  if (e.target.classList.contains('nav__link')) {
    document
      .querySelector(e.target.getAttribute('href'))
      .scrollIntoView({ behavior: 'smooth' });
  }
});

const tabs = document.querySelectorAll('.operations__tab');
const tabsContainer = document.querySelector('.operations__tab-container');
const tabsContent = document.querySelectorAll('.operations__content');

tabsContainer.addEventListener('click', function (e) {
  const clicked = e.target.closest('.operations__tab');
  // Guard clause
  if (!clicked) return;
  tabs.forEach(tab => tab.classList.remove('operations__tab--active'));
  clicked.classList.add('operations__tab--active');

  tabsContent.forEach(x => x.classList.remove('operations__content--active'));
  document
    .querySelector(`.operations__content--${clicked.dataset.tab}`)
    .classList.add('operations__content--active');
});

const handleHovering = function (e) {
  if (e.target.classList.contains('nav__link')) {
    const link = e.target;
    const otherLinks = link.closest('nav').querySelectorAll('.nav__link');
    const logo = document.querySelector('.nav__logo');
    logo.style.opacity = this;
    otherLinks.forEach(x => {
      if (x !== link) {
        x.style.opacity = this;
      }
    });
    // this is the attribute of the bind method which is used to set the value of this keyword in the function. In this case, it is set to 0.5 for mouseover and 1 for mouseout.
  }
};

nav.addEventListener('mouseover', handleHovering.bind(0.5));
nav.addEventListener('mouseout', handleHovering.bind(1));

// // New observer API in js
const images = document.querySelectorAll('img[data-src]');
const callbackFunc = function (entries, observer) {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;

    entry.target.src = entry.target.dataset.src;
    entry.target.addEventListener('load', function () {
      entry.target.classList.remove('lazy-img');
    });
    observer.unobserve(entry.target);
  });
};
const observerOption = {
  root: null,
  rootMargin: '20px',
  threshold: 0.5,
};

const observer = new IntersectionObserver(callbackFunc, observerOption);
images.forEach(img => observer.observe(img));

// sticky navbar
const navHeight = nav.getBoundingClientRect().height;
const footer = document.querySelector('.footer');
// Update
const sticky = function (entries) {
  entries.forEach(entry => {
    if (entry.target === header) {
      entry.isIntersecting
        ? nav.classList.remove('sticky')
        : nav.classList.add('sticky');
    }
  });
};

// const sticky = function (entries) {
//   entries.forEach(entry => {
//     if (entry.target === header) {
//       if (!entry.isIntersecting) {
//         nav.classList.add('sticky');
//       } else {
//         nav.classList.remove('sticky');
//       }
//     }
//     if (entry.target === footer) {
//       if (entry.isIntersecting) {
//         nav.classList.remove('sticky');
//       }
//     }
//   });
// };
const stickyObserver = new IntersectionObserver(sticky, {
  root: null,
  threshold: 0,
  rootMargin: `-${navHeight}px`,
});
stickyObserver.observe(header);
stickyObserver.observe(footer);

// const footerObserve = new IntersectionObserver(
//   function (entries) {
//     entries.forEach(e => {
//       if (e.isIntersecting) {
//         nav.classList.remove('sticky');
//       } else {
//         nav.classList.add('sticky');
//       }
//     });
//   },
//   {
//     root: null,
//     threshold: 0.5,
//   },
// );

// Reveal sections
const allSections = document.querySelectorAll('.section');

const revFunc = function (entries) {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    entry.target.classList.remove('section--hidden');
    // observer.unobserve(entry.target);
    sectionRevObserver.unobserve(entry.target);
  });
};
const sectionRevObserver = new IntersectionObserver(revFunc, {
  root: null,
  threshold: 0.15,
});

allSections.forEach(section => sectionRevObserver.observe(section));

// Slider
function slider() {
  const slider = document.querySelector('.slider');
  const slides = document.querySelectorAll('.slide');
  const btnLeft = document.querySelector('.slider__btn--left');
  const btnRight = document.querySelector('.slider__btn--right');

  let currentSlide = 0;
  const maxSlide = slides.length;

  const goToSlide = function (currentSlide) {
    slides.forEach(
      (s, i) =>
        (s.style.transform = `translateX(${100 * (i - currentSlide)}%)`),
    );
  };
  goToSlide(currentSlide);

  const nextSlide = function () {
    if (currentSlide === maxSlide - 1) {
      currentSlide = 0;
    } else {
      currentSlide++;
    }
    goToSlide(currentSlide);
    activateDot(currentSlide);
  };
  const prevSlide = function () {
    if (currentSlide === 0) {
      currentSlide = maxSlide - 1;
    } else {
      currentSlide--;
    }
    goToSlide(currentSlide);
    activateDot(currentSlide);
  };
  btnRight.addEventListener('click', nextSlide);

  btnLeft.addEventListener('click', prevSlide);

  // keyboard hand event
  document.addEventListener('keydown', function (e) {
    e.key === 'ArrowRight' && nextSlide();
    e.key === 'ArrowLeft' && prevSlide();
  });

  // function creating dots
  const dotsDiv = document.querySelector('.dots');
  const createDots = function () {
    slides.forEach((_, i) => {
      dotsDiv.insertAdjacentHTML(
        'beforeend',
        `<button class='dots__dot' data-slide='${i}'></button>`,
      );
    });
  };
  createDots();
  function activateDot(slide) {
    document
      .querySelectorAll('.dots__dot')
      .forEach(dot => dot.classList.remove('dots__dot--active'));
    document
      .querySelector(`.dots__dot[data-slide='${slide}']`)
      .classList.add('dots__dot--active');
  }

  dotsDiv.addEventListener('click', function (e) {
    if (!e.target.classList.contains('dots__dot')) return;
    else {
      const slideNumber = e.target.dataset.slide;
      goToSlide(slideNumber);
      activateDot(slideNumber);
    }
  });

  activateDot(0);
}
slider();
