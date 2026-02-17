import '../css/style.css';
import { gsap } from "gsap";
import { MotionPathPlugin } from "gsap/MotionPathPlugin";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { EllipseGeometry } from './ellipseGeometry.js';

gsap.registerPlugin(MotionPathPlugin, ScrollTrigger);

class EllipseText {
  constructor() {
    this.wrapper = document.querySelector(".tube__wrapper");
    this.textWrapper = document.querySelector(".tube__text__wrapper");
    this.items = document.querySelectorAll(".tube__text__item");
    this.focusZone = document.querySelector(".focused-img-container");

    // Ellipse geometry
    this.geometry = new EllipseGeometry(this.wrapper);
    this.geometry.updateResponsiveRadii(window.innerWidth, window.innerHeight);

    this.total = this.items.length;
    this.angleStep = (2 * Math.PI) / this.total;
    this.rotationOffset = 0;
    this.currentFocusIndex = null;
    this.lockedIndex = null;

    // Center title element
    this.centerTitle = document.querySelector(".center-title") || (() => {
      const el = document.createElement("div");
      el.className = "center-title";
      document.body.appendChild(el);
      return el;
    })();

    // Focused image
    this.focusedImg = document.getElementById("focused-img") || (() => {
      const img = document.createElement("img");
      img.id = "focused-img";
      img.style.position = "absolute";
      img.style.left = "50%";
      img.style.top = "50%";
      img.style.transform = "translate(-50%, -50%)";
      img.style.opacity = 0;
      document.body.appendChild(img);
      return img;
    })();

    // Hardcoded images
    this.itemImages = [
      { src: '../images/landing-imgs/Bossom.JPG', title: 'Bossom', background: 'dark' },
      { src: '../images/landing-imgs/Foxy-Loxy.jpg', title: 'Foxy Loxy', background: 'dark' },
      { src: '../images/landing-imgs/Hare-in-Headlights.JPG', title: 'Hare in Headlights', background: 'dark' },
      { src: '../images/landing-imgs/HayBale.JPG', title: 'Hay Bale', background: 'dark' },
      { src: '../images/landing-imgs/ick.jpg', title: 'Ick', background: 'dark' },
      { src: '../images/landing-imgs/Leggy-Peggy.jpg', title: 'Leggy Peggy', background: 'dark' },
      { src: '../images/landing-imgs/Neon-GRRRR.jpeg', title: 'Neon GRRRR', background: 'dark' },
      { src: '../images/landing-imgs/Nodding-Ones.JPG', title: 'Nodding Ones', background: 'dark' },
      { src: '../images/landing-imgs/Roadkill.JPG', title: 'Roadkill', background: 'dark' },
      { src: '../images/landing-imgs/Ruck-Sack.JPG', title: 'Ruck Sack', background: 'dark' },
      { src: '../images/landing-imgs/Sleeping-Beauties.jpg', title: 'Sleeping Beauties', background: 'dark' },
      { src: '../images/landing-imgs/Urns.jpg', title: 'Urns', background: 'dark' }
    ];


    // initial render
    this.calculatePositions(0);
    this.createScrollTrigger();
    this.addResizeHandler();
    this.populateTitles();
  }

  populateTitles() {
    this.items.forEach((item, i) => {
      const title = this.itemImages[i].title;
      const focusLayer = item.querySelector(".focus-layer");
      if (focusLayer) {
        focusLayer.textContent = title;
      }
    });
  }
  

  calculatePositions(offset) {

    let focusedIndex = null;
    this.items.forEach((item, i) => {
      const angle = i * this.angleStep + offset;
      const pos = this.geometry.computePosition(angle);
      const rot = this.geometry.computeRotation(angle);
      item.style.transform = `translate(-50%, -50%) translate(${pos.x}px, ${pos.y}px) rotate(${rot}deg)`;

      // Check focus zone
      const itemRect = item.getBoundingClientRect();
      const zoneRect = this.focusZone.getBoundingClientRect();
      const inZone = (
        itemRect.left < zoneRect.right &&
        itemRect.right > zoneRect.left &&
        itemRect.top < zoneRect.bottom &&
        itemRect.bottom > zoneRect.top
      );

      if (inZone) {
        item.classList.add("focused");
        item.style.opacity = 0;
        focusedIndex = i;
      } else {
        item.classList.remove("focused");
        item.style.opacity = 1;
      }
    });
    if (focusedIndex !== null) {
      this.setFocus(focusedIndex);
    } else {
      this.clearFocus();
    }
  }

  focusItem(item, index) {
    item.classList.add("focused");
    this.lockedIndex = index;
    this.setFocus(index);
  }

  unfocusItem(item, index) {
    item.classList.remove("focused");
    if (this.lockedIndex === index) this.lockedIndex = null;
    this.clearFocus();
  }

  setFocus(index) {
    const img = this.itemImages[index];

    this.currentFocusIndex = index;

    const text = this.items[index].textContent;
    this.centerTitle.textContent = img.title;
    this.centerTitle.classList.add("visible");
    this.centerTitle.style.color = img.background === 'dark' ? '#fff' : '#000';
    
    // showing relevant image 
    this.focusedImg.src = img.src;
    this.items[index].style.opacity = 0;
    this.focusedImg.style.opacity = 1;
  }

  clearFocus() {
    const i = this.currentFocusIndex;
    if (i !== null) this.items[i].style.opacity = 1;

    this.centerTitle.classList.remove("visible");
    this.centerTitle.textContent = "";
    this.focusedImg.style.opacity = 0;

    this.currentFocusIndex = null;
  }

  createScrollTrigger() {
    gsap.to(this, {
      rotationOffset: Math.PI * 2,
      ease: "none",
      scrollTrigger: {
        trigger: this.wrapper,
        start: "top top",
        end: "+=3000",
        scrub: true,
        pin: true
      },
      onUpdate: () => this.calculatePositions(this.rotationOffset)
    });
  }

  addResizeHandler() {
    window.addEventListener("resize", () => {
      this.geometry.updateResponsiveRadii(window.innerWidth, window.innerHeight);
      this.calculatePositions(this.rotationOffset);
      ScrollTrigger.refresh();
    });
  }
}

new EllipseText();
