import "./styles.css";

import { memo, useEffect, useRef, useState } from "react";
import type { IHighlight, NewHighlight } from "./types";

import {
  AreaHighlight,
  Highlight,
  HighlightPopup,
  PdfHighlighter,
  PdfLoader,
  Popup,
  Sidebar,
  Tip,
} from "./components";

const getNextId = () => String(Math.random()).slice(2);

const LOCAL_HIGHLIGHTS = "highlights";

const PDFViewer = memo(
  ({
    file,
    fileUrl,
    action,
    children,
  }: {
    file: string;
    fileUrl: string;
    action: () => any;
    children: any;
  }) => {
    const [url, setUrl] = useState<string>(
      fileUrl ||
        `${window.location.protocol}//${window.location.host}/files/${file}`
    );
    const [highlights, setHighlights] = useState<IHighlight[]>(
      JSON.parse(localStorage.getItem(`${file}-${LOCAL_HIGHLIGHTS}`) || "[]")
    );

    const [searchValue, setSearchValue] = useState<string>("");
    const [pagesRotation, setPagesRotation] = useState<number>(0);
    const [scaleValue, setScaleValue] = useState<string>("page-width");
    const [currentMatch, setCurrentMatch] = useState<number>(0);
    const [totalMatchCount, setTotalMatchCount] = useState<number>(0);
    const [selected, setSelected] = useState<string>("");

    const findNextAction = useRef<any>();

    const findPrevAction = useRef<any>();

    // const subscription$ = SharingInformationService.getSubject;

    const saveHighlights = () => {
      localStorage.setItem(
        `${file}-${LOCAL_HIGHLIGHTS}`,
        JSON.stringify(highlights)
      );
      alert("Highlight saved");
    };

    const resetHighlights = () => {
      localStorage.setItem(`${file}-${LOCAL_HIGHLIGHTS}`, "");
      setHighlights([]);
    };

    const scrollViewerTo = useRef<any>();

    const scrollToHighlightFromHash = (value: string) => {
      const highlight = getHighlightById(value);

      if (highlight) {
        scrollViewerTo.current(highlight);
      }
    };

    // useEffect(() => {
    //   const unsubs = subscription$.subscribe((data) => {
    //     console.log(data, highlights);
    //     setSelected(data);
    //   });

    //   return () => {
    //     unsubs.unsubscribe();
    //   };
    // }, []);

    useEffect(() => {
      setUrl(
        fileUrl ||
          `${window.location.protocol}//${window.location.host}/files/${file}`
      );
      setHighlights(
        JSON.parse(localStorage.getItem(`${file}-${LOCAL_HIGHLIGHTS}`) || "[]")
      );
    }, [file, fileUrl]);

    useEffect(() => {
      if (selected) scrollToHighlightFromHash(selected);
    }, [selected]);

    const getHighlightById = (id: string) => {
      return highlights.find((highlight) => highlight.id === id);
    };

    const addHighlight = (highlight: NewHighlight) => {
      setHighlights((currentHighlights) => [
        { ...highlight, id: getNextId() },
        ...currentHighlights,
      ]);
    };

    const updateHighlight = (
      highlightId: string,
      position: Object,
      content: Object
    ) => {
      console.log("Updating highlight", highlightId, position, content);

      const updatedHighlights = highlights.map((h) => {
        const {
          id,
          position: originalPosition,
          content: originalContent,
          ...rest
        } = h;
        return id === highlightId
          ? {
              id,
              position: { ...originalPosition, ...position },
              content: { ...originalContent, ...content },
              ...rest,
            }
          : h;
      });
      setHighlights(updatedHighlights);
    };

    if (!url) return <></>;

    const handlePageRotation = (direction: number) => {
      let rotation = direction ? pagesRotation + 90 : pagesRotation - 90;
      rotation = rotation > 270 ? 0 : rotation < 0 ? 270 : rotation;
      setPagesRotation(rotation);
    };

    return (
      <div className="flex h-screen">
        <Sidebar
          highlights={highlights}
          setSelected={setSelected}
          saveHighlights={saveHighlights}
          resetHighlights={resetHighlights}
          setPagesRotation={handlePageRotation}
          setScale={setScaleValue}
          setSearchValue={setSearchValue}
          currentMatch={currentMatch}
          totalMatchCount={totalMatchCount}
          findNext={findNextAction.current}
          findPrev={findPrevAction.current}
        >
          <div>
            {children}
            <slot />
            <button onClick={action}>Click</button>
          </div>
        </Sidebar>
        <div className="relative h-screen w-[75vw]">
          <PdfLoader
            url={url}
            beforeLoad={<span>Loading...</span>}
            onError={(e) => console.log(e)}
          >
            {(pdfDocument) => (
              <PdfHighlighter
                pdfDocument={pdfDocument}
                pagesRotation={pagesRotation}
                searchValue={searchValue}
                onSearch={(currentMatch, totalMatchCount) => {
                  setCurrentMatch(currentMatch);
                  setTotalMatchCount(totalMatchCount);
                }}
                findRefs={(findPrev, findNext) => {
                  findPrevAction.current = findPrev;
                  findNextAction.current = findNext;
                }}
                enableAreaSelection={(event: any) => event.altKey}
                onScrollChange={() => false}
                pdfScaleValue={scaleValue}
                scrollRef={(scrollTo: any) => {
                  scrollViewerTo.current = scrollTo;
                }}
                onSelectionFinished={(
                  position,
                  content,
                  hideTipAndSelection,
                  transformSelection
                ) => (
                  <Tip
                    content={content}
                    onOpen={transformSelection}
                    onConfirm={(comment) => {
                      addHighlight({ content, position, comment });

                      hideTipAndSelection();
                    }}
                  />
                )}
                highlightTransform={(
                  highlight,
                  index,
                  setTip,
                  hideTip,
                  viewportToScaled,
                  screenshot,
                  isScrolledTo
                ) => {
                  const isTextHighlight = !Boolean(
                    highlight.content && highlight.content.image
                  );

                  const component = isTextHighlight ? (
                    <Highlight
                      onClick={() =>
                        setTip(highlight, (highlight) => (
                          <HighlightPopup
                            highlight={highlight}
                            onDelete={() => {
                              setHighlights((current) =>
                                current.filter((h) => h.id !== highlight.id)
                              );
                              hideTip();
                            }}
                          />
                        ))
                      }
                      isScrolledTo={isScrolledTo}
                      position={highlight.position}
                      comment={highlight.comment}
                    />
                  ) : (
                    <AreaHighlight
                      isScrolledTo={isScrolledTo}
                      highlight={highlight}
                      onChange={(boundingRect) => {
                        updateHighlight(
                          highlight.id,
                          { boundingRect: viewportToScaled(boundingRect) },
                          { image: screenshot(boundingRect) }
                        );
                      }}
                    />
                  );

                  return (
                    <Popup
                      popupContent={<></>}
                      onMouseOver={(popupContent) =>
                        setTip(highlight, (highlight) => popupContent)
                      }
                      onMouseOut={hideTip}
                      key={index}
                      children={component}
                    />
                  );
                }}
                highlights={highlights}
              />
            )}
          </PdfLoader>
        </div>
      </div>
    );
  }
);

export default PDFViewer;
