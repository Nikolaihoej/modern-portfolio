import islandImg from '../assets/images/projects/island.png'
import todoImg from '../assets/images/projects/todo.jpg'
import biezyImg from '../assets/images/projects/biezy.png'
import modernImg from '../assets/images/projects/modern.png'
import echoviceImg from '../assets/images/projects/echovice.png'
import periodontImg from '../assets/images/projects/periodontImage.png'

export const projects = [
  {
    id: 1,
    title: 'Webdesign - Dansk Parodontologisk Selskab',
    description: "For Periodont, I designed the complete digital experience with a focus on creating a clear, professional, and engaging platform for dental professionals. The goal was to strengthen the organization's credibility while making it easy for visitors to access educational resources, events, publications, and membership information. Through thoughtful UX, structured information architecture, and a clean visual design, I created a website that improves usability, supports user engagement, and guides visitors naturally toward key actions.",
    image: periodontImg,
    link: 'https://periodont.dk/',
    hoverColor: 'rgb(83, 127, 156)'
  },
  {
    id: 2,
    title: 'Webdesign - EchoVice',
    description: "For Echovice, I designed the complete digital experience, from UX strategy and information architecture to the final user interface. The goal was to create a professional and trustworthy website that reflects the company's expertise in medical device innovation. With a strong focus on clarity, usability, and visual hierarchy, I developed a modern platform that effectively communicates the value of EchoM and its role in supporting cardiac care procedures.",
    image: echoviceImg,
    link: 'https://echovice.com/',
    hoverColor: 'rgb(98, 156, 83)'
  },
  {
    id: 3,
    title: 'Bachelor Project - Business Intelligence Dashboard',
    description: "A BI dashboard prototype built with Vue.js, Bootstrap, Chart.js, Gridstack, Axios, and Laravel. Developed under our fictitious company Biezy, using dummy data based on a fitness business concept. Created as part of our bachelor's degree to demonstrate an affordable, user-friendly BI solution for small and medium-sized businesses.",
    image: biezyImg,
    source: 'https://github.com/Nikolaihoej/BA-BI-frontend',
    hoverColor: 'rgb(123, 83, 156)'
  },
  {
    id: 4,
    title: 'Todo App',
    description: "A simple todo app built with vue.js and mongoDB and mongoose. for myself. I intent to make this Todo app an website in the future. making it possible for others to use. It was a quick refreash of the usage of MongoDB and learning mongoose.",
    image: todoImg,
    source: 'https://github.com/Nikolaihoej/Todo-list',
    hoverColor: 'rgb(83, 127, 156)'
  },
  {
    id: 5,
    title: 'Creative Personal Portfolio',
    description: "This is the third portfolio website I've created. I initially struggled to find a design that I liked and that stood out, but felt too simple, so I upgraded. This static portfolio is built with Vue.js and hosted on Firebase. It features a creative island theme with vibrant colors and engaging visuals to showcase my socials and github projects.",
    image: islandImg,
    link: 'https://niko-portfolio-2cf3b.web.app/',
    source: 'https://github.com/Nikolaihoej/webPortfolio',
    hoverColor: 'rgb(98, 156, 83)'
  },

    {
    id: 6,
    title: 'Modern portfolio',
    description: "A modern portfolio site built with Vue.js and Bootstrap. This is my latest portfolio website, featuring a clean and contemporary design to effectively showcase my projects and skills. It is fully responsive and reflects my personal style.",
    image: modernImg,
    source: 'https://github.com/Nikolaihoej/modern-portfolio',
    hoverColor: 'rgb(156, 83, 83)'
  },


]