import productImg01 from "../images/double-sofa-01.png";
import productImg02 from "../images/double-sofa-02.png";
import productImg03 from "../images/double-sofa-03.png";

import productImg04 from "../images/single-sofa-01.jpg";
import productImg05 from "../images/single-sofa-02.jpg";
import productImg06 from "../images/single-sofa-03.jpg";
import productImg007 from "../images/single-sofa-04.png";

import productImg07 from "../images/arm-chair-01.jpg";
import productImg08 from "../images/arm-chair-02.jpg";
import productImg09 from "../images/arm-chair-03.jpg";
import productImg10 from "../images/arm-chair-01.jpg";

import productImg13 from "../images/phone-01.jpg";
import productImg14 from "../images/phone-02.jpg";
import productImg15 from "../images/phone-03.jpg";
import productImg16 from "../images/phone-04.jpg";
import productImg17 from "../images/phone-05.jpg";
import productImg18 from "../images/phone-06.jpg";

import productImg19 from "../images/watch-01.jpg";
import productImg20 from "../images/watch-02.jpg";
import productImg21 from "../images/watch-03.jpg";
import productImg22 from "../images/watch-04.jpg";

import productImg23 from "../images/wireless-01.jpg";
import productImg25 from "../images/wireless-03.jpg";

import type { Product, Review } from "@/models/product";

/**
 * Helper function to create a review object with custom text.
 */
const createReview = (rating: number, text: string): Review => ({ rating, text });



