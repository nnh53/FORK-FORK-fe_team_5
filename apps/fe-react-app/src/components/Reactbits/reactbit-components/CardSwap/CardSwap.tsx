/* eslint-disable @typescript-eslint/no-non-null-assertion */
// /* eslint-disable react-hooks/exhaustive-deps */
// import gsap from "gsap";
// import React, {
//   Children,
//   cloneElement,
//   forwardRef,
//   isValidElement,
//   type ReactElement,
//   type ReactNode,
//   type RefObject,
//   useEffect,
//   useMemo,
//   useRef,
// } from "react";
// import "./CardSwap.css";

// export interface CardSwapProps {
//   width?: number | string;
//   height?: number | string;
//   cardDistance?: number;
//   verticalDistance?: number;
//   delay?: number;
//   pauseOnHover?: boolean;
//   onCardClick?: (idx: number) => void;
//   skewAmount?: number;
//   easing?: "linear" | "elastic";
//   /**
//    * Callback fired whenever the front card changes. Provides the index (based on original children order)
//    * of the card that is now at the front. Useful for syncing external UI like indicators or additional content.
//    */
//   onActiveIndexChange?: (idx: number) => void;
//   children: ReactNode;
// }

// export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
//   customClass?: string;
// }

// export const Card = forwardRef<HTMLDivElement, CardProps>(({ customClass, ...rest }, ref) => (
//   <div ref={ref} {...rest} className={`card ${customClass ?? ""} ${rest.className ?? ""}`.trim()} />
// ));
// Card.displayName = "Card";

// type CardRef = RefObject<HTMLDivElement>;
// interface Slot {
//   x: number;
//   y: number;
//   z: number;
//   zIndex: number;
// }

// const makeSlot = (i: number, distX: number, distY: number, total: number): Slot => ({
//   x: i * distX,
//   y: -i * distY,
//   z: -i * distX * 1.5,
//   zIndex: total - i,
// });

// const placeNow = (el: HTMLElement, slot: Slot, skew: number) =>
//   gsap.set(el, {
//     x: slot.x,
//     y: slot.y,
//     z: slot.z,
//     xPercent: -50,
//     yPercent: -50,
//     skewY: skew,
//     transformOrigin: "center center",
//     zIndex: slot.zIndex,
//     force3D: true,
//   });

// const CardSwap: React.FC<CardSwapProps> = ({
//   width = 600,
//   height = 400,
//   cardDistance = 60,
//   verticalDistance = 70,
//   delay = 5000,
//   pauseOnHover = false,
//   onCardClick,
//   onActiveIndexChange,
//   skewAmount = 6,
//   easing = "elastic",
//   children,
// }) => {
//   const config =
//     easing === "elastic"
//       ? {
//           ease: "elastic.out(0.6,0.9)",
//           durDrop: 2,
//           durMove: 2,
//           durReturn: 2,
//           promoteOverlap: 0.9,
//           returnDelay: 0.05,
//         }
//       : {
//           ease: "power1.inOut",
//           durDrop: 0.8,
//           durMove: 0.8,
//           durReturn: 0.8,
//           promoteOverlap: 0.45,
//           returnDelay: 0.2,
//         };

//   const childArr = useMemo(() => Children.toArray(children) as ReactElement<CardProps>[], [children]);
//   const refs = useMemo<RefObject<HTMLDivElement | null>[]>(() => childArr.map(() => React.createRef<HTMLDivElement>()), [childArr.length]);

//   const order = useRef<number[]>(Array.from({ length: childArr.length }, (_, i) => i));

//   const tlRef = useRef<gsap.core.Timeline | null>(null);
//   const intervalRef = useRef<number | null>(null);
//   const container = useRef<HTMLDivElement>(null);

//   useEffect(() => {
//     const total = refs.length;
//     refs.forEach((r, i) => placeNow(r.current!, makeSlot(i, cardDistance, verticalDistance, total), skewAmount));

//     // Notify initial active index (the first card by default)
//     if (typeof onActiveIndexChange === "function" && order.current.length) {
//       onActiveIndexChange(order.current[0]);
//     }

//     const swap = () => {
//       if (order.current.length < 2) return;

//       const [front, ...rest] = order.current;
//       const elFront = refs[front].current!;
//       const tl = gsap.timeline();
//       tlRef.current = tl;

