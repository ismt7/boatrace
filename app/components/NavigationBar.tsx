import React from "react";
import Link from "next/link";

const NavigationBar: React.FC = () => {
  return (
    <nav className="bg-gray-800 p-4">
      <ul className="flex space-x-4">
        <li>
          <Link href="/" className="text-white hover:underline">
            ホーム
          </Link>
        </li>
        <li>
          <Link href="/boat" className="text-white hover:underline">
            ダッシュボード
          </Link>
        </li>
        <li>
          <Link href="/race" className="text-white hover:underline">
            レース
          </Link>
        </li>
        <li>
          <Link href="/race/result" className="text-white hover:underline">
            レース結果
          </Link>
        </li>
        <li>
          <Link href="/moter" className="text-white hover:underline">
            モーター
          </Link>
        </li>
        <li>
          <Link href="/stadium" className="text-white hover:underline">
            レース場
          </Link>
        </li>
      </ul>
    </nav>
  );
};

export default NavigationBar;
