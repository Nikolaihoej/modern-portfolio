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
    image: paprika,
    link: 'https://www.restaurantpaprika.dk/'
  },
  {
    id: 2,
    title: 'Webdesign - Dining by Manan',
    image: diningbymanan,
    link: 'https://diningbymanan.dk/'
  },
  {
    id: 3,
    title: 'Webdesign - Masala Corner',
    image: masala,
    link: 'https://masalacorner.dk/'
  },
  {
    id: 4,
    title: 'Webdesign - TandooriBBQ',
    image: tandooribbq,
    link: 'https://tandooribbq.dk/'
  },
  {
    id: 5,
    title: 'Webdesign - PN-bogholder',
    image: pnregnskab,
    link: 'https://pn-bogholder.dk/'
  },
  {
    id: 6,
    title: 'Webdesign - Hallgrenskoreskole',
    image: hallgrenskoreskole,
    link: 'https://hallgrenskoereskole.dk/'
  },
  {
    id: 7,
    title: 'Webdesign - Mediprax',
    image: mediprax,
    link: 'https://mediprax.dk/'
  },
  {
    id: 8,
    title: 'Webdesign - Dansk Parodontologisk Selskab',
    image: periodontImg,
    link: 'https://periodont.dk/'
  },
  {
    id: 9,
    title: 'Webdesign - EchoVice',
    image: echoviceImg,
    link: 'https://echovice.com/'
  }
]

export const projects = rawProjects.map((project) => ({
  ...project,
  hoverColor: getHoverColorById(project.id)
}))