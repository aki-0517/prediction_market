import Link from 'next/link';
import React from 'react';

export type CardProps = {
    imageUrl: string;
    description?: string;
  };

export const Card = ({ imageUrl, description }: CardProps) => {
  return (
    <div className="flex flex-col rounded-lg shadow-lg overflow-hidden h-full w-60">
      <div className="flex-shrink-0">
        <img className="h-60 w-60 object-cover" src={imageUrl} alt="card image"/>
      </div>
      <div className="flex-1 bg-white p-6 flex flex-col justify-between">
        <div className="flex-1">
          <p className="text-base text-gray-700">{description}</p>
        </div>
        <div className="mt-6">
          <Link href="/detail"
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium bg-gray-200 hover:bg-gray-100"
          >
            {"See Details"}
          </Link>
        </div>
      </div>
    </div>
  );
};
