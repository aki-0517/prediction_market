"use client";

import Link from "next/link";
import { FunctionComponent } from "react";
import { CiSearch } from "react-icons/ci";
import { IconContext } from 'react-icons' 

export const Search: FunctionComponent = () => {
  return (
    <Link href="/search" aria-label="検索ページへ">
        <IconContext.Provider value={{  size: '30px' }}>
        <CiSearch />
        </IconContext.Provider>
    </Link>
  );
};
