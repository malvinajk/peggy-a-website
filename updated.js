import './src/style.css';
import { EllipseGeometry } from './src/ellipseGeometry.js';
import { EllipseItems } from './src/ellipseItems.js';

const items = document.querySelectorAll('.tube__text__item');
const wrapper = document.querySelector('.tube__wrapper');
const focusZone = document.querySelector('.focused-img-container');

const geometry = new EllipseGeometry();
geometry.updateResponsiveRadii(window.innerWidth, window.innerHeight);

const ellipseItems = new EllipseItems(items, geometry, focusZone);

let rotationOffset = 0;

gsap.to({}, {
    rotationOffset: Math.PI * 2,
    ease: "none",
    scrollTrigger: {
        trigger: wrapper,
        start: "top top",
        end: "+=3000",
        scrub: true,
        pin: true
    },
    onUpdate: function () {
        rotationOffset = this.targets()[0].rotationOffset;
        ellipseItems.update(rotationOffset);
    }
});

window.addEventListener("resize", () => {
    geometry.updateResponsiveRadii(window.innerWidth, window.innerHeight);
    ellipseItems.update(rotationOffset);
    ScrollTrigger.refresh();
});

console.log("Loaded")