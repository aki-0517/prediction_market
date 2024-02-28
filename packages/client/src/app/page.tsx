"use client";

import { Card, CardProps } from '@/components/Card'
import { Cards } from '@/components/Cards';
import { Header } from '@/components/Header'

export default function Home() {

  const markets: CardProps[] = [
    {
      imageUrl: "https://source.unsplash.com/random/800x600",
      description: "This is a description of market 1",
    },
    {
      imageUrl: "https://source.unsplash.com/random/800x600",
      description: "This is a description of market 2",
    },
    {
      imageUrl: "https://source.unsplash.com/random/800x600",
      description: "This is a description of market 3",
    },
    {
      imageUrl: "https://source.unsplash.com/random/800x600",
      description: "This is a description of market 4",
    },
  ];

  
  return (
    <div>
      <Header />
      <div className='p-5'>
        <h1 className='text-3xl font-bold'>Featured Markets</h1>
      </div>
      <Cards cards={markets} />
    </div>
  )
}
