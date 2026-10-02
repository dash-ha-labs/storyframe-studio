// One deterministic composition used by Studio, admin previews and the Hyperframes renderer.
// Motion follows Hyperframes' line-by-line-slide primitive: fast entrance, readable hold.
const escape = (value) =>
  String(value ?? "").replace(
    /[&<>"']/g,
    (c) =>
      ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[
        c
      ],
  );
const json = (value) => JSON.stringify(value).replaceAll("<", "\\u003c");
const hex = (value, fallback) =>
  /^#[a-f0-9]{6}$/i.test(value || "") ? value : fallback;
const safeUrl = (value) =>
  typeof value === "string" &&
  /^(?:blob:|data:image\/(?:png|jpeg|webp);base64,|\/|assets\/)/.test(value)
    ? value
    : "";
export function dimensions(format) {
  return format === "9:16"
    ? [1080, 1920]
    : format === "1:1"
      ? [1080, 1080]
      : format === "4:5"
        ? [1080, 1350]
        : [1920, 1080];
}
function readableInk(ink, bg) {
  const l = (h) => {
    const v = [1, 3, 5]
      .map((i) => parseInt(h.slice(i, i + 2), 16) / 255)
      .map((v) => (v <= 0.04045 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4));
    return v[0] * 0.2126 + v[1] * 0.7152 + v[2] * 0.0722;
  };
  const a = l(ink),
    b = l(bg);
  return (Math.max(a, b) + 0.05) / (Math.min(a, b) + 0.05) >= 4.5
    ? ink
    : b > 0.35
      ? "#172033"
      : "#ffffff";
}
export function compositionDocument(
  project,
  {
    mediaUrls = {},
    gsapUrl = "assets/gsap.min.js",
    fontUrl = "assets/inter.woff2",
    preview = false,
  } = {},
) {
  const [w, h] = dimensions(project.outputFormat),
    portrait = h > w,
    bg = hex(project.background, "#ffffff"),
    accent = hex(project.accent, "#2142e7"),
    ink = readableInk(hex(project.brandInk, "#182b4e"), bg);
  const timing = [];
  let cursor = 0;
  const html = project.scenes
    .map((scene, i) => {
      const asset = project.assets.find((a) => a.id === scene.assetId),
        src = safeUrl(mediaUrls[scene.assetId] || asset?.src),
        duration = scene.duration / 30,
        start = cursor;
      cursor += duration;
      const mode = scene.layout || "product",
        hasMedia = !!src && scene.kind !== "endcard",
        id = "scene-" + i;
      const media = hasMedia
        ? asset?.type === "video"
          ? `<video id="media-${i}" src="${escape(src)}" muted playsinline data-media-start="${scene.sourceIn || 0}" data-duration="${duration}"></video>`
          : `<img id="media-${i}" src="${escape(src)}" alt="${escape(asset?.name)}">`
        : "";
      const words = (
          scene.captionVisible === false ? "" : scene.caption || scene.title
        )
          .trim()
          .split(/\s+/),
        large = words.length <= 12;
      timing.push({
        start,
        duration,
        motion: scene.motion || "fade",
        id,
        media: asset?.type === "video" && hasMedia ? "media-" + i : null,
        sourceIn: scene.sourceIn || 0,
      });
      return `<section id="${id}" class="clip caption-${scene.captionPosition} layout-${hasMedia ? mode : "title"} ${portrait ? "portrait" : ""}" data-start="${start}" data-duration="${duration}" data-track-index="0"><div class="scene-fill"></div><div class="scene-content"><div class="identity"><span class="identity-dot"></span><span>${escape(project.productName || project.title)}</span></div><div class="scene-main"><div class="copy"><span class="scene-index">${String(i + 1).padStart(2, "0")} / ${String(project.scenes.length).padStart(2, "0")}</span><h1 style="font-size:${Math.round((scene.captionSize || 66) * (hasMedia ? 1.05 : 1.55))}px" class="headline ${large ? "short" : "long"}">${escape(words.join(" "))}</h1>${!hasMedia && project.website && i === project.scenes.length - 1 ? `<p class="website">${escape(project.website)}</p>` : ""}</div>${hasMedia ? `<div class="media-frame ${mode === "device" ? "device" : ""}"><div class="media-inner" style="transform:scale(${scene.scale || 1})">${media}</div></div>` : ""}</div><div class="scene-footer"><span>${escape(scene.title)}</span><div class="progress-track"><div class="progress-fill"></div></div></div></div></section>`;
    })
    .join("");
  const music = project.assets.find((a) => a.id === project.musicId),
    musicSrc = music && safeUrl(mediaUrls[music.id] || music.src);
  const audio =
    musicSrc && !project.musicMuted
      ? `<audio id="soundtrack" class="clip" src="${escape(musicSrc)}" data-start="0" data-duration="${Math.min(cursor, music.duration)}" data-track-index="2" data-volume="${project.musicVolume}"></audio>`
      : "";
  const previewScript = preview
    ? `const points=${json(timing)};function seek(t,playing=false){tl.seek(t,false);points.forEach(p=>{const el=document.getElementById(p.id);const active=t>=p.start&&t<p.start+p.duration;el.style.visibility=active?'visible':'hidden';if(p.media){const m=document.getElementById(p.media);const wanted=p.sourceIn+Math.max(0,t-p.start);if(active){if(!playing||Math.abs(m.currentTime-wanted)>.25)m.currentTime=wanted;if(playing)m.play().catch(()=>{});else m.pause()}else m.pause()}});const a=document.getElementById('soundtrack');if(a){a.volume=${project.musicVolume};if(Math.abs(a.currentTime-t)>.25)a.currentTime=t;if(playing)a.play().catch(()=>{});else a.pause()}}window.addEventListener('message',e=>{if(e.source!==parent||e.data?.type!=='storyframe-seek')return;seek(Number(e.data.time)||0,e.data.playing===true)});seek(.8);parent.postMessage({type:'storyframe-ready'},'*');`
    : "";
  return `<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=${w},height=${h}"><title>${escape(project.title)}</title><script src="${escape(gsapUrl)}"></script><style>
 @font-face{font-family:Inter;src:url('${escape(fontUrl)}') format('woff2');font-weight:100 900;font-display:block}*{box-sizing:border-box}html,body{margin:0;width:100%;height:100%;overflow:hidden}body{font-family:Inter,Arial,sans-serif;background:${bg};color:${ink}}#root{position:relative;width:100%;height:100%;overflow:hidden}.clip{position:absolute;inset:0}.scene-fill{position:absolute;inset:0;background:${bg}}.scene-content{position:relative;display:flex;flex-direction:column;width:100%;height:100%;padding:${portrait ? "90px 76px" : "70px 100px"};gap:40px}.identity{display:flex;align-items:center;gap:18px;font-size:30px;font-weight:600;max-width:100%;overflow-wrap:anywhere}.identity-dot{height:20px;width:20px;flex-shrink:0;border-radius:6px;background:${accent}}.scene-main{display:flex;gap:70px;align-items:center;flex:1;min-height:0}.copy{flex:1;min-width:0;display:flex;flex-direction:column;gap:28px}.scene-index{font-size:24px;font-weight:600;letter-spacing:.08em}.headline{font-size:${portrait ? "78px" : "86px"};line-height:1.07;letter-spacing:-.045em;font-weight:650;margin:0;overflow-wrap:anywhere;max-width:100%;}.headline.long{font-size:${portrait ? "60px" : "64px"}}.layout-title .copy{max-width:${portrait ? "880px" : "1370px"}}.layout-title .headline.short{font-size:${portrait ? "102px" : "126px"}}.media-frame{width:56%;height:100%;max-height:690px;border-radius:24px;overflow:hidden;background:#fff;border:1px solid ${ink}22;box-shadow:0 24px 70px ${ink}18;flex-shrink:0}.media-inner{width:100%;height:100%;display:flex;align-items:center;justify-content:center}.media-inner img,.media-inner video{width:100%;height:100%;object-fit:contain}.device{width:340px;max-height:740px;border:12px solid ${ink};border-radius:48px;margin:auto}.layout-device .copy{max-width:960px}.layout-product .scene-main{flex-direction:column;align-items:stretch;gap:32px}.layout-product .copy{flex:0}.layout-product .headline{font-size:60px}.layout-product .scene-index{display:none}.layout-product .media-frame{width:100%;flex:1;min-height:0}.portrait .scene-main{flex-direction:column;align-items:stretch;gap:40px}.portrait .copy{flex:0}.portrait .media-frame{width:100%;flex:1;max-height:none;min-height:0}.portrait .device{width:660px;max-width:100%;max-height:1120px}.portrait.layout-title .scene-main{justify-content:center}.scene-footer{display:flex;align-items:center;gap:36px;font-size:23px;justify-content:space-between}.scene-footer>span{max-width:70%;overflow-wrap:anywhere}.progress-track{width:160px;height:5px;background:${ink}22;overflow:hidden}.progress-fill{height:100%;width:100%;background:${accent};transform-origin:left}.website{font-size:32px;line-height:1.4;margin:0;overflow-wrap:anywhere}
 .layout-product.caption-bottom .copy{order:1}.layout-product.caption-top .copy{order:0}.layout-title.caption-bottom .scene-main{align-items:flex-end}.layout-title.caption-top .scene-main{align-items:flex-start}
 </style></head><body><div id="root" data-composition-id="storyframe" data-width="${w}" data-height="${h}" data-duration="${cursor}">${html}${audio}</div><script>window.__timelines=window.__timelines||{};const tl=gsap.timeline({paused:true});${timing
   .map((p) => {
     const target = `#${p.id} .headline`,
       media = `#${p.id} .media-frame`;
     return `tl.fromTo('${target}',{opacity:${p.motion === "none" ? 1 : 0},x:${p.motion === "slide" ? -36 : 0},y:${p.motion === "slide" ? 18 : 0},scale:${p.motion === "zoom" ? 0.94 : 1}},{opacity:1,x:0,y:0,scale:1,duration:.42,ease:'power3.out',immediateRender:false},${p.start + 0.12});tl.fromTo('#${p.id} .progress-fill',{scaleX:0},{scaleX:1,duration:${p.duration},ease:'none',immediateRender:false},${p.start});if(document.querySelector('${media}'))tl.fromTo('${media}',{opacity:${p.motion === "none" ? 1 : 0},y:${p.motion === "slide" ? 28 : 0},scale:${p.motion === "zoom" ? 0.96 : 1}},{opacity:1,y:0,scale:1,duration:.6,ease:'power3.out',immediateRender:false},${p.start + 0.24});`;
   })
   .join(
     "",
   )}window.__timelines.storyframe=tl;${previewScript}</script></body></html>`;
}
