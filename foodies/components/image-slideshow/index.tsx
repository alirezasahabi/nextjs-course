/**
 * NextJS knows React server componets & client components.
 * In all the vanila React apps which we're building with help of create-react-app or Vite,
 * we're using client components. Because in those projects, React is a pure client-side library,
 * running code in browser on the client.
 * Server componet is a feature built into React, but it must be unlocked
 * with certain build process & structure.
 * 
 * But NextJS is a fullstack framework & by default all components are server-side in that.
 * With server components, we have less client side JS code that must be downloaded
 * which improves performance & also they're great for SEO because web search crawlers
 * now see pages that contain the complete finished content(In vanila React apps
 * if we look at the source code of a page we'll see an empty page; basically a "div" with id of "root".
 * Because all the content is created & populated on the client side. The content of that "div"
 * will be visible based on the path we're in).
 *  Server components can't listen to browser events(click, change, submit,...)
 * They can't access browsers APIs(localStorage, sessionStorage,...)
 * They can't maintain state or use effects.
 * These functionalities are only available in client components.
 * In real world apps we use a mixture of server & client components.
 * We default to server components & use client components only necessary.
 * To make a component, a client component we add 'use client' at the top.
 * If this component is dependent on the other components
 * those components will automatically become client component.
 */

"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

import burgerImg from "@/assets/burger.jpg";
import curryImg from "@/assets/curry.jpg";
import dumplingsImg from "@/assets/dumplings.jpg";
import macncheeseImg from "@/assets/macncheese.jpg";
import pizzaImg from "@/assets/pizza.jpg";
import schnitzelImg from "@/assets/schnitzel.jpg";
import tomatoSaladImg from "@/assets/tomato-salad.jpg";
import classes from "./image-slideshow.module.css";

const images = [
  { image: burgerImg, alt: "A delicious, juicy burger" },
  { image: curryImg, alt: "A delicious, spicy curry" },
  { image: dumplingsImg, alt: "Steamed dumplings" },
  { image: macncheeseImg, alt: "Mac and cheese" },
  { image: pizzaImg, alt: "A delicious pizza" },
  { image: schnitzelImg, alt: "A delicious schnitzel" },
  { image: tomatoSaladImg, alt: "A delicious tomato salad" },
];

export default function ImageSlideshow() {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) =>
        prevIndex < images.length - 1 ? prevIndex + 1 : 0
      );
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className={classes.slideshow}>
      {images.map((image, index) => (
        <Image
          key={index}
          src={image.image}
          className={index === currentImageIndex ? classes.active : ""}
          alt={image.alt}
        />
      ))}
    </div>
  );
}