//       tl.to(elFront, {
//         y: "+=500",
//         duration: config.durDrop,
//         ease: config.ease,
//       });

//       tl.addLabel("promote", `-=${config.durDrop * config.promoteOverlap}`);
//       rest.forEach((idx, i) => {
//         const el = refs[idx].current!;
//         const slot = makeSlot(i, cardDistance, verticalDistance, refs.length);
//         tl.set(el, { zIndex: slot.zIndex }, "promote");
//         tl.to(
//           el,
//           {
//             x: slot.x,
//             y: slot.y,
//             z: slot.z,
//             duration: config.durMove,
//             ease: config.ease,
//           },
//           `promote+=${i * 0.15}`,
//         );
//       });

//       const backSlot = makeSlot(refs.length - 1, cardDistance, verticalDistance, refs.length);
//       tl.addLabel("return", `promote+=${config.durMove * config.returnDelay}`);
//       tl.call(
//         () => {
//           gsap.set(elFront, { zIndex: backSlot.zIndex });
//         },
//         undefined,
//         "return",
//       );
//       tl.set(elFront, { x: backSlot.x, z: backSlot.z }, "return");
//       tl.to(
//         elFront,
//         {
//           y: backSlot.y,
//           duration: config.durReturn,
//           ease: config.ease,
//         },
//         "return",
//       );

//       tl.call(() => {
//         order.current = [...rest, front];

//         // Inform consumer that active index has changed
//         if (typeof onActiveIndexChange === "function") {
//           const newActive = rest.length ? rest[0] : front;
//           onActiveIndexChange(newActive);
//         }
//       });
//     };

//     swap();
//     intervalRef.current = window.setInterval(swap, delay);

//     if (pauseOnHover) {
//       const node = container.current!;
//       const pause = () => {
//         tlRef.current?.pause();
//         clearInterval(intervalRef.current!);
//       };
//       const resume = () => {
//         tlRef.current?.play();
//         intervalRef.current = window.setInterval(swap, delay);
//       };
//       node.addEventListener("mouseenter", pause);
//       node.addEventListener("mouseleave", resume);
//       return () => {
//         node.removeEventListener("mouseenter", pause);
//         node.removeEventListener("mouseleave", resume);
//         clearInterval(intervalRef.current!);
//       };
//     }
//     return () => clearInterval(intervalRef.current!);
//   }, [cardDistance, verticalDistance, delay, pauseOnHover, skewAmount, easing, onActiveIndexChange]);

//   const rendered = childArr.map((child, i) =>
//     isValidElement<CardProps>(child)
//       ? cloneElement(child, {
//           key: i,
//           ref: refs[i],
//           style: { width, height, ...(child.props.style ?? {}) },
//           onClick: (e) => {
//             child.props.onClick?.(e as React.MouseEvent<HTMLDivElement>);
//             onCardClick?.(i);
//           },
//         } as CardProps & React.RefAttributes<HTMLDivElement>)
//       : child,
//   );

//   return (
//     <div ref={container} className="card-swap-container" style={{ width, height }}>
//       {rendered}
//     </div>
//   );
// };

// export default CardSwap;
/* eslint-disable react-hooks/exhaustive-deps */
import gsap from "gsap";
import React, {
  Children,
  cloneElement,
  forwardRef,
  isValidElement,
  type ReactElement,
  type ReactNode,
  type RefObject,
  useEffect,
  useMemo,
  useRef,
} from "react";
import "./CardSwap.css";

export interface CardSwapProps {
  width?: number | string;
  height?: number | string;
  cardDistance?: number;
  verticalDistance?: number;
  delay?: number;
  pauseOnHover?: boolean;
  onCardClick?: (idx: number) => void;
  skewAmount?: number;
  easing?: "linear" | "elastic";
  /**
   * Index of the card that should be at the front. When this changes,
   * the component will animate to bring that card to the front.
   */
  activeIndex: number | null;
  /**
   * Callback fired whenever the front card changes. Provides the index (based on original children order)
   * of the card that is now at the front. Useful for syncing external UI like indicators or additional content.
   */
  onActiveIndexChange?: (idx: number) => void;
  children: ReactNode;
}

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  customClass?: string;
}

