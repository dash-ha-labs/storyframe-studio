import "./composition-preview.css";
const EMPTY_URLS: Record<string, string> = {};
import React, { useEffect, useMemo, useRef, useState } from "react";
import { compositionDocument, dimensions } from "@storyframe/composition";
import type { Project } from "./model";
import gsapUrl from "gsap/dist/gsap.min.js?url";
import fontUrl from "@fontsource-variable/inter/files/inter-latin-wght-normal.woff2?url";
export default function CompositionPreview({
  project,
  urls = EMPTY_URLS,
  time = 0.8,
  playing = false,
  fit = false,
}: {
  project: Project;
  urls?: Record<string, string>;
  time?: number;
  playing?: boolean;
  fit?: boolean;
}) {
  const iframe = useRef<HTMLIFrameElement>(null),
    container = useRef<HTMLDivElement>(null),
    [box, setBox] = useState({ width: 600, height: 338 });
  const [w, h] = dimensions(project.outputFormat);
  const mediaUrls = useMemo(
    () =>
      Object.fromEntries(
        project.assets.map((a) => [
          a.id,
          a.src.startsWith("local:") ? urls[a.src.slice(6)] || "" : a.src,
        ]),
      ),
    [project.assets, urls],
  );
  const html = useMemo(
    () =>
      compositionDocument(project, {
        mediaUrls,
        gsapUrl,
        fontUrl,
        preview: true,
      }),
    [project, mediaUrls],
  );
  const state = useRef({ time, playing });
  state.current = { time, playing };
  const send = () =>
    iframe.current?.contentWindow?.postMessage(
      { type: "storyframe-seek", ...state.current },
      "*",
    );
  useEffect(send, [time, playing]);
  useEffect(() => {
    const listener = (e: MessageEvent) => {
      if (
        e.source === iframe.current?.contentWindow &&
        e.data?.type === "storyframe-ready"
      )
        send();
    };
    window.addEventListener("message", listener);
    return () => window.removeEventListener("message", listener);
  }, []);
  useEffect(() => {
    if (!container.current) return;
    const observer = new ResizeObserver(() => {
      if (container.current)
        setBox({
          width: container.current.clientWidth,
          height: container.current.clientHeight,
        });
    });
    observer.observe(container.current);
    return () => observer.disconnect();
  }, []);
  return (
    <div
      ref={container}
      className="composition-preview"
      style={fit ? { height: "100%" } : { aspectRatio: `${w}/${h}` }}
    >
      <iframe
        ref={iframe}
        title="Editable video composition"
        sandbox="allow-scripts allow-same-origin"
        srcDoc={html}
        style={{
          width: w,
          height: h,
          left: "50%",
          top: "50%",
          transform: `translate(-50%,-50%) scale(${Math.min(box.width / w, box.height / h)})`,
          transformOrigin: "center",
        }}
      />
    </div>
  );
}
