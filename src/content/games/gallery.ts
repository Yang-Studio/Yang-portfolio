export type GalleryPiece = {
  id: string
  title: string
  medium: string
  year: string
  src: string
  alt: string
}

export const gallery: GalleryPiece[] = [
  {
    id: 'kinetic-ink',
    title: 'Kinetic Ink',
    medium: 'Realtime fluid shader',
    year: '2024',
    src: '/images/gallery/kinetic-ink.jpg',
    alt: 'Ink-like fluid shader swirling in coral and slate hues.',
  },
  {
    id: 'glimmer-falls',
    title: 'Glimmer Falls',
    medium: 'TouchDesigner generative loop',
    year: '2023',
    src: '/images/gallery/glimmer-falls.jpg',
    alt: 'Waterfall of sparkling light particles cascading diagonally.',
  },
  {
    id: 'sage-spiral',
    title: 'Sage Spiral',
    medium: 'VR sculpture capture',
    year: '2023',
    src: '/images/gallery/sage-spiral.jpg',
    alt: 'Spiral of sage and coral voxels floating in mist.',
  },
  {
    id: 'resonant-grid',
    title: 'Resonant Grid',
    medium: 'Shader graph study',
    year: '2022',
    src: '/images/gallery/resonant-grid.jpg',
    alt: 'Grid of luminous nodes connected by subtle waves.',
  },
  {
    id: 'coral-loom',
    title: 'Coral Loom',
    medium: 'Procedural textile',
    year: '2022',
    src: '/images/gallery/coral-loom.jpg',
    alt: 'Textile pattern with coral and mist threads intertwined.',
  },
  {
    id: 'mist-borealis',
    title: 'Mist Borealis',
    medium: 'Niagara particle study',
    year: '2021',
    src: '/images/gallery/mist-borealis.jpg',
    alt: 'Aurora-like arcs of light in misty blues and corals.',
  },
]
