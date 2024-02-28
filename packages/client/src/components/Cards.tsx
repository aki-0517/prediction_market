import React from 'react';
import { Card, CardProps } from "./Card";

export type Props = {
    cards: CardProps[];
};

export const Cards = ({ cards }: Props) => {
  return (
    <div className="flex overflow-x-auto space-x-4 p-4">
      {cards.map((card, index) => (
        <div key={index} className="flex-shrink-0">
          <Card {...card} />
        </div>
      ))}
    </div>
  );
};
