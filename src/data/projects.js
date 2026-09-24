import islandImg from '../assets/images/projects/island.png'
import todoImg from '../assets/images/projects/todo.jpg'
import biezyImg from '../assets/images/projects/biezy.png'
import modernImg from '../assets/images/projects/modern.png'
import echoviceImg from '../assets/images/projects/echovice.png'
import periodontImg from '../assets/images/projects/periodontImage.png'
import mediprax from '../assets/images/projects/mediprax.png'
import hallgrenskoreskole from '../assets/images/projects/hallgrenskoreskole.png'
import pnregnskab from '../assets/images/projects/pnregnskab.png'
import paprika from '../assets/images/projects/paprika.png'
import diningbymanan from '../assets/images/projects/diningbymanan.png'
import masala from '../assets/images/projects/masala.png'
import tandooribbq from '../assets/images/projects/tandooribbq.png'

const hoverPalette = [
  'rgb(156, 83, 83)',
  'rgb(83, 127, 156)',
  'rgb(98, 156, 83)',
  'rgb(123, 83, 156)'
]

const getHoverColorById = (id) => {
  return hoverPalette[(id * 17 + 5) % hoverPalette.length]
}

const rawProjects = [
 {
    id: 1,
    title: 'Webdesign - paprika',
    description: "For Restaurant Paprika, I designed a complete digital experience that brings together the restaurant’s rich history, Indian and Pakistani cuisine, and wide range of dining experiences. The goal was to communicate the personality and heritage behind the restaurant while making the menu, takeaway, dining options, and events easy to explore. Through a bold visual direction, clear information architecture, and thoughtful UX, I created a website concept that connects Paprika’s traditional roots with a modern and engaging digital experience. - <strong>Designed at næmt.nu</strong>",
    image: paprika,
    link: 'https://www.restaurantpaprika.dk/'
  },
  {
    id: 2,
    title: 'Webdesign - Dining by Manan',
    description: "For Dining by Manan, I designed a complete digital experience that brings the brand’s three kitchens and diverse dining experiences together in one cohesive platform. The goal was to communicate the personality behind the kitchens while making the different concepts, services, and booking options easy to explore. Through a bold visual direction, clear information architecture, and thoughtful UX, I created a website concept that connects the different experiences while guiding visitors naturally toward discovering the food and getting in touch. - <strong>Designed at næmt.nu</strong>",
    image: diningbymanan,
    link: 'https://diningbymanan.dk/'
  },
  {
    id: 3,
    title: 'Webdesign - Masala Corner',
    description: "For Masala Corner, I designed a complete digital experience focused on bringing the brand’s authentic Indian street food concept to life. The goal was to showcase the food, story, and unique character of the restaurant while making the menu and practical information easy to explore. Through a bold visual direction, clear content structure, and thoughtful UX, I created a website concept that reflects the atmosphere of Storms Pakhus and naturally guides visitors from discovering the concept to exploring the menu. - <strong>Designed at næmt.nu</strong>",
    image: masala,
    link: 'https://masalacorner.dk/'
  },
  {
    id: 4,
    title: 'Webdesign - TandooriBBQ',
    description: "For Tandoori BBQ, I designed a complete digital experience focused on capturing the restaurant’s bold, authentic, and informal identity. The goal was to showcase the concept around tandoor-grilled food while making the menu, dishes, location, and story easy to explore. Through a strong visual direction, clear content structure, and thoughtful UX, I created a website concept that reflects the energy of the restaurant while guiding visitors naturally from discovering the food to finding their way to Tandoori BBQ. - <strong>Designed at næmt.nu</strong>",
    image: tandooribbq,
    link: 'https://tandooribbq.dk/'
  },
  {
    id: 5,
    title: 'Webdesign - PN-bogholder',
    description: "For PN Regnskabskonsulent, I designed a complete digital experience focused on creating a professional, approachable, and trustworthy platform for small and medium-sized businesses. The goal was to communicate the company’s extensive experience while making complex accounting services easy to understand and navigate. Through a clear information structure, thoughtful UX, and a clean, modern visual design, I created a website concept that builds trust, highlights the personal approach, and guides visitors naturally toward getting in touch. - <strong>Designed at næmt.nu</strong>",
    image: pnregnskab,
    link: 'https://pn-bogholder.dk/'
  },
  {
    id: 6,
    title: 'Webdesign - Hallgrenskoreskole',
    description: "For Hallgrens Køreskole, I designed a complete digital experience focused on creating a personal, approachable, and trustworthy platform for new and returning drivers. The goal was to communicate the school’s personal approach while making information about lessons, pricing, and the journey toward a driver’s licence easy to understand and navigate. Through thoughtful UX, clear information architecture, and a modern visual design, I created a website concept that builds confidence, simplifies the user journey, and guides visitors naturally toward signing up. - <strong>Designed at næmt.nu</strong>",
    image: hallgrenskoreskole,
    link: 'https://hallgrenskoereskole.dk/'
  },
  {
    id: 7,
    title: 'Webdesign - Mediprax',
    description: "For MEDIPRAX, I designed the complete digital experience with a focus on creating a calm, trustworthy, and accessible platform for people seeking psychiatric assessment and treatment. The goal was to communicate MEDIPRAX’s professional expertise while making complex information easy to understand and navigate. Through thoughtful UX, clear information architecture, and a warm, modern visual design, I created a website concept that builds trust, improves usability, and guides visitors naturally toward the right next step. - <strong>Designed at næmt.nu</strong>",
    image: mediprax,
    link: 'https://mediprax.dk/'
  },
  {
    id: 8,
    title: 'Webdesign - Dansk Parodontologisk Selskab',
    description: "For Periodont, I designed the complete digital experience with a focus on creating a clear, professional, and engaging platform for dental professionals. The goal was to strengthen the organization's credibility while making it easy for visitors to access educational resources, events, publications, and membership information. Through thoughtful UX, structured information architecture, and a clean visual design, I created a website that improves usability, supports user engagement, and guides visitors naturally toward key actions. - <strong>Designed at næmt.nu</strong>",
    image: periodontImg,
    link: 'https://periodont.dk/'
  },
  {
    id: 9,
    title: 'Webdesign - EchoVice',
    description: "For Echovice, I designed the complete digital experience, from UX strategy and information architecture to the final user interface. The goal was to create a professional and trustworthy website that reflects the company's expertise in medical device innovation. With a strong focus on clarity, usability, and visual hierarchy, I developed a modern platform that effectively communicates the value of EchoM and its role in supporting cardiac care procedures. - <strong>Designed at næmt.nu</strong>",
    image: echoviceImg,
    link: 'https://echovice.com/'
  },
  {
    id: 10,
    title: 'Bachelor Project - Business Intelligence Dashboard',
    description: "A BI dashboard prototype built with Vue.js, Bootstrap, Chart.js, Gridstack, Axios, and Laravel. Developed under our fictitious company Biezy, using dummy data based on a fitness business concept. Created as part of our bachelor's degree to demonstrate an affordable, user-friendly BI solution for small and medium-sized businesses.",
    image: biezyImg,
    source: 'https://github.com/Nikolaihoej/BA-BI-frontend'
  },
  {
    id: 11,
    title: 'Todo App',
    description: "A simple todo app built with vue.js and mongoDB and mongoose. for myself. I intent to make this Todo app an website in the future. making it possible for others to use. It was a quick refreash of the usage of MongoDB and learning mongoose.",
    image: todoImg,
    source: 'https://github.com/Nikolaihoej/Todo-list'
  },
  {
    id: 12,
    title: 'Creative Personal Portfolio',
    description: "This is the third portfolio website I've created. I initially struggled to find a design that I liked and that stood out, but felt too simple, so I upgraded. This static portfolio is built with Vue.js and hosted on Firebase. It features a creative island theme with vibrant colors and engaging visuals to showcase my socials and github projects.",
    image: islandImg,
    link: 'https://niko-portfolio-2cf3b.web.app/',
    source: 'https://github.com/Nikolaihoej/webPortfolio'
  },

    {
    id: 13,
    title: 'Modern portfolio',
    description: "A modern portfolio site built with Vue.js and Bootstrap. This is my latest portfolio website, featuring a clean and contemporary design to effectively showcase my projects and skills. It is fully responsive and reflects my personal style.",
    image: modernImg,
    source: 'https://github.com/Nikolaihoej/modern-portfolio'
  },
]

export const projects = rawProjects.map((project) => ({
  ...project,
  hoverColor: getHoverColorById(project.id)
}))