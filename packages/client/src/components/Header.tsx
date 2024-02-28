import Link from "next/link";
import { Search } from "./Search";

export const Header = () => {
  return (
    <header className="bg-white m-10">
      <div className="flex items-center justify-center h-16">
        {/* 左側の領域（現在は空） */}
        <div className="flex-1"></div>

        {/* 中央の領域: Linkコンポーネント */}
        <div className="flex-1 justify-center flex">
          <Link href="/" aria-label="トップページへ">
            <h1 className="text-4xl font-bold">Markets</h1>
          </Link>
        </div>

        {/* 右側の領域: Searchコンポーネント */}
        <div className="flex-1 justify-end flex">
          <Search />
        </div>
      </div>
    </header>
  );
};
