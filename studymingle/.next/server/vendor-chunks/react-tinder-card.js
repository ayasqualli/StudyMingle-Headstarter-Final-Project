/*
 * ATTENTION: An "eval-source-map" devtool has been used.
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file with attached SourceMaps in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
exports.id = "vendor-chunks/react-tinder-card";
exports.ids = ["vendor-chunks/react-tinder-card"];
exports.modules = {

/***/ "(ssr)/./node_modules/react-tinder-card/index.js":
/*!*************************************************!*\
  !*** ./node_modules/react-tinder-card/index.js ***!
  \*************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

eval("const React = __webpack_require__(/*! react */ \"(ssr)/./node_modules/next/dist/server/future/route-modules/app-page/vendored/ssr/react.js\")\nconst { useSpring, animated } = __webpack_require__(/*! @react-spring/web */ \"(ssr)/./node_modules/@react-spring/web/dist/cjs/index.js\")\nconst useWindowSize = __webpack_require__(/*! ./useWindowSize */ \"(ssr)/./node_modules/react-tinder-card/useWindowSize.js\")\n\nconst settings = {\n  maxTilt: 25, // in deg\n  rotationPower: 50,\n  swipeThreshold: 0.5 // need to update this threshold for RN (1.5 seems reasonable...?)\n}\n\n// physical properties of the spring\nconst physics = {\n  touchResponsive: {\n    friction: 50,\n    tension: 2000\n  },\n  animateOut: {\n    friction: 30,\n    tension: 400\n  },\n  animateBack: {\n    friction: 10,\n    tension: 200\n  }\n}\n\nconst pythagoras = (x, y) => {\n  return Math.sqrt(Math.pow(x, 2) + Math.pow(y, 2))\n}\n\nconst normalize = (vector) => {\n  const length = Math.sqrt(Math.pow(vector.x, 2) + Math.pow(vector.y, 2))\n  return { x: vector.x / length, y: vector.y / length }\n}\n\nconst animateOut = async (gesture, setSpringTarget, windowHeight, windowWidth) => {\n  const diagonal = pythagoras(windowHeight, windowWidth)\n  const velocity = pythagoras(gesture.x, gesture.y)\n  const finalX = diagonal * gesture.x\n  const finalY = diagonal * gesture.y\n  const finalRotation = gesture.x * 45\n  const duration = diagonal / velocity\n\n  setSpringTarget.start({\n    xyrot: [finalX, finalY, finalRotation],\n    config: { duration: duration }\n  })\n\n  // for now animate back\n  return await new Promise((resolve) =>\n    setTimeout(() => {\n      resolve()\n    }, duration)\n  )\n}\n\nconst animateBack = (setSpringTarget) => {\n  // translate back to the initial position\n  return new Promise((resolve) => {\n    setSpringTarget.start({ xyrot: [0, 0, 0], config: physics.animateBack, onRest: resolve })\n  })\n}\n\nconst getSwipeDirection = (property) => {\n  if (Math.abs(property.x) > Math.abs(property.y)) {\n    if (property.x > settings.swipeThreshold) {\n      return 'right'\n    } else if (property.x < -settings.swipeThreshold) {\n      return 'left'\n    }\n  } else {\n    if (property.y > settings.swipeThreshold) {\n      return 'down'\n    } else if (property.y < -settings.swipeThreshold) {\n      return 'up'\n    }\n  }\n  return 'none'\n}\n\n// must be created outside of the TinderCard forwardRef\nconst AnimatedDiv = animated.div\n\nconst TinderCard = React.forwardRef(\n  (\n    { flickOnSwipe = true, children, onSwipe, onCardLeftScreen, className, preventSwipe = [], swipeRequirementType = 'velocity', swipeThreshold = settings.swipeThreshold, onSwipeRequirementFulfilled, onSwipeRequirementUnfulfilled },\n    ref\n  ) => {\n    const { width, height } = useWindowSize()\n    const [{ xyrot }, setSpringTarget] = useSpring(() => ({\n      xyrot: [0, 0, 0],\n      config: physics.touchResponsive\n    }))\n\n    settings.swipeThreshold = swipeThreshold\n\n    React.useImperativeHandle(ref, () => ({\n      async swipe (dir = 'right') {\n        if (onSwipe) onSwipe(dir)\n        const power = 1.3\n        const disturbance = (Math.random() - 0.5) / 2\n        if (dir === 'right') {\n          await animateOut({ x: power, y: disturbance }, setSpringTarget, width, height)\n        } else if (dir === 'left') {\n          await animateOut({ x: -power, y: disturbance }, setSpringTarget, width, height)\n        } else if (dir === 'up') {\n          await animateOut({ x: disturbance, y: -power }, setSpringTarget, width, height)\n        } else if (dir === 'down') {\n          await animateOut({ x: disturbance, y: power }, setSpringTarget, width, height)\n        }\n        if (onCardLeftScreen) onCardLeftScreen(dir)\n      },\n      async restoreCard () {\n        await animateBack(setSpringTarget)\n      }\n    }))\n\n    const handleSwipeReleased = React.useCallback(\n      async (setSpringTarget, gesture) => {\n        // Check if this is a swipe\n        const dir = getSwipeDirection({\n          x: swipeRequirementType === 'velocity' ? gesture.vx : gesture.dx,\n          y: swipeRequirementType === 'velocity' ? gesture.vy : gesture.dy\n        })\n\n        if (dir !== 'none') {\n          if (flickOnSwipe) {\n            if (!preventSwipe.includes(dir)) {\n              if (onSwipe) onSwipe(dir)\n\n              await animateOut(swipeRequirementType === 'velocity' ? ({\n                x: gesture.vx,\n                y: gesture.vy\n              }) : (\n                normalize({ x: gesture.dx, y: gesture.dy }) // Normalize to avoid flicking the card away with super fast speed only direction is wanted here\n              ), setSpringTarget, width, height)\n              if (onCardLeftScreen) onCardLeftScreen(dir)\n              return\n            }\n          }\n        }\n\n        // Card was not flicked away, animate back to start\n        animateBack(setSpringTarget)\n      },\n      [swipeRequirementType, flickOnSwipe, preventSwipe, onSwipe, onCardLeftScreen, width, height]\n    )\n\n    let swipeThresholdFulfilledDirection = 'none'\n\n    const gestureStateFromWebEvent = (ev, startPositon, lastPosition, isTouch) => {\n      let dx = isTouch ? ev.touches[0].clientX - startPositon.x : ev.clientX - startPositon.x\n      let dy = isTouch ? ev.touches[0].clientY - startPositon.y : ev.clientY - startPositon.y\n\n      // We cant calculate velocity from the first event\n      if (startPositon.x === 0 && startPositon.y === 0) {\n        dx = 0\n        dy = 0\n      }\n\n      const vx = -(dx - lastPosition.dx) / (lastPosition.timeStamp - Date.now())\n      const vy = -(dy - lastPosition.dy) / (lastPosition.timeStamp - Date.now())\n\n      const gestureState = { dx, dy, vx, vy, timeStamp: Date.now() }\n      return gestureState\n    }\n\n    React.useLayoutEffect(() => {\n      let startPositon = { x: 0, y: 0 }\n      let lastPosition = { dx: 0, dy: 0, vx: 0, vy: 0, timeStamp: Date.now() }\n      let isClicking = false\n\n      const onTouchStart = (ev) => {\n        if (!ev.srcElement.className.includes('pressable') && ev.cancelable) {\n          ev.preventDefault()\n        }\n\n        const gestureState = gestureStateFromWebEvent(ev, startPositon, lastPosition, true)\n        lastPosition = gestureState\n        startPositon = { x: ev.touches[0].clientX, y: ev.touches[0].clientY }\n      }\n\n      element.current.addEventListener(('touchstart'), onTouchStart)\n\n      const onMouseDown = (ev) => {\n        isClicking = true\n        const gestureState = gestureStateFromWebEvent(ev, startPositon, lastPosition, false)\n        lastPosition = gestureState\n        startPositon = { x: ev.clientX, y: ev.clientY }\n      }\n\n      element.current.addEventListener(('mousedown'), onMouseDown)\n\n      const handleMove = (gestureState) => {\n        // Check fulfillment\n        if (onSwipeRequirementFulfilled || onSwipeRequirementUnfulfilled) {\n          const dir = getSwipeDirection({\n            x: swipeRequirementType === 'velocity' ? gestureState.vx : gestureState.dx,\n            y: swipeRequirementType === 'velocity' ? gestureState.vy : gestureState.dy\n          })\n          if (dir !== swipeThresholdFulfilledDirection) {\n            swipeThresholdFulfilledDirection = dir\n            if (swipeThresholdFulfilledDirection === 'none') {\n              if (onSwipeRequirementUnfulfilled) onSwipeRequirementUnfulfilled()\n            } else {\n              if (onSwipeRequirementFulfilled) onSwipeRequirementFulfilled(dir)\n            }\n          }\n        }\n\n        // use guestureState.vx / guestureState.vy for velocity calculations\n        // translate element\n        let rot = gestureState.vx * 15 // Magic number 15 looks about right\n        if (isNaN(rot)) rot = 0\n        rot = Math.max(Math.min(rot, settings.maxTilt), -settings.maxTilt)\n        setSpringTarget.start({ xyrot: [gestureState.dx, gestureState.dy, rot], config: physics.touchResponsive })\n      }\n\n      const onMouseMove = (ev) => {\n        if (!isClicking) return\n        const gestureState = gestureStateFromWebEvent(ev, startPositon, lastPosition, false)\n        lastPosition = gestureState\n        handleMove(gestureState)\n      }\n\n      window.addEventListener(('mousemove'), onMouseMove)\n\n      const onMouseUp = (ev) => {\n        if (!isClicking) return\n        isClicking = false\n        handleSwipeReleased(setSpringTarget, lastPosition)\n        startPositon = { x: 0, y: 0 }\n        lastPosition = { dx: 0, dy: 0, vx: 0, vy: 0, timeStamp: Date.now() }\n      }\n\n      window.addEventListener(('mouseup'), onMouseUp)\n\n      const onTouchMove = (ev) => {\n        const gestureState = gestureStateFromWebEvent(ev, startPositon, lastPosition, true)\n        lastPosition = gestureState\n        handleMove(gestureState)\n      }\n\n      element.current.addEventListener(('touchmove'), onTouchMove)\n\n      const onTouchEnd = (ev) => {\n        handleSwipeReleased(setSpringTarget, lastPosition)\n        startPositon = { x: 0, y: 0 }\n        lastPosition = { dx: 0, dy: 0, vx: 0, vy: 0, timeStamp: Date.now() }\n      }\n\n      element.current.addEventListener(('touchend'), onTouchEnd)\n\n      return () => {\n        element.current.removeEventListener(('touchstart'), onTouchStart)\n        element.current.removeEventListener(('touchmove'), onTouchMove)\n        element.current.removeEventListener(('touchend'), onTouchEnd)\n        window.removeEventListener(('mousemove'), onMouseMove)\n        window.removeEventListener(('mouseup'), onMouseUp)\n        element.current.removeEventListener(('mousedown'), onMouseDown)\n      }\n    }, [handleSwipeReleased, setSpringTarget, onSwipeRequirementFulfilled, onSwipeRequirementUnfulfilled])\n\n    const element = React.useRef()\n\n    return (\n      React.createElement(AnimatedDiv, {\n        ref: element,\n        className,\n        style: {\n          transform: xyrot.to((x, y, rot) => `translate3d(${x}px, ${y}px, ${0}px) rotate(${rot}deg)`)\n        },\n        children\n      })\n    )\n  }\n)\n\nmodule.exports = TinderCard\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKHNzcikvLi9ub2RlX21vZHVsZXMvcmVhY3QtdGluZGVyLWNhcmQvaW5kZXguanMiLCJtYXBwaW5ncyI6IkFBQUEsY0FBYyxtQkFBTyxDQUFDLHdHQUFPO0FBQzdCLFFBQVEsc0JBQXNCLEVBQUUsbUJBQU8sQ0FBQyxtRkFBbUI7QUFDM0Qsc0JBQXNCLG1CQUFPLENBQUMsZ0ZBQWlCOztBQUUvQztBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSxXQUFXO0FBQ1g7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLGNBQWM7QUFDZCxHQUFHOztBQUVIO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsNEJBQTRCLGdFQUFnRTtBQUM1RixHQUFHO0FBQ0g7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSxNQUFNO0FBQ047QUFDQTtBQUNBLElBQUk7QUFDSjtBQUNBO0FBQ0EsTUFBTTtBQUNOO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsTUFBTSxpT0FBaU87QUFDdk87QUFDQTtBQUNBLFlBQVksZ0JBQWdCO0FBQzVCLGFBQWEsT0FBTztBQUNwQjtBQUNBO0FBQ0EsS0FBSzs7QUFFTDs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSw2QkFBNkIsMEJBQTBCO0FBQ3ZELFVBQVU7QUFDViw2QkFBNkIsMkJBQTJCO0FBQ3hELFVBQVU7QUFDViw2QkFBNkIsMkJBQTJCO0FBQ3hELFVBQVU7QUFDViw2QkFBNkIsMEJBQTBCO0FBQ3ZEO0FBQ0E7QUFDQSxPQUFPO0FBQ1A7QUFDQTtBQUNBO0FBQ0EsS0FBSzs7QUFFTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxTQUFTOztBQUVUO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLGVBQWU7QUFDZiw0QkFBNEIsOEJBQThCO0FBQzFEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsT0FBTztBQUNQO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQSw2QkFBNkI7QUFDN0I7QUFDQTs7QUFFQTtBQUNBLDJCQUEyQjtBQUMzQiwyQkFBMkI7QUFDM0I7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLHlCQUF5QjtBQUN6Qjs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHlCQUF5QjtBQUN6Qjs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxXQUFXO0FBQ1g7QUFDQTtBQUNBO0FBQ0E7QUFDQSxjQUFjO0FBQ2Q7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGdDQUFnQyxpRkFBaUY7QUFDakg7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EseUJBQXlCO0FBQ3pCLHlCQUF5QjtBQUN6Qjs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQSx5QkFBeUI7QUFDekIseUJBQXlCO0FBQ3pCOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLOztBQUVMOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSw0REFBNEQsRUFBRSxNQUFNLEVBQUUsTUFBTSxFQUFFLGFBQWEsSUFBSTtBQUMvRixTQUFTO0FBQ1Q7QUFDQSxPQUFPO0FBQ1A7QUFDQTtBQUNBOztBQUVBIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vc3R1ZHltaW5nbGUvLi9ub2RlX21vZHVsZXMvcmVhY3QtdGluZGVyLWNhcmQvaW5kZXguanM/OTQ1ZiJdLCJzb3VyY2VzQ29udGVudCI6WyJjb25zdCBSZWFjdCA9IHJlcXVpcmUoJ3JlYWN0JylcbmNvbnN0IHsgdXNlU3ByaW5nLCBhbmltYXRlZCB9ID0gcmVxdWlyZSgnQHJlYWN0LXNwcmluZy93ZWInKVxuY29uc3QgdXNlV2luZG93U2l6ZSA9IHJlcXVpcmUoJy4vdXNlV2luZG93U2l6ZScpXG5cbmNvbnN0IHNldHRpbmdzID0ge1xuICBtYXhUaWx0OiAyNSwgLy8gaW4gZGVnXG4gIHJvdGF0aW9uUG93ZXI6IDUwLFxuICBzd2lwZVRocmVzaG9sZDogMC41IC8vIG5lZWQgdG8gdXBkYXRlIHRoaXMgdGhyZXNob2xkIGZvciBSTiAoMS41IHNlZW1zIHJlYXNvbmFibGUuLi4/KVxufVxuXG4vLyBwaHlzaWNhbCBwcm9wZXJ0aWVzIG9mIHRoZSBzcHJpbmdcbmNvbnN0IHBoeXNpY3MgPSB7XG4gIHRvdWNoUmVzcG9uc2l2ZToge1xuICAgIGZyaWN0aW9uOiA1MCxcbiAgICB0ZW5zaW9uOiAyMDAwXG4gIH0sXG4gIGFuaW1hdGVPdXQ6IHtcbiAgICBmcmljdGlvbjogMzAsXG4gICAgdGVuc2lvbjogNDAwXG4gIH0sXG4gIGFuaW1hdGVCYWNrOiB7XG4gICAgZnJpY3Rpb246IDEwLFxuICAgIHRlbnNpb246IDIwMFxuICB9XG59XG5cbmNvbnN0IHB5dGhhZ29yYXMgPSAoeCwgeSkgPT4ge1xuICByZXR1cm4gTWF0aC5zcXJ0KE1hdGgucG93KHgsIDIpICsgTWF0aC5wb3coeSwgMikpXG59XG5cbmNvbnN0IG5vcm1hbGl6ZSA9ICh2ZWN0b3IpID0+IHtcbiAgY29uc3QgbGVuZ3RoID0gTWF0aC5zcXJ0KE1hdGgucG93KHZlY3Rvci54LCAyKSArIE1hdGgucG93KHZlY3Rvci55LCAyKSlcbiAgcmV0dXJuIHsgeDogdmVjdG9yLnggLyBsZW5ndGgsIHk6IHZlY3Rvci55IC8gbGVuZ3RoIH1cbn1cblxuY29uc3QgYW5pbWF0ZU91dCA9IGFzeW5jIChnZXN0dXJlLCBzZXRTcHJpbmdUYXJnZXQsIHdpbmRvd0hlaWdodCwgd2luZG93V2lkdGgpID0+IHtcbiAgY29uc3QgZGlhZ29uYWwgPSBweXRoYWdvcmFzKHdpbmRvd0hlaWdodCwgd2luZG93V2lkdGgpXG4gIGNvbnN0IHZlbG9jaXR5ID0gcHl0aGFnb3JhcyhnZXN0dXJlLngsIGdlc3R1cmUueSlcbiAgY29uc3QgZmluYWxYID0gZGlhZ29uYWwgKiBnZXN0dXJlLnhcbiAgY29uc3QgZmluYWxZID0gZGlhZ29uYWwgKiBnZXN0dXJlLnlcbiAgY29uc3QgZmluYWxSb3RhdGlvbiA9IGdlc3R1cmUueCAqIDQ1XG4gIGNvbnN0IGR1cmF0aW9uID0gZGlhZ29uYWwgLyB2ZWxvY2l0eVxuXG4gIHNldFNwcmluZ1RhcmdldC5zdGFydCh7XG4gICAgeHlyb3Q6IFtmaW5hbFgsIGZpbmFsWSwgZmluYWxSb3RhdGlvbl0sXG4gICAgY29uZmlnOiB7IGR1cmF0aW9uOiBkdXJhdGlvbiB9XG4gIH0pXG5cbiAgLy8gZm9yIG5vdyBhbmltYXRlIGJhY2tcbiAgcmV0dXJuIGF3YWl0IG5ldyBQcm9taXNlKChyZXNvbHZlKSA9PlxuICAgIHNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgcmVzb2x2ZSgpXG4gICAgfSwgZHVyYXRpb24pXG4gIClcbn1cblxuY29uc3QgYW5pbWF0ZUJhY2sgPSAoc2V0U3ByaW5nVGFyZ2V0KSA9PiB7XG4gIC8vIHRyYW5zbGF0ZSBiYWNrIHRvIHRoZSBpbml0aWFsIHBvc2l0aW9uXG4gIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSkgPT4ge1xuICAgIHNldFNwcmluZ1RhcmdldC5zdGFydCh7IHh5cm90OiBbMCwgMCwgMF0sIGNvbmZpZzogcGh5c2ljcy5hbmltYXRlQmFjaywgb25SZXN0OiByZXNvbHZlIH0pXG4gIH0pXG59XG5cbmNvbnN0IGdldFN3aXBlRGlyZWN0aW9uID0gKHByb3BlcnR5KSA9PiB7XG4gIGlmIChNYXRoLmFicyhwcm9wZXJ0eS54KSA+IE1hdGguYWJzKHByb3BlcnR5LnkpKSB7XG4gICAgaWYgKHByb3BlcnR5LnggPiBzZXR0aW5ncy5zd2lwZVRocmVzaG9sZCkge1xuICAgICAgcmV0dXJuICdyaWdodCdcbiAgICB9IGVsc2UgaWYgKHByb3BlcnR5LnggPCAtc2V0dGluZ3Muc3dpcGVUaHJlc2hvbGQpIHtcbiAgICAgIHJldHVybiAnbGVmdCdcbiAgICB9XG4gIH0gZWxzZSB7XG4gICAgaWYgKHByb3BlcnR5LnkgPiBzZXR0aW5ncy5zd2lwZVRocmVzaG9sZCkge1xuICAgICAgcmV0dXJuICdkb3duJ1xuICAgIH0gZWxzZSBpZiAocHJvcGVydHkueSA8IC1zZXR0aW5ncy5zd2lwZVRocmVzaG9sZCkge1xuICAgICAgcmV0dXJuICd1cCdcbiAgICB9XG4gIH1cbiAgcmV0dXJuICdub25lJ1xufVxuXG4vLyBtdXN0IGJlIGNyZWF0ZWQgb3V0c2lkZSBvZiB0aGUgVGluZGVyQ2FyZCBmb3J3YXJkUmVmXG5jb25zdCBBbmltYXRlZERpdiA9IGFuaW1hdGVkLmRpdlxuXG5jb25zdCBUaW5kZXJDYXJkID0gUmVhY3QuZm9yd2FyZFJlZihcbiAgKFxuICAgIHsgZmxpY2tPblN3aXBlID0gdHJ1ZSwgY2hpbGRyZW4sIG9uU3dpcGUsIG9uQ2FyZExlZnRTY3JlZW4sIGNsYXNzTmFtZSwgcHJldmVudFN3aXBlID0gW10sIHN3aXBlUmVxdWlyZW1lbnRUeXBlID0gJ3ZlbG9jaXR5Jywgc3dpcGVUaHJlc2hvbGQgPSBzZXR0aW5ncy5zd2lwZVRocmVzaG9sZCwgb25Td2lwZVJlcXVpcmVtZW50RnVsZmlsbGVkLCBvblN3aXBlUmVxdWlyZW1lbnRVbmZ1bGZpbGxlZCB9LFxuICAgIHJlZlxuICApID0+IHtcbiAgICBjb25zdCB7IHdpZHRoLCBoZWlnaHQgfSA9IHVzZVdpbmRvd1NpemUoKVxuICAgIGNvbnN0IFt7IHh5cm90IH0sIHNldFNwcmluZ1RhcmdldF0gPSB1c2VTcHJpbmcoKCkgPT4gKHtcbiAgICAgIHh5cm90OiBbMCwgMCwgMF0sXG4gICAgICBjb25maWc6IHBoeXNpY3MudG91Y2hSZXNwb25zaXZlXG4gICAgfSkpXG5cbiAgICBzZXR0aW5ncy5zd2lwZVRocmVzaG9sZCA9IHN3aXBlVGhyZXNob2xkXG5cbiAgICBSZWFjdC51c2VJbXBlcmF0aXZlSGFuZGxlKHJlZiwgKCkgPT4gKHtcbiAgICAgIGFzeW5jIHN3aXBlIChkaXIgPSAncmlnaHQnKSB7XG4gICAgICAgIGlmIChvblN3aXBlKSBvblN3aXBlKGRpcilcbiAgICAgICAgY29uc3QgcG93ZXIgPSAxLjNcbiAgICAgICAgY29uc3QgZGlzdHVyYmFuY2UgPSAoTWF0aC5yYW5kb20oKSAtIDAuNSkgLyAyXG4gICAgICAgIGlmIChkaXIgPT09ICdyaWdodCcpIHtcbiAgICAgICAgICBhd2FpdCBhbmltYXRlT3V0KHsgeDogcG93ZXIsIHk6IGRpc3R1cmJhbmNlIH0sIHNldFNwcmluZ1RhcmdldCwgd2lkdGgsIGhlaWdodClcbiAgICAgICAgfSBlbHNlIGlmIChkaXIgPT09ICdsZWZ0Jykge1xuICAgICAgICAgIGF3YWl0IGFuaW1hdGVPdXQoeyB4OiAtcG93ZXIsIHk6IGRpc3R1cmJhbmNlIH0sIHNldFNwcmluZ1RhcmdldCwgd2lkdGgsIGhlaWdodClcbiAgICAgICAgfSBlbHNlIGlmIChkaXIgPT09ICd1cCcpIHtcbiAgICAgICAgICBhd2FpdCBhbmltYXRlT3V0KHsgeDogZGlzdHVyYmFuY2UsIHk6IC1wb3dlciB9LCBzZXRTcHJpbmdUYXJnZXQsIHdpZHRoLCBoZWlnaHQpXG4gICAgICAgIH0gZWxzZSBpZiAoZGlyID09PSAnZG93bicpIHtcbiAgICAgICAgICBhd2FpdCBhbmltYXRlT3V0KHsgeDogZGlzdHVyYmFuY2UsIHk6IHBvd2VyIH0sIHNldFNwcmluZ1RhcmdldCwgd2lkdGgsIGhlaWdodClcbiAgICAgICAgfVxuICAgICAgICBpZiAob25DYXJkTGVmdFNjcmVlbikgb25DYXJkTGVmdFNjcmVlbihkaXIpXG4gICAgICB9LFxuICAgICAgYXN5bmMgcmVzdG9yZUNhcmQgKCkge1xuICAgICAgICBhd2FpdCBhbmltYXRlQmFjayhzZXRTcHJpbmdUYXJnZXQpXG4gICAgICB9XG4gICAgfSkpXG5cbiAgICBjb25zdCBoYW5kbGVTd2lwZVJlbGVhc2VkID0gUmVhY3QudXNlQ2FsbGJhY2soXG4gICAgICBhc3luYyAoc2V0U3ByaW5nVGFyZ2V0LCBnZXN0dXJlKSA9PiB7XG4gICAgICAgIC8vIENoZWNrIGlmIHRoaXMgaXMgYSBzd2lwZVxuICAgICAgICBjb25zdCBkaXIgPSBnZXRTd2lwZURpcmVjdGlvbih7XG4gICAgICAgICAgeDogc3dpcGVSZXF1aXJlbWVudFR5cGUgPT09ICd2ZWxvY2l0eScgPyBnZXN0dXJlLnZ4IDogZ2VzdHVyZS5keCxcbiAgICAgICAgICB5OiBzd2lwZVJlcXVpcmVtZW50VHlwZSA9PT0gJ3ZlbG9jaXR5JyA/IGdlc3R1cmUudnkgOiBnZXN0dXJlLmR5XG4gICAgICAgIH0pXG5cbiAgICAgICAgaWYgKGRpciAhPT0gJ25vbmUnKSB7XG4gICAgICAgICAgaWYgKGZsaWNrT25Td2lwZSkge1xuICAgICAgICAgICAgaWYgKCFwcmV2ZW50U3dpcGUuaW5jbHVkZXMoZGlyKSkge1xuICAgICAgICAgICAgICBpZiAob25Td2lwZSkgb25Td2lwZShkaXIpXG5cbiAgICAgICAgICAgICAgYXdhaXQgYW5pbWF0ZU91dChzd2lwZVJlcXVpcmVtZW50VHlwZSA9PT0gJ3ZlbG9jaXR5JyA/ICh7XG4gICAgICAgICAgICAgICAgeDogZ2VzdHVyZS52eCxcbiAgICAgICAgICAgICAgICB5OiBnZXN0dXJlLnZ5XG4gICAgICAgICAgICAgIH0pIDogKFxuICAgICAgICAgICAgICAgIG5vcm1hbGl6ZSh7IHg6IGdlc3R1cmUuZHgsIHk6IGdlc3R1cmUuZHkgfSkgLy8gTm9ybWFsaXplIHRvIGF2b2lkIGZsaWNraW5nIHRoZSBjYXJkIGF3YXkgd2l0aCBzdXBlciBmYXN0IHNwZWVkIG9ubHkgZGlyZWN0aW9uIGlzIHdhbnRlZCBoZXJlXG4gICAgICAgICAgICAgICksIHNldFNwcmluZ1RhcmdldCwgd2lkdGgsIGhlaWdodClcbiAgICAgICAgICAgICAgaWYgKG9uQ2FyZExlZnRTY3JlZW4pIG9uQ2FyZExlZnRTY3JlZW4oZGlyKVxuICAgICAgICAgICAgICByZXR1cm5cbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICAvLyBDYXJkIHdhcyBub3QgZmxpY2tlZCBhd2F5LCBhbmltYXRlIGJhY2sgdG8gc3RhcnRcbiAgICAgICAgYW5pbWF0ZUJhY2soc2V0U3ByaW5nVGFyZ2V0KVxuICAgICAgfSxcbiAgICAgIFtzd2lwZVJlcXVpcmVtZW50VHlwZSwgZmxpY2tPblN3aXBlLCBwcmV2ZW50U3dpcGUsIG9uU3dpcGUsIG9uQ2FyZExlZnRTY3JlZW4sIHdpZHRoLCBoZWlnaHRdXG4gICAgKVxuXG4gICAgbGV0IHN3aXBlVGhyZXNob2xkRnVsZmlsbGVkRGlyZWN0aW9uID0gJ25vbmUnXG5cbiAgICBjb25zdCBnZXN0dXJlU3RhdGVGcm9tV2ViRXZlbnQgPSAoZXYsIHN0YXJ0UG9zaXRvbiwgbGFzdFBvc2l0aW9uLCBpc1RvdWNoKSA9PiB7XG4gICAgICBsZXQgZHggPSBpc1RvdWNoID8gZXYudG91Y2hlc1swXS5jbGllbnRYIC0gc3RhcnRQb3NpdG9uLnggOiBldi5jbGllbnRYIC0gc3RhcnRQb3NpdG9uLnhcbiAgICAgIGxldCBkeSA9IGlzVG91Y2ggPyBldi50b3VjaGVzWzBdLmNsaWVudFkgLSBzdGFydFBvc2l0b24ueSA6IGV2LmNsaWVudFkgLSBzdGFydFBvc2l0b24ueVxuXG4gICAgICAvLyBXZSBjYW50IGNhbGN1bGF0ZSB2ZWxvY2l0eSBmcm9tIHRoZSBmaXJzdCBldmVudFxuICAgICAgaWYgKHN0YXJ0UG9zaXRvbi54ID09PSAwICYmIHN0YXJ0UG9zaXRvbi55ID09PSAwKSB7XG4gICAgICAgIGR4ID0gMFxuICAgICAgICBkeSA9IDBcbiAgICAgIH1cblxuICAgICAgY29uc3QgdnggPSAtKGR4IC0gbGFzdFBvc2l0aW9uLmR4KSAvIChsYXN0UG9zaXRpb24udGltZVN0YW1wIC0gRGF0ZS5ub3coKSlcbiAgICAgIGNvbnN0IHZ5ID0gLShkeSAtIGxhc3RQb3NpdGlvbi5keSkgLyAobGFzdFBvc2l0aW9uLnRpbWVTdGFtcCAtIERhdGUubm93KCkpXG5cbiAgICAgIGNvbnN0IGdlc3R1cmVTdGF0ZSA9IHsgZHgsIGR5LCB2eCwgdnksIHRpbWVTdGFtcDogRGF0ZS5ub3coKSB9XG4gICAgICByZXR1cm4gZ2VzdHVyZVN0YXRlXG4gICAgfVxuXG4gICAgUmVhY3QudXNlTGF5b3V0RWZmZWN0KCgpID0+IHtcbiAgICAgIGxldCBzdGFydFBvc2l0b24gPSB7IHg6IDAsIHk6IDAgfVxuICAgICAgbGV0IGxhc3RQb3NpdGlvbiA9IHsgZHg6IDAsIGR5OiAwLCB2eDogMCwgdnk6IDAsIHRpbWVTdGFtcDogRGF0ZS5ub3coKSB9XG4gICAgICBsZXQgaXNDbGlja2luZyA9IGZhbHNlXG5cbiAgICAgIGNvbnN0IG9uVG91Y2hTdGFydCA9IChldikgPT4ge1xuICAgICAgICBpZiAoIWV2LnNyY0VsZW1lbnQuY2xhc3NOYW1lLmluY2x1ZGVzKCdwcmVzc2FibGUnKSAmJiBldi5jYW5jZWxhYmxlKSB7XG4gICAgICAgICAgZXYucHJldmVudERlZmF1bHQoKVxuICAgICAgICB9XG5cbiAgICAgICAgY29uc3QgZ2VzdHVyZVN0YXRlID0gZ2VzdHVyZVN0YXRlRnJvbVdlYkV2ZW50KGV2LCBzdGFydFBvc2l0b24sIGxhc3RQb3NpdGlvbiwgdHJ1ZSlcbiAgICAgICAgbGFzdFBvc2l0aW9uID0gZ2VzdHVyZVN0YXRlXG4gICAgICAgIHN0YXJ0UG9zaXRvbiA9IHsgeDogZXYudG91Y2hlc1swXS5jbGllbnRYLCB5OiBldi50b3VjaGVzWzBdLmNsaWVudFkgfVxuICAgICAgfVxuXG4gICAgICBlbGVtZW50LmN1cnJlbnQuYWRkRXZlbnRMaXN0ZW5lcigoJ3RvdWNoc3RhcnQnKSwgb25Ub3VjaFN0YXJ0KVxuXG4gICAgICBjb25zdCBvbk1vdXNlRG93biA9IChldikgPT4ge1xuICAgICAgICBpc0NsaWNraW5nID0gdHJ1ZVxuICAgICAgICBjb25zdCBnZXN0dXJlU3RhdGUgPSBnZXN0dXJlU3RhdGVGcm9tV2ViRXZlbnQoZXYsIHN0YXJ0UG9zaXRvbiwgbGFzdFBvc2l0aW9uLCBmYWxzZSlcbiAgICAgICAgbGFzdFBvc2l0aW9uID0gZ2VzdHVyZVN0YXRlXG4gICAgICAgIHN0YXJ0UG9zaXRvbiA9IHsgeDogZXYuY2xpZW50WCwgeTogZXYuY2xpZW50WSB9XG4gICAgICB9XG5cbiAgICAgIGVsZW1lbnQuY3VycmVudC5hZGRFdmVudExpc3RlbmVyKCgnbW91c2Vkb3duJyksIG9uTW91c2VEb3duKVxuXG4gICAgICBjb25zdCBoYW5kbGVNb3ZlID0gKGdlc3R1cmVTdGF0ZSkgPT4ge1xuICAgICAgICAvLyBDaGVjayBmdWxmaWxsbWVudFxuICAgICAgICBpZiAob25Td2lwZVJlcXVpcmVtZW50RnVsZmlsbGVkIHx8IG9uU3dpcGVSZXF1aXJlbWVudFVuZnVsZmlsbGVkKSB7XG4gICAgICAgICAgY29uc3QgZGlyID0gZ2V0U3dpcGVEaXJlY3Rpb24oe1xuICAgICAgICAgICAgeDogc3dpcGVSZXF1aXJlbWVudFR5cGUgPT09ICd2ZWxvY2l0eScgPyBnZXN0dXJlU3RhdGUudnggOiBnZXN0dXJlU3RhdGUuZHgsXG4gICAgICAgICAgICB5OiBzd2lwZVJlcXVpcmVtZW50VHlwZSA9PT0gJ3ZlbG9jaXR5JyA/IGdlc3R1cmVTdGF0ZS52eSA6IGdlc3R1cmVTdGF0ZS5keVxuICAgICAgICAgIH0pXG4gICAgICAgICAgaWYgKGRpciAhPT0gc3dpcGVUaHJlc2hvbGRGdWxmaWxsZWREaXJlY3Rpb24pIHtcbiAgICAgICAgICAgIHN3aXBlVGhyZXNob2xkRnVsZmlsbGVkRGlyZWN0aW9uID0gZGlyXG4gICAgICAgICAgICBpZiAoc3dpcGVUaHJlc2hvbGRGdWxmaWxsZWREaXJlY3Rpb24gPT09ICdub25lJykge1xuICAgICAgICAgICAgICBpZiAob25Td2lwZVJlcXVpcmVtZW50VW5mdWxmaWxsZWQpIG9uU3dpcGVSZXF1aXJlbWVudFVuZnVsZmlsbGVkKClcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgIGlmIChvblN3aXBlUmVxdWlyZW1lbnRGdWxmaWxsZWQpIG9uU3dpcGVSZXF1aXJlbWVudEZ1bGZpbGxlZChkaXIpXG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgLy8gdXNlIGd1ZXN0dXJlU3RhdGUudnggLyBndWVzdHVyZVN0YXRlLnZ5IGZvciB2ZWxvY2l0eSBjYWxjdWxhdGlvbnNcbiAgICAgICAgLy8gdHJhbnNsYXRlIGVsZW1lbnRcbiAgICAgICAgbGV0IHJvdCA9IGdlc3R1cmVTdGF0ZS52eCAqIDE1IC8vIE1hZ2ljIG51bWJlciAxNSBsb29rcyBhYm91dCByaWdodFxuICAgICAgICBpZiAoaXNOYU4ocm90KSkgcm90ID0gMFxuICAgICAgICByb3QgPSBNYXRoLm1heChNYXRoLm1pbihyb3QsIHNldHRpbmdzLm1heFRpbHQpLCAtc2V0dGluZ3MubWF4VGlsdClcbiAgICAgICAgc2V0U3ByaW5nVGFyZ2V0LnN0YXJ0KHsgeHlyb3Q6IFtnZXN0dXJlU3RhdGUuZHgsIGdlc3R1cmVTdGF0ZS5keSwgcm90XSwgY29uZmlnOiBwaHlzaWNzLnRvdWNoUmVzcG9uc2l2ZSB9KVxuICAgICAgfVxuXG4gICAgICBjb25zdCBvbk1vdXNlTW92ZSA9IChldikgPT4ge1xuICAgICAgICBpZiAoIWlzQ2xpY2tpbmcpIHJldHVyblxuICAgICAgICBjb25zdCBnZXN0dXJlU3RhdGUgPSBnZXN0dXJlU3RhdGVGcm9tV2ViRXZlbnQoZXYsIHN0YXJ0UG9zaXRvbiwgbGFzdFBvc2l0aW9uLCBmYWxzZSlcbiAgICAgICAgbGFzdFBvc2l0aW9uID0gZ2VzdHVyZVN0YXRlXG4gICAgICAgIGhhbmRsZU1vdmUoZ2VzdHVyZVN0YXRlKVxuICAgICAgfVxuXG4gICAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcigoJ21vdXNlbW92ZScpLCBvbk1vdXNlTW92ZSlcblxuICAgICAgY29uc3Qgb25Nb3VzZVVwID0gKGV2KSA9PiB7XG4gICAgICAgIGlmICghaXNDbGlja2luZykgcmV0dXJuXG4gICAgICAgIGlzQ2xpY2tpbmcgPSBmYWxzZVxuICAgICAgICBoYW5kbGVTd2lwZVJlbGVhc2VkKHNldFNwcmluZ1RhcmdldCwgbGFzdFBvc2l0aW9uKVxuICAgICAgICBzdGFydFBvc2l0b24gPSB7IHg6IDAsIHk6IDAgfVxuICAgICAgICBsYXN0UG9zaXRpb24gPSB7IGR4OiAwLCBkeTogMCwgdng6IDAsIHZ5OiAwLCB0aW1lU3RhbXA6IERhdGUubm93KCkgfVxuICAgICAgfVxuXG4gICAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcigoJ21vdXNldXAnKSwgb25Nb3VzZVVwKVxuXG4gICAgICBjb25zdCBvblRvdWNoTW92ZSA9IChldikgPT4ge1xuICAgICAgICBjb25zdCBnZXN0dXJlU3RhdGUgPSBnZXN0dXJlU3RhdGVGcm9tV2ViRXZlbnQoZXYsIHN0YXJ0UG9zaXRvbiwgbGFzdFBvc2l0aW9uLCB0cnVlKVxuICAgICAgICBsYXN0UG9zaXRpb24gPSBnZXN0dXJlU3RhdGVcbiAgICAgICAgaGFuZGxlTW92ZShnZXN0dXJlU3RhdGUpXG4gICAgICB9XG5cbiAgICAgIGVsZW1lbnQuY3VycmVudC5hZGRFdmVudExpc3RlbmVyKCgndG91Y2htb3ZlJyksIG9uVG91Y2hNb3ZlKVxuXG4gICAgICBjb25zdCBvblRvdWNoRW5kID0gKGV2KSA9PiB7XG4gICAgICAgIGhhbmRsZVN3aXBlUmVsZWFzZWQoc2V0U3ByaW5nVGFyZ2V0LCBsYXN0UG9zaXRpb24pXG4gICAgICAgIHN0YXJ0UG9zaXRvbiA9IHsgeDogMCwgeTogMCB9XG4gICAgICAgIGxhc3RQb3NpdGlvbiA9IHsgZHg6IDAsIGR5OiAwLCB2eDogMCwgdnk6IDAsIHRpbWVTdGFtcDogRGF0ZS5ub3coKSB9XG4gICAgICB9XG5cbiAgICAgIGVsZW1lbnQuY3VycmVudC5hZGRFdmVudExpc3RlbmVyKCgndG91Y2hlbmQnKSwgb25Ub3VjaEVuZClcblxuICAgICAgcmV0dXJuICgpID0+IHtcbiAgICAgICAgZWxlbWVudC5jdXJyZW50LnJlbW92ZUV2ZW50TGlzdGVuZXIoKCd0b3VjaHN0YXJ0JyksIG9uVG91Y2hTdGFydClcbiAgICAgICAgZWxlbWVudC5jdXJyZW50LnJlbW92ZUV2ZW50TGlzdGVuZXIoKCd0b3VjaG1vdmUnKSwgb25Ub3VjaE1vdmUpXG4gICAgICAgIGVsZW1lbnQuY3VycmVudC5yZW1vdmVFdmVudExpc3RlbmVyKCgndG91Y2hlbmQnKSwgb25Ub3VjaEVuZClcbiAgICAgICAgd2luZG93LnJlbW92ZUV2ZW50TGlzdGVuZXIoKCdtb3VzZW1vdmUnKSwgb25Nb3VzZU1vdmUpXG4gICAgICAgIHdpbmRvdy5yZW1vdmVFdmVudExpc3RlbmVyKCgnbW91c2V1cCcpLCBvbk1vdXNlVXApXG4gICAgICAgIGVsZW1lbnQuY3VycmVudC5yZW1vdmVFdmVudExpc3RlbmVyKCgnbW91c2Vkb3duJyksIG9uTW91c2VEb3duKVxuICAgICAgfVxuICAgIH0sIFtoYW5kbGVTd2lwZVJlbGVhc2VkLCBzZXRTcHJpbmdUYXJnZXQsIG9uU3dpcGVSZXF1aXJlbWVudEZ1bGZpbGxlZCwgb25Td2lwZVJlcXVpcmVtZW50VW5mdWxmaWxsZWRdKVxuXG4gICAgY29uc3QgZWxlbWVudCA9IFJlYWN0LnVzZVJlZigpXG5cbiAgICByZXR1cm4gKFxuICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChBbmltYXRlZERpdiwge1xuICAgICAgICByZWY6IGVsZW1lbnQsXG4gICAgICAgIGNsYXNzTmFtZSxcbiAgICAgICAgc3R5bGU6IHtcbiAgICAgICAgICB0cmFuc2Zvcm06IHh5cm90LnRvKCh4LCB5LCByb3QpID0+IGB0cmFuc2xhdGUzZCgke3h9cHgsICR7eX1weCwgJHswfXB4KSByb3RhdGUoJHtyb3R9ZGVnKWApXG4gICAgICAgIH0sXG4gICAgICAgIGNoaWxkcmVuXG4gICAgICB9KVxuICAgIClcbiAgfVxuKVxuXG5tb2R1bGUuZXhwb3J0cyA9IFRpbmRlckNhcmRcbiJdLCJuYW1lcyI6W10sInNvdXJjZVJvb3QiOiIifQ==\n//# sourceURL=webpack-internal:///(ssr)/./node_modules/react-tinder-card/index.js\n");