export const Card = forwardRef<HTMLDivElement, CardProps>(({ customClass, ...rest }, ref) => (
  <div ref={ref} {...rest} className={`card ${customClass ?? ""} ${rest.className ?? ""}`.trim()} />
));
Card.displayName = "Card";

// type CardRef = RefObject<HTMLDivElement>;
interface Slot {
  x: number;
  y: number;
  z: number;
  zIndex: number;
}

const makeSlot = (i: number, distX: number, distY: number, total: number): Slot => ({
  x: i * distX,
  y: -i * distY,
  z: -i * distX * 1.5,
  zIndex: total - i,
});

const placeNow = (el: HTMLElement, slot: Slot, skew: number) =>
  gsap.set(el, {
    x: slot.x,
    y: slot.y,
    z: slot.z,
    xPercent: -50,
    yPercent: -50,
    skewY: skew,
    transformOrigin: "center center",
    zIndex: slot.zIndex,
    force3D: true,
  });

const CardSwap: React.FC<CardSwapProps> = ({
  width = 600,
  height = 400,
  cardDistance = 60,
  verticalDistance = 70,
  delay = 5000,
  pauseOnHover = false,
  onCardClick,
  onActiveIndexChange,
  skewAmount = 6,
  easing = "elastic",
  activeIndex,
  children,
}) => {
  const config =
    easing === "elastic"
      ? {
          ease: "elastic.out(0.6,0.9)",
          durDrop: 2,
          durMove: 2,
          durReturn: 2,
          promoteOverlap: 0.9,
          returnDelay: 0.05,
        }
      : {
          ease: "power1.inOut",
          durDrop: 0.8,
          durMove: 0.8,
          durReturn: 0.8,
          promoteOverlap: 0.45,
          returnDelay: 0.2,
        };

  const childArr = useMemo(() => Children.toArray(children) as ReactElement<CardProps>[], [children]);
  const refs = useMemo<RefObject<HTMLDivElement | null>[]>(() => childArr.map(() => React.createRef<HTMLDivElement>()), [childArr.length]);

  const order = useRef<number[]>(Array.from({ length: childArr.length }, (_, i) => i));
  const lastActiveIndex = useRef<number | undefined>(activeIndex);

  const tlRef = useRef<gsap.core.Timeline | null>(null);
  const intervalRef = useRef<number | null>(null);
  const container = useRef<HTMLDivElement>(null);

  // Function to bring a specific card to the front
  const bringToFront = (targetIndex: number) => {
    if (targetIndex < 0 || targetIndex >= refs.length) return;
    if (order.current[0] === targetIndex) return; // Already at front

    // Stop current animation and interval
    tlRef.current?.kill();
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }

    // Reorder array to bring target to front
    const currentOrder = [...order.current];
    const targetPosition = currentOrder.indexOf(targetIndex);
    if (targetPosition === -1) return;

    // Remove target from current position and place at front
    currentOrder.splice(targetPosition, 1);
    const newOrder = [targetIndex, ...currentOrder];

    // Animate all cards to their new positions
    const tl = gsap.timeline();
    tlRef.current = tl;

    newOrder.forEach((cardIndex, position) => {
      const el = refs[cardIndex].current!;
      const slot = makeSlot(position, cardDistance, verticalDistance, refs.length);

      tl.to(
        el,
        {
          x: slot.x,
          y: slot.y,
          z: slot.z,
          duration: config.durMove,
          ease: config.ease,
          zIndex: slot.zIndex,
        },
        // position * 0.1,
        0,
      );
    });

    // tl.call(() => {
    //   order.current = newOrder;
    //   if (typeof onActiveIndexChange === "function") {
    //     onActiveIndexChange(targetIndex);
    //   }

    //   // Restart the automatic swapping
    //   // startAutoSwap();
    // });
  };

  // const startAutoSwap = () => {
  //   const swap = () => {
  //     if (order.current.length < 2) return;

  //     const [front, ...rest] = order.current;
  //     const elFront = refs[front].current!;
  //     const tl = gsap.timeline();
  //     tlRef.current = tl;

  //     tl.to(elFront, {
  //       y: "+=500",
  //       duration: config.durDrop,
  //       ease: config.ease,
  //     });

  //     tl.addLabel("promote", `-=${config.durDrop * config.promoteOverlap}`);
  //     rest.forEach((idx, i) => {
  //       const el = refs[idx].current!;
  //       const slot = makeSlot(i, cardDistance, verticalDistance, refs.length);
  //       tl.set(el, { zIndex: slot.zIndex }, "promote");
  //       tl.to(
  //         el,
  //         {
  //           x: slot.x,
  //           y: slot.y,
  //           z: slot.z,
  //           duration: config.durMove,
  //           ease: config.ease,
  //         },
  //         `promote+=${i * 0.15}`,
  //       );
  //     });

  //     const backSlot = makeSlot(refs.length - 1, cardDistance, verticalDistance, refs.length);
  //     tl.addLabel("return", `promote+=${config.durMove * config.returnDelay}`);
  //     tl.call(
  //       () => {
  //         gsap.set(elFront, { zIndex: backSlot.zIndex });
  //       },
  //       undefined,
  //       "return",
  //     );
  //     tl.set(elFront, { x: backSlot.x, z: backSlot.z }, "return");
  //     tl.to(
  //       elFront,
  //       {
  //         y: backSlot.y,
  //         duration: config.durReturn,
  //         ease: config.ease,
  //       },
  //       "return",
  //     );

  //     tl.call(() => {
  //       order.current = [...rest, front];

  //       // Inform consumer that active index has changed
  //       if (typeof onActiveIndexChange === "function") {
  //         const newActive = rest.length ? rest[0] : front;
  //         onActiveIndexChange(newActive);
  //       }
  //     });
  //   };

  //   swap();
  //   intervalRef.current = window.setInterval(swap, delay);
  // };

  // Handle activeIndex prop changes
  useEffect(() => {
    if (activeIndex !== undefined && activeIndex != null && activeIndex !== lastActiveIndex.current) {
      lastActiveIndex.current = activeIndex;
      bringToFront(activeIndex);
    }
  }, [activeIndex]);

  useEffect(() => {
    const total = refs.length;
    refs.forEach((r, i) => placeNow(r.current!, makeSlot(i, cardDistance, verticalDistance, total), skewAmount));

    // If activeIndex is provided, bring that card to front initially
    if (activeIndex !== undefined && activeIndex != null && activeIndex >= 0 && activeIndex < refs.length) {
      const newOrder = [activeIndex, ...Array.from({ length: refs.length }, (_, i) => i).filter((i) => i !== activeIndex)];
      order.current = newOrder;

      // Re-position cards according to new order
      newOrder.forEach((cardIndex, position) => {
        const el = refs[cardIndex].current!;
        const slot = makeSlot(position, cardDistance, verticalDistance, refs.length);
        placeNow(el, slot, skewAmount);
      });

      if (typeof onActiveIndexChange === "function") {
        onActiveIndexChange(activeIndex);
      }
    } else {
      // Notify initial active index (the first card by default)
      if (typeof onActiveIndexChange === "function" && order.current.length) {
        onActiveIndexChange(order.current[0]);
      }
    }

    // startAutoSwap();

    if (pauseOnHover) {
      const node = container.current!;
      const pause = () => {
        tlRef.current?.pause();
        clearInterval(intervalRef.current!);
      };
      const resume = () => {
        tlRef.current?.play();
        // startAutoSwap();
      };
      node.addEventListener("mouseenter", pause);
      node.addEventListener("mouseleave", resume);
      return () => {
        node.removeEventListener("mouseenter", pause);
        node.removeEventListener("mouseleave", resume);
        clearInterval(intervalRef.current!);
      };
    }
    return () => clearInterval(intervalRef.current!);
  }, [cardDistance, verticalDistance, delay, pauseOnHover, skewAmount, easing, onActiveIndexChange]);

  const rendered = childArr.map((child, i) =>
    isValidElement<CardProps>(child)
      ? cloneElement(child, {
          key: i,
          ref: refs[i],
          style: { width, height, ...(child.props.style ?? {}) },
          onClick: (e) => {
            child.props.onClick?.(e as React.MouseEvent<HTMLDivElement>);
            onCardClick?.(i);
          },
        } as CardProps & React.RefAttributes<HTMLDivElement>)
      : child,
  );

  return (
    <div ref={container} className="card-swap-container" style={{ width, height }}>
      {rendered}
    </div>
  );
};

export default CardSwap;
