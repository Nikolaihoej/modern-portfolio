import islandImg from '../assets/images/projects/island.png'
import todoImg from '../assets/images/projects/todo.jpg'
import biezyImg from '../assets/images/projects/biezy.png'
import portfolioImg from '../assets/images/projects/modernportfolio.jpg'

export const projects = [
  {
    id: 1,
    title: 'Bachelor Project - Business Intelligence Dashboard',
    description: "A BI dashboard prototype built with Vue.js, Bootstrap, Chart.js, Gridstack, Axios, and Laravel. Developed under our fictitious company Biezy, using dummy data based on a fitness business concept. Created as part of our bachelor's degree to demonstrate an affordable, user-friendly BI solution for small and medium-sized businesses.",
    image: biezyImg,
    source: 'https://github.com/Nikolaihoej/BA-BI-frontend',
    hoverColor: 'rgb(123, 83, 156)'
  },
  {
    id: 2,
    title: 'Todo App',
    description: 'A simple todo app built with vue.js and mongoDB and mongoose. for myself. I intent to make this Todo app an website in the future. making it possible for others to use. It was a quick refreash of the usage of MongoDB and learning mongoose.',
    image: todoImg,
    source: 'https://github.com/Nikolaihoej/Todo-list',
    hoverColor: 'rgb(83, 127, 156)'
  },
  {
    id: 3,
    title: 'Creative Personal Portfolio',
    description: 'Creative portfolio made before the modern one. Built with Vue.js.',
    image: islandImg,
    link: 'https://niko-portfolio-2cf3b.web.app/',
    source: 'https://github.com/Nikolaihoej/webPortfolio',
    hoverColor: 'rgb(98, 156, 83)'
  },

    {
    id: 4,
    title: 'This Portfolio',
    description: 'A modern portfolio site built with Vue and Bootstrap.',
    image: portfolioImg,
    source: 'https://github.com/Nikolaihoej/webPortfolio',
    hoverColor: 'rgb(156, 83, 83)'
  },


]