const products: Product[] = [
  {
    id: "01",
    productName: "Stone and Beam Westview",
    imgUrl: productImg01,
    category: "sofa",
    price: 193,
    shortDesc: "A sturdy hardwood-frame sofa featuring plush cushions for ultimate family comfort.",
    description: "The Stone and Beam Westview sofa combines classic craftsmanship with everyday durability. Designed with high-resiliency foam cushions and a solid hardwood frame, it offers long-lasting support and timeless elegance for your living room.",
    reviews: [createReview(4.7, "Extremely comfortable and sturdy build.")],
    avgRating: 4.5,
  },
  {
    id: "02",
    productName: "Rivet Bigelow Modern",
    imgUrl: productImg02,
    category: "sofa",
    price: 253,
    shortDesc: "Sleek mid-century design with tapered legs and luxurious upholstery.",
    description: "Bring a touch of vintage flair to your home with the Rivet Bigelow Modern sofa. Featuring clean lines, soft yet supportive cushioning, and durable wooden legs, it is an ideal centerpiece for contemporary living spaces.",
    reviews: [createReview(4.8, "Looks even better in person!"), createReview(4.8, "Very stylish and cozy.")],
    avgRating: 4.7,
  },
  {
    id: "03",
    productName: "Amazon Brand Modern Sofa",
    imgUrl: productImg03,
    category: "sofa",
    price: 173,
    shortDesc: "Minimalist and compact design tailored for apartments and urban spaces.",
    description: "This modern sofa offers smart space-saving proportions without sacrificing comfort. Wrapped in breathable, high-grade fabric with an engineered wood frame, it provides reliable daily seating with effortless style.",
    reviews: [createReview(4.6, "Perfect size for my studio apartment."), createReview(4.9, "Great value for money.")],
    avgRating: 4.7,
  },
  {
    id: "26",
    productName: "Rivet Bigelow Modern",
    imgUrl: productImg02,
    category: "sofa",
    price: 253,
    shortDesc: "Sleek mid-century design with tapered legs and luxurious upholstery.",
    description: "Bring a touch of vintage flair to your home with the Rivet Bigelow Modern sofa. Featuring clean lines, soft yet supportive cushioning, and durable wooden legs, it is an ideal centerpiece for contemporary living spaces.",
    reviews: [createReview(4.8, "Amazing quality finish."), createReview(4.8, "Very comfortable.")],
    avgRating: 4.7,
  },
  {
    id: "04",
    productName: "Fluffy Sheep Sofa",
    imgUrl: productImg04,
    category: "sofa",
    price: 163,
    shortDesc: "Ultra-soft textured fabric finish designed for maximum relaxation.",
    description: "Indulge in cozy comfort with the Fluffy Sheep Sofa. Its plush, textured upholstery feels exceptionally soft against the skin, making it the ultimate lounging spot for reading or unwinding after a long day.",
    reviews: [createReview(4.6, "So soft and cozy!"), createReview(4.9, "Everyone who visits asks where I got it.")],
    avgRating: 4.7,
  },
  {
    id: "05",
    productName: "Faux Velvet Sofa",
    imgUrl: productImg05,
    category: "sofa",
    price: 163,
    shortDesc: "Rich velvet texture offering a luxurious look and plush seating experience.",
    description: "Elevate your interior decor with the elegant sheen of our Faux Velvet Sofa. Crafted with dense padding and premium velvet fabric, it adds a sophisticated and chic accent to modern and eclectic rooms.",
    reviews: [createReview(4.6, "Gorgeous fabric and color."), createReview(4.9, "Feels very luxurious.")],
    avgRating: 4.7,
  },
  {
    id: "06",
    productName: "Fluffy Sheep Sofa",
    imgUrl: productImg06,
    category: "sofa",
    price: 163,
    shortDesc: "Ultra-soft textured fabric finish designed for maximum relaxation.",
    description: "Indulge in cozy comfort with the Fluffy Sheep Sofa. Its plush, textured upholstery feels exceptionally soft against the skin, making it the ultimate lounging spot for reading or unwinding after a long day.",
    reviews: [createReview(4.6, "Love the texture!"), createReview(4.9, "Super comfortable.")],
    avgRating: 4.7,
  },
  {
    id: "07",
    productName: "Sakarias Armchair",
    imgUrl: productImg07,
    category: "chair",
    price: 99,
    shortDesc: "Ergonomic armchair designed to provide exceptional back support and style.",
    description: "The Sakarias Armchair blends ergonomic contouring with elegant aesthetics. Whether placed in a reading nook or as an accent piece in your living room, it delivers reliable comfort and graceful style.",
    reviews: [createReview(4.6, "Great reading chair."), createReview(4.9, "Very easy to assemble.")],
    avgRating: 4.7,
  },
  {
    id: "27",
    productName: "Modern Arm Sofa",
    imgUrl: productImg007,
    category: "sofa",
    price: 173,
    shortDesc: "Compact single-arm sofa built for modern lounge areas.",
    description: "A sleek and versatile seating solution, the Modern Arm Sofa features a streamlined profile and supportive cushions. Perfect for compact spaces looking for a clean, contemporary aesthetic.",
    reviews: [createReview(4.6, "Fits perfectly in my office."), createReview(4.9, "Sturdy and neat.")],
    avgRating: 4.7,
  },
  {
    id: "08",
    productName: "Baltsar Chair",
    imgUrl: productImg08,
    category: "chair",
    price: 89,
    shortDesc: "Lightweight, contemporary accent chair with sturdy wooden legs.",
    description: "The Baltsar Chair offers clean Scandinavian design lines and reliable durability. Its lightweight structure makes it easy to reposition around your home while maintaining a chic decorative appeal.",
    reviews: [createReview(4.6, "Lightweight yet sturdy."), createReview(4.9, "Clean minimalist look.")],
    avgRating: 4.7,
  },
  {
    id: "09",
    productName: "Helmar Chair",
    imgUrl: productImg09,
    category: "chair",
    price: 112,
    shortDesc: "Padded accent chair featuring deep cushioning and durable upholstery.",
    description: "Designed for prolonged seating comfort, the Helmar Chair features generous padding and robust construction. It serves as a stylish and comfortable addition to dining areas or study rooms.",
    reviews: [createReview(4.6, "Very comfortable seat padding."), createReview(4.9, "High quality build.")],
    avgRating: 4.7,
  },
  {
    id: "10",
    productName: "Apple iPhone 12 Pro",
    imgUrl: productImg13,
    category: "mobile",
    price: 799,
    shortDesc: "Advanced dual-camera system, A14 Bionic chip, and brilliant Super Retina XDR display.",
    description: "The Apple iPhone 12 Pro delivers lightning-fast performance and pro-grade photography capabilities. Equipped with Night mode, Ceramic Shield front cover, and immersive display technology, it is built to perform brilliantly.",
    reviews: [createReview(4.8, "Camera quality is incredible."), createReview(4.9, "Fast and reliable phone.")],
    avgRating: 4.8,
  },
  {
    id: "25",
    productName: "Sakarias Armchair",
    imgUrl: productImg10,
    category: "chair",
    price: 99,
    shortDesc: "Ergonomic armchair designed to provide exceptional back support and style.",
    description: "The Sakarias Armchair blends ergonomic contouring with elegant aesthetics. Whether placed in a reading nook or as an accent piece in your living room, it delivers reliable comfort and graceful style.",
    reviews: [createReview(4.6, "Very cozy chair."), createReview(4.9, "Great craftsmanship.")],
    avgRating: 4.7,
  },
  {
    id: "11",
    productName: "Apple iPhone 12 Max",
    imgUrl: productImg14,
    category: "mobile",
    price: 799,
    shortDesc: "Large-screen flagship smartphone with exceptional battery life and fluid performance.",
    description: "Experience expansive visuals and powerful processing with the iPhone 12 Max. Featuring a stunning large OLED display, advanced camera optics, and long-lasting battery capacity for all-day productivity.",
    reviews: [createReview(4.8, "Love the big screen size."), createReview(4.9, "Battery lasts all day.")],
    avgRating: 4.8,
  },
  {
    id: "12",
    productName: "Realme 8",
    imgUrl: productImg15,
    category: "mobile",
    price: 599,
    shortDesc: "Vibrant Super AMOLED display and fast-charging capabilities in a slim profile.",
    description: "The Realme 8 is engineered for speed and clarity, featuring a vivid display, capable multi-lens camera setup, and rapid battery charging support to keep up with your active lifestyle.",
    reviews: [createReview(4.8, "Super fast charging speed!"), createReview(4.9, "Great budget flagship killer.")],
    avgRating: 4.8,
  },
  {
    id: "13",
    productName: "One Plus Nord",
    imgUrl: productImg16,
    category: "mobile",
    price: 799,
    shortDesc: "Smooth 90Hz fluid AMOLED display and robust Snapdragon performance.",
    description: "OnePlus Nord delivers flagship-level smoothness and premium photography features at an accessible price. Enjoy a seamless user experience, fast multitasking, and clean software.",
    reviews: [createReview(4.8, "Screen smoothness is top notch."), createReview(4.9, "OxygenOS is amazing.")],
    avgRating: 4.8,
  },
  {
    id: "14",
    productName: "Apple iPhone 13 Pro",
    imgUrl: productImg17,
    category: "mobile",
    price: 899,
    shortDesc: "Pro camera system with macro photography, Cinematic mode, and ProMotion display.",
    description: "The iPhone 13 Pro pushes the boundaries of smartphone capability with its breakthrough ProMotion display, lightning-fast A15 Bionic chip, and professional-grade video recording features.",
    reviews: [createReview(4.8, "Cinematic mode is mind-blowing."), createReview(4.9, "Battery life is a huge upgrade.")],
    avgRating: 4.8,
  },
  {
    id: "15",
    productName: "Samsung Galaxy S22",
    imgUrl: productImg18,
    category: "mobile",
    price: 699,
    shortDesc: "Dynamic AMOLED 2X display, nightography camera, and sleek armor aluminum frame.",
    description: "The Samsung Galaxy S22 combines cutting-edge mobile innovation with a refined design. Capture stunning low-light photos and enjoy ultra-smooth scrolling on a brilliant, vibrant display.",
    reviews: [createReview(4.8, "Display colors are gorgeous."), createReview(4.9, "Compact and powerful.")],
    avgRating: 4.8,
  },
  {
    id: "16",
    productName: "Rolex Watch",
    imgUrl: productImg19,
    category: "watch",
    price: 299,
    shortDesc: "Timeless luxury timepiece crafted with precision automatic movement.",
    description: "An iconic symbol of status and precision engineering, this luxury timepiece features robust stainless steel construction, a sophisticated dial, and dependable Swiss automatic movement.",
    reviews: [createReview(4.8, "Looks extremely prestigious."), createReview(4.9, "Immaculate craftsmanship.")],
    avgRating: 4.8,
  },
  {
    id: "17",
    productName: "Timex Easy Reader Watch",
    imgUrl: productImg20,
    category: "watch",
    price: 299,
    shortDesc: "Classic casual watch featuring clear Arabic numerals and INDIGLO backlight.",
    description: "The Timex Easy Reader offers effortless readability and classic everyday style. Equipped with a genuine leather strap and reliable quartz movement, it is a dependable companion for any occasion.",
    reviews: [createReview(4.8, "Very easy to read at night."), createReview(4.9, "Classic and comfortable.")],
    avgRating: 4.8,
  },
  {
    id: "18",
    productName: "Rolex Watch",
    imgUrl: productImg21,
    category: "watch",
    price: 299,
    shortDesc: "Exquisite luxury wrist watch with sophisticated dial detailing.",
    description: "Blending elegance with enduring performance, this luxury watch makes a bold statement on the wrist. Built with scratch-resistant crystal and high-grade materials for lasting durability.",
    reviews: [createReview(4.8, "Stunning design details."), createReview(4.9, "Keeps perfect time.")],
    avgRating: 4.8,
  },
  {
    id: "19",
    productName: "Apple Watch",
    imgUrl: productImg22,
    category: "watch",
    price: 399,
    shortDesc: "Advanced fitness tracking, ECG monitoring, and seamless notifications on your wrist.",
    description: "Stay connected, active, and healthy with the Apple Watch. Featuring comprehensive workout metrics, blood oxygen sensing, and a brilliant always-on retina display.",
    reviews: [createReview(4.8, "Great for workout tracking."), createReview(4.9, "Integration with iPhone is seamless.")],
    avgRating: 4.8,
  },
  {
    id: "20",
    productName: "Beat Studio Wireless",
    imgUrl: productImg23,
    category: "wireless",
    price: 199,
    shortDesc: "Active Noise Cancelling (ANC) headphones with premium acoustics and deep bass.",
    description: "Immerse yourself in pure sound with Beat Studio Wireless headphones. Featuring real-time audio calibration, long battery life, and plush over-ear cushions for all-day listening comfort.",
    reviews: [createReview(4.8, "Noise cancellation works great."), createReview(4.9, "Deep bass and clear highs.")],
    avgRating: 4.8,
  },
  {
    id: "22",
    productName: "Beat EP Headphones",
    imgUrl: productImg25,
    category: "wireless",
    price: 199,
    shortDesc: "Battery-free sleek on-ear headphones delivering masterfully tuned sound.",
    description: "The Beat EP headphones offer battery-free lightweight listening with robust durability. Engineered with stainless steel reinforcement and crisp acoustic performance for music lovers.",
    reviews: [createReview(4.8, "Love that they don't need charging."), createReview(4.9, "Very clear sound quality.")],
    avgRating: 4.8,
  },
];

export default products;
