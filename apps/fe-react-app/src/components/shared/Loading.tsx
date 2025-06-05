import { gsap } from 'gsap';
import React, { useEffect, useRef } from 'react';

const Loading: React.FC = () => {
  const svgRef = useRef<SVGSVGElement>(null);
  const target1Ref = useRef<SVGLineElement>(null);
  const target2Ref = useRef<SVGLineElement>(null);
  const squareRef = useRef<SVGRectElement>(null);
  const textRef = useRef<SVGTextElement>(null);

  useEffect(() => {
    // Ensure all refs are current
    if (!svgRef.current || !target1Ref.current || !target2Ref.current || !squareRef.current || !textRef.current) return;

    // Create timeline
    const tl = gsap.timeline({
      repeat: -1,
      repeatDelay: 0.5,
      defaults: { duration: 0.6, ease: 'power2.inOut' },
    });

    // Initial setup
    gsap.set(target1Ref.current, { rotation: 45, svgOrigin: '50 50' });
    gsap.set(target2Ref.current, { rotation: 135, svgOrigin: '50 50' });

    // Animation sequence
    tl.to([target1Ref.current, target2Ref.current], { attr: { x2: 100 } })
      .to(target1Ref.current, { rotation: 0 }, 'turn')
      .to(target2Ref.current, { rotation: 180 }, 'turn')
      .to(target1Ref.current, { y: -10 }, 'move')
      .to(target2Ref.current, { y: 10 }, 'move')
      .to(squareRef.current, { attr: { height: 22, y: 38 } }, 'move')
      .to([target1Ref.current, target2Ref.current], { attr: { x1: 50, x2: 50 } })
      .to(textRef.current, { duration: 1, opacity: 0, ease: 'none' });

    // Cleanup function
    return () => {
      tl.kill();
    };
  }, []);

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        background: `repeating-linear-gradient(
          0deg,
          hsla(103, 11%, 32%, 0.09) 0px,
          hsla(103, 11%, 32%, 0.09) 1px,
          transparent 1px,
          transparent 11px
        ),
        repeating-linear-gradient(
          90deg,
          hsla(103, 11%, 32%, 0.09) 0px,
          hsla(103, 11%, 32%, 0.09) 1px,
          transparent 1px,
          transparent 11px
        ),
        linear-gradient(90deg, hsl(317, 13%, 6%), hsl(317, 13%, 6%))`,
        overflow: 'hidden',
      }}
    >
      <svg
        ref={svgRef}
        id="demo"
        xmlns="http://www.w3.org/2000/svg"
        width="1000"
        height="1000"
        viewBox="0 0 100 100"
        style={{ maxHeight: '80%', maxWidth: '80%' }}
      >
        <defs>
          <clipPath id="theClipPath">
            <rect ref={squareRef} id="theSquare" x="0" y="50" width="100" height="0" fill="red" />
          </clipPath>
        </defs>
        <line ref={target1Ref} id="target1" x1="0" y1="50" x2="0" y2="50" strokeWidth="1" stroke="#fff" />
        <line ref={target2Ref} id="target2" x1="0" y1="50" x2="0" y2="50" strokeWidth="1" stroke="#fff" />
        <g id="clipPathReveal" clipPath="url(#theClipPath)">
          <text ref={textRef} transform="translate(50 55)" textAnchor="middle" fontSize="12" fill="#fff">
            Please Stand By...
          </text>
        </g>
      </svg>
    </div>
  );
};

export default Loading;

