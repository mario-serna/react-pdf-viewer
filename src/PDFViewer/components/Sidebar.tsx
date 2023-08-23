import { ReactElement } from "react";
import type { IHighlight } from "../types";

interface Props {
  children?: ReactElement;
  highlights: Array<IHighlight>;
  setSelected: (id: string) => void;
  saveHighlights: () => void;
  resetHighlights: () => void;
  setPagesRotation: (pagesRotation: number) => void;
  setScale: (scaleValue: string) => void;
  setSearchValue: (searchValue: string) => void;
  currentMatch: number;
  totalMatchCount: number;
  findNext: () => void;
  findPrev: () => void;
}

const Sidebar = ({
  children,
  highlights,
  setSelected,
  saveHighlights,
  resetHighlights,
  currentMatch,
  findNext,
  findPrev,
  setPagesRotation,
  setScale,
  setSearchValue,
  totalMatchCount,
}: Props) => {
  return (
    <div className="overflow-auto w-[25vw] text-white bg-gradient-to-r from-purple-500 to-pink-500">
      <div className="flex flex-col gap-1 p-4">
        {children}
        <input
          title="text"
          className="text-black"
          type="text"
          onChange={(e) => setSearchValue(e.target.value)}
        />
        <div>
          <button
            className="h-8 w-8 p-1 text-white bg-blue-400 rounded-xl transition ease-in-out delay-150 hover:-translate-y-1 hover:scale-105 hover:bg-blue-500 duration-300"
            onClick={findPrev}
          >
            {"<"}
          </button>
          <button>{`${currentMatch}/${totalMatchCount}`}</button>
          <button
            className="h-8 w-8 p-1 text-white bg-blue-400 rounded-xl transition ease-in-out delay-150 hover:-translate-y-1 hover:scale-105 hover:bg-blue-500 duration-300"
            onClick={findNext}
          >
            {">"}
          </button>
        </div>
        <div className="flex gap-1 items-center">
          <span>Rotation:</span>
          <button
            className="h-8 w-8 p-1 text-white bg-blue-400 rounded-xl transition ease-in-out delay-150 hover:-translate-y-1 hover:scale-105 hover:bg-blue-500 duration-300"
            onClick={() => setPagesRotation(0)}
          >
            ↪️
          </button>
          <button
            className="h-8 w-8 p-1 text-white bg-blue-400 rounded-xl transition ease-in-out delay-150 hover:-translate-y-1 hover:scale-105 hover:bg-blue-500 duration-300"
            onClick={() => setPagesRotation(1)}
          >
            ↩️
          </button>
        </div>
        <h3 style={{ marginBottom: "1rem" }}>Set Scale</h3>
        {["page-width", "1", "2", "3"].map((scaleValue) => (
          <button key={scaleValue} onClick={() => setScale(scaleValue)}>
            {scaleValue}
          </button>
        ))}
      </div>
      {highlights.length > 0 ? (
        <div className="flex flex-col gap-2 p-4">
          <button
            className="h-10 w-full p-2 text-white bg-blue-400 rounded-xl transition ease-in-out delay-150 hover:-translate-y-1 hover:scale-105 hover:bg-blue-500 duration-300"
            onClick={saveHighlights}
          >
            Save highlights
          </button>
          <button
            className="h-10 w-full p-2 text-black bg-white rounded-xl transition ease-in-out delay-150 hover:-translate-y-1 hover:scale-105 hover:bg-slate-300 duration-300"
            onClick={resetHighlights}
          >
            Reset highlights
          </button>
        </div>
      ) : null}
      <ul className="list-none p-0">
        {highlights.map((highlight, index) => (
          <li
            key={index}
            className="p-4 cursor-pointer border-b-2 border-b-white transition ease-in-out delay-150 hover:bg-orange-400"
            onClick={() => {
              setSelected(highlight.id);
              // SharingInformationService.setSubject = highlight.id;
            }}
          >
            <div>
              <strong>{highlight.comment.text}</strong>
              {highlight.content.text ? (
                <blockquote className="mt-2">
                  {`${highlight.content.text.slice(0, 90).trim()}…`}
                </blockquote>
              ) : null}
              {highlight.content.image ? (
                <div className="overflow-auto max-w-xs border-dashed mt-2">
                  <img src={highlight.content.image} alt={"Screenshot"} />
                </div>
              ) : null}
            </div>
            <div className="mt-2 text-right text-xs">
              Page {highlight.position.pageNumber}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Sidebar;
