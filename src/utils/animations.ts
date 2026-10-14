import { animate, stagger } from 'animejs';

/**
 * Animate numbers counting up smoothly (e.g. 0 -> 5 rows, 0ms -> 14ms)
 */
export function animateCounter(
  from: number,
  to: number,
  onUpdate: (val: number) => void,
  duration = 600
) {
  const obj = { val: from };
  animate(obj, {
    val: to,
    duration,
    ease: 'outQuad',
    onUpdate: () => {
      onUpdate(Math.round(obj.val));
    },
  });
}

/**
 * Animate Result Table rows entering with stagger slide-up
 */
export function animateResultRows(selector = '.result-row-entry') {
  const elements = document.querySelectorAll(selector);
  if (elements.length > 0) {
    animate(elements, {
      opacity: [0, 1],
      translateY: [14, 0],
      delay: stagger(35),
      duration: 350,
      ease: 'outQuad',
    });
  }
}

/**
 * Animate active query blast across editor and workspace
 */
export function animateQueryBlast() {
  const editor = document.getElementById('sql-editor-wrapper');
  if (editor) {
    animate(editor, {
      boxShadow: [
        '0 0 0px rgba(88, 166, 255, 0)',
        '0 0 24px rgba(88, 166, 255, 0.4)',
        '0 0 0px rgba(88, 166, 255, 0)',
      ],
      duration: 700,
      ease: 'inOutQuad',
    });
  }
}

/**
 * Spring bounce when table is released after dragging
 */
export function animateCardDrop(element: HTMLElement | null) {
  if (!element) return;
  animate(element, {
    scale: [1.025, 0.99, 1],
    duration: 400,
    ease: 'outElastic(1.4, 0.6)',
  });
}

/**
 * Animate success check badge popping in with elastic celebration
 */
export function animateSuccessCheck(selector = '#success-check-badge') {
  const el = document.querySelector(selector);
  if (el) {
    animate(el, {
      scale: [0.6, 1.15, 1],
      rotate: [-15, 0],
      opacity: [0, 1],
      duration: 500,
      ease: 'outElastic(1.3, 0.7)',
    });
  }
}