/***/ }),

/***/ "(ssr)/./node_modules/react-tinder-card/useWindowSize.js":
/*!*********************************************************!*\
  !*** ./node_modules/react-tinder-card/useWindowSize.js ***!
  \*********************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

eval("const { useState, useEffect } = __webpack_require__(/*! react */ \"(ssr)/./node_modules/next/dist/server/future/route-modules/app-page/vendored/ssr/react.js\")\n\n// this hook ensures that window size is only updated on the client and not on the server when using Next.js\nfunction useWindowSize () {\n  const [windowSize, setWindowSize] = useState({\n    width: undefined,\n    height: undefined\n  })\n\n  useEffect(() => {\n    function handleResize () {\n      setWindowSize({\n        width: window.innerWidth,\n        height: window.innerHeight\n      })\n    }\n    window.addEventListener('resize', handleResize)\n    handleResize()\n\n    return () => window.removeEventListener('resize', handleResize)\n  }, [])\n  return windowSize\n}\n\nmodule.exports = useWindowSize\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKHNzcikvLi9ub2RlX21vZHVsZXMvcmVhY3QtdGluZGVyLWNhcmQvdXNlV2luZG93U2l6ZS5qcyIsIm1hcHBpbmdzIjoiQUFBQSxRQUFRLHNCQUFzQixFQUFFLG1CQUFPLENBQUMsd0dBQU87O0FBRS9DO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxHQUFHOztBQUVIO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxPQUFPO0FBQ1A7QUFDQTtBQUNBOztBQUVBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7O0FBRUEiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9zdHVkeW1pbmdsZS8uL25vZGVfbW9kdWxlcy9yZWFjdC10aW5kZXItY2FyZC91c2VXaW5kb3dTaXplLmpzPzFiMWQiXSwic291cmNlc0NvbnRlbnQiOlsiY29uc3QgeyB1c2VTdGF0ZSwgdXNlRWZmZWN0IH0gPSByZXF1aXJlKCdyZWFjdCcpXG5cbi8vIHRoaXMgaG9vayBlbnN1cmVzIHRoYXQgd2luZG93IHNpemUgaXMgb25seSB1cGRhdGVkIG9uIHRoZSBjbGllbnQgYW5kIG5vdCBvbiB0aGUgc2VydmVyIHdoZW4gdXNpbmcgTmV4dC5qc1xuZnVuY3Rpb24gdXNlV2luZG93U2l6ZSAoKSB7XG4gIGNvbnN0IFt3aW5kb3dTaXplLCBzZXRXaW5kb3dTaXplXSA9IHVzZVN0YXRlKHtcbiAgICB3aWR0aDogdW5kZWZpbmVkLFxuICAgIGhlaWdodDogdW5kZWZpbmVkXG4gIH0pXG5cbiAgdXNlRWZmZWN0KCgpID0+IHtcbiAgICBmdW5jdGlvbiBoYW5kbGVSZXNpemUgKCkge1xuICAgICAgc2V0V2luZG93U2l6ZSh7XG4gICAgICAgIHdpZHRoOiB3aW5kb3cuaW5uZXJXaWR0aCxcbiAgICAgICAgaGVpZ2h0OiB3aW5kb3cuaW5uZXJIZWlnaHRcbiAgICAgIH0pXG4gICAgfVxuICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdyZXNpemUnLCBoYW5kbGVSZXNpemUpXG4gICAgaGFuZGxlUmVzaXplKClcblxuICAgIHJldHVybiAoKSA9PiB3aW5kb3cucmVtb3ZlRXZlbnRMaXN0ZW5lcigncmVzaXplJywgaGFuZGxlUmVzaXplKVxuICB9LCBbXSlcbiAgcmV0dXJuIHdpbmRvd1NpemVcbn1cblxubW9kdWxlLmV4cG9ydHMgPSB1c2VXaW5kb3dTaXplXG4iXSwibmFtZXMiOltdLCJzb3VyY2VSb290IjoiIn0=\n//# sourceURL=webpack-internal:///(ssr)/./node_modules/react-tinder-card/useWindowSize.js\n");

/***/ })

};
;