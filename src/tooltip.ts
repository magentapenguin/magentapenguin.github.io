import * as floating from "@floating-ui/dom";
import './tooltip.css';

interface TooltipOpts {
    padding?: number;
    offset?: number;
    animationDuration?: number;
    strategy?: 'fixed' | 'absolute';
    direction?: 'top' | 'bottom' | 'left' | 'right';
}

export default class Tooltip {
    tooltip?: HTMLElement;
    arrow?: HTMLElement;
    private cleanUp?: () => void;
    constructor(public elem: HTMLElement, public text: string, public opts?: TooltipOpts) {
        console.log(elem, this.elem);
        this.elem.addEventListener('mouseenter', this.onHover.bind(this));
        this.elem.addEventListener('mouseleave', this.onLeave.bind(this));
        this.elem.addEventListener('focus', this.onHover.bind(this));
        this.elem.addEventListener('blur', this.onLeave.bind(this));
    }
    unmount() {
        this.elem.removeEventListener('mouseenter', this.onHover);
        this.elem.removeEventListener('mouseleave', this.onLeave);
        this.elem.removeEventListener('focus', this.onHover);
        this.elem.removeEventListener('blur', this.onLeave);
        this.tooltip?.remove();
    }
    private updatePosition() {
        if (!this.tooltip) return;

        floating.computePosition(this.elem, this.tooltip!, {
            middleware: [
                floating.flip(),
                floating.offset(this.opts?.offset ?? 5),
                floating.shift({ padding: this.opts?.padding ?? 5 }),
                floating.arrow({ element: this.arrow! })
            ],
            strategy: this.opts?.strategy ?? 'absolute',
            placement: this.opts?.direction ?? 'top'
        }).then(({ x, y, strategy, placement, middlewareData }) => {
            Object.assign(this.tooltip!.style, {
                left: `${Math.floor(x)}px`,
                top: `${Math.floor(y)}px`,
                position: strategy
            });
            // arrow
            if (!this.arrow || !middlewareData.arrow) return;
            const { x: ax, y: ay } = middlewareData.arrow;
            Object.assign(this.arrow.style, {
                left: ax != null ? `${ax}px` : '',
                top: ay != null ? `${ay}px` : ''
            });
            this.arrow.dataset.placement = placement;
        });
    }
    onHover() {
        if (this.tooltip) this.tooltip.remove();
        this.tooltip = document.createElement('div');
        this.tooltip.classList.add('tooltip');
        this.tooltip.innerText = this.text;
        this.arrow = document.createElement('div');
        this.arrow.classList.add('tooltip-arrow');
        this.tooltip.appendChild(this.arrow);
        document.body.appendChild(this.tooltip);
        this.animate([
            { transform: 'scale(0%)' },
            { transform: 'scale(100%)' }
        ], {
            duration: this.opts?.animationDuration ?? 200,
            easing: 'cubic-bezier(0.16, 1, 0.3, 1)'
        });
        this.cleanUp = floating.autoUpdate(this.elem, this.tooltip, this.updatePosition.bind(this));
    }
    private animate(kfs: Keyframe[], opts: KeyframeAnimationOptions, finish?: () => void) {
        const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        if (reduceMotion) {
            finish?.();
            return;
        }
        if (!this.tooltip) return;
        const animation = this.tooltip.animate(kfs, opts);
        if (finish) animation.onfinish = finish;
    }
    onLeave() {
        this.animate([
            { transform: 'scale(100%)' },
            { transform: 'scale(0%)' }
        ], {
            duration: this.opts?.animationDuration ?? 200,
            easing: 'cubic-bezier(0.16, 1, 0.3, 1)'
        }, () => {
            this.tooltip?.remove();
            this.tooltip = undefined;
        });
        this.cleanUp?.();
    }
}