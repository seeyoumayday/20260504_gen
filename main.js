import React, { useState, useEffect } from 'react';

export default function App() {
const [inputText, setInputText] = useState('朝の光');
const [lyrics, setLyrics] = useState('');

const generateLyrics = () => {
let A, B;

// 「の」が含まれていない場合の処理を変更（Aを入力値、Bを「光」にする）
if (!inputText.includes('の')) {
A = inputText;
B = '光';
} else {
// 先着順（最初）の「の」のインデックスを取得
const firstNoIndex = inputText.indexOf('の');

// 「の」の前をA、後ろをBとする
A = inputText.substring(0, firstNoIndex);
B = inputText.substring(firstNoIndex + 1);
}

// 歌詞の構築
const line1 = `${A}の${B}の中で ah`;
const line2 = `${A}の${B}の中で ah, ah, ah`;
const line3 = `${B}り出す`;
const line4 = `${A}の${B}の中で ah, ah, ah`;
const line5 = `${A}の${B}の中で`;

setLyrics(`${line1}\n${line2}\n${line3}\n${line4}\n${line5}`);
};

// 初回表示時にも自動で生成する
useEffect(() => {
generateLyrics();
}, []);

// Enterキーを押したときの処理
const handleKeyDown = (e) => {
if (e.key === 'Enter') {
generateLyrics();
}
};

return (
<div className="min-h-screen bg-slate-50 flex flex-col items-center py-10 px-4 font-sans text-slate-800">

    {/* 入力エリア */}
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 w-full max-w-lg mb-12 z-10">
        <h1 className="text-xl font-bold mb-4 text-slate-700 text-center">
            「朝の光の中で」ジェネレーター
        </h1>
        <div className="flex flex-col sm:flex-row gap-3">
            <input type="text"
                className="flex-grow border border-slate-300 rounded-lg p-3 text-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-shadow"
                placeholder="例：朝の光" value={inputText} onChange={(e)=> setInputText(e.target.value)}
            onKeyDown={handleKeyDown}
            />
            <button onClick={generateLyrics}
                className="bg-slate-800 text-white font-bold py-3 px-6 rounded-lg hover:bg-slate-700 transition duration-200 active:scale-95 whitespace-nowrap">
                生成する
            </button>
        </div>
        <p className="text-xs text-slate-500 mt-3 text-center">
            「の」を含む言葉を入力してください。（「の」がない場合はBが「光」になります）
        </p>
    </div>

    {/* 歌詞出力エリア（大きく表示） */}
    <div className="flex-grow flex items-center justify-center w-full pb-10 overflow-hidden">
        <div className="text-left inline-block">
            <pre
                className="text-4xl md:text-5xl lg:text-7xl font-serif text-slate-800 tracking-wider leading-[1.6] whitespace-pre-wrap transition-all duration-300">
            {lyrics}
          </pre>
        </div>
    </div>

</div>
);
}