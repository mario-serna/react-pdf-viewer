import reactToWebComponent from "@r2wc/react-to-web-component";
import { PDFViewer } from "./PDFViewer";

customElements.define(
  "sai-react-doc-viewer",
  // @ts-ignore
  reactToWebComponent(PDFViewer, {
    props: {
      file: "string",
      fileUrl: "string",
      action: "function",
      children: "string",
    },
  })
);
